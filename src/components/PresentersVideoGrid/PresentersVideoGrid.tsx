/* eslint-disable no-nested-ternary */
import { Space } from '@dolbyio/comms-uikit-react';
import type { Participant } from '@voxeet/voxeet-web-sdk/types/models/Participant';
import { ReactNode, HTMLAttributes } from 'react';

import styles from './PresentersVideoGrid.module.scss';

type PresentersVideoGridProps = HTMLAttributes<HTMLDivElement> & {
  testID?: string;
  participants: Participant[];
  renderItem: (participant: Participant) => ReactNode;
  lastItem: () => ReactNode;
};

const PresentersVideoGrid = ({ testID, participants, renderItem, lastItem }: PresentersVideoGridProps) => {
  return (
    <Space className={styles.container} fh data-testid={testID}>
      {participants.map((p) => renderItem(p))}
      {lastItem()}
    </Space>
  );
};

export default PresentersVideoGrid;
