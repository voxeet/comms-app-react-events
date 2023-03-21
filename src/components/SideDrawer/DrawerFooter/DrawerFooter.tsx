import { Space } from '@dolbyio/comms-uikit-react';
import { ReactNode } from 'react';

import styles from './DrawerFooter.module.scss';

type DrawerFooterProps = {
  children: ReactNode;
};

export const DrawerFooter = ({ children }: DrawerFooterProps) => {
  return (
    <Space testID="DrawerFooter" className={styles.footer}>
      {children}
    </Space>
  );
};
