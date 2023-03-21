import {
  AudioCaptureMode,
  AudioProcessingMessages,
  LeaveConferenceButton,
  useAudioProcessing,
  useMessage,
} from '@dolbyio/comms-uikit-react';
import { useLiveStreaming } from '@hooks/useLiveStreaming';
import { getRejoinPath } from '@src/utils/route';
import { useIntl } from 'react-intl';
import { useParams, useNavigate } from 'react-router-dom';

const LeaveConference = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const params = useParams();
  const { setAudioCaptureMode, isMusicMode } = useAudioProcessing();
  const { sendMessage } = useMessage();
  const { isLocalUserLiveStreamingOwner, isLiveStreamingModeActive, streamHandler } = useLiveStreaming();

  const onSuccess = () => {
    navigate(getRejoinPath(params.id || ''), { replace: true });
  };
  /*
    We need this pre-action to clean up ex Live streaming with proper participants message handling
   */
  const preAction = () => {
    /*
     * We need to handle this here , since after ending call , we won't be able to send message to others.
     * Probably there should be a need to add pre-leaving action inside Comms provider as well
     */
    if (isMusicMode) {
      setAudioCaptureMode?.({ mode: AudioCaptureMode.Standard });
      sendMessage({ text: AudioProcessingMessages.MUSIC_MODE_STOPPED });
    }
    if (isLocalUserLiveStreamingOwner && isLiveStreamingModeActive) {
      return streamHandler('stop');
    }
    return true;
  };

  return (
    <LeaveConferenceButton
      testID="LeaveConferenceButton"
      tooltipText={intl.formatMessage({ id: 'leaveCall' })}
      onSuccess={onSuccess}
      preAction={preAction}
    />
  );
};

export default LeaveConference;
