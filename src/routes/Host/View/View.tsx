// TODO add error handling that isn't console.log

import AllowAudioModal from '@components/AllowAudioModal';
import { InviteParticipants } from '@components/InviteParticipants';
import { MediaDock } from '@components/MediaDock/MediaDock';
import ModalContentBase from '@components/ModalContentBase';
import { Onboarding } from '@components/Onboarding/Onboarding';
import PendingTakeoverInfoBar from '@components/PendingTakeoverInfoBar';
import ScreenSharingPermissionModal from '@components/ScreenSharingPermissionModal/ScreenSharingPermissionModal';
import SideBar from '@components/SideBar';
import { SideDrawer } from '@components/SideDrawer';
import Text from '@components/Text';
import { TopBar } from '@components/TopBar/TopBar';
import {
  Conference as ConferenceComponent,
  InfoBar,
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
  useVideo,
  Modal,
  useNotifications,
  ParticipantsGrid,
  Icon,
  Button,
  useMessage,
  ScreenShareTakeoverMessages,
} from '@dolbyio/comms-uikit-react';
import { useActiveParticipants } from '@hooks/useActiveParticipants';
import { useChat } from '@hooks/useChat';
import useDrawer from '@hooks/useDrawer';
import { useRealTimeStreaming } from '@hooks/useRealTimeStreaming';
import useSDKErrorHandler from '@hooks/useSDKErrorsHandler';
import { SideDrawerContentTypes } from '@src/context/SideDrawerContext';
import { hostLiveSteps } from '@src/onboarding/host_live';
import { hostPreLiveSteps } from '@src/onboarding/host_pre_live';
import getProxyUrl from '@src/utils/getProxyUrl';
import { useDebounce } from '@src/utils/misc';
import { getHostPath, getViewerPath } from '@src/utils/route';
import cx from 'classnames';
import { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';

import { CollapsiblePanel } from './CollapsiblePanel/CollapsiblePanel';
import { ShareLinks } from './ShareLinks/ShareLinks';
import styles from './View.module.scss';

type ViewProps = {
  onExit: () => void;
};

export const View = ({ onExit }: ViewProps) => {
  const { openDrawer } = useDrawer();
  const params = useParams();
  const { conference, leaveConference } = useConference();
  const { activeParticipants } = useActiveParticipants();
  const { participant, participants } = useParticipants();
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
  const { showSuccessNotification, showErrorNotification } = useNotifications();
  const { message, sender, sendMessage, clearMessage } = useMessage();
  const { messages, sendMessage: sendGeneralChatMessage } = useChat();
  const intl = useIntl();
  const [isHostPanelOpen, setIsHostPanelOpen] = useState(false);
  const {
    status: screenSharingStatus,
    permissionError,
    setSharingErrors,
    isLocalUserPresentationOwner,
    isPresentationModeActive,
    startScreenShare,
    stopScreenShare,
  } = useScreenSharing();
  const { status: recordingStatus, ownerId, isLocalUserRecordingOwner, stopRecording } = useRecording();
  const [isStopScreenShareModalVisible, setIsStopScreenShareModalVisible] = useState(false);
  const [inviteModalState, setInviteModalState] = useState({ open: false, showViewerLink: false });
  const [takeoverStatus, setTakeoverStatus] = useState<'none' | 'request' | 'pending' | 'accepted'>();
  const [screenShareRequests, setScreenShareRequests] = useState<Set<string>>(new Set());
  const [showShareLinks, setShowShareLinks] = useState(true);
  const [isStageControlsVisible, setIsStageControlsVisible] = useState(false);
  const [showPreLiveOnboarding, setShowPreLiveOnboarding] = useState(true);
  const [showLiveOnboarding, setShowLiveOnboarding] = useState(false);

  const cleanup = useCallback(() => {
    if (isLocalUserRecordingOwner) {
      stopRecording();
    }
    if (isLocalUserPresentationOwner) {
      stopScreenShare();
    }
    if (participants.length === 1 && isRtsLive) {
      stopRealTimeStreaming();
    }
    leaveConference();
  }, [
    isLocalUserPresentationOwner,
    isLocalUserRecordingOwner,
    isRtsLive,
    leaveConference,
    participants.length,
    stopRealTimeStreaming,
    stopRecording,
    stopScreenShare,
  ]);

  useSDKErrorHandler(cleanup, cleanup);

  useEffect(() => {
    document.title = `${document.title} - ${params.id}`;
    return () => {
      // eslint-disable-next-line prefer-destructuring
      document.title = document.title.split(' - ')[0];
    };
  }, [params.id]);

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
  }, [isVideo, localCamera, selectCamera]);

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
  }, [localMicrophone, isAudio, selectMicrophone]);

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
  }, [localSpeakers, selectSpeaker]);

  useEffect(() => {
    if (message?.type === ScreenShareTakeoverMessages.REQUEST && sender?.info.name && isLocalUserPresentationOwner) {
      screenShareRequests.add(sender.info.name);
      setScreenShareRequests(new Set(screenShareRequests));
    } else if (message?.type === ScreenShareTakeoverMessages.ACCEPT && message?.user === participant?.info.name) {
      setTakeoverStatus('accepted');
    } else if (message?.type === ScreenShareTakeoverMessages.DECLINE && message?.user === participant?.info.name) {
      showErrorNotification(intl.formatMessage({ id: 'requestDeclined' }));
      setTakeoverStatus('none');
    }
    clearMessage();
    // TODO solve perf issue
    // exhaustive deps here caused a large perf issue
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message]);

  useEffect(() => {
    if (screenSharingStatus !== ShareStatus.Active) {
      setTakeoverStatus('none');
      setScreenShareRequests(new Set());
    }
  }, [screenSharingStatus]);

  useEffect(() => {
    setShowLiveOnboarding(isRtsLive);
  }, [isRtsLive]);

  const isPresentationActive =
    screenSharingStatus === ShareStatus.Active || (isLocalUserPresentationOwner && isPresentationModeActive);

  const startShare = async () => {
    setTakeoverStatus('none');
    const success = await startScreenShare();
    if (success) {
      showSuccessNotification(intl.formatMessage({ id: 'presentingSuccessfully' }));
    }
  };

  const stopShare = async () => {
    await stopScreenShare();
    showSuccessNotification(intl.formatMessage({ id: 'screenSharingStopped' }));
  };

  const toggleScreenShare = () => {
    if (screenSharingStatus === ShareStatus.Active && isLocalUserPresentationOwner) {
      setIsStopScreenShareModalVisible(true);
      return;
    }

    if (screenSharingStatus === ShareStatus.Active) {
      setTakeoverStatus('request');
      return;
    }

    startShare();
  };

  const requestTakeover = () => {
    sendMessage({ type: ScreenShareTakeoverMessages.REQUEST });
    setTakeoverStatus('pending');
  };

  const acceptTakeover = async (requester: string) => {
    screenShareRequests.delete(requester);
    const declinees = new Set(screenShareRequests);
    setScreenShareRequests(new Set());
    await stopShare();
    sendMessage({
      type: ScreenShareTakeoverMessages.ACCEPT,
      user: requester,
    });
    for (const declinee of declinees.values()) {
      sendMessage({
        type: ScreenShareTakeoverMessages.DECLINE,
        user: declinee,
      });
    }
  };

  const declineTakeover = async (user: string) => {
    screenShareRequests.delete(user);
    setScreenShareRequests(new Set(screenShareRequests));
    await sendMessage({
      type: ScreenShareTakeoverMessages.DECLINE,
      user,
    });
  };

  const confirmStopScreenShare = () => {
    setIsStopScreenShareModalVisible(false);
    stopScreenShare();
  };

  const openParticipantsPanel = () => {
    openDrawer(SideDrawerContentTypes.PARTICIPANTS);
  };

  const openChatPanel = () => {
    openDrawer(SideDrawerContentTypes.CHAT);
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

  const exit = () => {
    cleanup();
    onExit();
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

  const hideStageControls = useDebounce(() => {
    setIsStageControlsVisible(false);
  }, 2000);

  const showStageControls = () => {
    setIsStageControlsVisible(true);
    hideStageControls();
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
            </div>
          )}
          <div className={styles.stage} data-testid="mainView">
            <div className={styles.left} onMouseMove={showStageControls}>
              {!isPresentationActive && <ParticipantsGrid testID="VideoGridBox" localText="You" />}
              {isPresentationActive && (
                <ScreenSharingPresentationBox
                  fallbackText={intl.formatMessage({ id: 'screenShareDefaultFallbackText' })}
                  fallbackButtonText={intl.formatMessage({ id: 'tryAgain' })}
                  style={{
                    backgroundColor: 'black',
                  }}
                />
              )}
              <div
                className={cx(
                  styles.stageControls,
                  (isStageControlsVisible || showPreLiveOnboarding) && styles.visible,
                )}
              >
                {screenSharingStatus === ShareStatus.Active && isLocalUserPresentationOwner && (
                  <div className={styles.screenShareStatus}>
                    <Icon testID="ScreenShareIcon" name="present" size="m" />
                    <Text testID="ScreenShareLabel">{intl.formatMessage({ id: 'screenSharing' })}</Text>
                    <Icon testID="ScreenShareStatus" name="circle" size="xxxs" color="#00B865" />
                  </div>
                )}
                <div id="stageControls" className={styles.controls} onFocus={showStageControls}>
                  <MediaDock onScreenShareClick={toggleScreenShare} />
                </div>
              </div>
            </div>
            {!isRtsLive && participants.length === 1 && !isPresentationActive && showShareLinks && (
              <ShareLinks meetingName={params.id} onCloseClick={() => setShowShareLinks(false)} />
            )}
          </div>
          <div id="hostPanel" data-testid="CollapsiblePanel" className={styles.hostPanel}>
            <CollapsiblePanel
              isOpen={isHostPanelOpen}
              isAskForShareVisible={takeoverStatus === 'accepted'}
              isPresentationActive={isPresentationActive}
              screenShareRequests={Array.from(screenShareRequests.values())}
              onOpenClick={() => setIsHostPanelOpen(!isHostPanelOpen)}
              onInviteCoHostClick={openInviteCoHostModal}
              onTakeoverAccept={acceptTakeover}
              onTakeoverDecline={declineTakeover}
              onAskForShareAccept={toggleScreenShare}
              onAskForShareCancel={() => setTakeoverStatus('none')}
              onScreenShareClick={toggleScreenShare}
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
            onChatClick={openChatPanel}
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
        {takeoverStatus === 'pending' && (
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
        {!(showPreLiveOnboarding || showLiveOnboarding) && <AllowAudioModal />}
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
          testID="ScreenSharingTakeOverModal"
          isVisible={takeoverStatus === 'request'}
          close={() => setTakeoverStatus('none')}
          closeButton
        >
          <ModalContentBase
            buttons={[
              {
                onClick: requestTakeover,
                label: intl.formatMessage({ id: 'askForPermission' }),
                testID: 'AskForPermissionButton',
              },
              {
                onClick: () => setTakeoverStatus('none'),
                label: intl.formatMessage({ id: 'cancel' }),
                variant: 'secondary',
                testID: 'CancelButton',
              },
            ]}
            headline={intl.formatMessage({ id: 'someoneElseIsPresenting' })}
            description={intl.formatMessage({ id: 'screenSharingPermissionDesc' })}
            headerLogo="present"
          />
        </Modal>
        <Modal
          testID="StopScreenShareModal"
          isVisible={isStopScreenShareModalVisible}
          close={() => setIsStopScreenShareModalVisible(false)}
          modalWidth={375}
          closeButton
          overlayClickClose
        >
          <div className={styles.stopScreenShareModal}>
            <Text testID="Header" type="H2" color="grey.100">
              {intl.formatMessage({ id: 'stopScreenSharing' })}
            </Text>
            <Text testID="Description" align="center" type="bodyDefault" color="grey.100">
              {intl.formatMessage({ id: 'stopScreenSharingModalDesc' })}
            </Text>
            <Button testID="ConfirmStopSharing" style={{ height: 32 }} onClick={confirmStopScreenShare}>
              <Text type="captionSmallDemiBold">{intl.formatMessage({ id: 'stopSharing' })}</Text>
            </Button>
          </div>
        </Modal>
        <ScreenSharingPermissionModal isOpen={!!permissionError} closeModal={() => setSharingErrors()} />
        <SideDrawer
          activeParticipants={activeParticipants}
          messages={messages}
          onMessageSubmit={sendGeneralChatMessage}
          onParticipantsClick={openParticipantsPanel}
          onChatClick={openChatPanel}
          onSettingsClick={openSettingsPanel}
          onExitConfirm={exit}
        />
        {showPreLiveOnboarding && (
          <Onboarding name="hostPreLive" steps={hostPreLiveSteps} onComplete={() => setShowPreLiveOnboarding(false)} />
        )}
        {showLiveOnboarding && !showPreLiveOnboarding && (
          <Onboarding name="hostLive" steps={hostLiveSteps} onComplete={() => setShowLiveOnboarding(false)} />
        )}
      </div>
    </ConferenceComponent>
  );
};
