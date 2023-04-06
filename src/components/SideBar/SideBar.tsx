import { IconButton, IconButtonProps, Tooltip, useTheme, Modal, Text, Button, Space } from '@dolbyio/comms-uikit-react';
import { useState } from 'react';
import { useIntl } from 'react-intl';

import styles from './SideBar.module.scss';

const SideBarButton = (
  props: IconButtonProps & {
    tooltipText: string;
    testID?: string;
  },
) => {
  const { tooltipText, testID, ...rest } = props;
  return (
    <Tooltip text={tooltipText}>
      <IconButton testID={testID} variant="circle" size="s" iconSize="m" {...rest} />
    </Tooltip>
  );
};

const SideBar = ({
  numParticipants,
  onParticipantsClick,
  onInviteClick,
  onSettingsClick,
  onExitConfirm,
}: {
  numParticipants?: number;
  onParticipantsClick?: () => void;
  onInviteClick?: () => void;
  onSettingsClick?: () => void;
  onExitConfirm?: () => void;
}) => {
  const [showLeaveCheckModal, setShowLeaveCheckModal] = useState(false);
  const { getColor } = useTheme();
  const intl = useIntl();

  return (
    <div className={styles.sideBar}>
      {onParticipantsClick && (
        <SideBarButton
          id="participantsButton"
          testID="ParticipantsButton"
          badge={numParticipants}
          badgeColor="grey.400"
          tooltipText={intl.formatMessage({ id: 'participantsLabel' })}
          icon="participants"
          onClick={onParticipantsClick}
        />
      )}
      <div className={styles.lowerSectionStart} />
      {onInviteClick && (
        <div>
          <SideBarButton
            id="inviteButton"
            testID="InviteButton"
            tooltipText={intl.formatMessage({ id: 'inviteLabel' })}
            icon="invite"
            onClick={onInviteClick}
          />
        </div>
      )}
      {onSettingsClick && (
        <div className={styles.aboveDivider}>
          <SideBarButton
            id="settingsButton"
            testID="SettingsButton"
            tooltipText={intl.formatMessage({ id: 'settings' })}
            icon="settings"
            onClick={onSettingsClick}
          />
        </div>
      )}
      {onExitConfirm && (
        <div className={styles.exit}>
          <SideBarButton
            id="leaveEventButton"
            testID="LeaveEventButton"
            tooltipText={intl.formatMessage({ id: 'exit' })}
            icon="exit"
            backgroundColor={getColor('infoError')}
            onClick={() => setShowLeaveCheckModal(true)}
          />
        </div>
      )}
      <Modal
        testID="LeaveEventModel"
        isVisible={showLeaveCheckModal}
        close={() => setShowLeaveCheckModal(false)}
        closeButton
        overlayClickClose
      >
        <Space m="l" className={styles.modal}>
          <Text testID="LeaveEventModelDescription" type="h6" align="center">
            Are you sure you want to leave the event?
          </Text>
          <Button testID="LeaveButton" size="s" fw onClick={onExitConfirm}>
            leave event
          </Button>
          <Button testID="CancelButton" variant="secondary" size="s" fw onClick={() => setShowLeaveCheckModal(false)}>
            cancel
          </Button>
        </Space>
      </Modal>
    </div>
  );
};

export default SideBar;
