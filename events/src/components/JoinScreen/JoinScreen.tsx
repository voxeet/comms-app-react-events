import Text from '@components/Text';
import Version from '@components/Version';
import { IconButton } from '@dolbyio/comms-uikit-react';
import { ReactNode } from 'react';

import styles from './JoinScreen.module.scss';

type JoinScreenProps = {
  heading: string;
  onBackClick?: () => void;
  onSettingsClick?: () => void;
  children: ReactNode;
};

export const JoinScreen = ({ heading, onBackClick, onSettingsClick, children }: JoinScreenProps) => {
  return (
    <div className={styles.layout}>
      <div className={styles.header}>
        <div>
          {onBackClick && (
            <IconButton
              testID="StepBackButton"
              backgroundColor="transparent"
              icon="arrowLeft"
              iconColor="grey.100"
              onClick={onBackClick}
            />
          )}
        </div>
        <Text testID="EventJoinTitle" className={styles.heading} color="grey.25" type="H4">
          {heading}
        </Text>
        <div>
          {onSettingsClick && (
            <IconButton
              testID="SettingsButton"
              backgroundColor="transparent"
              icon="settings"
              onClick={onSettingsClick}
              iconColor="grey.300"
            />
          )}
        </div>
      </div>
      <div className={styles.main}>{children}</div>
      <div className={styles.footer}>
        <Text
          testID="CopyRight"
          type="captionRegular"
          color="grey.300"
          labelKey="copyright"
          values={{ year: new Date().getFullYear() }}
        />
        <Version />
      </div>
    </div>
  );
};
