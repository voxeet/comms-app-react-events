import Text from '@components/Text';
import { Space } from '@dolbyio/comms-uikit-react';

import styles from './Rejoin.module.scss';
import { RejoinButton } from './RejoinButton/RejoinButton';
import { ReturnToHomeButton } from './ReturnToHomeButton/ReturnToHomeButton';

type RejoinProps = {
  onJoinSuccess: () => void;
};

export const Rejoin = ({ onJoinSuccess }: RejoinProps) => {
  return (
    <Space testID="ConferenceLeftRoute">
      <Space fw className={styles.wrapper}>
        <Space className={styles.textContainer}>
          <Text testID="ConferenceLeftPageHeading" type="H0" align="center" labelKey="eventLeft" />
        </Space>
        <ReturnToHomeButton />
        <RejoinButton onJoinSuccess={onJoinSuccess} />
      </Space>
    </Space>
  );
};
