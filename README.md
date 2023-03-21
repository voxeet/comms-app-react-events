# Dolby.io Events React App

**ALL LINKS ARE DUD**

## Overview

This project demonstrates what a simple video meeting experience is like, built using React.

| Intended use   | Features                     | Tech stack            |
| -------------- | ---------------------------- | --------------------- |
| Events         | RTS Start/Stop (placeholder) | React                 |
| Webinars       |                              | Typescript/Javascript |
| Virtual events |                              | HTML/CSS              |

Want to learn more? Check out the [Video Call App Project Gallery page](https://docs.dolby.io/communications-apis/docs/video-call).

## Getting Started

The following steps will quickly get you started testing the Dolby.io Communications APIs capabilities.

### Pre-requisites

To get started building this app you will need a Dolby.io account and access token. You will also need the following -

- NPM v8.11
- Yarn v 1.22.19
- Node v18.0.0

#### How to get a Dolby.io account

To setup your Dolby.io account, go to [Dolby.io dashboard](https://dashboard.dolby.io) and complete the form. After confirming your email address, you will be logged in.

#### How to obtain access token

You will need to generate a client access token to run this app. Follow the steps to obtain a token.

1. Go to the _Dashboard_, and find the _Launch Demos_ button.
   ![dashboard](documentation/assets/Dashboard.png)
2. On the next screen, there is a token field where you can copy the client access token to your clipboard. The generated token is active for 12 hours.
   ![token](documentation/assets/apps-dashboard.png)

## How to run the Events app

Run the following steps after cloning the repository to run the application locally.

### Install dependencies

**note** : This guide is written with [Yarn](https://yarnpkg.com/) in mind.

Open a terminal window in the root directory of your project folder. Install the project's dependencies using the following command.

```bash
yarn
```

### Setup your .env file

Rename the `.env.example` file in the repository to `.env`.

Get your client access token from your Dolby.io dashboard, as described above. Assign `VITE_CLIENT_ACCESS_TOKEN` the client token you grabbed in the [How to obtain an access token](#how-to-obtain-access-token) step.

** TODO ** Fill in additional configurations file.

### Start the app

Execute the following command to run the application locally.

```bash
yarn dev
```

### Ready.dolby.io (placeholder)

In order to experience the backend functinonality and experience the entire RTS experience, you need to start the proxy server.

Refer to the [API server proxy guide](../api-proxy/README.md) on how to setup and start the proxy server.

### Running both frontend and backend apps together

From the `examples/videocall` directory, run `yarn dev-proxy` to run both the front end and backend apps together.

### Open the app in a browser

After the appropriate message appears in the terminal window, open <http://localhost:3000/event> in the browser. The application will launch at this address.

**note** The default route that the app follows is `/conference`. This needs to be updated to `/event` in order to experience the events flow.

## Known issues and limitations

## Requirements and supported platforms

Video Conference Call App supports four main browsers

- Chrome 100+
- Safari 15+
- Firefox 100+
- Edge 100+

## More resources

Looking for more sample apps and projects? Head to the [Project Gallery](https://docs.dolby.io/communications-apis/page/gallery).
