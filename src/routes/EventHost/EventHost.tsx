/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-nested-ternary */
// TODO add error handling that isn't console.log

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
  Icon,
  Button,
} from '@dolbyio/comms-uikit-react';
import useConferenceCreate from '@hooks/useConferenceCreate';
import { useLiveStreaming } from '@hooks/useLiveStreaming';
import { usePageRefresh } from '@hooks/usePageRefresh';
import { useRealTimeStreaming } from '@hooks/useRealTimeStreaming';
import { InviteParticipants } from '@src/components/InviteParticipants';
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
import cx from 'classnames';
import { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate, useParams } from 'react-router-dom';

import { EventCoHost } from '../EventCoHost/EventCoHost';

import { CollapsiblePanel } from './CollapsiblePanel/CollapsiblePanel';
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
      <ParticipantVideo testID="ParticipantVideo" participant={participant} style={{ flexGrow: 1 }} />
      {showShareLinks && (
        <div data-tesid="FirstParticipantConatiner" className={styles.shareLinksContainer}>
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
            <IconButton
              testID="ConatinerClose"
              icon="close"
              backgroundColor="grey.800"
              onClick={() => toggleShowShareLinks(false)}
            />
          </div>
          <Text testID="EventTitleLabel">Event Title ID</Text>
          <Text testID="MeetingName" style={{ color: 'var(--colors-grey-400)' }}>
            {meetingName}
          </Text>
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
  const { isMobileSmall } = useTheme();
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
  const [isStopScreenShareModalVisible, setIsStopScreenShareModalVisible] = useState(false);
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

  const openStopScreenShareModal = () => {
    setIsStopScreenShareModalVisible(true);
  };

  const closeStopScreenShareModal = () => {
    setIsStopScreenShareModalVisible(false);
  };

  const confirmStopScreenShare = () => {
    closeStopScreenShareModal();
    stopScreenShare();
  };

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

  return (
    <ConferenceComponent id={conference?.id}>
      <div className={styles.pageLayout}>
        <div className={styles.header}>
          <TopBar isLive={isRtsLive} isLoading={isRtsLoading} onStreamClick={toggleRts} joinType="host" />
        </div>
        <div className={styles.main}>
          {(!isRtsLive || isLocalUserPresentationOwner) && (
            <div className={styles.banners}>
              {!isRtsLive && (
                <div data-testid="NotLiveBanner" className={cx(styles.banner, styles.notLiveBanner)}>
                  <Text>This event {`hasn't`} started yet</Text>
                </div>
              )}
              {isLocalUserPresentationOwner && (
                <div className={cx(styles.banner, styles.screenSharingBanner)}>
                  <div className={styles.left}>
                    <Icon name="present" size="m" />
                    <Text>{intl.formatMessage({ id: 'screenSharing' })}</Text>
                    <Icon name="circle" size="xxxs" color="#00B865" />
                  </div>
                  <Button style={{ height: 32 }} onClick={openStopScreenShareModal}>
                    <Text type="captionSmallDemiBold">{intl.formatMessage({ id: 'stopSharing' })}</Text>
                  </Button>
                </div>
              )}
            </div>
          )}
          {/* {!isPresentationActive ? <ParticipantsGrid localText="You" /> : null} */}
          <div className={styles.stage}>
            {!isRtsLive && participants.length === 1 && !isPresentationActive ? (
              <SingleHostPresent meetingName={params.id} participant={participants[0]} />
            ) : !isPresentationActive ? (
              <ParticipantsGrid localText="You" />
            ) : null}
            {isPresentationActive ? (
              <ScreenSharingPresentationBox
                fallbackText={intl.formatMessage({ id: 'screenShareDefaultFallbackText' })}
                fallbackButtonText={intl.formatMessage({ id: 'tryAgain' })}
                style={{
                  backgroundColor: 'black',
                }}
              />
            ) : null}
          </div>
          <div data-testid="CollapsiblePanel" className={styles.hostPanel}>
            <CollapsiblePanel
              onInviteCoHostClick={openInviteCoHostModal}
              isPresentationActive={isPresentationActive}
              isOpen={isHostPanelOpen}
              onOpenClick={() => setIsHostPanelOpen(!isHostPanelOpen)}
            />
          </div>
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
          <Space className={styles.pendingTakeoverBar} mt="s">
            <PendingTakeoverInfoBar />
          </Space>
        )}
        {!isLocalUserRecordingOwner && recordingStatus === RecordingStatus.Active && (
          <Space className={styles.pendingTakeoverBar} mt="s">
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
          testID="InviteParticipantsModel"
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
        <Modal
          testID="StopScreenShareModal"
          isVisible={isStopScreenShareModalVisible}
          close={closeStopScreenShareModal}
          modalWidth={375}
          closeButton
          overlayClickClose
        >
          <div className={styles.stopScreenShareModal}>
            <Text testID="Header" type="H2" color="grey.100">
              {intl.formatMessage({ id: 'stopScreenSharing' })}
            </Text>
            <Text align="center" type="bodyDefault" color="grey.100">
              {intl.formatMessage({ id: 'stopScreenSharingModalDesc' })}
            </Text>
            <Button style={{ height: 32 }} onClick={confirmStopScreenShare}>
              <Text type="captionSmallDemiBold">{intl.formatMessage({ id: 'stopSharing' })}</Text>
            </Button>
          </div>
          {/* <ModalContentBase
            buttons={[
              {
                onClick: confirmStopScreenShare,
                label: intl.formatMessage({
                  id: 'stopScreenSharing',
                }),
              },
            ]}
            headline={intl.formatMessage({ id: 'stopScreenSharing' })}
            description={intl.formatMessage({ id: 'stopScreenSharingModalDesc' })}
          /> */}
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
