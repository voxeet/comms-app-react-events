import { useTheme, Space, Overlay } from '@dolbyio/comms-uikit-react';
import useDrawer from '@hooks/useDrawer';
import ConferenceDeviceSettings from '@src/components/SideDrawer/ContentTypes/ConferenceDeviceSettings/ConferenceDeviceSettings';
import DeviceSetup from '@src/components/SideDrawer/ContentTypes/DeviceSetup/DeviceSetup';
import Participants from '@src/components/SideDrawer/ContentTypes/Participants/Participants';
import { SideDrawerContentTypes } from '@src/context/SideDrawerContext';
import { ActiveParticipants } from '@voxeet/voxeet-web-sdk/types/events/notification';
import cx from 'classnames';
import { useMemo } from 'react';

import SideDrawerBottomBar from '../SideDrawerBottomBar/SideDrawerBottomBar';

import styles from './SideDrawer.module.scss';

const isSafariMobile = navigator.userAgent.match(/safari/i) && !('chrome' in window);

type SideDrawerProps = {
  activeParticipants?: ActiveParticipants;
  onParticipantsClick?: () => void;
  onSettingsClick?: () => void;
  onExitConfirm?: () => void;
};

export const SideDrawer = ({
  activeParticipants,
  onParticipantsClick,
  onSettingsClick,
  onExitConfirm,
}: SideDrawerProps) => {
  const { getColor, isMobile, isMobileSmall } = useTheme();
  const { isDrawerOpen, contentType, closeDrawer } = useDrawer();

  const isSmartphone = isMobile || isMobileSmall;
  const isSafariTablet = isSafariMobile && !isSmartphone;
  const isVisible = isDrawerOpen && contentType !== null;

  const background = useMemo(() => {
    if (
      contentType === SideDrawerContentTypes.PARTICIPANTS ||
      contentType === SideDrawerContentTypes.CONFERENCE_SETTINGS
    ) {
      return 'grey.800';
    }
    if (contentType === SideDrawerContentTypes.DEVICE_SETUP) {
      return 'grey.800';
    }
    return 'grey.800';
  }, [contentType, isDrawerOpen]);

  const content = useMemo(() => {
    if (contentType === SideDrawerContentTypes.DEVICE_SETUP) {
      return <DeviceSetup />;
    }
    if (contentType === SideDrawerContentTypes.PARTICIPANTS) {
      return <Participants activeParticipants={activeParticipants} />;
    }
    if (contentType === SideDrawerContentTypes.CONFERENCE_SETTINGS) {
      return <ConferenceDeviceSettings />;
    }
    return null;
  }, [contentType, isDrawerOpen]);

  const drawerWrapper = useMemo(
    () => (
      <Space
        fw={isSmartphone}
        fh
        testID="Drawer"
        className={cx(styles.drawer, isSmartphone && styles.mobile, isVisible && styles.active)}
        style={{ backgroundColor: getColor(background, 'grey.800') }}
      >
        <Space fw fh className={styles.container}>
          {isVisible && (
            <>
              {content}
              <SideDrawerBottomBar
                contentType={contentType}
                onExitConfirm={onExitConfirm}
                onSettingsClick={onSettingsClick}
                onParticipantsClick={onParticipantsClick}
              />
            </>
          )}
        </Space>
      </Space>
    ),
    [isSmartphone, isDrawerOpen, contentType],
  );

  return (
    <>
      <Overlay visible={isVisible} onClick={closeDrawer} opacity={0.5} color="black" />
      {(!isSafariTablet || isVisible) && drawerWrapper}
    </>
  );
};

export default SideDrawer;
