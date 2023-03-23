import {
  LocalToggleAudioButton,
  LocalToggleVideoButton,
  MediaButton,
  ShareStatus,
  Space,
  useConference,
  useScreenSharing,
} from '@dolbyio/comms-uikit-react';
import { useIntl } from 'react-intl';

import styles from './MediaDock.module.scss';

export type MediaDockProps = {
  onScreenShareClick: () => void;
};

export const MediaDock = ({ onScreenShareClick }: MediaDockProps) => {
  const { conference } = useConference();
  const { status, isLocalUserPresentationOwner, isPendingTakeoverRequest } = useScreenSharing();
  const intl = useIntl();

  if (conference === null) {
    return null;
  }

  return (
    <Space testID="MediaDock" className={styles.dock}>
      <Space className={styles.row}>
        <LocalToggleAudioButton
          size="s"
          defaultBackgroundColor="white"
          activeBackgroundColor="white"
          disabledBackgroundColor="white"
          defaultIconColor="primary.400"
          activeIconColor="grey.300"
          disabledIconColor="grey.100"
          activeStrokeColor="grey.300"
          disabledStrokeColor="grey.100"
          defaultTooltipText={intl.formatMessage({ id: 'mute' })}
          activeTooltipText={intl.formatMessage({ id: 'unmute' })}
        />
        <LocalToggleVideoButton
          size="s"
          defaultBackgroundColor="white"
          activeBackgroundColor="white"
          disabledBackgroundColor="white"
          defaultIconColor="primary.400"
          activeIconColor="grey.300"
          disabledIconColor="grey.100"
          activeStrokeColor="grey.300"
          disabledStrokeColor="grey.100"
          defaultTooltipText={intl.formatMessage({ id: 'cameraOff' })}
          activeTooltipText={intl.formatMessage({ id: 'cameraOn' })}
        />
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
        />
      </Space>
    </Space>
  );
};
