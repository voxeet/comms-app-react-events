import Text from '@components/Text';
import { Button, Layout, Space } from '@dolbyio/comms-uikit-react';
import useConferenceCleanup from '@hooks/useConferenceCleanup';
import { TopBar } from '@src/components/TopBar/TopBar';
import { openInNewTab } from '@src/utils/misc';
import cx from 'classnames';
import { useParams } from 'react-router-dom';

import styles from './DemoEnded.module.scss';

const URL_SALES =
  'https://dolby.io/contact/?utm_medium=referral&utm_campaign=landing-page-contact-sales&utm_source=eventapp';
const URL_GITHUB =
  'https://www.github.com/dolbyio-samples/comms-app-events-react//?utm_medium=referral&utm_campaign=event-app-gh&utm_source=eventapp';
const URL_SIGN_UP =
  'https://dashboard.dolby.io/?utm_medium=referral&utm_campaign=landing-page-sign-up&utm_source=eventapp';

export const DemoEnded = () => {
  const { id } = useParams();

  useConferenceCleanup();

  const navigateSignUp = () => {
    openInNewTab(URL_SIGN_UP);
  };

  const navigateGithub = () => {
    openInNewTab(URL_GITHUB);
  };

  const navigateSales = () => {
    openInNewTab(URL_SALES);
  };

  return (
    <Layout testID="ConferenceLeftRoute" backgroundColor="black">
      <TopBar joinType="viewer" isLive={false} isMinimal eventName={id} />
      <Space fw className={styles.wrapper}>
        <Space className={cx(styles.textContainer)}>
          <Text testID="ConferenceLeftPageHeading" type="h4" align="center" labelKey="eventEnded" />
        </Space>
        <div className={styles.item}>
          <Text labelKey="signupLabel" color="grey.200" type="paragraphSmall" />
          <Button onClick={navigateSignUp} testID="Signup" variant="primary" className={styles.button}>
            <Text type="button" labelKey="signup" />
          </Button>
        </div>
        <div className={styles.item}>
          <Text labelKey="githubLabel" color="grey.200" type="paragraphSmall" />
          <Button onClick={navigateGithub} testID="Github" variant="tertiaryGrey" className={styles.button}>
            <Text type="button" labelKey="github" />
          </Button>
        </div>
        <div className={styles.item}>
          <Text labelKey="contactSalesLabel" color="grey.200" type="paragraphSmall" />
          <Button onClick={navigateSales} testID="ContactSales" variant="tertiaryGrey" className={styles.button}>
            <Text type="button" labelKey="contactSales" />
          </Button>
        </div>
      </Space>
    </Layout>
  );
};
