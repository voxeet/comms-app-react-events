import { communications } from '@dolbyio/dolbyio-rest-apis-client';
import { Handler } from '@netlify/functions';

import { env } from '../src/utils/env';

const KEY = env('KEY');
const SECRET = env('SECRET');

const handler: Handler = async () => {
  try {
    const token = await communications.authentication.getClientAccessToken(KEY, SECRET, 3600);
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(token),
    };
  } catch (e) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(e),
    };
  }
};

export { handler };
