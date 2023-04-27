import { useConference, useParticipants } from '@dolbyio/comms-uikit-react';
import { ChatMessage } from '@src/types/chat';
import getProxyUrl from '@src/utils/getProxyUrl';
import Pubnub from 'pubnub';
import { usePubNub } from 'pubnub-react';
import { useCallback, useEffect, useState } from 'react';

type SentMessage = {
  text: string;
  sender: string;
};

export function useChat() {
  const { conference } = useConference();
  const { participant } = useParticipants();
  const pubnub = usePubNub();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [token, setToken] = useState('');

  const sendMessage = useCallback(
    (text: string) => {
      if (!participant?.info.name) {
        throw new Error("Could not send chat message. Could not retrieve local participant's name.");
      } else if (!conference) {
        throw new Error('Conference is undefined');
      }
      const message: SentMessage = {
        text,
        sender: participant.info.name,
      };
      return pubnub.publish({
        channel: conference.id,
        message,
      });
    },
    [participant?.info.name, conference, pubnub],
  );

  useEffect(() => {
    let timeout: number;
    async function fetchToken() {
      if (!conference) {
        return;
      }

      const res = await fetch(`${getProxyUrl()}/pubnub/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channelId: conference.id }),
      });
      if (!res.ok) {
        return;
      }

      const json: { token: string } = await res.json();
      pubnub.setToken(json.token);
      setToken(json.token);
      const parsed = pubnub.parseToken(json.token);
      // Refresh token 1 minute before expiry
      timeout = window.setTimeout(fetchToken, (parsed.ttl - 1) * 60 * 1000);
    }
    fetchToken();

    return () => {
      clearTimeout(timeout);
    };
  }, [conference, pubnub]);

  useEffect(() => {
    if (!conference || !token) {
      return () => {};
    }

    const handleMessage = (e: Pubnub.MessageEvent) => {
      const msg = e.message as SentMessage;
      setMessages((messages) => [
        ...messages,
        {
          ...msg,
          // Convert timeToken to Unix timestamp (in milliseconds)
          // https://support.pubnub.com/hc/en-us/articles/360051495812-How-do-I-convert-the-PubNub-timetoken-to-Unix-timestamp-
          timestamp: Math.trunc(parseInt(e.timetoken, 10) / 10000),
        },
      ]);
    };

    const listeners: Pubnub.ListenerParameters = { message: handleMessage };
    const subscriptions: Pubnub.SubscribeParameters = { channels: [conference.id] };
    pubnub.addListener(listeners);
    pubnub.subscribe(subscriptions);
    return () => {
      pubnub.unsubscribe(subscriptions);
      pubnub.removeListener(listeners);
    };
  }, [conference, token, pubnub]);

  return {
    messages,
    sendMessage,
  };
}
