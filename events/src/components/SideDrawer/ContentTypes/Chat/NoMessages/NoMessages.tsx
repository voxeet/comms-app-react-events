import { Icon } from '@dolbyio/comms-uikit-react';
import Text from '@src/components/Text';

import styles from './NoMessages.module.scss';

export const NoMessages = () => {
  return (
    <div className={styles.container}>
      <div className={styles.icon}>
        <Icon name="chat" size="xl" color="grey.300" />
      </div>
      <Text>No messages!</Text>
    </div>
  );
};
