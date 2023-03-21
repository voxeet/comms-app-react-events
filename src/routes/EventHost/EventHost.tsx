/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-nested-ternary */
// TODO add error handling that isn't console.log

import ActionBar from '@components/ActionBar';
import AllowAudioModal from '@components/AllowAudioModal';
import PendingTakeoverInfoBar from '@components/PendingTakeoverInfoBar';
import ScreenSharingPermissionModal from '@components/ScreenSharingPermissionModal/ScreenSharingPermissionModal';
import {
  Conference as ConferenceComponent,
  IconButton,
  InfoBar,
  GenericStatus,
  Overlay,
  RecordingStatus,
  ScreenSharingPresentationBox,
  ShareStatus,
  Space,
  Spinner,
  useAudio,
  useCamera,
  useConference,
  useMicrophone,
  useParticipants,
  useRecording,
  useScreenSharing,
  useSpeaker,
  useTheme,
  useVideo,
  Modal,
  useNotifications,
  ParticipantVideo,
  ParticipantsGrid,
} from '@dolbyio/comms-uikit-react';
import useConferenceCreate from '@hooks/useConferenceCreate';
import { useLiveStreaming } from '@hooks/useLiveStreaming';
import { usePageRefresh } from '@hooks/usePageRefresh';
import { useRealTimeStreaming } from '@hooks/useRealTimeStreaming';
import { InviteParticipants } from '@src/components/InviteParticipants';
import PresentersGrid from '@src/components/PresentersGrid/PresentersGrid';
import SideBar from '@src/components/SideBar';
import { SideDrawer } from '@src/components/SideDrawer';
import Text from '@src/components/Text';
import { TopBar } from '@src/components/TopBar/TopBar';
import { SideDrawerContentTypes } from '@src/context/SideDrawerContext';
import { useActiveParticipants } from '@src/hooks/useActiveParticipants';
import useDrawer from '@src/hooks/useDrawer';
import useSDKErrorHandler from '@src/hooks/useSDKErrorsHandler';
import getProxyUrl from '@src/utils/getProxyUrl';
import { getHostPath, getRejoinPath, getViewerPath } from '@src/utils/route';
import { Participant } from '@voxeet/voxeet-web-sdk/types/models/Participant';
import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate, useParams } from 'react-router-dom';

import confStyles from '../Conference/Conference.module.scss';
import { EventCoHost } from '../EventCoHost/EventCoHost';

import styles from './EventHost.module.scss';

const SingleHostPresent = ({
  meetingName,
  participant,
}: {
  meetingName: string | undefined;
  participant: Participant;
}) => {
  const [showShareLinks, toggleShowShareLinks] = useState(true);

  return (
    <div className={styles.singleHostPresent}>
      <ParticipantVideo participant={participant} style={{ flexGrow: 1 }} />
      {showShareLinks && (
        <div className={styles.shareLinksContainer}>
          <div className={styles.flex}>
            <div className={styles.shareLinksTop}>
              <Text
                className={styles.firstToJoin}
                // If this is added in css, Text clobbers it and shrinks the text
                style={{ fontSize: 24 }}
              >
                {`You're`} the first to arrive
              </Text>
              <Text>Wait or invite other participants to join</Text>
            </div>
            <IconButton
              icon="close"
              style={{ backgroundColor: 'var(--colors-grey-800)' }}
              onClick={() => toggleShowShareLinks(false)}
            />
          </div>
          <Text>Event Title ID</Text>
          <Text style={{ color: 'var(--colors-grey-400)' }}>{meetingName}</Text>
          <InviteParticipants
            coHostLink={window.location.origin + getHostPath(meetingName || '')}
            viewerLink={window.location.origin + getViewerPath(meetingName || '')}
          />
        </div>
      )}
    </div>
  );
};

