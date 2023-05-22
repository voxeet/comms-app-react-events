import { Icon, ParticipantAvatar } from '@dolbyio/comms-uikit-react';
import Text from '@src/components/Text';
import { ChatMessage } from '@src/types/chat';
import cx from 'classnames';
import { useMemo, useState } from 'react';
import { useIntl } from 'react-intl';

import styles from './Message.module.scss';

type MessageProps = {
  message: ChatMessage;
  isOwnedByLocalUser: boolean;
  onDeleteMessageClick?: (message: ChatMessage) => void;
};

export const Message = ({ message, isOwnedByLocalUser, onDeleteMessageClick }: MessageProps) => {
  const intl = useIntl();
  const [isHoveringDelete, setIsHoveringDelete] = useState(false);

  const time = useMemo(() => {
    // Converts a PubNub time token to a Unix timestamp (milliseconds)
    // https://support.pubnub.com/hc/en-us/articles/360051495812-How-do-I-convert-the-PubNub-timetoken-to-Unix-timestamp-
    const timestamp = Math.trunc(parseInt(message.timeToken, 10) / 10000);
    const d = new Date(timestamp);
    return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  }, [message.timeToken]);

  const label = useMemo(() => {
    if (isOwnedByLocalUser) {
      return `(${intl.formatMessage({ id: 'you' })})`;
    }
    if (message.role === 'host') {
      return intl.formatMessage({ id: 'host' });
    }
    return undefined;
  }, [intl, message.role, isOwnedByLocalUser]);

  return (
    <div data-testid="ChatMessage" className={cx(styles.message, isHoveringDelete && styles.delete)}>
      <ParticipantAvatar testID="Avatar" size="xs" participant={message.username} />
      <div className={styles.main}>
        <div className={styles.header}>
          <div data-testid="Sender" className={styles.name}>
            <Text testID="SenderName">{message.username}</Text>
            {label && (
              <Text testID="SenderType" style={{ fontWeight: '400' }} color="grey.300">
                {label}
              </Text>
            )}
          </div>
          <div className={styles.right}>
            <Text testID="Time" color="grey.200" type="captionSmall">
              {time}
            </Text>
            {onDeleteMessageClick && (
              <Icon name="delete" size="m" color="grey.300" onMouseEnter={() => setIsHoveringDelete(true)} />
            )}
          </div>
        </div>
        <Text testID="Message" style={{ wordBreak: 'break-word' }} color="grey.200">
          {message.text}
        </Text>
        {onDeleteMessageClick && (
          <button
            data-testid="Delete"
            type="button"
            className={cx(styles.delete, isHoveringDelete && styles.visible)}
            onClick={() => onDeleteMessageClick?.(message)}
            onMouseLeave={() => setIsHoveringDelete(false)}
          >
            <Text type="caption">{intl.formatMessage({ id: 'delete' })}</Text>
          </button>
        )}
      </div>
    </div>
  );
};
