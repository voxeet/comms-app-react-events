import AskForShareTooltip from '@components/AskForShareTooltip';
import PresenterGridItem from '@components/PresenterGridItem/PresenterGridItem';
import ShareHandOverTooltip from '@components/ShareHandOverTooltip/ShareHandOverTooltip';
import Text from '@components/Text';
import { Icon, IconButton, Tooltip, useParticipants, useScreenSharing } from '@dolbyio/comms-uikit-react';
import cx from 'classnames';
import { useIntl } from 'react-intl';

import styles from './CollapsiblePanel.module.scss';

type CollapsiblePanelProps = {
  isOpen: boolean;
  isAskForShareVisible: boolean;
  isPresentationActive: boolean;
  screenShareRequests: string[];
  onOpenClick: () => void;
  onInviteCoHostClick: () => void;
  onTakeoverAccept: (requester: string) => void;
  onTakeoverDecline: (requester: string) => void;
  onAskForShareAccept: () => void;
  onAskForShareCancel: () => void;
  onScreenShareClick: () => void;
};

export const CollapsiblePanel = ({
  isOpen,
  isAskForShareVisible,
  isPresentationActive,
  screenShareRequests,
  onOpenClick,
  onInviteCoHostClick,
  onTakeoverAccept,
  onTakeoverDecline,
  onAskForShareAccept,
  onAskForShareCancel,
  onScreenShareClick,
}: CollapsiblePanelProps) => {
  const { participant, participants } = useParticipants();
  const { isLocalUserPresentationOwner } = useScreenSharing();
  const intl = useIntl();

  let meFirst = participants;
  if (participant) {
    const localFirstParticipants = participants.filter((p) => p.id !== participant.id);
    localFirstParticipants.unshift(participant);
    meFirst = localFirstParticipants;
  }

  return (
    <div className={cx(styles.collapsiblePanel, isOpen && styles.open)}>
      <div className={styles.notifications}>
        {isLocalUserPresentationOwner &&
          screenShareRequests.map((requester) => (
            <div data-testid="ShareHandOver" key={requester} className={styles.notification}>
              <ShareHandOverTooltip
                accept={() => onTakeoverAccept(requester)}
                cancel={() => onTakeoverDecline(requester)}
                requester={requester}
              />
            </div>
          ))}
        {isAskForShareVisible && (
          <div data-testid="AskForShare" className={styles.notification}>
            <AskForShareTooltip accept={onAskForShareAccept} cancel={onAskForShareCancel} />
          </div>
        )}
      </div>
      <button type="button" className={styles.header} onClick={onOpenClick}>
        <div className={styles.headerText}>
          <Text testID="HostsPanelTitle" type="h6" color="white">
            {intl.formatMessage({ id: 'hostLabel' })}
          </Text>
          <Text testID="HostsCount" type="subtitleSmall" color="white">
            {participants.length === 1 ? '1 presenter' : `${participants.length} presenters`}
          </Text>
        </div>
        <Icon testID={isOpen ? 'CloseButton' : 'OpenButton'} name={isOpen ? 'chevronUp' : 'chevronDown'} />
      </button>
      {isOpen && (
        <div className={styles.content}>
          <div className={styles.grid}>
            {meFirst.map((p) => (
              <div key={p.id} className={styles.participant}>
                <PresenterGridItem
                  participant={p}
                  localText={intl.formatMessage({ id: 'you' })}
                  forceShowAvatar={!isPresentationActive}
                  onScreenShareClick={onScreenShareClick}
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
      )}
    </div>
  );
};
