import { DrawerMainContent, DrawerHeader } from '@components/SideDrawer';
import Text from '@components/Text';
import { UserMetadata } from '@context/PubNubContext';
import { useParticipants, Space } from '@dolbyio/comms-uikit-react';
import { InviteStatus } from '@src/types/invite';
import type { Participant } from '@voxeet/voxeet-web-sdk/types/models/Participant';

import { ParticipantItem } from './ParticipantItem/ParticipantItem';
import styles from './Participants.module.scss';

type ParticipantsProps = {
  hosts: Participant[];
  viewers: UserMetadata[];
  viewerCount: number;
  inviteStatuses?: Map<string, InviteStatus>;
  onInviteClick?: (uuid: string) => void;
};

const Participants = ({ hosts, viewers, viewerCount, inviteStatuses, onInviteClick }: ParticipantsProps) => {
  const { participant, participantsStatus } = useParticipants();

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
            <Text
              testID="HostsCount"
              className={styles.heading}
              color="grey.100"
              type="H3"
              labelKey="hostParticipants"
              values={{ count: hosts.length }}
            />
            {hosts.map((host) => (
              <ParticipantItem
                key={host.id}
                participant={host}
                isLocal={participantsStatus[host.id] ? participantsStatus[host.id].isLocal : false}
              />
            ))}
          </div>
          <div>
            <Text
              testID="ViewersCount"
              className={styles.heading}
              color="grey.100"
              type="H3"
              labelKey="viewerCount"
              values={{ count: viewerCount }}
            />
            {viewers.map((viewer) => (
              <ParticipantItem
                key={viewer.uuid}
                participant={viewer}
                isLocal={participant ? viewer.uuid === participant.id : false}
                inviteStatus={inviteStatuses ? inviteStatuses.get(viewer.uuid) : undefined}
                onInviteClick={onInviteClick ? () => onInviteClick(viewer.uuid) : undefined}
              />
            ))}
          </div>
        </Space>
      </DrawerMainContent>
    </Space>
  );
};

export default Participants;
