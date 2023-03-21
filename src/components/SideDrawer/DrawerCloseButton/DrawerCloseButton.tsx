import { IconButton, IconButtonProps } from '@dolbyio/comms-uikit-react';
import useDrawer from '@hooks/useDrawer';

type DrawerCloseButtonProps = Omit<IconButtonProps, 'onClick' | 'icon' | 'size' | 'variant'>;

export const DrawerCloseButton = ({ ...rest }: DrawerCloseButtonProps) => {
  const { closeDrawer } = useDrawer();

  return (
    <IconButton variant="circle" icon="close" size="s" onClick={closeDrawer} testID="DrawerCloseButton" {...rest} />
  );
};
