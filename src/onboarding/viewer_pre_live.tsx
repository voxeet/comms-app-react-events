import { OnboardingStep } from '@components/Onboarding/Onboarding';

export const viewerPreLiveSteps: OnboardingStep[] = [
  {
    title: 'Event is not live',
    content: () => <>Your event has not started.</>,
  },
];
