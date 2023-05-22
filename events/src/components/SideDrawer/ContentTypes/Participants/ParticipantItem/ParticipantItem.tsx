import Text from '@components/Text';
import { UserMetadata } from '@context/PubNubContext';
import { Space, Avatar, ParticipantSpeakingIndicator, Icon } from '@dolbyio/comms-uikit-react';
import { InviteStatus } from '@src/types/invite';
import type { Participant } from '@voxeet/voxeet-web-sdk/types/models/Participant';
import cx from 'classnames';
import { useState } from 'react';
import { useIntl } from 'react-intl';

import styles from './ParticipantItem.module.scss';

type ParticipantItemProps = {
  participant: Participant | UserMetadata;
  isLocal: boolean;
  inviteStatus?: InviteStatus;
  onInviteClick?: () => void;
};

export const ParticipantItem = ({ participant, isLocal, inviteStatus, onInviteClick }: ParticipantItemProps) => {
  const intl = useIntl();
  const [isHoveringInvite, setIsHoveringInvite] = useState(false);
  const isViewer = 'username' in participant;

  const getInviteContent = () => {
    if (!onInviteClick) {
      return null;
    }
    if (inviteStatus === 'declined') {
      return (
        <div className={styles.declined}>
          <Text type="caption">{intl.formatMessage({ id: 'declined' })}</Text>
        </div>
      );
    }
    if (inviteStatus === 'invited') {
      return (
        <Text type="caption" color="grey.200">
          {intl.formatMessage({ id: 'invitedToHost' })}
        </Text>
      );
    }
    const label = intl.formatMessage({ id: 'inviteToHost' });
    return (
      <button
        className={styles.invite}
        type="button"
        aria-label={label}
        onClick={() => {
          setIsHoveringInvite(false);
          onInviteClick();
        }}
        onFocus={() => setIsHoveringInvite(true)}
        onBlur={() => setIsHoveringInvite(false)}
        onMouseOver={() => setIsHoveringInvite(true)}
        onMouseLeave={() => setIsHoveringInvite(false)}
      >
        <span>
          <Icon name="friends" color={isHoveringInvite ? 'white' : 'grey.300'} />
          {isHoveringInvite && (
            <div className={styles.tooltip}>
              <Text type="caption">{label}</Text>
            </div>
          )}
        </span>
      </button>
    );
  };

  return (
    <Space testID="ParticipantItem" className={cx(styles.item, isHoveringInvite && styles.hover)}>
      <Space className={styles.avatar}>
        <Avatar
          testID="ParticipantAvatar"
          size="s"
          participant={isViewer ? participant.username : participant}
          borderColor="grey.100"
        />
      </Space>
      <Text testID="ParticipantName">
        {isViewer ? participant.username : participant.info.name}{' '}
        {isLocal ? `(${intl.formatMessage({ id: 'you' })})` : ''}
      </Text>
      {isViewer ? (
        getInviteContent()
      ) : (
        <ParticipantSpeakingIndicator
          variant="square"
          testID="ParticipantSpeakingIndicator"
          participant={participant}
          inactiveIconColor="white"
          mutedIconColor="white"
          inactiveBackgroundColor="grey.600"
          mutedBackgroundColor="grey.600"
        />
      )}
    </Space>
  );
};
