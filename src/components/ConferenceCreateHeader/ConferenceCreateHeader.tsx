import Text from '@components/Text';
import { SideDrawerContentTypes } from '@context/SideDrawerContext';
import { IconButton, Space } from '@dolbyio/comms-uikit-react';
import useConferenceCreate from '@hooks/useConferenceCreate';
import useDrawer from '@hooks/useDrawer';
import { CreateStep } from '@src/types/routes';

import styles from './ConferenceCreateHeader.module.scss';

export const headerSizes = {
  small: 48,
  medium: 64,
  large: 72,
};

export const ConferenceCreateHeader = ({ event }: { event?: boolean }) => {
  const { step, prevStep } = useConferenceCreate();
  const { openDrawer } = useDrawer();

  let labelKey;
  if (event) {
    if (step === CreateStep.deviceSetup) {
      labelKey = 'setupInvite';
    } else {
      labelKey = 'createEvent';
    }
  } else {
    labelKey = 'joinEvent';
  }

  return (
    <Space fw id="ConferenceCreateHeader" testID="ConferenceCreateHeader" className={styles.container}>
      <Space style={{ width: 48 }}>
        {step > CreateStep.userSetup && (
          <IconButton
            testID="StepBackButton"
            backgroundColor="transparent"
            icon="arrowLeft"
            iconColor="grey.100"
            onClick={prevStep}
          />
        )}
      </Space>
      <Text testID="ConferenceCreateHeaderTitle" color="grey.25" type="H4" labelKey={labelKey} />
      <Space style={{ width: 48 }}>
        {step === CreateStep.deviceSetup && (
          <IconButton
            testID="SettingsButton"
            backgroundColor="transparent"
            icon="settings"
            onClick={() => openDrawer(SideDrawerContentTypes.DEVICE_SETUP)}
            iconColor="grey.300"
          />
        )}
      </Space>
    </Space>
  );
};
