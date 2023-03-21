import { CreateStep } from '@src/types/routes';
import { useState, createContext, useMemo, SetStateAction, Dispatch, ReactNode } from 'react';

type ConferenceCreateContext = {
  step: CreateStep;
  setStep: Dispatch<SetStateAction<number>>;
  username: string;
  setUsername: Dispatch<SetStateAction<string>>;
  meetingName: string;
  setMeetingName: Dispatch<SetStateAction<string>>;
};

type ConferenceCreateProviderProps = { children: ReactNode };

export const ConferenceCreateContext = createContext<ConferenceCreateContext>({} as ConferenceCreateContext);

export const ConferenceCreateProvider = ({ children }: ConferenceCreateProviderProps) => {
  const [step, setStep] = useState(CreateStep.userSetup);
  const [username, setUsername] = useState('');
  const [meetingName, setMeetingName] = useState('');

  const contextValue: ConferenceCreateContext = useMemo(
    () => ({
      step,
      setStep,
      username,
      setUsername,
      meetingName,
      setMeetingName,
    }),
    [step, username, meetingName],
  );

  return <ConferenceCreateContext.Provider value={contextValue}>{children}</ConferenceCreateContext.Provider>;
};
