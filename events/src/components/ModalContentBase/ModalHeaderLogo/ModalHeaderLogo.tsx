import { Space, Icon, useTheme, ColorKey, IconComponentName } from '@dolbyio/comms-uikit-react';
import { useCallback } from 'react';

import styles from './ModalHeaderLogo.module.scss';

type ModalHeaderLogoProps = {
  primaryBackgroundColor?: ColorKey | [ColorKey, ColorKey];
  secondaryBackgroundColor?: ColorKey | [ColorKey, ColorKey];
  borderColor?: ColorKey;
  iconColor?: ColorKey;
  icon?: IconComponentName;
};

const ModalHeaderLogo = ({
  primaryBackgroundColor = ['rgba(255, 255, 255, 0.16)', 'rgba(255, 255, 255, 0.48)'],
  secondaryBackgroundColor = ['secondary.600', 'primary.500'],
  borderColor = 'rgba(255, 255, 255, 0.64)',
  iconColor = 'white',
  icon,
}: ModalHeaderLogoProps) => {
  const { getColorOrGradient, getColor } = useTheme();

  const isGradient = useCallback((color: ColorKey | [ColorKey, ColorKey]) => {
    return Array.isArray(color);
  }, []);

  const baseColor = getColorOrGradient(primaryBackgroundColor);

  const handlePrimaryBackgroundColor = !isGradient(primaryBackgroundColor)
    ? getColor(primaryBackgroundColor as string)
    : `linear-gradient(315deg, ${baseColor[0]} 0%, ${baseColor[1]} 100%)`;

  const baseBackgroundColor = getColorOrGradient(secondaryBackgroundColor);

  const handleSecondaryBackgroundColor = !isGradient(secondaryBackgroundColor)
    ? getColor(secondaryBackgroundColor as string)
    : `linear-gradient(99.69deg, ${baseBackgroundColor[0]} -10.66%, ${baseBackgroundColor[1]} 114.64%)`;

  return (
    <Space testID="ModalHeaderLogo" className={styles.wrapper}>
      <Space className={styles.bigCircle} style={{ background: handleSecondaryBackgroundColor }} />
      <Space
        className={styles.iconWrapper}
        style={{ background: handlePrimaryBackgroundColor, borderColor: getColor(borderColor) }}
      >
        {icon ? <Icon name={icon} color={getColor(iconColor)} /> : null}
      </Space>
      <Space className={styles.smallCircle} style={{ background: handleSecondaryBackgroundColor }} />
    </Space>
  );
};

export default ModalHeaderLogo;
