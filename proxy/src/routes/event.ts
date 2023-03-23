// import { authentication, communications, streaming } from '@dolbyio/dolbyio-rest-apis-client';
import express from 'express';

import { env } from '../utils/env';
import { processErrorStatus } from '../utils/errors';

const router = express.Router();

const KEY = env('KEY');
const SECRET = env('SECRET');

const baseUrl = 'https://api.dolby.io';
const commsBaseUrl = 'https://comms.api.dolby.io';

// this is mirroring the type from @dolbyio/dolbyio-rest-apis-client
export const authentication = {
  getApiAccessToken: async (key: string, secret: string, timeout?: number): Promise<string> => {
    const encodedParams = new URLSearchParams();
    encodedParams.set('grant_type', 'client_credentials');

    const res = await fetch(`${baseUrl}/v1/auth/token`, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/x-www-form-urlencoded',
        authorization: `Basic ${Buffer.from(`${key}:${secret}`).toString('base64')}`,
      },
      body: encodedParams,
    });
    if (res.status !== 200) {
      console.error({ status: res.status, statusText: res.statusText });
      return '';
    }

    const { access_token: accessToken } = await res.json();
    return accessToken;
  },
};

const options = (token: string, body: Record<string, unknown>) => ({
  method: 'POST',
  headers: {
    accept: 'application/json',
    'content-type': 'application/json',
    authorization: `Bearer ${token}`,
  },
  body: body ? JSON.stringify(body) : undefined,
});

// this is mirroring the type from @dolbyio/dolbyio-rest-apis-client
export const communications = {
  streaming: {
    startRts: async (token: string, conferenceId: string) => {
      const url = `${commsBaseUrl}/v3/conferences/mix/${conferenceId}/rts/start`;
      const res = await fetch(url, options(token, { data: { layoutUrl: 'default' } }));

      if (res.status !== 200) {
        // TODO return error
        return {};
      }

      return res.json();
    },
    stopRts: async (token: string, conferenceId: string) => {
      const url = `${commsBaseUrl}/v3/conferences/mix/${conferenceId}/rts/stop`;
      return fetch(url, options(token, {}));
    },
  },
};

router.post('/event_start', async ({ body }, res) => {
  const { conferenceId } = body;
  if (!conferenceId) {
    return res.status(400).json({ error: 'Missing necessary parameters' });
  }
  try {
    const token = await authentication.getApiAccessToken(KEY, SECRET, 3600);
    const { viewerUrl } = await communications.streaming.startRts(token, conferenceId);
    return res.status(200).json({ viewerUrl });
  } catch (e) {
    console.log(e);
    const { status, message } = processErrorStatus(e);
    return res.status(status).send(message);
  }
});

router.post('/event_stop', async ({ body }, res) => {
  const { conferenceId } = body;

  if (!conferenceId) {
    return res.status(400).json({ error: 'Missing conference id param.' });
  }
  try {
    const token = await authentication.getApiAccessToken(KEY, SECRET, 3600);
    await communications.streaming.stopRts(token, conferenceId);
    return res.status(204).send('OK');
  } catch (e) {
    console.log(e);
    const { status, message } = processErrorStatus(e);
    return res.status(status).send(message);
  }
});

export default router;
