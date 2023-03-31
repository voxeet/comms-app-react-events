/* eslint-disable no-nested-ternary */
import { FacebookLive, Twitch, YouTubeStudio } from '@assets/index';
import LiveStreamingModal from '@components/LiveStreamingModal';
import StopLiveStreamingModal from '@components/StopLiveStreamingModal';
import Text from '@components/Text';
import Timer from '@components/Timer';
import {
  GenericStatus,
  LiveStreamingActionBar,
  RecordingActionBar,
  ScreenSharingActionBar,
  Space,
  useNotifications,
  useRecording,
  useScreenSharing,
  useTheme,
} from '@dolbyio/comms-uikit-react';
import { useLiveStreaming } from '@hooks/useLiveStreaming';
import { forwardRef, useState } from 'react';
import { useIntl } from 'react-intl';

type ActionBarProps = {
  mobileShare?: boolean;
};

const providers = {
  twitch: <Twitch />,
  youtube: <YouTubeStudio />,
  facebook: <FacebookLive />,
  other: null,
};

function isActive(...args: GenericStatus[]) {
  return args.every((arg) => arg === GenericStatus.Active);
}

function isSomeActive(...args: GenericStatus[]) {
  return args.some((arg) => arg === GenericStatus.Active);
}

const ServiceProviderLogo = () => {
  const { provider } = useLiveStreaming();
  return (
    <Space mr="xs" style={{ justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
      {providers[provider as keyof typeof providers]}
    </Space>
  );
};

const StreamingLabel = () => {
  const { owner: liveStreamingOwner, timestamp, isLocalUserLiveStreamingOwner } = useLiveStreaming();
  const { isMobileSmall } = useTheme();
  const { isRecordingModeActive, status } = useRecording();

  return (
    <>
      <Timer startTime={timestamp ?? undefined} />
      {!((isMobileSmall && isRecordingModeActive) || isActive(status)) && (
        <>
          <Text> | </Text>
          <Text
            labelKey={isLocalUserLiveStreamingOwner ? 'streaming' : 'isStreaming'}
            values={{ participant: liveStreamingOwner?.info.name }}
          />
        </>
      )}
    </>
  );
};

const StreamingModal = ({
  isStreamingModal,
  setStreamingModal,
}: {
  isStreamingModal: boolean;
  setStreamingModal: (newVal: boolean) => void;
}) => {
  const { status: streamingStatus, streamHandler } = useLiveStreaming();
  const { showSuccessNotification } = useNotifications();
  const intl = useIntl();

  if (!isStreamingModal) {
    return null;
  }
  if (isActive(streamingStatus)) {
    return (
      <StopLiveStreamingModal
        isOpen={isStreamingModal}
        closeModal={() => setStreamingModal(false)}
        accept={async () => {
          setStreamingModal(false);
          await streamHandler('stop');
          showSuccessNotification(intl.formatMessage({ id: 'liveStreamingEnded' }));
        }}
      />
    );
  }
  return <LiveStreamingModal closeModal={() => setStreamingModal(false)} isOpen={isStreamingModal} />;
};

export const ActionBar = forwardRef<HTMLDivElement, ActionBarProps>(({ mobileShare }, ref) => {
  const { isDesktop, isMobile, isMobileSmall, isTablet } = useTheme();
  const intl = useIntl();
  const [activeBar, setActiveBar] = useState<'presenting' | 'recording' | 'streaming'>('presenting');
  const { showSuccessNotification } = useNotifications();
  const { owner, isPresentationModeActive, status: sharingStatus, isLocalUserPresentationOwner } = useScreenSharing();
  const {
    isLocalUserRecordingOwner,
    isRecordingModeActive,
    status: recordingStatus,
    timestamp: recordingTimestamp,
  } = useRecording();
  const { status: streamingStatus, isLiveStreamingModeActive, isLocalUserLiveStreamingOwner } = useLiveStreaming();
  const [isStreamingModal, setStreamingModal] = useState(false);

  if (
    !isLocalUserPresentationOwner &&
    !isLocalUserRecordingOwner &&
    !isLocalUserLiveStreamingOwner &&
    !isSomeActive(sharingStatus, recordingStatus, streamingStatus)
  ) {
    return null;
  }

  return (
    <div className="actionBarRef" ref={ref}>
      <Space
        ph={isDesktop ? 'm' : !mobileShare && (isTablet ? 'm' : 'xs')}
        pt={isMobile || isMobileSmall ? 'xs' : isDesktop && 'm'}
        pb={!isDesktop && !isMobileSmall && !mobileShare && 'xs'}
        style={{ display: 'flex' }}
      >
        {(isLocalUserRecordingOwner || isActive(recordingStatus)) && !mobileShare && (
          <RecordingActionBar
            onMount={() => setActiveBar('recording')}
            onClick={() => setActiveBar('recording')}
            compact={
              activeBar !== 'recording' && (isPresentationModeActive || isSomeActive(streamingStatus, sharingStatus))
            }
            statusLabels={{
              active: (
                <>
                  <Timer startTime={recordingTimestamp ?? undefined} />
                  {!(isMobileSmall && (isLiveStreamingModeActive || isActive(streamingStatus))) && (
                    <>
                      <Text> | </Text>
                      <Text labelKey="recording" />
                    </>
                  )}
                </>
              ),
              error: intl.formatMessage({ id: 'recordingFailed' }),
              loading: `${intl.formatMessage({ id: 'recording' })}...`,
              other: '',
            }}
            buttonLabels={{
              active: {
                tooltip: intl.formatMessage({ id: 'stopRecording' }),
                label: intl.formatMessage({ id: !isDesktop ? 'stop' : 'stopRecording' }),
              },
              error: {
                tooltip: intl.formatMessage({ id: 'tryAgain' }),
                label: intl.formatMessage({ id: 'tryAgain' }),
              },
            }}
            onActionSuccess={() => {
              if (isActive(recordingStatus)) {
                showSuccessNotification(intl.formatMessage({ id: 'recordingStopped' }));
              }
              if (isActive(recordingStatus)) {
                showSuccessNotification(intl.formatMessage({ id: 'recordingSuccessfully' }));
              }
            }}
          />
        )}
        {(isLiveStreamingModeActive || isActive(streamingStatus)) && !mobileShare && (
          <>
            <LiveStreamingActionBar
              ml={isActive(recordingStatus) || isRecordingModeActive ? 'xs' : undefined}
              onMount={() => setActiveBar('streaming')}
              actions={{ start: () => setStreamingModal(true), stop: () => setStreamingModal(true) }}
              streamingServiceLogo={<ServiceProviderLogo />}
              onClick={() => setActiveBar('streaming')}
              compact={(isActive(sharingStatus) || isActive(recordingStatus)) && activeBar !== 'streaming'}
              statusLabels={{
                active: <StreamingLabel />,
                error: intl.formatMessage({ id: 'streamingFailed' }),
                loading: `${intl.formatMessage({ id: 'streaming' })}...`,
                other: '',
              }}
              buttonLabels={{
                active: {
                  label: intl.formatMessage({ id: !isDesktop ? 'stop' : 'stopStreaming' }),
                },
                error: {
                  label: intl.formatMessage({ id: 'tryAgain' }),
                },
              }}
              guestLabel={<StreamingLabel />}
            />
            <StreamingModal isStreamingModal={isStreamingModal} setStreamingModal={setStreamingModal} />
          </>
        )}
        {(isDesktop || mobileShare) && (isPresentationModeActive || isActive(sharingStatus)) && (
          <ScreenSharingActionBar
            ml={
              (isLocalUserRecordingOwner ||
                isActive(recordingStatus) ||
                isLiveStreamingModeActive ||
                isActive(streamingStatus)) &&
              !mobileShare
                ? 'xs'
                : undefined
            }
            onMount={() => setActiveBar('presenting')}
            onClick={() => setActiveBar('presenting')}
            compact={
              activeBar !== 'presenting' &&
              (isRecordingModeActive || isLiveStreamingModeActive || isSomeActive(streamingStatus, recordingStatus))
            }
            statusLabels={{
              active: intl.formatMessage({ id: 'screenSharing' }),
              error: intl.formatMessage({ id: 'screenSharingIssue' }),
              loading: `${intl.formatMessage({ id: 'screenSharing' })}...`,
              other: '',
            }}
            buttonLabels={{
              label: intl.formatMessage({ id: 'stopPresenting' }),
            }}
            onActionSuccess={() => {
              showSuccessNotification(intl.formatMessage({ id: 'screenSharingStopped' }));
            }}
            guestLabel={intl.formatMessage({ id: 'isPresenting' }, { participant: owner?.info.name })}
          />
        )}
      </Space>
    </div>
  );
});
