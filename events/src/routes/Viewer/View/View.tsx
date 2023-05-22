import { Onboarding } from '@components/Onboarding/Onboarding';
import SideBar from '@components/SideBar';
import { SideDrawer } from '@components/SideDrawer';
import Text from '@components/Text';
import { TopBar } from '@components/TopBar/TopBar';
import { PubNubContext } from '@context/PubNubContext';
import { SideDrawerContentTypes } from '@context/SideDrawerContext';
import { MediaButton, useAudio, useConference, useNotifications, useParticipants } from '@dolbyio/comms-uikit-react';
import { useChat } from '@hooks/useChat';
import useDrawer from '@hooks/useDrawer';
import { useInvite } from '@hooks/useInvite';
import { useParticipantList } from '@hooks/useParticipantList';
import { viewerLiveSteps } from '@src/onboarding/viewer_live';
import { viewerPreLiveSteps } from '@src/onboarding/viewer_pre_live';
import { useContext, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { JoinAsHostModal } from './JoinAsHostModal/JoinAsHostModal';
import { Video } from './Video/Video';
import styles from './View.module.scss';

export const View = ({ onExitConfirm }: { onExitConfirm: () => void }) => {
  const pubnub = useContext(PubNubContext);
  const { closeDrawer, openDrawer } = useDrawer();
  const { isPageMuted, resetAudio, toggleMuteParticipants } = useAudio();
  const { conference } = useConference();
  const { participants } = useParticipants();
  const { showErrorNotification } = useNotifications();
  const { messages, numUnreadMessages, sendMessage, markAsRead } = useChat();
  const { hosts, viewers, viewerCount } = useParticipantList();
  const { inviter, accept: acceptInvite, decline: declineInvite, ignore: ignoreInvite } = useInvite();
  const intl = useIntl();
  const [mediaStream, setMediaStream] = useState<MediaStream>();
  const [disableVideo, setDisableVideo] = useState(false);
  const [showPreLiveOnboarding, setShowPreLiveOnboarding] = useState(true);
  const [showLiveOnboarding, setShowLiveOnboarding] = useState(false);

  // The mixer participant sometimes joins as a 'mixer_mix' or 'user'.
  // Instead of checking for both user types, we just check that the participant's type is not a 'listener'.
  const mixerParticipant = participants.find((p) => p.type !== 'listener');
  const isLive = !!mixerParticipant;

  // Cleanup on unmount. This cleanup is specifically for when the viewer is promoted to a host.
  useEffect(() => {
    return () => {
      closeDrawer();
      resetAudio();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Set correct state when going to and from pre-live to live
  useEffect(() => {
    setMediaStream(mixerParticipant?.streams[0]);
    setShowPreLiveOnboarding(!isLive);
    setShowLiveOnboarding(!!isLive);
    if (isLive) {
      // Turn off audio by default
      toggleMuteParticipants();
    } else {
      closeDrawer();
      resetAudio();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mixerParticipant, isLive]);

  useEffect(() => {
    if (!isLive && inviter) {
      ignoreInvite();
    }
  }, [isLive, inviter, ignoreInvite]);

  useEffect(() => {
    if (pubnub.status === 'error') {
      showErrorNotification(intl.formatMessage({ id: 'invalidPubNubKeys' }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pubnub.status]);

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
      <TopBar isLive={isLive} joinType="viewer" viewerCount={viewerCount} />
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
          numParticipants={hosts.length + viewerCount}
          numUnreadMessages={numUnreadMessages}
          onParticipantsClick={mixerParticipant ? openParticipantsPanel : undefined}
          onChatClick={mixerParticipant && pubnub.status === 'ready' ? openChatPanel : undefined}
          onExitConfirm={onExitConfirm}
        />
      </div>
      <SideDrawer
        hosts={hosts}
        viewers={Array.from(viewers).map(([, user]) => user)}
        viewerCount={viewerCount}
        messages={messages}
        numUnreadMessages={numUnreadMessages}
        onMessageSubmit={sendMessage}
        onMessageRead={markAsRead}
        onParticipantsClick={mixerParticipant ? openParticipantsPanel : undefined}
        onChatClick={mixerParticipant && pubnub.status === 'ready' ? openChatPanel : undefined}
        onExitConfirm={onExitConfirm}
      />

      {isLive && inviter && (
        <JoinAsHostModal inviter={inviter} onAcceptClick={acceptInvite} onDeclineClick={declineInvite} />
      )}

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
