import SideBar from '@components/SideBar';
import { SideDrawer } from '@components/SideDrawer';
import Text from '@components/Text';
import { TopBar } from '@components/TopBar/TopBar';
import { SideDrawerContentTypes } from '@context/SideDrawerContext';
import { MediaButton, useAudio, useConference, useParticipants } from '@dolbyio/comms-uikit-react';
import { useActiveParticipants } from '@hooks/useActiveParticipants';
import useDrawer from '@hooks/useDrawer';
import { useRealTimeStreaming } from '@hooks/useRealTimeStreaming';
import getProxyUrl from '@src/utils/getProxyUrl';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { Video } from './Video/Video';
import styles from './View.module.scss';

export const View = ({ onExitConfirm }: { onExitConfirm: () => void }) => {
  const { openDrawer } = useDrawer();
  const { isPageMuted, toggleMuteParticipants } = useAudio();
  const { activeParticipants } = useActiveParticipants();
  const { conference } = useConference();
  const { participants } = useParticipants();
  const { mixerParticipant, isLive } = useRealTimeStreaming(getProxyUrl());
  const [mediaStream, setMediaStream] = useState<MediaStream>();
  const [disableVideo, setDisableVideo] = useState(false);
  const intl = useIntl();

  useEffect(() => {
    setMediaStream(mixerParticipant?.streams[0]);
  }, [mixerParticipant]);

  const openParticipantsPanel = () => {
    openDrawer(SideDrawerContentTypes.PARTICIPANTS);
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
            <div className={styles.buttons}>
              <MediaButton
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
            <Text type="H2" labelKey="viewerNotLive" />
            <Text color="grey.200" labelKey="viewerNotLiveSubText" />
          </div>
        )}
        <SideBar
          numParticipants={
            activeParticipants
              ? activeParticipants.participantCount + activeParticipants.viewerCount
              : participants.length
          }
          onParticipantsClick={openParticipantsPanel}
          onExitConfirm={onExitConfirm}
        />
      </div>

      <SideDrawer activeParticipants={activeParticipants} />
    </div>
  );
};
