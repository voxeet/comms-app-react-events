import AskForShareTooltip from '@components/AskForShareTooltip';
import PresenterGridItem from '@components/PresenterGridItem/PresenterGridItem';
import ShareHandOverTooltip from '@components/ShareHandOverTooltip/ShareHandOverTooltip';
import Text from '@components/Text';
import {
  IconButton,
  Modal,
  ScreenShareTakeoverMessages,
  ShareStatus,
  Tooltip,
  useMessage,
  useNotifications,
  useParticipants,
  useScreenSharing,
} from '@dolbyio/comms-uikit-react';
import ModalContentBase from '@src/components/ModalContentBase';
import cx from 'classnames';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import styles from './CollapsiblePanel.module.scss';

type CollapsiblePanelProps = {
  isPresentationActive: boolean;
  isOpen: boolean;
  onOpenClick: () => void;
  onInviteCoHostClick: () => void;
};

export const CollapsiblePanel = ({
  isPresentationActive,
  isOpen,
  onOpenClick,
  onInviteCoHostClick,
}: CollapsiblePanelProps) => {
  const { participant, participants } = useParticipants();
  const { startScreenShare, stopScreenShare, status, isLocalUserPresentationOwner, setPendingTakeoverRequest } =
    useScreenSharing();
  const { message, sender, sendMessage, clearMessage } = useMessage();
  const { showSuccessNotification, showErrorNotification } = useNotifications();
  const intl = useIntl();
  const [isTakeoverModalVisible, setIsTakeoverModalVisible] = useState(false);
  const [isAskForShareVisible, setIsAskForShareVisible] = useState(false);
  const [requests, setRequests] = useState<Set<string>>(new Set());

  let meFirst = participants;
  if (participant) {
    const localFirstParticipants = participants.filter((p) => p.id !== participant.id);
    localFirstParticipants.unshift(participant);
    meFirst = localFirstParticipants;
  }

  const startShare = async () => {
    setIsAskForShareVisible(false);
    const success = await startScreenShare();
    if (success) {
      showSuccessNotification(intl.formatMessage({ id: 'presentingSuccessfully' }));
    }
  };

  const stopShare = async () => {
    await stopScreenShare();
    showSuccessNotification(intl.formatMessage({ id: 'screenSharingStopped' }));
  };

  const toggleScreenShare = async () => {
    if (status === ShareStatus.Active && isLocalUserPresentationOwner) {
      stopShare();
      return;
    }

    if (status === ShareStatus.Active) {
      setIsTakeoverModalVisible(true);
      return;
    }

    startShare();
  };

  const requestTakeOver = () => {
    sendMessage({ type: ScreenShareTakeoverMessages.REQUEST });
    setIsTakeoverModalVisible(false);
    setPendingTakeoverRequest(true);
  };

  const acceptTakeOver = async (requester: string) => {
    requests.delete(requester);
    const declinees = new Set(requests);
    setRequests(new Set());
    await stopShare();
    sendMessage({
      type: ScreenShareTakeoverMessages.ACCEPT,
      user: requester,
    });
    for (const declinee of declinees.values()) {
      sendMessage({
        type: ScreenShareTakeoverMessages.DECLINE,
        user: declinee,
      });
    }
  };

  const declineTakeOver = async (user: string) => {
    requests.delete(user);
    setRequests(new Set(requests));
    await sendMessage({
      type: ScreenShareTakeoverMessages.DECLINE,
      user,
    });
  };

  useEffect(() => {
    if (message?.type === ScreenShareTakeoverMessages.REQUEST && sender?.info.name && isLocalUserPresentationOwner) {
      requests.add(sender.info.name);
      setRequests(new Set(requests));
    } else if (message?.type === ScreenShareTakeoverMessages.ACCEPT && message?.user === participant?.info.name) {
      setIsAskForShareVisible(true);
      setPendingTakeoverRequest(false);
    } else if (message?.type === ScreenShareTakeoverMessages.DECLINE && message?.user === participant?.info.name) {
      showErrorNotification(intl.formatMessage({ id: 'requestDeclined' }));
      setPendingTakeoverRequest(false);
    }
    clearMessage();
  }, [message]);

  useEffect(() => {
    if (status !== ShareStatus.Active) {
      setPendingTakeoverRequest(false);
      setIsTakeoverModalVisible(false);
      setRequests(new Set());
    }
  }, [status]);

  return (
    <>
      <Modal
        testID="ScreenSharingTakeOverModal"
        isVisible={isTakeoverModalVisible}
        close={() => setIsTakeoverModalVisible(false)}
        closeButton
      >
        <ModalContentBase
          buttons={[
            {
              onClick: requestTakeOver,
              label: intl.formatMessage({ id: 'askForPermission' }),
              testID: 'AskForPermissionButton',
            },
            {
              onClick: () => setIsTakeoverModalVisible(false),
              label: intl.formatMessage({ id: 'cancel' }),
              variant: 'secondary',
              testID: 'CancelButton',
            },
          ]}
          headline={intl.formatMessage({ id: 'someoneElseIsPresenting' })}
          description={intl.formatMessage({ id: 'screenSharingPermissionDesc' })}
          headerLogo="present"
        />
      </Modal>
      <div className={cx(styles.collapsiblePanel, isOpen && styles.open)}>
        <div className={styles.notifications}>
          {isLocalUserPresentationOwner &&
            Array.from(requests.values()).map((requester) => (
              <div data-testid="ShareHandOver" key={requester} className={styles.notification}>
                <ShareHandOverTooltip
                  accept={() => acceptTakeOver(requester)}
                  cancel={() => declineTakeOver(requester)}
                  requester={requester}
                />
              </div>
            ))}
          {isAskForShareVisible && (
            <div data-testid="AskForShare" className={styles.notification}>
              <AskForShareTooltip accept={startShare} cancel={() => setIsAskForShareVisible(false)} />
            </div>
          )}
        </div>
        <div className={styles.header} onClick={onOpenClick} onKeyDown={onOpenClick} tabIndex={0} role="button">
          <div className={styles.headerText}>
            <Text testID="HostsPanelTitle" type="h6" color="white">
              {intl.formatMessage({ id: 'hostLabel' })}
            </Text>
            <Text testID="HostsCount" type="subtitleSmall" color="white">
              {participants.length === 1 ? '1 presenter' : `${participants.length} presenters`}
            </Text>
          </div>
          <IconButton
            testID={isOpen ? 'CloseButton' : 'OpenButton'}
            onClick={onOpenClick}
            icon={isOpen ? 'chevronUp' : 'chevronDown'}
            backgroundColor="grey.800"
          />
        </div>
        <div className={styles.content}>
          <div className={styles.grid}>
            {meFirst.map((p) => (
              <div key={p.id} className={styles.participant}>
                <PresenterGridItem
                  participant={p}
                  localText={intl.formatMessage({ id: 'you' })}
                  forceShowAvatar={!isPresentationActive}
                  onScreenShareClick={toggleScreenShare}
                />
              </div>
            ))}
            <Tooltip text={intl.formatMessage({ id: 'inviteCoHosts' })}>
              <IconButton
                testID="InviteHosts"
                icon="add"
                size="l"
                variant="circle"
                backgroundColor="transparent"
                strokeColor="grey.400"
                onClick={onInviteCoHostClick}
              />
            </Tooltip>
          </div>
        </div>
      </div>
    </>
  );
};
