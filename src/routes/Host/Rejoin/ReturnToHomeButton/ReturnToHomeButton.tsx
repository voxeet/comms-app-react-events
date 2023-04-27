import Text from '@components/Text';
import { Button, useAudio, useVideo, Space } from '@dolbyio/comms-uikit-react';
import { getEventCreatePath } from '@src/utils/route';
import { useNavigate } from 'react-router-dom';

import styles from './ReturnToHomeButton.module.scss';

export const ReturnToHomeButton = () => {
  const navigate = useNavigate();
  const { resetVideo } = useVideo();
  const { resetAudio } = useAudio();

  const homeScreen = () => {
    resetVideo();
    resetAudio();
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
