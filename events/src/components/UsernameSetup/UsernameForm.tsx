import { Button, Input } from '@dolbyio/comms-uikit-react';
import { translationKeys, useCreateEventValidation } from '@hooks/useCreateEventValidation';
import { ChangeEvent, FormEvent, useState } from 'react';
import { useIntl } from 'react-intl';

import styles from './UsernameSetup.module.scss';

type UsernameFormProps = {
  onSubmit: (name: string) => void;
};

export const UsernameForm = ({ onSubmit }: UsernameFormProps) => {
  const intl = useIntl();
  const [name, setName] = useState('');
  const { validation, validateInput } = useCreateEventValidation('user');

  const updateName = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > 3) {
      validateInput(e.target.value);
    }
    setName(e.target.value);
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { valid: userValid } = validateInput(name);

    if (name.length && userValid) {
      onSubmit(name);
    }
  };

  return (
    <form className={styles.form} onSubmit={submit}>
      <Input
        labelBackground="grey.900"
        labelColor="white"
        textColor="white"
        testID={translationKeys.user.inputTestId}
        label={intl.formatMessage({ id: 'yourName' })}
        value={name}
        placeholder={intl.formatMessage({ id: 'enterName' })}
        onChange={updateName}
        validation={validation}
        autoFocus
      />
      <Button testID="Next" type="submit">
        Next
      </Button>
    </form>
  );
};
