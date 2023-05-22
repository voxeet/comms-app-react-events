import {
  LocalToggleAudioButton,
  LocalToggleVideoButton,
  MediaButton,
  ShareStatus,
  Space,
  useScreenSharing,
} from '@dolbyio/comms-uikit-react';
import { useIntl } from 'react-intl';

import styles from './MediaDock.module.scss';

export type MediaDockProps = {
  onScreenShareClick?: () => void;
};

export const MediaDock = ({ onScreenShareClick }: MediaDockProps) => {
  const { status, isLocalUserPresentationOwner, isPendingTakeoverRequest } = useScreenSharing();
  const intl = useIntl();

  return (
    <Space testID="MediaDock" className={styles.dock}>
      <Space className={styles.row}>
        <LocalToggleAudioButton
          size="s"
          defaultBackgroundColor="white"
          activeBackgroundColor="grey.600"
          disabledBackgroundColor="white"
          defaultIconColor="primary.400"
          activeIconColor="white"
          disabledIconColor="grey.100"
          disabledStrokeColor="grey.100"
          defaultTooltipText={intl.formatMessage({ id: 'mute' })}
          activeTooltipText={intl.formatMessage({ id: 'unmute' })}
          testID="ToggleMicrophoneButton"
        />
        <LocalToggleVideoButton
          size="s"
          defaultBackgroundColor="white"
          activeBackgroundColor="grey.600"
          disabledBackgroundColor="white"
          defaultIconColor="primary.400"
          activeIconColor="white"
          disabledIconColor="grey.100"
          disabledStrokeColor="grey.100"
          defaultTooltipText={intl.formatMessage({ id: 'cameraOff' })}
          activeTooltipText={intl.formatMessage({ id: 'cameraOn' })}
          testID="ToggleCameraButton"
        />
        {onScreenShareClick && (
          <MediaButton
            size="s"
            tooltipPosition="top"
            defaultTooltipText={intl.formatMessage({ id: 'present' })}
            activeTooltipText={intl.formatMessage({ id: 'stopPresenting' })}
            defaultIcon="present"
            activeIcon="present"
            disabledIcon="present"
            isActive={status === ShareStatus.Active && isLocalUserPresentationOwner}
            isDisabled={isPendingTakeoverRequest}
            onClick={onScreenShareClick}
            testID="ToggleScreenshareButton"
          />
        )}
      </Space>
    </Space>
  );
};
