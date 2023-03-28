import { authentication, communications } from '@dolbyio/dolbyio-rest-apis-client';
import express from 'express';

import { env } from '../utils/env';
import { processErrorStatus } from '../utils/errors';

const router = express.Router();

const KEY = env('KEY');
const SECRET = env('SECRET');

router.post('/streaming/start', async ({ body }, res) => {
  const { conferenceId, rtmp } = body;
  if (!rtmp || !conferenceId) {
    return res.status(400).json({ error: 'Missing necessary parameters' });
  }
  try {
    const token = await authentication.getApiAccessToken(KEY, SECRET, 3600);
    await communications.streaming.startRtmp(token, conferenceId, rtmp);
    return res.status(204).send('OK');
  } catch (e) {
    const { status, message } = processErrorStatus(e);
    return res.status(status).send(message);
  }
});

router.post('/streaming/stop', async ({ body, query }, res) => {
  res.status(200);
  let conferenceId;
  if ('conferenceId' in body) conferenceId = body.conferenceId;
  if ('conferenceId' in query) conferenceId = query.conferenceId;

  if (!conferenceId) {
    return res.status(400).json({ error: 'Missing conference id param.' });
  }
  try {
    const token = await authentication.getApiAccessToken(KEY, SECRET, 3600);
    await communications.streaming.stopRtmp(token, conferenceId);
    return res.status(204).send('OK');
  } catch (e) {
    console.log(e);
    const { status, message } = processErrorStatus(e);
    return res.status(status).send(message);
  }
});

export default router;
