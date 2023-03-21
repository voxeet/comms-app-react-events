import AskForShareTooltip from '@components/AskForShareTooltip/AskForShareTooltip';
import ScreenSharingTakeOverModal from '@components/ScreenSharingTakeOverModal/ScreenSharingTakeOverModal';
import ShareHandOverTooltip from '@components/ShareHandOverTooltip/ShareHandOverTooltip';
import {
  DialogTooltip,
  LocalToggleAudioButton,
  LocalToggleVideoButton,
  ScreenShareButton,
  Space,
  useConference,
  useNotifications,
} from '@dolbyio/comms-uikit-react';
import { ReactNode, useCallback } from 'react';
import { useIntl } from 'react-intl';

import styles from './MediaDock.module.scss';

export const MediaDock = () => {
  const { conference } = useConference();
  const { showSuccessNotification, showErrorNotification } = useNotifications();
  const intl = useIntl();

  if (conference === null) {
    return null;
  }

  const renderTakeOver = useCallback(
    (isOpen: boolean, close: () => void): ReactNode => (
      <ScreenSharingTakeOverModal isOpen={isOpen} closeModal={close} />
    ),
    [],
  );

  const renderHandOver = useCallback(
    (isVisible: boolean, accept: () => void, cancel: () => void, requester?: string): ReactNode => (
      <DialogTooltip isVisible={isVisible}>
        <ShareHandOverTooltip accept={accept} cancel={cancel} requester={requester} />
      </DialogTooltip>
    ),
    [],
  );

  const renderAskForShare = useCallback(
    (isVisible: boolean, accept: () => void, cancel: () => void): ReactNode => (
      <DialogTooltip isVisible={isVisible}>
        <AskForShareTooltip accept={accept} cancel={cancel} />
      </DialogTooltip>
    ),
    [],
  );

  return (
    <Space testID="MediaDock" className={styles.dock} p="m">
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
        <ScreenShareButton
          size="s"
          defaultTooltipText={intl.formatMessage({ id: 'present' })}
          activeTooltipText={intl.formatMessage({ id: 'stopPresenting' })}
          onStartSharingAction={() => showSuccessNotification(intl.formatMessage({ id: 'presentingSuccessfully' }))}
          onStopSharingAction={() => showSuccessNotification(intl.formatMessage({ id: 'screenSharingStopped' }))}
          onTakeOverDeclineAction={() => showErrorNotification(intl.formatMessage({ id: 'requestDeclined' }))}
          renderTakeOver={renderTakeOver}
          renderHandOver={renderHandOver}
          renderAskForShare={renderAskForShare}
        />
      </Space>
    </Space>
  );
};
