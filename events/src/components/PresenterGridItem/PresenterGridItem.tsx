import { ParticipantsGridItem, Space, Text, useParticipants } from '@dolbyio/comms-uikit-react';
import type { Participant } from '@voxeet/voxeet-web-sdk/types/models/Participant';
import { memo } from 'react';

import { MediaDock } from '../MediaDock/MediaDock';

import styles from './PresenterGridItem.module.scss';

type PresenterGridItemProps = {
  participant: Participant;
  localText: string;
  forceShowAvatar?: boolean;
  onScreenShareClick: () => void;
};

const PresenterGridItem = memo(
  ({ participant, localText, forceShowAvatar, onScreenShareClick }: PresenterGridItemProps) => {
    const { participantsStatus } = useParticipants();
    const { isLocal } = participantsStatus[participant.id] || {};

    return (
      <Space testID="PresenterGridItem" className={styles.item}>
        {isLocal ? (
          <Text testID="LocalName" type="captionDemiBold" color="white">
            {`${participant.info.name} (${localText})`}
          </Text>
        ) : (
          <Text testID="DrawerParticipantName" type="captionDemiBold" color="white">
            {participant.info.name}
          </Text>
        )}
        <div className={styles.video}>
          <ParticipantsGridItem
            participant={participant}
            localText={localText}
            showParticipantNamePill={false}
            forceShowAvatar={forceShowAvatar}
          />
        </div>
        {isLocal && (
          <div className={styles.dock}>
            <MediaDock onScreenShareClick={onScreenShareClick} />
          </div>
        )}
      </Space>
    );
  },
);

export default PresenterGridItem;
