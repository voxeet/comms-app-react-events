import Text from '@components/Text';
import { Button, Icon, Modal } from '@dolbyio/comms-uikit-react';
import { useIntl } from 'react-intl';

import styles from './PromoteToHostModal.module.scss';

type PromoteToHostModalProps = {
  viewerToPromote: string;
  onConfirmClick: () => void;
  onCancelClick: () => void;
};

export const PromoteToHostModal = ({ viewerToPromote, onConfirmClick, onCancelClick }: PromoteToHostModalProps) => {
  const intl = useIntl();
  return (
    <Modal testID="PromoteToHostModal" isVisible close={onCancelClick} modalWidth={375} closeButton overlayClickClose>
      <div className={styles.content}>
        <div className={styles.icon}>
          <Icon name="friends" fluid color="grey.200" />
        </div>
        <Text type="H2" align="center">
          {intl.formatMessage({ id: 'inviteToHost' })}
        </Text>
        <Text align="center">
          {intl.formatMessage({ id: 'promoteToHostDescription' }, { viewer: viewerToPromote })}
        </Text>
        <div className={styles.buttons}>
          <Button size="s" fw onClick={onConfirmClick}>
            <Text type="button">{intl.formatMessage({ id: 'promoteToHostConfirm' })}</Text>
          </Button>
          <Button size="s" fw onClick={onCancelClick} variant="tertiaryGrey">
            <Text type="button">{intl.formatMessage({ id: 'cancel' })}</Text>
          </Button>
        </div>
      </div>
    </Modal>
  );
};
