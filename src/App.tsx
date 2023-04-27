import { CommsProvider, ThemeProvider, LogProvider, NotificationCenter, LogLevel } from '@dolbyio/comms-uikit-react';
import PubNub from 'pubnub';
import { PubNubProvider } from 'pubnub-react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import styles from './App.module.scss';
import PhoneLandscapeCurtain from './components/PhoneLandscapeCurtain';
import TranslationProvider from './components/TranslationProvider';
import { SideDrawerProvider } from './context/SideDrawerContext';
import useToken from './hooks/useToken';
import { Navigator } from './routes/Navigator';
import { env } from './utils/env';

const pubnub = new PubNub({
  publishKey: env('VITE_PUBNUB_PUBLISH_KEY'),
  subscribeKey: env('VITE_PUBNUB_SUBSCRIBE_KEY'),
  userId: 'events-client',
});

const App = () => {
  const { YOUR_TOKEN, getToken, error } = useToken();

  if (error) {
    return (
      <ThemeProvider>
        <div className={styles.fallbackContainer}>Error : {error}</div>;
      </ThemeProvider>
    );
  }

  if (!YOUR_TOKEN) {
    return null;
  }

  return (
    <PubNubProvider client={pubnub}>
      <LogProvider minLogLevel={LogLevel.warn}>
        <TranslationProvider>
          <CommsProvider
            token={YOUR_TOKEN}
            refreshToken={getToken}
            packageUrlPrefix={`${window.location.origin}${import.meta.env.BASE_URL}assets/wasm/`}
          >
            <ThemeProvider>
              <SideDrawerProvider>
                <div className={styles.app}>
                  <Navigator />
                </div>
                {/* Because of the problem with resize / orientation change events , we need to lock android chrome landscape mode* /}
                {/* for mobile devices */}
                <PhoneLandscapeCurtain />
                <NotificationCenter position="top-center" />
              </SideDrawerProvider>
            </ThemeProvider>
          </CommsProvider>
        </TranslationProvider>
      </LogProvider>
    </PubNubProvider>
  );
};

const container = document.getElementById('root');
// no-non-null-assertion comes from official react docs
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(container!);
root.render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
