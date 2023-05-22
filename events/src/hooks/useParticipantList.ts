import { PubNubContext, UserMetadata } from '@context/PubNubContext';
import { useConference, useNotifications } from '@dolbyio/comms-uikit-react';
import { ActiveParticipants } from '@voxeet/voxeet-web-sdk/types/events/notification';
import { Participant } from '@voxeet/voxeet-web-sdk/types/models/Participant';
import PubNub from 'pubnub';
import { useContext, useEffect, useState } from 'react';

export function useParticipantList() {
  const { pubnub, status, getUserMetadata, addListeners } = useContext(PubNubContext);
  const { conference } = useConference();
  const { subscribe } = useNotifications();
  // Hosts are retrieved from the Dolby.io Communications API by subscribing to the Conference.ActiveParticipants event
  const [hosts, setHosts] = useState<Participant[]>([]);
  // Viewers are retrieved from PubNub by using the Presence feature
  const [viewers, setViewers] = useState<Map<string, UserMetadata>>(new Map()); // Key is UUID
  const [viewerCount, setViewerCount] = useState(0);
  const [isFetchingViewers, setIsFetchingViewers] = useState(false);

  // Fetch the current viewer list on mount
  useEffect(() => {
    async function fetchViewers() {
      if (!conference || !pubnub || isFetchingViewers) {
        return;
      }

      setIsFetchingViewers(true);
      const data = await new Promise<PubNub.HereNowResponse>((resolve, reject) => {
        pubnub.hereNow(
          {
            channels: [`${conference.id}`],
          },
          (status, response) => {
            if (status.statusCode !== 200 || status.error) {
              return reject(new Error(`Could not fetch viewers. Error: ${status}`));
            }
            return resolve(response);
          },
        );
      });

      const channel = data.channels[conference.id];
      if (!channel) {
        return;
      }

      // Get metadata for all users
      const requests = new Map<string, Promise<UserMetadata>>();
      for (const user of channel.occupants) {
        if (!requests.has(user.uuid)) {
          requests.set(user.uuid, getUserMetadata(user.uuid));
        }
      }

      // Extract viewers only
      const metadatas = await Promise.all(requests.values());
      const viewers = new Map<string, UserMetadata>();
      for (const metadata of metadatas) {
        if (metadata.role === 'viewer') {
          viewers.set(metadata.uuid, metadata);
        }
      }
      setViewers(viewers);
    }
    fetchViewers();
  }, [conference, pubnub, isFetchingViewers, getUserMetadata]);

  // Set up listener to receive presence events
  useEffect(() => {
    if (!conference || status !== 'ready') {
      return () => {};
    }

    const handlePresence = async (e: PubNub.PresenceEvent) => {
      if (!conference) {
        throw new Error('Could not handle presence event. Conference is undefined.');
      }

      // Presence events only need to be handled for viewers. Hosts are handled using the Dolby.io Communications API
      const metadata = await getUserMetadata(e.uuid);
      if (metadata.role === 'host') {
        return;
      }

      if (e.action === 'join') {
        setViewers((prev) => {
          prev.set(e.uuid, {
            uuid: e.uuid,
            username: metadata.username,
            role: metadata.role,
          });
          return new Map(prev);
        });
        return;
      }

      if (e.action === 'leave' || e.action === 'timeout') {
        setViewers((prev) => {
          prev.delete(e.uuid);
          return new Map(prev);
        });
      }
    };

    const removeListeners = addListeners({ presence: handlePresence });
    return removeListeners;
  }, [conference, status, getUserMetadata, addListeners]);

  // Subscribe to the presence channel
  useEffect(() => {
    if (!conference || !pubnub) {
      return () => {};
    }

    pubnub.subscribe({ channels: [conference.id], withPresence: true });
    return () => {
      pubnub.unsubscribe({ channels: [conference.id] });
    };
  }, [conference, pubnub]);

  // Subscribe to the Conference.ActiveParticipants event to get a list of hosts
  useEffect(() => {
    if (!conference?.alias) {
      return undefined;
    }

    const handler = (data: ActiveParticipants) => {
      setHosts(data.participants);
      setViewerCount(data.viewerCount);
    };

    return subscribe({ type: 'Conference.ActiveParticipants', conferenceAlias: conference.alias }, handler);
  }, [conference?.alias, subscribe]);

  return {
    hosts,
    viewers,
    viewerCount: pubnub ? viewers.size : viewerCount,
  };
}
