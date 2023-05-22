import Text from '@components/Text';
import { Space, useSession } from '@dolbyio/comms-uikit-react';

import packageJson from '../../../package.json';

import styles from './Version.module.scss';

export const Version = () => {
  const { getSDKVersion } = useSession();
  return (
    <Space testID="AppVersion" className={styles.version}>
      <Text
        testID="Version"
        type="captionSmallRegular"
        color="grey.300"
        labelKey="version"
        values={{ v: packageJson.version }}
      />
      <Space className={styles.spacer} />
      <Text testID="SDK" type="captionSmallRegular" color="grey.300" labelKey="sdk" values={{ v: getSDKVersion() }} />
    </Space>
  );
};
