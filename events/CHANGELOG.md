# comms-app-react-events

## 1.2.0

### Minor Changes

- 399b73ce: - Refactor PubNub code
  - Add "Host"/"(You)" labels to chat messages
- 9c8b784e: Add Pubnub keys to netlify one-click-deploy to allow using new chat features through one click deploy
- 3fda9630: Implement promoting viewers to host
- ca523864: Add viewers to participants list

### Patch Changes

- fd0e2185: Added analytics tracking component info for events app
- 91e4e03f: Do not show the T-2 notification in ungated demo
- 9589ce01: Added the testid for chat components
- de4f87ee: Reorder things in read me to make OCD more prominent
- 7f38cc1d: Cleanup on refresh or exit
- 29627e4a: Add warning caption to inform user that app is awaiting for camera and microphone initialization
- 3ed6dd33: Bug Fix for new host joins notification

  - Filter out "Mixer joined as a host."
  - Show Notification for new host joined only on Host View.

- 88021f06: Fix spotlight for stage controls when onboarding
- faa68e2d: Fix viewer side drawer not opening
- 4c098c5f: Don't hide overlays
- 1900d2e9: Prevent screenshare request accepted modal from disappearing
- 642190c7: Fix viewer audio state
- b07749fb: Fix participants list not showing
- 2c408a4b: Fix UI/Controls shift from `Device Initialization` Warning label by adding absolute positioning.
- 9fa7af94: Bug fix for wrapping text/breaking long words on Messages
- 46d92261: Disable promoting to host if event is not live
- 6179da56: Filter out mixer participant from new host joined notification
- a3df07eb: Add in some notes on customising and extending the app
- b6e608e9: Chat design alignments

  - Show "No messages!" in the chat box when there are no messages
  - Add support for multi-line chat messages
  - Add a send button to the chat input

- 4d4552bb: Close "promote to host" dialog if event stops
- 9ab39dd3: Add in tooltips
- 2da37b70: cleanup on close or refresh
- 91b374f4: When a new host joins, all hosts should receive a toast notification that shows who joined.
- Updated dependencies [d7789fb4]
- Updated dependencies [3fda9630]
- Updated dependencies [e70fe30d]
  - @dolbyio/comms-uikit-react@1.0.0

## 1.1.0

### Minor Changes

- 22645038: - Adds a badge to the chat button showing the number of unread messages
  - Adds a button at the bottom of the chat that informs the user that there are unread messages. Clicking the button scrolls the chat to the bottom
  - Exports the `Badge` component from UI Kit
- d43caf7e: - Add chat message history
  - Upgrade Vite from 2.7.2 to 4.3.3
  - Upgrade Prettier from 2.5.1 to 2.8.8
- f569d652: Change structure to enable frontend and backend to run together easily
- d43caf7e: - Add ability for hosts to delete chat messages
- c16a826b: Update events app to run the backend server by default with a single script
- 840a4b7d: Simplify routes into:

  - `CreateEvent` - `/`
  - `Host` - `/:id`
  - `Viewer` - `/:id/watch`

  Other changes:

  - Remove the `ConferenceCreateHeader` and `ConferenceCreateFooter` components. These are now part of the new `JoinScreen` component.
  - Remove `useConferenceCreate` hook and its related context
  - Remove `useConferenceCleanup` hook
  - Remove `ConferenceCreate` folder in `routes`. I've extracted the `useCreateEventValidation` hook from this folder

- d43caf7e: Fix visual state of the microphone and camera buttons
- 545f1dcd: - Hide the Participants and Chat buttons in the viewer if the event isn't live
  - When using the `env` utility function, if the environment variable is not found, we no longer throw an error. This was done because omitting the new PubNub environment variables shouldn't block `api-proxy` or `events` from starting.
  - Because of the above, I've also refactored `api-proxy` a bit so that each file in `routes` exports a factory function that returns an Express router. Doing it this way lets us pass in the environment variables which provides better type safety and allows the consumer (in this case, `getApp()`) to handle missing environment variables.
  - Make `subscribe` in `CommsProvider` use `useCallback` to prevent subscriptions from unsubscribing and resubscribing

### Patch Changes

- c9de6141: Handle invalid PubNub keys
- feade147: Added data-testid for chat component elements
- 96f5021e: Change default value for the proxy server to reflect the netlify environment
- 8fff03d3: Update error message for invalid dolby.io keys
- Updated dependencies [22645038]
- Updated dependencies [da5f8916]
- Updated dependencies [d43caf7e]
- Updated dependencies [d43caf7e]
- Updated dependencies [e7a044f0]
- Updated dependencies [545f1dcd]
- Updated dependencies [695a9a5c]
  - @dolbyio/comms-uikit-react@0.9.1
