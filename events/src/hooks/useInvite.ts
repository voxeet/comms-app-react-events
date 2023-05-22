import { PubNubContext, isUserMetadata } from '@context/PubNubContext';
import { useConference } from '@dolbyio/comms-uikit-react';
import { InviteStatus } from '@src/types/invite';
import { getHostPath } from '@src/utils/route';
import PubNub from 'pubnub';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const VIEWER_CHANNEL_SUFFIX = '.viewer';

function getViewerChannelId(viewerId: string) {
  return `${viewerId}${VIEWER_CHANNEL_SUFFIX}`;
}

export function useInvite() {
  const { pubnub, userMetadata, addListeners } = useContext(PubNubContext);
  const { leaveConference } = useConference();
  const navigate = useNavigate();
  const params = useParams();
  const channels = useRef<Set<string>>(new Set());
  const [statuses, setStatuses] = useState<Map<string, InviteStatus>>(new Map()); // Key is UUID
  const [inviter, setInviter] = useState<string>();

  const send = useCallback(
    (uuid: string) => {
      if (!pubnub || !userMetadata) {
        throw new Error('Could not send invite to viewer. PubNub client is not initialized yet.');
      }

      const channel = getViewerChannelId(uuid);
      pubnub.subscribe({ channels: [channel] });
      channels.current.add(channel);
      setStatuses((prev) => {
        prev.set(uuid, 'invited');
        return new Map(prev);
      });
      const message: InviteStatus = 'invited';
      return pubnub.publish({
        channel,
        message,
        meta: userMetadata,
      });
    },
    [pubnub, userMetadata],
  );

  const accept = useCallback(async () => {
    if (!params.id) {
      throw new Error('Could not accept invite. Invalid event name.');
    }
    await leaveConference();
    navigate(getHostPath(params.id), { state: { username: userMetadata?.username } });
  }, [leaveConference, navigate, params, userMetadata]);

  const decline = useCallback(() => {
    if (!pubnub || !userMetadata) {
      throw new Error('Could not decline invite. PubNub client is not initialized yet.');
    }
    setInviter(undefined);
    const message: InviteStatus = 'declined';
    return pubnub.publish({
      channel: getViewerChannelId(userMetadata.uuid),
      message,
      meta: userMetadata,
    });
  }, [pubnub, userMetadata]);

  const ignore = useCallback(() => {
    setInviter(undefined);
  }, []);

  // Set up listener to receive messages
  useEffect(() => {
    if (!userMetadata) {
      return () => {};
    }

    const handleMessage = (e: PubNub.MessageEvent) => {
      // Skip any messages not intended for the viewer channel
      if (!e.channel.endsWith(VIEWER_CHANNEL_SUFFIX)) {
        return;
      }
      const sender = e.userMetadata;
      const message = e.message as InviteStatus;
      if (!isUserMetadata(sender)) {
        throw new Error('Could not process invite. User metadata is invalid or missing.');
      }

      if (userMetadata.role === 'host' && sender.role === 'viewer') {
        if (message === 'declined') {
          setStatuses((prev) => {
            prev.set(sender.uuid, 'declined');
            return new Map(prev);
          });
        }
      } else if (userMetadata.role === 'viewer' && sender.role === 'host') {
        if (message === 'invited') {
          setInviter((prev) => prev ?? sender.username);
        }
      }
    };

    const removeListeners = addListeners({ message: handleMessage });
    return removeListeners;
  }, [userMetadata, addListeners]);

  // Set up channel subscriptions
  useEffect(() => {
    if (!pubnub || !userMetadata) {
      return () => {};
    }

    // If user is a viewer, subscribe to viewer's channel
    if (userMetadata.role === 'viewer') {
      const channel = getViewerChannelId(userMetadata.uuid);
      pubnub.subscribe({ channels: [channel] });
      return () => {
        pubnub.unsubscribe({ channels: [channel] });
      };
    }

    // If user is a host, we don't need to subscribe to any channels yet.
    // Viewer channels will be subscribed to when an invite is sent.
    // But on unmount, we need to unsubscribe from all viewer channels.
    const channelsToUnsub = Array.from(channels.current.values());
    return () => {
      pubnub.unsubscribe({ channels: channelsToUnsub });
    };
  }, [pubnub, userMetadata]);

  return {
    statuses,
    inviter,
    send,
    accept,
    decline,
    ignore,
  };
}
