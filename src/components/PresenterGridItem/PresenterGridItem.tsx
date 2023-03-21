import { ParticipantsGridItem, Space, Text, useParticipants, useTheme } from '@dolbyio/comms-uikit-react';
import type { Participant } from '@voxeet/voxeet-web-sdk/types/models/Participant';
import cx from 'classnames';
import { memo } from 'react';

import { MediaDock } from '../MediaDock/MediaDock';

import styles from './PresenterGridItem.module.scss';

type PresenterGridItemProps = {
  participant: Participant;
  localText: string;
  forceShowAvatar?: boolean;
};

const PresenterGridItem = memo(({ participant, localText, forceShowAvatar }: PresenterGridItemProps) => {
  const { isMobileSmall, isMobile } = useTheme();
  const { participantsStatus } = useParticipants();

  const { isLocal } = participantsStatus[participant.id] || {};

  const isSmartphone = isMobileSmall || isMobile;

  return (
    <Space testID="PresenterGridItem" className={cx(styles.item, { [styles.mobile]: isSmartphone })}>
      <Space className={styles.row}>
        <Space className={styles.column}>
          {isLocal ? (
            <Text testID="LocalName" type="captionDemiBold" color="white">
              {`${participant.info.name} (${localText})`}
            </Text>
          ) : (
            <Text testID="DrawerParticipantName" type="captionDemiBold" color="white">
              {participant.info.name}
            </Text>
          )}
        </Space>
      </Space>
      <ParticipantsGridItem
        participant={participant}
        localText={localText}
        showParticipantNamePill={false}
        forceShowAvatar={forceShowAvatar}
      />
      {isLocal ? (
        <Space className={styles.dock}>
          <MediaDock />
        </Space>
      ) : (
        <Space className={styles.video} />
      )}
    </Space>
  );
});

export default PresenterGridItem;
