import { useNotifications, useConference } from '@dolbyio/comms-uikit-react';
import { ActiveParticipants } from '@voxeet/voxeet-web-sdk/types/events/notification';
import { useEffect, useState } from 'react';

export const useActiveParticipants = () => {
  const { conference } = useConference();

  const alias = conference?.alias;
  const { subscribe } = useNotifications();
  const [activeParticipants, setActiveParticipants] = useState<ActiveParticipants>();

  useEffect(() => {
    if (!alias) {
      return undefined;
    }

    const handler = (data: ActiveParticipants) => {
      setActiveParticipants(data);
    };

    return subscribe({ type: 'Conference.ActiveParticipants', conferenceAlias: alias }, handler);
  }, [alias]);

  return { activeParticipants };
};

export const useViewerCount = () => {
  const { activeParticipants: { viewerCount } = { viewerCount: 0 } } = useActiveParticipants();

  return viewerCount;
};
