import { Onboarding } from '@components/Onboarding/Onboarding';
import SideBar from '@components/SideBar';
import { SideDrawer } from '@components/SideDrawer';
import Text from '@components/Text';
import { TopBar } from '@components/TopBar/TopBar';
import { SideDrawerContentTypes } from '@context/SideDrawerContext';
import { MediaButton, useAudio, useConference, useParticipants } from '@dolbyio/comms-uikit-react';
import { useActiveParticipants } from '@hooks/useActiveParticipants';
import { useChat } from '@hooks/useChat';
import useDrawer from '@hooks/useDrawer';
import { viewerLiveSteps } from '@src/onboarding/viewer_live';
import { viewerPreLiveSteps } from '@src/onboarding/viewer_pre_live';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { Video } from './Video/Video';
import styles from './View.module.scss';

export const View = ({ onExitConfirm }: { onExitConfirm: () => void }) => {
  const { closeDrawer, openDrawer } = useDrawer();
  const { isPageMuted, toggleMuteParticipants } = useAudio();
  const { activeParticipants } = useActiveParticipants();
  const { conference } = useConference();
  const { participants } = useParticipants();
  const { messages, sendMessage } = useChat();
  const intl = useIntl();
  const [mediaStream, setMediaStream] = useState<MediaStream>();
  const [disableVideo, setDisableVideo] = useState(false);
  const [showPreLiveOnboarding, setShowPreLiveOnboarding] = useState(true);
  const [showLiveOnboarding, setShowLiveOnboarding] = useState(false);

  // The mixer participant sometimes joins as a 'mixer_mix' or 'user'.
  // Instead of checking for both user types, we just check that the participant's type is not a 'listener'.
  const mixerParticipant = participants.find((p) => p.type !== 'listener');
  const isLive = !!mixerParticipant;

  useEffect(() => {
    setMediaStream(mixerParticipant?.streams[0]);
    setShowPreLiveOnboarding(!mixerParticipant);
    setShowLiveOnboarding(!!mixerParticipant);
    if (!mixerParticipant) {
      closeDrawer();
    }
  }, [closeDrawer, mixerParticipant]);

  const openParticipantsPanel = () => {
    openDrawer(SideDrawerContentTypes.PARTICIPANTS);
  };

  const openChatPanel = () => {
    openDrawer(SideDrawerContentTypes.CHAT);
  };

  if (!conference) {
    return null;
  }

  return (
    <div className={styles.layout}>
      <TopBar isLive={isLive} joinType="viewer" />
      <div className={styles.content}>
        {mixerParticipant && mediaStream ? (
          <div className={styles.live}>
            <div className={styles.video}>
              <Video disableVideo={disableVideo} mediaStream={mediaStream} />
            </div>
            <div id="viewerControls" className={styles.buttons}>
              <MediaButton
                testID="ToggleVideoButton"
                activeIcon="camera"
                defaultIcon="cameraOff"
                disabledIcon="cameraOff"
                activeTooltipText={intl.formatMessage({ id: 'videoOff' })}
                defaultTooltipText={intl.formatMessage({ id: 'videoOn' })}
                tooltipPosition="top"
                isActive={!disableVideo}
                onClick={() => setDisableVideo(!disableVideo)}
              />
              <MediaButton
                testID="ToggleAudioButton"
                activeIcon="speaker"
                defaultIcon="speakerOff"
                disabledIcon="speakerOff"
                activeTooltipText={intl.formatMessage({ id: 'audioOff' })}
                defaultTooltipText={intl.formatMessage({ id: 'audioOn' })}
                tooltipPosition="top"
                isActive={!isPageMuted}
                onClick={toggleMuteParticipants}
              />
            </div>
          </div>
        ) : (
          <div className={styles.notLive}>
            <Text testID="EventNotLivePageHeading" type="H2" labelKey="viewerNotLive" />
            <Text testID="EventNotLivePageDescription" color="grey.200" labelKey="viewerNotLiveSubText" />
          </div>
        )}
        <SideBar
          numParticipants={
            activeParticipants
              ? activeParticipants.participantCount + activeParticipants.viewerCount
              : participants.length
          }
          onParticipantsClick={mixerParticipant ? openParticipantsPanel : undefined}
          onChatClick={mixerParticipant ? openChatPanel : undefined}
          onExitConfirm={onExitConfirm}
        />
      </div>
      <SideDrawer
        activeParticipants={activeParticipants}
        messages={messages}
        onMessageSubmit={sendMessage}
        onParticipantsClick={mixerParticipant ? openParticipantsPanel : undefined}
        onChatClick={mixerParticipant ? openChatPanel : undefined}
        onExitConfirm={onExitConfirm}
      />

      {showLiveOnboarding && (
        <Onboarding name="liveViewer" steps={viewerLiveSteps} onComplete={() => setShowLiveOnboarding(false)} />
      )}

      {showPreLiveOnboarding && (
        <Onboarding
          name="preLiveViewer"
          steps={viewerPreLiveSteps}
          onComplete={() => setShowPreLiveOnboarding(false)}
        />
      )}
    </div>
  );
};
