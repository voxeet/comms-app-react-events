import { useConference, useParticipants } from '@dolbyio/comms-uikit-react';
import getProxyUrl from '@src/utils/getProxyUrl';
import PubNub from 'pubnub';
import { useState, createContext, useMemo, ReactNode, useEffect, useCallback, useRef } from 'react';

export type UserMetadata = {
  uuid: string;
  username: string;
  role: 'host' | 'viewer';
};

type PubNubContext = {
  pubnub?: PubNub;
  status: 'initializing' | 'ready' | 'error';
  userMetadata?: UserMetadata;
  getUserMetadata: (uuid: string) => Promise<UserMetadata>;
  addListeners: (params: PubNub.ListenerParameters) => () => void;
};

export function isUserMetadata(obj?: object): obj is UserMetadata {
  if (
    obj &&
    'uuid' in obj &&
    typeof obj.uuid === 'string' &&
    'username' in obj &&
    typeof obj.username === 'string' &&
    'role' in obj &&
    typeof obj.role === 'string'
  ) {
    return true;
  }
  return false;
}

export const PubNubContext = createContext<PubNubContext>({} as PubNubContext);

export const PubNubProvider = ({ children }: { children: ReactNode }) => {
  const { conference } = useConference();
  const { participant } = useParticipants();
  const [pubnub, setPubnub] = useState<PubNub>();
  const [status, setStatus] = useState<PubNubContext['status']>('initializing');
  const [userMetadata, setUserMetadata] = useState<UserMetadata>();
  const messageListeners = useRef<Set<(e: PubNub.MessageEvent) => void>>(new Set());
  const messageActionListeners = useRef<Set<(e: PubNub.MessageActionEvent) => void>>(new Set());
  const presenceListeners = useRef<Set<(e: PubNub.PresenceEvent) => void>>(new Set());

  const getUserMetadata = useCallback(
    async (uuid: string): Promise<UserMetadata> => {
      if (!pubnub) {
        throw new Error('Could not get user metadata. PubNub client is not initialized yet.');
      }
      const metadata = await pubnub.objects.getUUIDMetadata<{ role: UserMetadata['role'] }>({ uuid });
      const username = metadata.data.name;
      const role = metadata.data.custom?.role;
      if (!username || !role) {
        throw new Error(`Could not get user metadata. Invalid or missing PubNub metadata for user ID: ${uuid}`);
      }
      return {
        uuid,
        username,
        role,
      };
    },
    [pubnub],
  );

  const addListeners = useCallback(
    (params: PubNub.ListenerParameters) => {
      if (!pubnub) {
        throw new Error(`Could not add listeners. PubNub client is not initialized yet.`);
      }

      const { message, messageAction, presence } = params;
      const unsubscribers: (() => void)[] = [];
      if (message) {
        messageListeners.current.add(message);
        unsubscribers.push(() => messageListeners.current.delete(message));
      }
      if (messageAction) {
        messageActionListeners.current.add(messageAction);
        unsubscribers.push(() => messageActionListeners.current.delete(messageAction));
      }
      if (presence) {
        presenceListeners.current.add(presence);
        unsubscribers.push(() => presenceListeners.current.delete(presence));
      }

      // Return a function to remove listeners
      return () => {
        for (const unsubscribe of unsubscribers) {
          unsubscribe();
        }
      };
    },
    [pubnub],
  );

  // Fetch token and set up token refreshing
  useEffect(() => {
    let timeout: number;
    async function fetchToken() {
      if (!conference || !participant || !participant.info.name) {
        return;
      }

      // Instead of requesting a token directly from PubNub (which requires a PubNub secret key),
      // we use an intermediate server (api-proxy) to fetch and return a PubNub token. This provides
      // added security because the events application never needs to know about the secret key. This
      // strategy is recommended by PubNub.
      // https://www.pubnub.com/docs/general/resources/architecture#key-exchange--rotation
      const res = await fetch(`${getProxyUrl()}/pubnub/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conferenceId: conference.id,
          userId: participant.id,
          username: participant.info.name,
          role: participant.type === 'listener' ? 'viewer' : 'host',
        }),
      });
      if (!res.ok) {
        setPubnub(undefined);
        setStatus('error');
        return;
      }

      const json: { token: string; publishKey: string; subscribeKey: string } = await res.json();
      const sdk = new PubNub({
        publishKey: json.publishKey,
        subscribeKey: json.subscribeKey,
        userId: participant.id,
      });
      sdk.setToken(json.token);

      // Refresh token 1 minute before expiry
      const parsed = sdk.parseToken(json.token);
      timeout = window.setTimeout(fetchToken, (parsed.ttl - 1) * 60 * 1000);

      setPubnub(sdk);
      setStatus('ready');
    }
    fetchToken();

    return () => {
      clearTimeout(timeout);
    };
  }, [conference, participant]);

  // Fetch and store metadata for the current user
  useEffect(() => {
    async function fetchMetadata() {
      if (!pubnub) {
        return;
      }
      const metadata = await getUserMetadata(pubnub.getUUID());
      setUserMetadata(metadata);
    }
    fetchMetadata();
  }, [getUserMetadata, pubnub]);

  // Set up base listeners
  useEffect(() => {
    if (!pubnub) {
      return () => {};
    }

    const listeners: PubNub.ListenerParameters = {
      message: (e) => messageListeners.current.forEach((listener) => listener(e)),
      messageAction: (e) => messageActionListeners.current.forEach((listener) => listener(e)),
      presence: (e) => presenceListeners.current.forEach((listener) => listener(e)),
    };
    pubnub.addListener(listeners);
    return () => {
      pubnub.removeListener(listeners);
    };
  }, [pubnub]);

  const contextValue: PubNubContext = useMemo(
    () => ({
      pubnub,
      status,
      userMetadata,
      getUserMetadata,
      addListeners,
    }),
    [pubnub, status, userMetadata, getUserMetadata, addListeners],
  );

  return <PubNubContext.Provider value={contextValue}>{children}</PubNubContext.Provider>;
};
