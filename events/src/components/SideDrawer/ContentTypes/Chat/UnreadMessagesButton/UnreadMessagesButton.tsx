import { Badge, Text } from '@dolbyio/comms-uikit-react';
import { useIntl } from 'react-intl';

import styles from './UnreadMessages.module.scss';

type UnreadMessagesButtonProps = {
  numUnreadMessages: number;
  onClick: () => void;
};

export const UnreadMessagesButton = ({ numUnreadMessages, onClick }: UnreadMessagesButtonProps) => {
  const intl = useIntl();
  return (
    <button type="button" className={styles.button} onClick={onClick}>
      <Badge content={numUnreadMessages} backgroundColor="primary.300" />
      <Text type="caption">{intl.formatMessage({ id: 'newMessages' })}</Text>
    </button>
  );
};
