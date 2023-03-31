import ModalContentBase from '@components/ModalContentBase';
import Switch from '@components/Switch';
import { Space, Text, useTheme, useAudio, BlockedAudioStateType, Modal } from '@dolbyio/comms-uikit-react';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import styles from './AllowAudioModal.module.scss';

type AllowAudioModalProps = {
  testID?: string;
};

const AllowAudioModal = ({ testID = 'AllowAudioModal' }: AllowAudioModalProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAllowAudioChecked, setIsAllowAudioChecked] = useState(false);
  const intl = useIntl();
  const { getColor } = useTheme();
  const { playBlockedAudio, blockedAudioState, markBlockedAudioEnabled } = useAudio();

  useEffect(() => {
    (() => {
      setTimeout(() => {
        if (blockedAudioState === BlockedAudioStateType.ACTIVATED) {
          setIsModalOpen(true);
        } else {
          setIsModalOpen(false);
        }
      }, 2000);
    })();
    // I am farily confident that this is the state we want, but am not 100%
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAllowAudio = async () => {
    await playBlockedAudio();
    markBlockedAudioEnabled();
    setIsModalOpen(false);
  };

  return (
    <Modal
      testID={testID}
      isVisible={isModalOpen}
      close={() => {
        setIsModalOpen(false);
      }}
      closeButton
    >
      <ModalContentBase
        buttons={[
          {
            onClick: handleAllowAudio,
            label: intl.formatMessage({ id: 'confirm' }),
            disabled: !isAllowAudioChecked,
          },
        ]}
        headline={intl.formatMessage({ id: 'allowAudio' })}
        description={intl.formatMessage({ id: 'allowAudioDescr' })}
        headerLogo="speaker"
      >
        <Space fw pv="s" className={styles.switchSection} style={{ borderColor: getColor('grey.700') }}>
          <Space ml="l">
            <Text className={styles.allowAudioDescr} type="bodyDefault" color="grey.200">
              {intl.formatMessage({ id: 'playingAudio' })}
            </Text>
          </Space>
          <Space mr="l" className={styles.allowAudioSwitch}>
            <Switch isActive={isAllowAudioChecked} onClick={() => setIsAllowAudioChecked(!isAllowAudioChecked)} />
          </Space>
        </Space>
      </ModalContentBase>
    </Modal>
  );
};

export default AllowAudioModal;
