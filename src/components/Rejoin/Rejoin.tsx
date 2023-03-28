import {
  RejoinConferenceButton,
  Space,
  Overlay,
  Spinner,
  useCamera,
  useVideo,
  useMicrophone,
  useAudio,
} from '@dolbyio/comms-uikit-react';
import { getHostPath } from '@src/utils/route';
import { useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate, useParams } from 'react-router-dom';

import setJoinOptions, { JoinParams } from '../../utils/setJoinOptions';

import styles from './Rejoin.module.scss';

export const Rejoin = () => {
  const params = useParams();
  const navigate = useNavigate();
  const intl = useIntl();
  const [isLoading, setIsLoading] = useState(false);
  const [isMicrophonePermission, setIsMicrophonePermission] = useState<boolean>(false);
  const [isCameraPermission, setIsCameraPermission] = useState<boolean>(false);

  const { getCameraPermission } = useCamera();
  const { isVideo } = useVideo();
  const { getMicrophonePermission } = useMicrophone();
  const { isAudio } = useAudio();

  const checkPermissions = async () => {
    const microphonePermission = await getMicrophonePermission();
    const cameraPermission = await getCameraPermission();

    setIsMicrophonePermission(microphonePermission);
    setIsCameraPermission(cameraPermission);
  };

  useEffect(() => {
    checkPermissions();
  }, []);

  const joinParams: JoinParams = {
    isMicrophonePermission,
    isCameraPermission,
    isAudio,
    isVideo,
  };

  const joinOptions = useMemo(() => {
    return setJoinOptions(joinParams);
  }, [isMicrophonePermission, isCameraPermission, isAudio, isVideo]);

  const onSuccess = () => {
    navigate(getHostPath(params.id || ''), { replace: true });
  };

  return (
    <Space mt="m">
      <Overlay visible={isLoading} opacity={1} color="black">
        <Spinner textContent={intl.formatMessage({ id: 'joiningEvent' })} />
      </Overlay>
      <RejoinConferenceButton
        className={styles.button}
        onStart={setIsLoading}
        onSuccess={onSuccess}
        text={intl.formatMessage({ id: 'rejoin' })}
        joinOptions={joinOptions}
        testID="RejoinButton"
      />
    </Space>
  );
};
