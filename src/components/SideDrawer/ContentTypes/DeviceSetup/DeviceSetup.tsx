import {
  VideoLocalView,
  Space,
  SpeakersSelect,
  MicrophoneSelect,
  CameraSelect,
  useTheme,
  useCamera,
  useMicrophone,
} from '@dolbyio/comms-uikit-react';
import useConferenceCreate from '@hooks/useConferenceCreate';
import useDrawer from '@hooks/useDrawer';
import { DrawerMainContent, DrawerHeader } from '@src/components/SideDrawer';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import styles from './DeviceSetup.module.scss';

const DeviceSetup = () => {
  const [isCameraPermission, setIsCameraPermission] = useState<boolean>(false);
  const [isMicrophonePermission, setIsMicrophonePermission] = useState<boolean>(false);

  const { getCameraPermission } = useCamera();
  const { getMicrophonePermission } = useMicrophone();
  const intl = useIntl();
  const { username } = useConferenceCreate();
  const { isDesktop } = useTheme();
  const { isDrawerOpen } = useDrawer();

  const checkCameraPermission = async () => {
    try {
      const hasCameraAccess = await getCameraPermission();
      setIsCameraPermission(hasCameraAccess);
    } catch {
      setIsCameraPermission(false);
    }
  };

  const checkMicrophonePermission = async () => {
    try {
      const hasMicrophoneAccess = await getMicrophonePermission();
      setIsMicrophonePermission(hasMicrophoneAccess);
    } catch {
      setIsMicrophonePermission(false);
    }
  };

  useEffect(() => {
    checkCameraPermission();
    checkMicrophonePermission();
    // This is an on component mount hook
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Space fw fh testID="DeviceSetup" className={styles.contentContainer}>
      <DrawerHeader
        labelKey="settings"
        color="grey.100"
        closeButtonBackgroundColor="grey.500"
        closeButtonIconColor="white"
        closeButtonStrokeColor="transparent"
      />
      <DrawerMainContent scrollbarColor="grey.100">
        <Space mb="m" className={styles.videoContainer}>
          <VideoLocalView
            cameraReverseButton={!isDesktop}
            testID="DeviceSetupDrawerLocalView"
            username={username}
            disabled={!isDrawerOpen}
            isMicrophonePermission={isMicrophonePermission}
            className={styles.videoRwd}
            indicator={false}
            audio={false}
          />
        </Space>
        <Space mb="s" className={styles.divider} />
        {isDesktop && isCameraPermission && (
          <Space mb="s" ph="m">
            <CameraSelect
              testID="CameraSelect"
              label={intl.formatMessage({ id: 'camera' })}
              placeholder={intl.formatMessage({ id: 'camera' })}
              labelColor="grey.100"
              textColor="grey.100"
              iconColor="grey.100"
              backgroundColor="grey.800"
              primaryBorderColor="grey.500"
              hoverColor="grey.700"
            />
          </Space>
        )}
        <Space mb="s" className={styles.divider} />
        {isMicrophonePermission && (
          <Space mb="s" ph="m">
            <MicrophoneSelect
              testID="MicrophoneSelect"
              label={intl.formatMessage({ id: 'microphone' })}
              placeholder={intl.formatMessage({ id: 'microphone' })}
              labelColor="grey.100"
              textColor="grey.100"
              iconColor="grey.100"
              backgroundColor="grey.800"
              primaryBorderColor="grey.500"
              hoverColor="grey.700"
            />
          </Space>
        )}
        <Space mb="s" className={styles.divider} />
        <Space mb="s" ph="m">
          <SpeakersSelect
            testID="SpeakersSelect"
            label={intl.formatMessage({ id: 'speakers' })}
            placeholder={intl.formatMessage({ id: 'speakers' })}
            defaultDeviceLabel={intl.formatMessage({ id: 'defaultSpeaker' })}
            labelColor="grey.100"
            textColor="grey.100"
            iconColor="grey.100"
            backgroundColor="grey.800"
            primaryBorderColor="grey.500"
            hoverColor="grey.700"
          />
        </Space>
      </DrawerMainContent>
    </Space>
  );
};

export default DeviceSetup;
