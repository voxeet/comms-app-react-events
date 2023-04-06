import { InviteParticipants } from '@components/InviteParticipants';
import Text from '@components/Text';
import { IconButton } from '@dolbyio/comms-uikit-react';
import { getFriendlyName } from '@src/utils/misc';
import { getHostPath, getViewerPath } from '@src/utils/route';

import styles from './ShareLinks.module.scss';

export const ShareLinks = ({
  meetingName,
  onCloseClick,
}: {
  meetingName: string | undefined;
  onCloseClick: () => void;
}) => {
  return (
    <div data-testid="FirstParticipantConatiner" className={styles.shareLinksContainer}>
      <div className={styles.flex}>
        <div className={styles.shareLinksTop}>
          <Text
            testID="ConatinerTitle"
            className={styles.firstToJoin}
            // If this is added in css, Text clobbers it and shrinks the text
            style={{ fontSize: 24 }}
          >
            {`You're`} the first to arrive
          </Text>
          <Text testID="ConatinerDescription">Wait or invite other participants to join</Text>
        </div>
        <IconButton testID="ConatinerClose" icon="close" backgroundColor="grey.800" onClick={onCloseClick} />
      </div>
      <Text testID="EventTitleLabel">Event Title ID</Text>
      <Text testID="MeetingName" style={{ color: 'var(--colors-grey-400)' }}>
        {getFriendlyName(meetingName ?? '')}
      </Text>
      <InviteParticipants
        coHostLink={window.location.origin + getHostPath(meetingName || '')}
        viewerLink={window.location.origin + getViewerPath(meetingName || '')}
      />
    </div>
  );
};