const ConfView = () => {
  const { openDrawer } = useDrawer();
  const params = useParams();
  const navigate = useNavigate();
  const { conference, leaveConference } = useConference();
  const { activeParticipants } = useActiveParticipants();
  const { participants } = useParticipants();
  const { meetingName } = useConferenceCreate();
  const { selectCamera, localCamera } = useCamera();
  const { isVideo } = useVideo();
  const { selectMicrophone, localMicrophone } = useMicrophone();
  const { isAudio } = useAudio();
  const { selectSpeaker, localSpeakers } = useSpeaker();
  const {
    isLive: isRtsLive,
    isLoading: isRtsLoading,
    startRealTimeStreaming,
    stopRealTimeStreaming,
  } = useRealTimeStreaming(getProxyUrl());
  const { showErrorNotification } = useNotifications();
  const intl = useIntl();
  const { isDesktop, isMobileSmall, isLandscape } = useTheme();
  const mobileScreenShareRef = useRef<HTMLDivElement>(null);
  const [isHostPanelOpen, setIsHostPanelOpen] = useState(false);
  const {
    status: screenSharingStatus,
    permissionError,
    setSharingErrors,
    isLocalUserPresentationOwner,
    isPendingTakeoverRequest,
    isPresentationModeActive,
    stopScreenShare,
  } = useScreenSharing();
  const { status: recordingStatus, ownerId, isLocalUserRecordingOwner, stopRecording } = useRecording();
  const [inviteModalState, setInviteModalState] = useState({ open: false, showViewerLink: false });
  const [showBars, setShowBars] = useState(true);
  const { isLiveStreamingModeActive, isLocalUserLiveStreamingOwner, sendStreamingBeacon, streamHandler } =
    useLiveStreaming();

  const refreshCleanup = (e: BeforeUnloadEvent) => {
    e.preventDefault();
    sendStreamingBeacon();
  };

  usePageRefresh(refreshCleanup, [isLiveStreamingModeActive]);

  const sessionAndTokenErrorHandler = useCallback(async () => {
    if (isLocalUserRecordingOwner) {
      await stopRecording();
    }
    if (isLocalUserPresentationOwner) {
      stopScreenShare();
    }
    leaveConference();
  }, [isLocalUserRecordingOwner, isLocalUserPresentationOwner]);

  useSDKErrorHandler(sessionAndTokenErrorHandler, sessionAndTokenErrorHandler);

  useEffect(() => {
    if (showBars && isMobileSmall && participants.length > 1) {
      setTimeout(() => {
        setShowBars(false);
      }, 4000);
    }
    if (participants.length < 2) {
      setShowBars(true);
    }
  }, [showBars, participants.length]);

  useEffect(() => {
    document.title = `${document.title} - ${meetingName}`;
    return () => {
      // eslint-disable-next-line prefer-destructuring
      document.title = document.title.split(' - ')[0];
    };
  }, [meetingName]);

  useEffect(() => {
    (async () => {
      if (localCamera && localCamera.deviceId && isVideo) {
        try {
          await selectCamera(localCamera.deviceId);
        } catch (error) {
          // console.error(error);
        }
      }
    })();
  }, [localCamera]);

  useEffect(() => {
    (async () => {
      if (localMicrophone && localMicrophone.deviceId && isAudio) {
        try {
          await selectMicrophone(localMicrophone.deviceId);
        } catch (error) {
          // console.error(error);
        }
      }
    })();
  }, [localMicrophone, isAudio]);

  useEffect(() => {
    (async () => {
      if (localSpeakers && localSpeakers.deviceId) {
        try {
          await selectSpeaker(localSpeakers.deviceId);
        } catch (error) {
          // console.error(error);
        }
      }
    })();
  }, [localSpeakers]);

  // const isSmartphone = isMobile || isMobileSmall;

  // const isOneParticipant = useMemo(() => {
  //   return false;
  // }, [participants]);

  const isPresentationActive =
    screenSharingStatus === ShareStatus.Active || (isLocalUserPresentationOwner && isPresentationModeActive);

  const openParticipantsPanel = () => {
    openDrawer(SideDrawerContentTypes.PARTICIPANTS);
  };

  const openInviteParticipantsModal = () => {
    setInviteModalState({
      open: true,
      showViewerLink: true,
    });
  };

  const openInviteCoHostModal = () => {
    setInviteModalState({
      open: true,
      showViewerLink: false,
    });
  };

  const closeInviteModal = () => {
    setInviteModalState({
      open: false,
      showViewerLink: false,
    });
  };

  const openSettingsPanel = () => {
    openDrawer(SideDrawerContentTypes.DEVICE_SETUP);
  };

  const exit = async () => {
    if (isLocalUserRecordingOwner && recordingStatus === GenericStatus.Active) {
      await stopRecording();
    }
    if (isLocalUserPresentationOwner && screenSharingStatus === GenericStatus.Active) {
      await stopScreenShare();
    }
    if (isLocalUserLiveStreamingOwner && isLiveStreamingModeActive) {
      streamHandler('stop');
    }

    await leaveConference();
    navigate(getRejoinPath(params.id || ''), { replace: true });
  };

  const toggleRts = () => {
    if (isRtsLive) {
      stopRealTimeStreaming().catch(() => {
        showErrorNotification(intl.formatMessage({ id: 'liveStreamingError' }));
      });
    } else {
      startRealTimeStreaming().catch(() => {
        showErrorNotification(intl.formatMessage({ id: 'liveStreamingError' }));
      });
    }
  };

  // TODO make something less terrible than this
  const height = useMemo(() => {
    const footer = 84;
    const topbar = 80;
    const eventNotStarted = 52;
    const isPresenting = 40;
    let missingHeight = footer + topbar;

    if (!isRtsLive) {
      missingHeight += eventNotStarted;
    }
    if (isPresentationActive) {
      missingHeight += isPresenting;
    }

    return missingHeight;
  }, [isHostPanelOpen, isRtsLive]);
  return (
    <ConferenceComponent id={conference?.id}>
      <div className={styles.pageLayout}>
        <div className={styles.header}>
          <TopBar isLive={isRtsLive} isLoading={isRtsLoading} onStreamClick={toggleRts} joinType="host" />
        </div>
        <div className={styles.main}>
          {!isRtsLive && (
            <div className={styles.notLiveBanner}>
              <Text>This event {`hasn't`} started yet</Text>
            </div>
          )}
          {/* {!isPresentationActive ? <ParticipantsGrid localText="You" /> : null} */}
          {!isRtsLive && participants.length === 1 && !isPresentationActive ? (
            <SingleHostPresent meetingName={params.id} participant={participants[0]} />
          ) : !isPresentationActive ? (
            <ParticipantsGrid localText="You" />
          ) : null}
          {isPresentationActive ? (
            <Space className={confStyles.presentationWrapper} pb={!isDesktop && !isLandscape && 'xs'}>
              {!isDesktop && <ActionBar ref={mobileScreenShareRef} mobileShare />}
              <ScreenSharingPresentationBox
                fallbackText={intl.formatMessage({ id: 'screenShareDefaultFallbackText' })}
                fallbackButtonText={intl.formatMessage({ id: 'tryAgain' })}
                style={{
                  margin: 'auto',
                  height: `calc(100% - ${height}px)`,
                  backgroundColor: 'black',
                }}
              />
            </Space>
          ) : null}
        </div>
        <div className={styles.sidebar}>
          <SideBar
            numParticipants={
              activeParticipants
                ? activeParticipants.participantCount + activeParticipants.viewerCount
                : participants.length
            }
            onParticipantsClick={openParticipantsPanel}
            onInviteClick={openInviteParticipantsModal}
            onSettingsClick={openSettingsPanel}
            onExitConfirm={exit}
          />
        </div>
        <div className={styles.footer}>
          <CollapsiblePanel
            onInviteCoHostClick={openInviteCoHostModal}
            isPresentationActive={isPresentationActive}
            isOpen={isHostPanelOpen}
            setIsOpen={setIsHostPanelOpen}
          />
        </div>
        {/* Below this point are items that don't need specific locations on the page - they are rendered in modals or other such positions */}
        <Overlay
          visible={screenSharingStatus === ShareStatus.Loading || recordingStatus === RecordingStatus.Loading}
          opacity={0.8}
          color="black"
        >
          <Spinner
            textContent={
              screenSharingStatus === ShareStatus.Loading
                ? intl.formatMessage({ id: 'preparingScreenSharing' })
                : intl.formatMessage({ id: 'preparingRecording' })
            }
          />
        </Overlay>
        {isPendingTakeoverRequest && (
          <Space className={confStyles.pendingTakeoverBar} mt="s">
            <PendingTakeoverInfoBar />
          </Space>
        )}
        {!isLocalUserRecordingOwner && recordingStatus === RecordingStatus.Active && (
          <Space className={confStyles.pendingTakeoverBar} mt="s">
            <InfoBar
              testID="RecordingInfoBar"
              iconName="record"
              text={intl.formatMessage(
                { id: 'startedRecording' },
                { user: participants.find((part) => part.id === ownerId)?.info.name || '' },
              )}
              style={{ padding: '12px' }}
            />
          </Space>
        )}
        <AllowAudioModal />
        <Modal
          isVisible={inviteModalState.open}
          close={closeInviteModal}
          modalWidth={462}
          closeButton
          overlayClickClose
        >
          <Space p="l">
            <InviteParticipants
              coHostLink={window.location.origin + getHostPath(params.id || '')}
              viewerLink={
                inviteModalState.showViewerLink ? window.location.origin + getViewerPath(params.id || '') : undefined
              }
            />
          </Space>
        </Modal>
        <ScreenSharingPermissionModal isOpen={!!permissionError} closeModal={() => setSharingErrors()} />
        <SideDrawer
          activeParticipants={activeParticipants}
          onParticipantsClick={openParticipantsPanel}
          onSettingsClick={openSettingsPanel}
          onExitConfirm={exit}
        />

        {/* Commenting out mobile-only interaction for mvp */}
        {/* {!isDesktop && <ActionBar ref={actionBarRef} />} */}
        {/* {!isDesktop && (
          <div ref={mobileTopRef} className={confStyles.topBarContainer}>
            <MobileTopBar visible={showBars} />
          </div>
        )} */}
        {/* <Space style={{ display: 'grid', gridTemplateRows: 'auto 1fr', height: '100%' }}>
          {!isDesktop && (
            <Space
              fw={!isTablet && isPortrait}
              className={cx(
                confStyles.bottomDrawer,
                import.meta.env.VITE_STREAMING && !isTablet && confStyles.extended,
                isBottomDrawerOpen && confStyles.active,
                !isTablet && confStyles.smartphones,
              )}
            />
          )}
        </Space> */}
        {/* {isMobileSmall && !showBars && (
          <div
            className={cx(confStyles.actionDetector)}
            onTouchStartCapture={() => {
              setShowBars(true);
            }}
          />
        )} */}
      </div>
    </ConferenceComponent>
  );
};

