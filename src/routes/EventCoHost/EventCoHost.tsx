import { Space } from '@dolbyio/comms-uikit-react';
import ConferenceCreateFooter from '@src/components/ConferenceCreateFooter';
import ConferenceCreateHeader from '@src/components/ConferenceCreateHeader';
import useConferenceCreate from '@src/hooks/useConferenceCreate';
import { CreateStep } from '@src/types/routes';
import { useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';

import DeviceSetup from '../ConferenceCreate/DeviceSetup';
import { Join } from '../EventView/Join/Join';

import styles from './EventCoHost.module.scss';

export const EventCoHost = () => {
  const params = useParams();
  const { step, setStep } = useConferenceCreate();
  const [name, setName] = useState('');

  const conferenceName = params.id || '';

  const join = useCallback(
    async (name: string) => {
      setName(name);
      setStep(CreateStep.deviceSetup);
    },
    [setStep],
  );

  return (
    <div className={styles.container}>
      {step === CreateStep.deviceSetup ? (
        <Space fh className={styles.setup}>
          <ConferenceCreateHeader event />
          <DeviceSetup meetingName={conferenceName} username={name} />
          <ConferenceCreateFooter />
        </Space>
      ) : (
        <Join eventName={conferenceName} onJoinStart={join} />
      )}
    </div>
  );
};
