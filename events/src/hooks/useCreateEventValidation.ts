import { ValidationType } from '@dolbyio/comms-uikit-react';
import { isValid } from '@src/utils/validation';
import { useState } from 'react';
import { useIntl } from 'react-intl';

export const translationKeys = {
  user: {
    headerId: 'enterName',
    headerTestId: 'EnterName',
    disclaimerId: 'enterNameDisclaimer',
    disclaimerTestId: 'EnterNameDisclaimer',
    inputLabel: 'name',
    inputTestId: 'UsernameInput',
    validationMessage: 'genericValidation',
    // validationMessage: 'usernameValidation',
    submitButtonTestId: 'UsernameNextButton',
    submitButtonLabel: 'next',
    buttonHeight: 'unset',
    submitButtonLabelTestId: 'Next',
  },
  meeting: {
    headerId: 'hiName',
    headerTestId: 'HelloUser',
    disclaimerId: 'meetingTitleDisclaimer',
    disclaimerTestId: 'MeetingTitleDisclaimer',
    inputLabel: 'meetingTitle',
    inputTestId: 'MeetingNameInput',
    validationMessage: `genericValidation`,
    // validationMessage: `meetingTitleValidation`,
    submitButtonTestId: 'MeetingNameJoinButton',
    submitButtonLabel: 'join',
    submitButtonLabelTestId: 'JoinButtonText',
    buttonHeight: 48,
  },
} as const;

export const useCreateEventValidation = (type: 'user' | 'meeting') => {
  const [validation, setValidation] = useState<ValidationType>({ valid: true });
  const intl = useIntl();
  const settings = translationKeys[type];

  const validateInput = (value: string, callback?: () => void) => {
    const minChar = type === 'meeting' ? 3 : 2;
    const valid = isValid(value, minChar);

    const validationState = value.length
      ? {
          valid,
          message: valid ? undefined : intl.formatMessage({ id: settings.validationMessage }, { minChar }),
        }
      : { valid: true };
    setValidation(validationState);
    if (valid) {
      callback?.();
    }
    return validationState;
  };

  return { validation, validateInput };
};
