import { Space, ColorKey } from '@dolbyio/comms-uikit-react';
import { DrawerCloseButton } from '@src/components/SideDrawer/DrawerCloseButton/DrawerCloseButton';
import Text from '@src/components/Text';
import { TextValues, TranslationKeys } from '@src/types/translations';

import styles from './DrawerHeader.module.scss';

export type DrawerHeaderProps = {
  labelKey: TranslationKeys;
  labelValues?: TextValues;
  color?: ColorKey;
  closeButtonBackgroundColor?: ColorKey;
  closeButtonIconColor?: ColorKey;
  closeButtonStrokeColor?: ColorKey;
};

export const DrawerHeader = ({
  labelKey,
  labelValues,
  color,
  closeButtonBackgroundColor = 'white',
  closeButtonIconColor = 'purple',
  closeButtonStrokeColor = 'purple',
}: DrawerHeaderProps) => {
  return (
    <Space testID="DrawerHeader" className={styles.container}>
      <Text type="H3" color={color} labelKey={labelKey} values={labelValues} />
      <Space className={styles.buttonWrapper}>
        <DrawerCloseButton
          iconColor={closeButtonIconColor}
          backgroundColor={closeButtonBackgroundColor}
          strokeColor={closeButtonStrokeColor}
        />
      </Space>
    </Space>
  );
};
