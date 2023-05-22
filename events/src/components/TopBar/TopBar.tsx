import {
  useNotifications,
  useErrors,
  useRecording,
  useConference,
  Space,
  Pill,
  RecordButton,
  RecordingStatus,
  Icon,
  Button,
  useTheme,
  Modal,
} from '@dolbyio/comms-uikit-react';
import { ungatedFeaturesEnabled } from '@src/utils/env';
import { getFriendlyName, getConferenceCreated } from '@src/utils/misc';
import { useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';

import RecordingModal from '../RecordingModal';
import Text from '../Text';
import Timer from '../Timer';

const MINUTE = 60 * 1000;
const LENGTH = (ungatedFeaturesEnabled() ? 15 : 60) * MINUTE;
const SHOWAFTER = LENGTH - 2 * MINUTE;

function useMeetingEndingSoon(startTime = 0): boolean {
  const now = Date.now();
  const timeTillEnd = now - startTime;
  const endingSoon = timeTillEnd > SHOWAFTER;
  const alreadyEnded = timeTillEnd > LENGTH;

  const [meetingEndsSoon, setMeetingEndsSoon] = useState(!!startTime && endingSoon && !alreadyEnded);

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;

    if (!meetingEndsSoon && !alreadyEnded) {
      timer = setTimeout(() => {
        setMeetingEndsSoon(true);
      }, SHOWAFTER - timeTillEnd);
    }

    return () => clearTimeout(timer);
  }, [alreadyEnded, timeTillEnd, meetingEndsSoon]);

  return meetingEndsSoon;
}

export const TopBar = ({
  isLive,
  isLoading,
  isMinimal = false,
  onStreamClick,
  joinType,
  eventName,
  viewerCount,
}: {
  isLive?: boolean;
  isLoading?: boolean;
  isMinimal?: boolean;
  onStreamClick?: () => void;
  joinType: 'viewer' | 'host';
  eventName?: string;
  viewerCount?: number;
}) => {
  const { getColor } = useTheme();
  const intl = useIntl();
  const { showSuccessNotification, showErrorNotification } = useNotifications();
  const { recordingErrors } = useErrors();
  const { status: recordingStatus } = useRecording();
  const { conference } = useConference();
  const [showTwoMinutesRemaining, setShowTwoMinutesRemaining] = useState(true);
  const startTime = getConferenceCreated(eventName ?? conference?.alias ?? '');

  const eventEndsSoon = useMeetingEndingSoon(startTime);

  const buttonText = useMemo(() => {
    if (isLoading) {
      return 'Loading...';
    }
    if (isLive) {
      return 'Stop';
    }
    return 'Go Live';
  }, [isLive, isLoading]);

  const eventTime = useMemo(() => {
    const startDate = startTime ? new Date(startTime) : new Date(Date.now());
    const endDate = startTime ? new Date(startTime + LENGTH) : new Date(Date.now() + 60 * 60 * 1000);

    return `${startDate.toLocaleDateString(undefined, {
      weekday: 'long',
    })}, ${startDate.toLocaleDateString(undefined, {
      month: 'long',
    })} ${startDate.getDate()} · ${startDate.toLocaleString('en-US', {
      hour: 'numeric',
      hour12: true,
      minute: 'numeric',
    })} - ${endDate.toLocaleString('en-US', { hour: 'numeric', hour12: true, minute: 'numeric' })}`;
  }, [startTime]);

  const renderRecordModal = (isVisible: boolean, accept: () => void, cancel: () => void) => (
    <RecordingModal testID="RecordingModel" isOpen={isVisible} closeModal={cancel} accept={accept} />
  );

  return (
    <Space
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 'var(--spaces-xs) var(--spaces-m)',
        borderBottom: `1px solid ${getColor('grey.700')}`,
      }}
      testID="TopBar"
    >
      <Space style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 16 }}>
        <Pill
          size="l"
          style={{ minWidth: 122, height: 30, borderRadius: 6, backgroundColor: getColor('grey.800') }}
          text="Logo"
          testID="Logo"
        />
        <Text type="h6" color="white" testID="MeetingName">
          {getFriendlyName(eventName ?? conference?.alias ?? '')}
        </Text>
        {!isLive && joinType === 'viewer' ? null : (
          <Pill
            testID="StreamingMode"
            style={{
              padding: '12px 12px',
              backgroundColor: isLive ? getColor('red.500') : getColor('grey.300'),
            }}
            text={isLive ? intl.formatMessage({ id: 'live' }) : intl.formatMessage({ id: 'preLiveSession' })}
          />
        )}

        <Text testID="MeetingTime" style={{ color: getColor('grey.200') }}>
          {eventTime}
        </Text>
      </Space>
      <Space style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Space style={{ display: 'flex', alignItems: 'center' }}>
          {isLive && (
            <>
              <Icon name="eyeOpen" color="grey.400" />
              <Text testID="ViewersCount" type="paragraphExtraSmall" color="grey.400" style={{ paddingLeft: 8 }}>
                {`${viewerCount} viewer${viewerCount === 1 ? '' : 's'}`}
              </Text>
            </>
          )}
          {joinType === 'host' && (
            <>
              <div id="recordButton">
                <RecordButton
                  isDisabled={ungatedFeaturesEnabled()}
                  transparent
                  activeIconColor="red"
                  defaultTooltipText={intl.formatMessage({ id: 'record' })}
                  activeTooltipText={intl.formatMessage({ id: 'stopRecording' })}
                  tooltipPosition="bottom"
                  onStopRecordingAction={() => showSuccessNotification(intl.formatMessage({ id: 'recordingStopped' }))}
                  onError={() =>
                    showErrorNotification(
                      intl.formatMessage({
                        id: recordingErrors['Recording already in progress']
                          ? 'recordingAlreadyInProgress'
                          : 'recordingError',
                      }),
                    )
                  }
                  renderStartConfirmation={renderRecordModal}
                  renderStopConfirmation={renderRecordModal}
                />
              </div>
              {recordingStatus === RecordingStatus.Active && (
                <Text testID="RecordingLabel" labelKey="recording" type="paragraphExtraSmall" color="#B9B9BA" />
              )}
            </>
          )}
        </Space>
        {!isMinimal && (
          <>
            <Space testID="Timer" id="timer">
              <Timer alwaysShowHour type="h4Thin" runTimer={isLive} />
            </Space>
            <Icon testID="StreamingStatus" name="circle" size="xxxs" color={isLive ? 'red.500' : 'grey.300'} />
          </>
        )}
        {joinType === 'host' && onStreamClick && (
          <Button
            id="rtsButton"
            testID={`${buttonText.replaceAll(/\s/g, '')}Button`}
            disabled={isLoading}
            style={{ width: 107, height: 30, backgroundColor: isLive ? getColor('red.500') : '#00B865' }}
            onClick={onStreamClick}
          >
            {buttonText}
          </Button>
        )}
        {ungatedFeaturesEnabled() && (
          <Modal
            testID="LeaveEventModel"
            isVisible={!!eventEndsSoon && showTwoMinutesRemaining}
            close={() => setShowTwoMinutesRemaining(false)}
            closeButton
            overlayClickClose
          >
            <Space m="l" css={{ display: 'flex', flexDirection: 'column' }}>
              <Text testID="LeaveEventModelDescription" type="h6" align="center">
                Two Minutes Remaining
              </Text>
              <Text testID="LeaveEventModelDescription" align="center">
                This event will stop in two minutes
              </Text>
            </Space>
          </Modal>
        )}
      </Space>
    </Space>
  );
};
