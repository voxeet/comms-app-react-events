import Text from '@components/Text';
import { Button, useAudio, useVideo, Space } from '@dolbyio/comms-uikit-react';
import useConferenceCreate from '@hooks/useConferenceCreate';
import { CreateStep } from '@src/types/routes';
import { getEventCreatePath } from '@src/utils/route';
import { useNavigate } from 'react-router-dom';

import styles from './ReturnToHome.module.scss';

export const ReturnToHome = () => {
  const { setStep } = useConferenceCreate();
  const navigate = useNavigate();
  const { resetVideo } = useVideo();
  const { resetAudio } = useAudio();

  const homeScreen = () => {
    resetVideo();
    resetAudio();
    setStep(CreateStep.userSetup);
    navigate(getEventCreatePath());
  };

  return (
    <Space mt="l">
      <Button onClick={homeScreen} testID="ReturnToHomeButton" variant="primary" className={styles.button}>
        <Text type="button" labelKey="returnToHome" />
      </Button>
    </Space>
  );
};
