import { useCommsContext } from '@dolbyio/comms-uikit-react';
import { env } from '@src/utils/env';
import { Participant } from '@voxeet/voxeet-web-sdk/types/models/Participant';
import { useEffect, useMemo, useState } from 'react';

function getFetchOptions(body: unknown) {
  return {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
}

export const useRealTimeStreaming = (proxyUrl: string) => {
  const { conference, participants } = useCommsContext();
  const [isLoading, setIsLoading] = useState(false);
  const VITE_API_PROXY_URL = env('VITE_API_PROXY_URL');

  /*
    This is being done as netlify functions requires flattened url, so has a different url segment here.
     For all other uses, we expect the proxy api endpoints to be `/event/start` and `/event/stop`
  */
  const eventSegment = VITE_API_PROXY_URL.includes('/.netlify/functions') ? '/event_' : '/event/';

  const mixerParticipant: Participant | undefined = useMemo(() => {
    return participants.find((p) => p.info.externalId === 'Mixer_rts' || p.info.externalId === 'mixer_mix');
  }, [participants]);

  const isLive = !!mixerParticipant;

  useEffect(() => {
    setIsLoading(false);
  }, [isLive]);

  const startRealTimeStreaming = async () => {
    try {
      if (!conference) {
        throw new Error('Tried to start Real-time Streaming but no conference is available');
      }

      setIsLoading(true);
      const res = await fetch(`${proxyUrl}${eventSegment}start`, getFetchOptions({ conferenceId: conference.id }));

      if (res.status !== 200) {
        console.error('Error from API when starting live streaming:');
        console.error({ status: res.status, ...(await res.json()) });
        throw new Error('Could not start Real-time Streaming');
      }
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const stopRealTimeStreaming = async () => {
    try {
      if (!conference) {
        throw new Error('Tried to stop Real-time Streaming but no conference is available');
      }

      setIsLoading(true);
      const res = await fetch(`${proxyUrl}${eventSegment}stop`, getFetchOptions({ conferenceId: conference.id }));

      if (!res.ok) {
        throw new Error('Could not stop Real-time Streaming');
      }
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  return {
    mixerParticipant,
    isLive,
    isLoading,
    startRealTimeStreaming,
    stopRealTimeStreaming,
  };
};
