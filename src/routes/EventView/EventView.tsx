import { Overlay, Spinner, useConference, useSession } from '@dolbyio/comms-uikit-react';
import { useCallback, useState } from 'react';
import { useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';

import styles from './EventView.module.scss';
import { Join } from './Join/Join';
import Rejoin from './Rejoin/Rejoin';
import { View } from './View/View';

export const EventView = () => {
  const { id } = useParams();
  const intl = useIntl();
  const { joinConference, createConference, conference } = useConference();
  const { openSession } = useSession();
  const [screen, setScreen] = useState<'join' | 'loading' | 'view' | 'rejoin'>('join');

  const join = useCallback(
    async (name: string) => {
      setScreen('loading');
      await openSession({ name });
      const conf = await createConference({ alias: id });
      await joinConference(conf, {}, true);

      setScreen('view');
    },
    [createConference, id, joinConference, openSession],
  );

  return (
    <div className={styles.container}>
      {screen === 'join' && <Join eventName={id} onJoinStart={join} />}
      {screen === 'loading' && (
        <Overlay opacity={1} color="black">
          <Spinner textContent={intl.formatMessage({ id: conference ? 'joiningEvent' : 'fetchEventDetails' })} />
        </Overlay>
      )}
      {screen === 'view' && (
        <View
          onExitConfirm={() => {
            setScreen('rejoin');
          }}
        />
      )}
      {screen === 'rejoin' && (
        <Rejoin
          onRejoin={() => {
            setScreen('view');
          }}
        />
      )}
    </div>
  );
};
