import { OnboardingStep } from '@components/Onboarding/Onboarding';

export const hostPreLiveSteps: OnboardingStep[] = [
  {
    title: 'Pre-Live session',
    content: () => (
      <ul style={{ margin: 0, padding: '0 var(--spaces-m)' }}>
        <li>Your event has not started.</li>
        <li>Meet with your co-hosts and prepare for your live event.</li>
      </ul>
    ),
  },
  {
    target: 'stageControls',
    title: 'Control bar',
    content: () => <>Mute your camera and mic, and share your screen.</>,
    position: 'bottom',
  },
  {
    target: 'recordButton',
    title: 'Event recording',
    content: () => <>Recording is disabled for this demo experience.</>,
    position: 'bottom',
  },
  {
    target: 'timer',
    title: 'Timer',
    content: () => <>Event duration timer.</>,
    position: 'bottom',
  },
  {
    target: 'participantsButton',
    title: 'Total participants',
    content: () => <>See all co-hosts and viewers.</>,
    position: 'left',
    align: 'start',
  },

  {
    target: 'inviteButton',
    title: 'Invite participants',
    content: () => <>Add more co-hosts and viewers.</>,
    position: 'left',
    align: 'end',
  },

  {
    target: 'settingsButton',
    title: 'Settings',
    content: () => <>View and adjust settings.</>,
    position: 'left',
    align: 'end',
  },
  {
    target: 'leaveEventButton',
    title: 'Exit',
    content: () => <>Exit event.</>,
    position: 'left',
    align: 'end',
  },
  {
    target: 'hostPanel',
    title: 'Host & Co-host bar',
    content: () => <>View your co-hosts, share your screen, and turn your camera and mic off/on.</>,
    position: 'top',
  },
  {
    target: 'rtsButton',
    title: 'Go live',
    content: () => <>Click here to start your live event.</>,
    position: 'bottom',
    align: 'end',
  },
];
