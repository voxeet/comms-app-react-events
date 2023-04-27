import { DemoEndedScreen } from '@components/DemoEndedScreen/DemoEndedScreen';
import { DeviceSetup } from '@components/DeviceSetup/DeviceSetup';
import { Onboarding } from '@components/Onboarding/Onboarding';
import { SideDrawerContentTypes } from '@context/SideDrawerContext';
import { Space, useConference } from '@dolbyio/comms-uikit-react';
import useDrawer from '@hooks/useDrawer';
import { JoinScreen } from '@src/components/JoinScreen/JoinScreen';
import { UsernameSetup } from '@src/components/UsernameSetup/UsernameSetup';
import { hostJoinSteps } from '@src/onboarding/host_join';
import { ungatedFeaturesEnabled } from '@src/utils/env';
import { useCallback, useState } from 'react';
import { useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';

import { Rejoin } from './Rejoin/Rejoin';
import { View } from './View/View';

export const Host = () => {
  const { conference } = useConference();
  const { openDrawer } = useDrawer();
  const params = useParams();
  const intl = useIntl();
  const [username, setUsername] = useState('');
  const [screen, setScreen] = useState<'join' | 'setup' | 'view' | 'exit'>(conference ? 'view' : 'join');
  const [showOnboarding, setShowOnboarding] = useState(true);

  const eventName = params.id || '';

  const showDeviceSetup = useCallback(async (name: string) => {
    setScreen('setup');
    setUsername(name);
  }, []);

  const showHostView = () => {
    setScreen('view');
  };

  const showExitScreen = async () => {
    setScreen('exit');
  };

  return (
    <Space fh>
      {screen === 'join' && (
        <JoinScreen heading={intl.formatMessage({ id: 'joinEvent' })}>
          <UsernameSetup eventName={eventName} onSubmit={showDeviceSetup} />
        </JoinScreen>
      )}
      {screen === 'setup' && (
        <JoinScreen
          heading={intl.formatMessage({ id: 'joinEvent' })}
          onBackClick={screen === 'setup' ? () => setScreen('join') : undefined}
          onSettingsClick={screen === 'setup' ? () => openDrawer(SideDrawerContentTypes.DEVICE_SETUP) : undefined}
        >
          <DeviceSetup eventName={eventName} username={username} onJoinSuccess={showHostView} />
        </JoinScreen>
      )}
      {screen === 'view' && <View onExit={showExitScreen} />}
      {screen === 'exit' && (ungatedFeaturesEnabled() ? <DemoEndedScreen /> : <Rejoin onJoinSuccess={showHostView} />)}
      {showOnboarding && (
        <Onboarding name="hostJoin" steps={hostJoinSteps} onComplete={() => setShowOnboarding(false)} />
      )}
    </Space>
  );
};
