import { DemoEndedScreen } from '@components/DemoEndedScreen/DemoEndedScreen';
import { JoinScreen } from '@components/JoinScreen/JoinScreen';
import { Onboarding } from '@components/Onboarding/Onboarding';
import { UsernameSetup } from '@components/UsernameSetup/UsernameSetup';
import { PubNubProvider } from '@context/PubNubContext';
import { Overlay, Space, Spinner, useConference, useSession } from '@dolbyio/comms-uikit-react';
import { viewerJoinSteps } from '@src/onboarding/viewer_join';
import { ungatedFeaturesEnabled } from '@src/utils/env';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';

import Rejoin from './Rejoin/Rejoin';
import { View } from './View/View';

export const Viewer = () => {
  const { id } = useParams();
  const intl = useIntl();
  const { joinConference, createConference, leaveConference } = useConference();
  const { openSession, isSessionOpened } = useSession();
  const [screen, setScreen] = useState<'join' | 'joining' | 'view' | 'exit'>('join');
  const [showOnboarding, setShowOnboarding] = useState(true);

  const join = async (username?: string) => {
    setScreen('joining');
    if (!isSessionOpened() && username) {
      await openSession({ name: username });
    }
    const conf = await createConference({ alias: id });
    await joinConference(conf, {}, true);
    setScreen('view');
  };

  const exit = async () => {
    await leaveConference();
    setScreen('exit');
  };

  return (
    <Space fh>
      {screen === 'join' && id && (
        <JoinScreen heading={intl.formatMessage({ id: 'joinEvent' })}>
          <UsernameSetup eventName={id} onSubmit={join} />
        </JoinScreen>
      )}
      {screen === 'joining' && (
        <Overlay opacity={1} color="black">
          <Spinner textContent={intl.formatMessage({ id: 'joiningEvent' })} />
        </Overlay>
      )}
      {screen === 'view' && (
        <PubNubProvider>
          <View onExitConfirm={exit} />
        </PubNubProvider>
      )}
      {screen === 'exit' && ungatedFeaturesEnabled() ? <DemoEndedScreen /> : <Rejoin onRejoin={join} />}
      {showOnboarding && (
        <Onboarding name="viewerJoin" steps={viewerJoinSteps} onComplete={() => setShowOnboarding(false)} />
      )}
    </Space>
  );
};
