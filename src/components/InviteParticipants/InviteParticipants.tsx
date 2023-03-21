import Copy from '@src/components/Copy';
import Text from '@src/components/Text';
import { useIntl } from 'react-intl';

import styles from './InviteParticipants.module.scss';

type InviteParticipantsProps = {
  /** URL where a co-host can join the event */
  coHostLink?: string;
  /** URL where a viewer can join the event */
  viewerLink?: string;
};

export const InviteParticipants = ({ coHostLink, viewerLink }: InviteParticipantsProps) => {
  const intl = useIntl();
  const heading =
    coHostLink && !viewerLink
      ? intl.formatMessage({ id: 'inviteCoHostsHeading' })
      : intl.formatMessage({ id: 'inviteParticipantsHeading' });

  return (
    <div className={styles.container}>
      <Text type="H2">{heading}</Text>
      {coHostLink && (
        <div className={styles.copy}>
          <Text>{intl.formatMessage({ id: 'inviteCoHosts' })}</Text>
          <Copy
            copyValue={coHostLink}
            tooltipText={intl.formatMessage({ id: 'copyLink' })}
            successText={intl.formatMessage({ id: 'linkCopied' })}
          />
        </div>
      )}
      {viewerLink && (
        <div className={styles.copy}>
          <Text>{intl.formatMessage({ id: 'inviteViewers' })}</Text>
          <Copy
            copyValue={viewerLink}
            tooltipText={intl.formatMessage({ id: 'copyLink' })}
            successText={intl.formatMessage({ id: 'linkCopied' })}
          />
        </div>
      )}
    </div>
  );
};
