import { useParticipants, Space, ParticipantAvatar, ParticipantSpeakingIndicator } from '@dolbyio/comms-uikit-react';
import { DrawerMainContent, DrawerHeader } from '@src/components/SideDrawer';
import Text from '@src/components/Text';
import type { ActiveParticipants } from '@voxeet/voxeet-web-sdk/types/events/notification';
import type { Participant } from '@voxeet/voxeet-web-sdk/types/models/Participant';
import { useIntl } from 'react-intl';

import styles from './Participants.module.scss';

const ParticipantItem = ({ participant, isLocal }: { participant: Participant; isLocal: boolean }) => {
  const intl = useIntl();

  return (
    <Space className={styles.item}>
      <Space className={styles.avatar}>
        <ParticipantAvatar testID="ParticipantAvatar" size="s" participant={participant} borderColor="grey.100" />
      </Space>
      <Text>
        {participant.info.name} {isLocal ? `(${intl.formatMessage({ id: 'you' })})` : ''}
      </Text>
      <ParticipantSpeakingIndicator
        variant="square"
        testID="ParticipantSpeakingIndicator"
        participant={participant}
        inactiveIconColor="white"
        mutedIconColor="white"
        inactiveBackgroundColor="grey.600"
        mutedBackgroundColor="grey.600"
      />
    </Space>
  );
};

const Participants = ({ activeParticipants }: { activeParticipants?: ActiveParticipants }) => {
  const { participants, participantsStatus } = useParticipants();
  const hosts = activeParticipants?.participants ?? participants;
  const viewerCount = activeParticipants?.viewerCount ?? 0;

  return (
    <Space fw fh testID="Participants" className={styles.container}>
      <DrawerHeader
        labelKey="totalParticipants"
        labelValues={{ count: hosts.length + viewerCount }}
        color="grey.100"
        closeButtonBackgroundColor="grey.500"
        closeButtonIconColor="white"
        closeButtonStrokeColor="transparent"
      />
      <DrawerMainContent>
        <Space className={styles.participants}>
          <div>
            <Text color="grey.100" type="H3" labelKey="hostParticipants" values={{ count: hosts.length }} />
            {hosts.map((p) => (
              <ParticipantItem
                key={p.id}
                participant={p}
                isLocal={participantsStatus[p.id] ? participantsStatus[p.id].isLocal : false}
              />
            ))}
          </div>
          <div>
            <Text color="grey.100" type="H3" labelKey="viewerCount" values={{ count: viewerCount }} />
          </div>
        </Space>
      </DrawerMainContent>
    </Space>
  );
};

export default Participants;
