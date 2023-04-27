import { useTheme, Space, Overlay, useCommsContext } from '@dolbyio/comms-uikit-react';
import useDrawer from '@hooks/useDrawer';
import ConferenceDeviceSettings from '@src/components/SideDrawer/ContentTypes/ConferenceDeviceSettings/ConferenceDeviceSettings';
import DeviceSetup from '@src/components/SideDrawer/ContentTypes/DeviceSetup/DeviceSetup';
import Participants from '@src/components/SideDrawer/ContentTypes/Participants/Participants';
import { SideDrawerContentTypes } from '@src/context/SideDrawerContext';
import { ChatMessage } from '@src/types/chat';
import { ActiveParticipants } from '@voxeet/voxeet-web-sdk/types/events/notification';
import cx from 'classnames';
import { useEffect } from 'react';

import SideDrawerBottomBar from '../SideDrawerBottomBar/SideDrawerBottomBar';

import { Chat } from './ContentTypes/Chat/Chat';
import styles from './SideDrawer.module.scss';

const isSafariMobile = navigator.userAgent.match(/safari/i) && !('chrome' in window);

type SideDrawerProps = {
  activeParticipants?: ActiveParticipants;
  messages?: ChatMessage[];
  onMessageSubmit?: (text: string) => void;
  onParticipantsClick?: () => void;
  onChatClick?: () => void;
  onSettingsClick?: () => void;
  onExitConfirm?: () => void;
};

export const SideDrawer = ({
  activeParticipants,
  messages,
  onMessageSubmit,
  onParticipantsClick,
  onChatClick,
  onSettingsClick,
  onExitConfirm,
}: SideDrawerProps) => {
  const { getColor, isMobile, isMobileSmall } = useTheme();
  const { isDrawerOpen, contentType, closeDrawer } = useDrawer();
  const { conferenceStatus } = useCommsContext();

  useEffect(() => {
    if (conferenceStatus === 'ended') {
      onExitConfirm?.();
    }
  }, [conferenceStatus, onExitConfirm]);

  const isSmartphone = isMobile || isMobileSmall;
  const isSafariTablet = isSafariMobile && !isSmartphone;
  const isVisible = isDrawerOpen && contentType !== null;

  const content = () => {
    if (contentType === SideDrawerContentTypes.DEVICE_SETUP) {
      return <DeviceSetup />;
    }
    if (contentType === SideDrawerContentTypes.PARTICIPANTS) {
      return <Participants activeParticipants={activeParticipants} />;
    }
    if (contentType === SideDrawerContentTypes.CONFERENCE_SETTINGS) {
      return <ConferenceDeviceSettings />;
    }
    if (contentType === SideDrawerContentTypes.CHAT && messages && onMessageSubmit) {
      return <Chat messages={messages} onMessageSubmit={onMessageSubmit} />;
    }
    return null;
  };

  return (
    <>
      <Overlay visible={isVisible} onClick={closeDrawer} opacity={0.5} color="black" />
      {(!isSafariTablet || isVisible) && (
        <Space
          fw={isSmartphone}
          fh
          testID="Drawer"
          className={cx(styles.drawer, isSmartphone && styles.mobile, isVisible && styles.active)}
          style={{ backgroundColor: getColor('grey.800') }}
        >
          <Space fw fh className={styles.container}>
            {isVisible && (
              <>
                {content()}
                <SideDrawerBottomBar
                  contentType={contentType}
                  onParticipantsClick={onParticipantsClick}
                  onChatClick={onChatClick}
                  onSettingsClick={onSettingsClick}
                  onExitConfirm={onExitConfirm}
                />
              </>
            )}
          </Space>
        </Space>
      )}
    </>
  );
};

export default SideDrawer;
