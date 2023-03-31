import ConferenceCreateFooter from '@src/components/ConferenceCreateFooter';
import ConferenceCreateHeader from '@src/components/ConferenceCreateHeader';
import Text from '@src/components/Text';
import { getFriendlyName } from '@src/utils/misc';

import styles from './Join.module.scss';
import { JoinForm } from './JoinForm';

type JoinProps = {
  eventName?: string;
  onJoinStart: (name: string) => void;
};

export const Join = ({ eventName, onJoinStart }: JoinProps) => {
  return (
    <div className={styles.layout}>
      <ConferenceCreateHeader />
      <div className={styles.content}>
        {eventName && (
          <Text testID="MeetingName" type="H1" className={styles.eventTitle}>
            {getFriendlyName(eventName)}
          </Text>
        )}
        <JoinForm onSubmit={onJoinStart} />
      </div>
      <ConferenceCreateFooter />
    </div>
  );
};
