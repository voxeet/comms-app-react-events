import { Button, Input, Layout, Space, useCamera } from '@dolbyio/comms-uikit-react';
import ConferenceCreateFooter from '@src/components/ConferenceCreateFooter';
import ConferenceCreateHeader from '@src/components/ConferenceCreateHeader';
import Text from '@src/components/Text';
import useConferenceCleanup from '@src/hooks/useConferenceCleanup';
import useConferenceCreate from '@src/hooks/useConferenceCreate';
import useSDKErrorHandler from '@src/hooks/useSDKErrorsHandler';
import { CreateStep } from '@src/types/routes';
import cx from 'classnames';
import { useState } from 'react';
import { useIntl } from 'react-intl';

import styles from './ConferenceCreate/ConferenceCreate.module.scss';
import {
  translationKeys,
  useCreateConferenceValidation,
} from './ConferenceCreate/ConferenceCreateInput/ConferenceCreateInput';
import DeviceSetup from './ConferenceCreate/DeviceSetup';

const isIPhone = navigator.userAgent.match(/iPhone/i);

const StartStreamForm = ({
  name,
  setName,
  conferenceName,
  setConferenceName,
}: {
  name: string;
  setName: (value: string) => void;
  conferenceName: string;
  setConferenceName: (value: string) => void;
}) => {
  const { validation: userValidation, validateInput: validateUserInput } = useCreateConferenceValidation('user');
  const { validation: meetingValidation, validateInput: validateMeetingInput } =
    useCreateConferenceValidation('meeting');
  const { setStep } = useConferenceCreate();

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
          const { valid: conferenceValid } = validateMeetingInput(conferenceName);

          if (name.length && conferenceName.length && userValid && conferenceValid) {
            setStep(CreateStep.deviceSetup);
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
          value={conferenceName}
          placeholder={intl.formatMessage({ id: 'enterEventTitle' })}
          onChange={({ target: { value } }) => {
            if (value.length > 3) {
              validateMeetingInput(value);
            }
            setConferenceName(value);
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

const CreateEvent = () => {
  const [name, setName] = useState('');
  const [conferenceName, setConferenceName] = useState('');
  const { step } = useConferenceCreate();

  const { stopLocalVideo } = useCamera();
  useConferenceCleanup();
  useSDKErrorHandler(
    () => undefined,
    async () => {
      await stopLocalVideo();
    },
  );

  return (
    <Layout
      testID="ConferenceCreateRoute"
      backgroundColor="grey.900"
      className={cx(styles.layout, { [styles.layoutSafari]: isIPhone })}
    >
      <ConferenceCreateHeader event />
      {step === CreateStep.deviceSetup ? (
        <DeviceSetup username={name} meetingName={conferenceName} />
      ) : (
        <StartStreamForm
          name={name}
          setName={setName}
          conferenceName={conferenceName}
          setConferenceName={setConferenceName}
        />
      )}
      <ConferenceCreateFooter />
    </Layout>
  );
};

export default CreateEvent;
