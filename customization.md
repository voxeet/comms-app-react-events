# Making the events app your own

## Changing the labels in the app

To change the labels in the app, you can modify [en.json](events/src/translations/en.json) and change the labels as necessary.
To add a new string, add a new key-value pair to the JSON file. You can then reference that new key in the code as follows:

```javascript

// en.json
{
    //... other keys
    "yourNewKey" : "your new value",
}

// your own code file
import {Text} from '@dolbyio/comms-uikit-react';

<Text labelKey="yourNewKey" type="H2" />

```

## Add a company logo

To add a company logo in place of our placeholder `logo` in the events app, you need to modify the `TopBar` component located under [Components](src/components/TopBar/TopBar.tsx). Replace the following lines of code with your own `<img >`

```javascript
// replace the following lines of code
<Pill
    size="l"
    style={{ minWidth: 122, height: 30, borderRadius: 6, backgroundColor: getColor('grey.800') }}
    text="Logo"
    testID="Logo"
/>

// To something like this
<img src='/path/to/your/image' />
// You will need to wrap your `img` in a div tag to make sure it fits in fine and doesn't bloat the size of the TopBar.
```

## Enabling chat and promoting a viewer to co-host

The chat and "promoting a viewer to a co-host" features in this sample app are powered by [PubNub](https://www.pubnub.com). PubNub allows us to asynchronously send messages across all instances of an event with low latency and thus offering a compelling experience. You can get started with PubNub by following [this guide](https://www.pubnub.com/docs/general/basics/set-up-your-account).

To set up chat in this application, simply configure these three variables in your [.env](.env) file, as shown in the image.

```bash
# These are your pubnub credentials for enabling chat
PUBNUB_PUBLISH_KEY=YOUR_PUBNUB_PUBLISH_KEY
PUBNUB_SUBSCRIBE_KEY=YOUR_PUBNUB_SUBSCRIBE_KEY
PUBNUB_SECRET_KEY=YOUR_PUBNUB_SECRET_KEY
```

![PubNub keys](documentation/pubnub_keys.png)

The code for the chat feature can be found in the [Chat component](src/components/SideDrawer/ContentTypes/Chat/) directory along with the [useChat](src/hooks/useChat.ts) hook.

## Customizing the App Theme

The app theme is controlled by the [Dolby.io UI Kit](https://www.npmjs.com/package/@dolbyio/comms-uikit-react). Refer to [this guide](https://github.com/DolbyIO/comms-uikit-react/blob/main/documentation/providers/ThemeProvider.md) on how to stylize your app.

## Customizing the viewer layout

You can re-arrange the rendered layout for your viewers by configuring the Communications API Mixer app. A mixer app is a web app based on the Dolby.io communications APIs that composes multiple streams of videos into a single stream and passes that on to any RTMP or webRTC based consumer. Refer to this [blog](https://dolby.io/blog/creating-a-custom-mixer-layout-for-streaming-a-conference/) for more details.
