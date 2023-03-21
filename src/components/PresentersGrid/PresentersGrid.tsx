import { IconButton, Space, Tooltip, useParticipants } from '@dolbyio/comms-uikit-react';
import type { Participant } from '@voxeet/voxeet-web-sdk/types/models/Participant';
import { useIntl } from 'react-intl';

import PresenterGridItem from '../PresenterGridItem/PresenterGridItem';
import PresentersVideoGrid from '../PresentersVideoGrid/PresentersVideoGrid';

import styles from './PresentersGrid.module.scss';

type PresentersGridProps = {
  localText: string;
  onInviteCoHostClick: () => void;
  forceShowAvatar?: boolean;
  testID?: string;
};

const PresentersGrid = ({ localText, onInviteCoHostClick, forceShowAvatar, testID }: PresentersGridProps) => {
  const { participant, participants } = useParticipants();
  const intl = useIntl();

  let meFirst;
  if (participant) {
    const localFirstParticipants = participants.filter((p) => p.id !== participant.id);
    localFirstParticipants.unshift(participant);
    meFirst = localFirstParticipants;
  } else {
    meFirst = participants;
  }

  const renderParticipant = (p: Participant) => {
    return <PresenterGridItem key={p.id} participant={p} localText={localText} forceShowAvatar={forceShowAvatar} />;
  };

  const lastItem = () => (
    <Tooltip text={intl.formatMessage({ id: 'inviteCoHosts' })}>
      <IconButton
        icon="add"
        size="l"
        variant="circle"
        backgroundColor="transparent"
        strokeColor="grey.200"
        onClick={onInviteCoHostClick}
      />
    </Tooltip>
  );

  return (
    <Space testID={testID} className={styles.gridWrapper}>
      <PresentersVideoGrid participants={meFirst} renderItem={renderParticipant} lastItem={lastItem} />
    </Space>
  );
};

export default PresentersGrid;
