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

4. Observe the traffic on your terminal window, looking for the line

```bash
[1] Listening at http://localhost:4000/
```

You will still need to start your application (port 3000 by default) that will communicate with this API proxy service.
