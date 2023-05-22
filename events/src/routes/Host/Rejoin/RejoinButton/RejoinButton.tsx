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
import setJoinOptions, { JoinParams } from '@src/utils/setJoinOptions';
import { useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';

import styles from './RejoinButton.module.scss';

type RejoinButtonProps = {
  onJoinSuccess: () => void;
};

export const RejoinButton = ({ onJoinSuccess }: RejoinButtonProps) => {
  const intl = useIntl();
  const [isLoading, setIsLoading] = useState(false);
  const [isMicrophonePermission, setIsMicrophonePermission] = useState<boolean>(false);
  const [isCameraPermission, setIsCameraPermission] = useState<boolean>(false);

  const { getCameraPermission } = useCamera();
  const { isVideo } = useVideo();
  const { getMicrophonePermission } = useMicrophone();
  const { isAudio } = useAudio();

  useEffect(() => {
    const checkPermissions = async () => {
      const microphonePermission = await getMicrophonePermission();
      const cameraPermission = await getCameraPermission();

      setIsMicrophonePermission(microphonePermission);
      setIsCameraPermission(cameraPermission);
    };
    checkPermissions();
    // This is a component mount check
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const joinOptions = useMemo(() => {
    const joinParams: JoinParams = {
      isMicrophonePermission,
      isCameraPermission,
      isAudio,
      isVideo,
    };

    return setJoinOptions(joinParams);
  }, [isMicrophonePermission, isCameraPermission, isAudio, isVideo]);

  return (
    <Space mt="m">
      <Overlay visible={isLoading} opacity={1} color="black">
        <Spinner textContent={intl.formatMessage({ id: 'joiningEvent' })} />
      </Overlay>
      <RejoinConferenceButton
        className={styles.button}
        onStart={setIsLoading}
        onSuccess={onJoinSuccess}
        text={intl.formatMessage({ id: 'rejoin' })}
        joinOptions={joinOptions}
        testID="RejoinButton"
      />
    </Space>
  );
};
