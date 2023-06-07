# Dolby.io Live Events React App

## Overview

This project demonstrates what an events experience is like, built using React.

<p align="center">
    <img src="./events/documentation/banner.jpg" />
</p>

| Intended use   | Features                                | Tech stack            |
| -------------- | --------------------------------------- | --------------------- |
| Live Events    | create, start, stream and stop an event | Typescript/Javascript |
| Webinars       | A/V controls for hosts and viewers      | HTML/CSS              |
| Virtual events | Mute camera and microphone              | React                 |
|                | Screen share                            |                       |
|                | Invite co-hosts and viewers             |                       |
|                | Event Recording                         |                       |
|                | Participant List                        |                       |
|                | Chat with other participants*           |                       |
|                | Promote a viewer to co-host*            |                       |

> * Requires a PubNub account to work on these features.

## Requirements and supported platforms

The app currently supports

* Chrome 100+
* Edge 100+
* Safari 111+
* Firefox 16.3+

## Run the demo directly

You can deploy the Dolby.io Virtual Events app without needing to clone and build the app using the Deploy to Netlify button. You will need:

* A Netlify account to which you're logged into
* Your Dolby.io App key and secret
* [Optional] Publisher and Subcriber tokens, along with the secret key for PubNub. This is only needed if you would like to experience chat and promoting viewers to host.

Refer to [this guide](#how-to-get-a-dolbyio-account) on how to obtain your Dolby.io tokens and [this guide from PubNub](https://www.pubnub.com/tutorials/javascript-sdk-chat-app/?step=set-up-environment) on how to obtain your PubNub tokens.

[![Deploy to Netlify from fork](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/dolbyio-samples/comms-app-react-events)

## Running locally

Please see [the events package readme](./events/README.md) for information on how to run the app locally.

### How to get a Dolby.io account

To setup your Dolby.io account, go to the [Dolby.io dashboard](https://dolby.io) and register for an account. After confirming your email address, you will be logged in.

> If you did not receive a verification email, check your Spam or Junk email folders.

## More resources

Want to experience the app without building it? Try our Virtual Events [Demo app](https://events.experience.dolby.io).

Looking for more sample apps and projects? Head to the [Dolby.io Project Gallery](https://docs.dolby.io/communications-apis/page/gallery).