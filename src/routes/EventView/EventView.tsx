import { Overlay, Spinner, useConference, useSession } from '@dolbyio/comms-uikit-react';
import { Onboarding } from '@src/components/Onboarding/Onboarding';
import { viewerJoinSteps } from '@src/onboarding/viewer_join';
import { ungatedFeaturesEnabled } from '@src/utils/env';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';

import { DemoEnded } from '../Ungated/PostDemo/DemoEnded';

import styles from './EventView.module.scss';
import { Join } from './Join/Join';
import Rejoin from './Rejoin/Rejoin';
import { View } from './View/View';

export const EventView = () => {
  const { id } = useParams();
  const intl = useIntl();
  const { joinConference, createConference, leaveConference, conference } = useConference();
  const { openSession, isSessionOpened } = useSession();
  const [screen, setScreen] = useState<'join' | 'loading' | 'view' | 'exit'>('join');
  const [showOnboarding, setShowOnboarding] = useState(true);

  const join = async (name: string) => {
    setScreen('loading');
    if (!isSessionOpened()) {
      await openSession({ name });
    }
    const conf = await createConference({ alias: id });
    await joinConference(conf, {}, true);
    setScreen('view');
  };

  const exit = async () => {
    await leaveConference();
    setScreen('exit');
  };

  const rejoin = async () => {
    const conf = await createConference({ alias: id });
    await joinConference(conf, {}, true);
    setScreen('view');
  };

  return (
    <div className={styles.container}>
      {screen === 'join' && <Join eventName={id} onJoinStart={join} />}
      {screen === 'loading' && (
        <Overlay opacity={1} color="black">
          <Spinner textContent={intl.formatMessage({ id: conference ? 'joiningEvent' : 'fetchEventDetails' })} />
        </Overlay>
      )}
      {screen === 'view' && <View onExitConfirm={exit} />}
      {screen === 'exit' && ungatedFeaturesEnabled() ? <DemoEnded /> : <Rejoin onRejoin={rejoin} />}
      {showOnboarding && (
        <Onboarding name="viewerJoin" steps={viewerJoinSteps} onComplete={() => setShowOnboarding(false)} />
      )}
    </div>
  );
};
