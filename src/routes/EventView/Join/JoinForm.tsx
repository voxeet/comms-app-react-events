import { Button, Input } from '@dolbyio/comms-uikit-react';
import {
  translationKeys,
  useCreateConferenceValidation,
} from '@src/routes/ConferenceCreate/ConferenceCreateInput/ConferenceCreateInput';
import { ChangeEvent, FormEvent, useState } from 'react';
import { useIntl } from 'react-intl';

import styles from './Join.module.scss';

type JoinFormProps = {
  onSubmit: (name: string) => void;
};

export const JoinForm = ({ onSubmit }: JoinFormProps) => {
  const intl = useIntl();
  const [name, setName] = useState('');
  const { validation, validateInput } = useCreateConferenceValidation('user');

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
    <form className={styles.joinForm} onSubmit={submit}>
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
