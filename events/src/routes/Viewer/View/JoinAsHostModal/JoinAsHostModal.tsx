import Text from '@components/Text';
import { Button, Icon, Modal } from '@dolbyio/comms-uikit-react';
import { useIntl } from 'react-intl';

import styles from './JoinAsHostModal.module.scss';

type JoinAsHostModalProps = {
  inviter: string;
  onAcceptClick: () => void;
  onDeclineClick: () => void;
};

export const JoinAsHostModal = ({ inviter, onAcceptClick, onDeclineClick }: JoinAsHostModalProps) => {
  const intl = useIntl();
  return (
    <Modal testID="JoinAsHostModal" isVisible close={onDeclineClick} modalWidth={375} closeButton>
      <div className={styles.content}>
        <div className={styles.icon}>
          <Icon name="friends" fluid color="grey.200" />
        </div>
        <Text type="H2" align="center">
          {intl.formatMessage({ id: 'joinAsHostHeading' })}
        </Text>
        <Text align="center">{intl.formatMessage({ id: 'joinAsHostDescription' }, { hostName: inviter })}</Text>
        <div className={styles.buttons}>
          <Button size="s" fw onClick={onAcceptClick}>
            <Text type="button">{intl.formatMessage({ id: 'joinAsHost' })}</Text>
          </Button>
          <Button size="s" fw onClick={onDeclineClick} variant="tertiaryGrey">
            <Text type="button">{intl.formatMessage({ id: 'stayAsViewer' })}</Text>
          </Button>
        </div>
      </div>
    </Modal>
  );
};
