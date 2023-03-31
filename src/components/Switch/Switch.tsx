/* eslint-disable import/no-extraneous-dependencies */
import { Space, useTheme, ColorKey } from '@dolbyio/comms-uikit-react';
import cx from 'classnames';

import styles from './Switch.module.scss';

type SwitchProps = {
  isActive: boolean;
  onClick?: () => void;
  testID?: string;
  defaultSwitchColor?: ColorKey;
  activeSwitchColor?: ColorKey;
  defaultSwitchHandlerColor?: ColorKey;
  activeSwitchHandlerColor?: ColorKey;
};

const Switch = ({
  isActive = false,
  onClick,
  testID,
  defaultSwitchColor = 'grey.300',
  activeSwitchColor = 'infoSuccess',
  defaultSwitchHandlerColor = 'white',
  activeSwitchHandlerColor = 'white',
}: SwitchProps) => {
  const { getColor } = useTheme();

  const backgroundColor = isActive ? getColor(activeSwitchColor) : getColor(defaultSwitchColor);
  const handlerBackgroundColor = isActive ? getColor(activeSwitchHandlerColor) : getColor(defaultSwitchHandlerColor);

  return (
    <Space testID={testID} className={styles.switch} style={{ backgroundColor }} onClick={onClick}>
      <Space
        className={cx(styles.switchHandler, isActive && styles.active)}
        style={{ backgroundColor: handlerBackgroundColor, borderColor: backgroundColor }}
      />
    </Space>
  );
};

export default Switch;
