import { SupportedLanguage } from '@src/types/translations';
import { ReactNode } from 'react';
import { IntlProvider } from 'react-intl';

import enMessages from '../../translations/en.json';

type TranslationProviderProps = {
  children: ReactNode;
};

const messagesMap = {
  [SupportedLanguage.en]: enMessages,
};

export const TranslationProvider = ({ children }: TranslationProviderProps) => {
  return (
    <IntlProvider locale={SupportedLanguage.en} messages={messagesMap[SupportedLanguage.en]}>
      {children}
    </IntlProvider>
  );
};
