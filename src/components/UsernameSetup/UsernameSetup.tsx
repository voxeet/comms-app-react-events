import Text from '@src/components/Text';
import { getFriendlyName } from '@src/utils/misc';

import { UsernameForm } from './UsernameForm';
import styles from './UsernameSetup.module.scss';

type UsernameSetupProps = {
  eventName: string;
  onSubmit: (username: string) => void;
};

export const UsernameSetup = ({ eventName, onSubmit }: UsernameSetupProps) => {
  return (
    <div className={styles.layout}>
      <div className={styles.content}>
        <Text testID="MeetingName" type="H1" className={styles.eventTitle}>
          {getFriendlyName(eventName)}
        </Text>
        <UsernameForm onSubmit={onSubmit} />
      </div>
    </div>
  );
};
