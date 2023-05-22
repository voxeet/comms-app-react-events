import ModalContentBase, { type Buttons } from '@components/ModalContentBase/ModalContentBase';
import { Modal, useRecording } from '@dolbyio/comms-uikit-react';
import { useIntl } from 'react-intl';

type RecordingModalProps = {
  testID?: string;
  isOpen: boolean;
  closeModal: () => void;
  accept: () => void;
};

const RecordingModal = ({ testID = 'RecordingModal', isOpen, closeModal, accept }: RecordingModalProps) => {
  const intl = useIntl();
  const { isRecordingModeActive } = useRecording();

  const buttonsConfig: Buttons = [
    {
      onClick: accept,
      label: intl.formatMessage({
        id: isRecordingModeActive ? 'stopRecording' : 'startRecording',
      }),
      testID: isRecordingModeActive ? 'StopRecordingButton' : 'StartRecordingButton',
    },
    {
      onClick: closeModal,
      label: intl.formatMessage({ id: 'cancel' }),
      variant: 'secondary',
      testID: 'CancelButton',
    },
  ];

  return (
    <Modal testID={testID} isVisible={isOpen} close={closeModal} closeButton>
      <ModalContentBase
        buttons={buttonsConfig}
        headline={intl.formatMessage({ id: isRecordingModeActive ? 'stopRecording' : 'recordModalHeadline' })}
        description={intl.formatMessage({ id: 'recordModalDesc' })}
        headerLogo="record"
      />
    </Modal>
  );
};

export default RecordingModal;
