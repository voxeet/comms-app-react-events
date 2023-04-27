import { DeviceSetup } from '@components/DeviceSetup/DeviceSetup';
import { JoinScreen } from '@components/JoinScreen/JoinScreen';
import { SideDrawerContentTypes } from '@context/SideDrawerContext';
import { Button, Input, Space, useCamera } from '@dolbyio/comms-uikit-react';
import { translationKeys, useCreateEventValidation } from '@hooks/useCreateEventValidation';
import useDrawer from '@hooks/useDrawer';
import { Onboarding } from '@src/components/Onboarding/Onboarding';
import Text from '@src/components/Text';
import useSDKErrorHandler from '@src/hooks/useSDKErrorsHandler';
import { hostJoinSteps } from '@src/onboarding/host_join';
import { makeUnique } from '@src/utils/misc';
import { getHostPath } from '@src/utils/route';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

const CreateEventForm = ({
  name,
  setName,
  eventName,
  setEventName,
  onSubmit,
}: {
  name: string;
  setName: (value: string) => void;
  eventName: string;
  setEventName: (value: string) => void;
  onSubmit: () => void;
}) => {
  const { validation: userValidation, validateInput: validateUserInput } = useCreateEventValidation('user');
  const { validation: meetingValidation, validateInput: validateMeetingInput } = useCreateEventValidation('meeting');

  const intl = useIntl();

  return (
    <>
      <Space p="l" />
      <Text labelKey="createYourEvent" testID="ConferenceCreatePageHeading" color="white" type="H2" />
      <Space p="xs" />
      <Text
        labelKey="createEventSubtext"
        testID="ConferenceCreatePageDescription"
        color="grey.200"
        type="paragraphSmall"
      />
      <Space p="s" />
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const { valid: userValid } = validateUserInput(name);
          const { valid: eventValid } = validateMeetingInput(eventName);

          if (name.length && eventName.length && userValid && eventValid) {
            onSubmit();
          }
        }}
        css={{
          width: 400,
        }}
      >
        <Input
          labelBackground="grey.900"
          labelColor="white"
          textColor="white"
          testID={translationKeys.user.inputTestId}
          label={intl.formatMessage({ id: 'yourName' })}
          value={name}
          placeholder={intl.formatMessage({ id: 'enterName' })}
          onChange={({ target: { value } }) => {
            if (value.length > 3) {
              validateUserInput(value);
            }
            setName(value);
          }}
          validation={userValidation}
          autoFocus
        />
        <Space p="s" />
        <Input
          labelBackground="grey.900"
          labelColor="white"
          textColor="white"
          testID={translationKeys.meeting.inputTestId}
          label={intl.formatMessage({ id: 'eventTitle' })}
          value={eventName}
          placeholder={intl.formatMessage({ id: 'enterEventTitle' })}
          onChange={({ target: { value } }) => {
            if (value.length > 3) {
              validateMeetingInput(value);
            }
            setEventName(value);
          }}
          validation={meetingValidation}
        />
        <Space p="s" />
        <Button testID="Next" css={{ width: '100%' }} type="submit">
          Next
        </Button>
      </form>
    </>
  );
};

export const CreateEvent = () => {
  const { openDrawer } = useDrawer();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [eventName, setEventName] = useState('');
  const [uniqueEventName, setUniqueEventName] = useState('');
  const [screen, setScreen] = useState<'create' | 'setup'>('create');
  const [showOnboarding, setShowOnboarding] = useState(true);
  const intl = useIntl();

  const { stopLocalVideo } = useCamera();
  useSDKErrorHandler(
    () => undefined,
    async () => {
      await stopLocalVideo();
    },
  );

  const showDeviceSetup = () => {
    setUniqueEventName(makeUnique(eventName));
    setScreen('setup');
  };

  const navigateToHostView = () => {
    navigate(getHostPath(uniqueEventName));
  };

  return (
    <>
      <JoinScreen
        heading={intl.formatMessage({ id: screen === 'create' ? 'createEvent' : 'setupInvite' })}
        onBackClick={screen === 'setup' ? () => setScreen('create') : undefined}
        onSettingsClick={screen === 'setup' ? () => openDrawer(SideDrawerContentTypes.DEVICE_SETUP) : undefined}
      >
        {screen === 'create' && (
          <CreateEventForm
            name={name}
            setName={setName}
            eventName={eventName}
            setEventName={setEventName}
            onSubmit={showDeviceSetup}
          />
        )}
        {screen === 'setup' && (
          <DeviceSetup username={name} eventName={uniqueEventName} onJoinSuccess={navigateToHostView} />
        )}
      </JoinScreen>
      {showOnboarding && (
        <Onboarding name="hostJoin" steps={hostJoinSteps} onComplete={() => setShowOnboarding(false)} />
      )}
    </>
  );
};
