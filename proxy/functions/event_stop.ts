import { Handler, HandlerEvent } from '@netlify/functions';

import { authentication, communications } from '../src/routes/event';
import { env } from '../src/utils/env';
import { processErrorStatus } from '../src/utils/errors';

const KEY = env('KEY');
const SECRET = env('SECRET');

const handler: Handler = async (event: HandlerEvent) => {
  const { conferenceId } = JSON.parse(event.body || '{}');

  if (!conferenceId) {
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Missing necessary parameter: conferenceId' }),
    };
  }

  try {
    const token = await authentication.getApiAccessToken(KEY, SECRET, 3600);
    await communications.streaming.stopRts(token, conferenceId);
    return {
      statusCode: 200,
    };
  } catch (e) {
    console.log(e);
    const { status, message } = processErrorStatus(e);
    return {
      statusCode: status,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ message }),
    };
  }
};

export { handler };
