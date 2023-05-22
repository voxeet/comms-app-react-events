import { OnboardingStep } from '@components/Onboarding/Onboarding';

export const viewerLiveSteps: OnboardingStep[] = [
  {
    title: 'Live event',
    content: () => <>The event is now live and streaming from your host.</>,
  },
  {
    target: 'viewerControls',
    title: 'Viewer controls',
    content: () => <>Turn off/on the live event audio and video.</>,
    position: 'top',
  },
  {
    target: 'participantsButton',
    title: 'Total participants',
    content: () => <>See all co-hosts and viewers.</>,
    position: 'left',
    align: 'start',
  },
  {
    target: 'chatButton',
    title: 'Chat',
    content: () => <>Chat with viewers and co-hosts.</>,
    position: 'left',
    align: 'start',
  },
  {
    target: 'leaveEventButton',
    title: 'Exit',
    content: () => <>Exit event.</>,
    position: 'left',
    align: 'end',
  },
];
