import { OnboardingStep } from '@components/Onboarding/Onboarding';

export const hostLiveSteps: OnboardingStep[] = [
  {
    title: 'Live event',
    content: () => <>The event is now live and streaming to your viewers.</>,
  },
  {
    target: 'rtsButton',
    title: 'Stop live event',
    content: () => <>This will stop the event for viewers. You can still interact with co-hosts.</>,
    position: 'bottom',
    align: 'end',
  },
];
