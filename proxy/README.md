# API Proxy setup

Use this proxy server sample code to connect your Dolby.io communications API based project to our backend services and correctly handle POST requests for features such as starting and stopping RTMP or RTS streams. You can read our [guide on webinars and virtual events](https://docs.dolby.io/communications-apis/page/webinars-and-virtual-events) to understand in more detail about RTMP and RTS based streams.

## Setup

**note** This guide is written with [Yarn](https://yarnpkg.com) in mind.

> All instructions listed here assume that this `api-proxy` directory is the root.

1. Run the following command to install all necessary dependencies:

```bash
yarn
```

1. Rename the [.env.example](.env.example) file to `.env`, then add your `KEY` and `SECRET`.

### How to obtain App Key and Secret

You can obtain your app key and secret to run this app from the [Dolby.io dashboard](dashboard.dolby.io). Follow the steps to obtain them.

1. Go to the _Dashboard_, and click on the `API Keys` next to your application.
   ![dashboard](docs/img/dashboard.png)
2. On the next screen, copy the `App key` and `App secret` and paste them in your `.env` file against the marked variables.
   ![token](docs/img/client_access_token.png)

3. You can start the proxy server by running the following command.

```bash
yarn dev
```

4. Observe the traffic on your terminal window. A sample log snippet is presented here.

```bash
[0] 2:28:03 pm - Found 0 errors. Watching for file changes.
[1] Debugger listening on ws://127.0.0.1:9229/ee1f05df-66b8-44c9-b99c-e4952c0d7641
[1] For help, see: https://nodejs.org/en/docs/inspector
[1] Debugger listening on ws://127.0.0.1:9229/13a22631-75dd-4bb1-85ee-37f1a168cbb9
[1] For help, see: https://nodejs.org/en/docs/inspector
[1] Listening at http://localhost:4000/
[1] [POST] 200 - https://api.dolby.io/v1/auth/token
[1] [POST] 200 - https://comms.api.dolby.io/v2/conferences/mix/your-conference-id/rtmp/start
[1] [POST] 200 - https://api.dolby.io/v1/auth/token
[1] [POST] 200 - https://comms.api.dolby.io/v2/conferences/mix/your-conference-id/rtmp/stop
```

You should observe two things once your proxy service has started -

- An open Websocket connection (i.e. port 9229) that receives notifications from the Dolby.io backend.
- A listener on the port number configured in your env (i.e. 4000, as specified by default in the `.env.example` file) that communicates with your front end application.

You will still need to start your application (port 3000 by default) that will communicate with this API proxy service.