type CollapsiblePanelProps = {
  onInviteCoHostClick: () => void;
  isPresentationActive: boolean;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

const CollapsiblePanel = ({ onInviteCoHostClick, isPresentationActive, isOpen, setIsOpen }: CollapsiblePanelProps) => {
  const { participants } = useParticipants();

  const intl = useIntl();

  return (
    <div className={styles.collapsiblePanel}>
      <Space
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Space
          style={{
            display: 'flex',
            gap: 16,
            alignItems: 'center',
          }}
        >
          <Text type="h6" color="white">
            {intl.formatMessage({ id: 'hostLabel' })}
          </Text>
          <Text type="subtitleSmall" color="white">
            {participants.length === 1 ? '1 presenter' : `${participants.length} presenters`}
          </Text>
        </Space>
        <IconButton
          onClick={() => setIsOpen(!isOpen)}
          icon={isOpen ? 'chevronUp' : 'chevronDown'}
          backgroundColor="grey.800"
        />
      </Space>
      <Space style={{ display: isOpen ? 'block' : 'none', paddingBottom: 28, maxHeight: 330, overflow: 'scroll' }}>
        <PresentersGrid
          localText={intl.formatMessage({ id: 'you' })}
          testID="PresentersGrid"
          onInviteCoHostClick={onInviteCoHostClick}
          forceShowAvatar={!isPresentationActive}
        />
      </Space>
    </div>
  );
};

const NoConfView = () => {
  return (
    <Space fh fw>
      <EventCoHost />
    </Space>
  );
};

const HostView = () => {
  const { conference } = useConference();

  if (conference) {
    return <ConfView />;
  }
  return <NoConfView />;
};

export default HostView;
