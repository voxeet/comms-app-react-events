import { OnboardingStep } from '@components/Onboarding/Onboarding';

export const hostSetupSteps: OnboardingStep[] = [
  {
    target: 'inviteParticipants',
    title: 'Setup and invite',
    content: () => (
      <>
        Invite co-hosts and viewers
        <br />
        <br />
        Tap the &quot;Enter session&quot; button to enter your &quot;Pre-Live Session&quot;.
      </>
    ),
    position: 'left',
  },
];
