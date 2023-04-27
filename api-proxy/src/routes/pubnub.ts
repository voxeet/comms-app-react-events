import crypto from 'crypto';

// Note that we are not using the PubNub JS SDK because it crashes Netlify Functions
// Potentially an issue with serverless-http
import { Router } from 'express';

const BASE_URL = 'https://ps.pubnub.com';

function encodeString(input: string) {
  return encodeURIComponent(input).replace(/[!~*'()]/g, (x) => `%${x.charCodeAt(0).toString(16).toUpperCase()}`);
}

// See https://www.pubnub.com/docs/sdks/rest-api#v2-signature-generation-access-manager-v3 for how signatures are generated
function generateSignature(
  httpMethod: 'POST',
  endpoint: string,
  params: Record<string, string>,
  body: string,
  publishKey: string,
  secretKey: string,
): string {
  // Create query param string where the params are sorted in lexicographical order
  const sortedParams = Object.keys(params)
    .sort()
    .map((key) => `${key}=${encodeString(params[key])}`)
    .join('&');
  const input = `${httpMethod}\n${publishKey}\n${endpoint}\n${sortedParams}\n${body}`;
  const hash = `v2.${crypto.createHmac('sha256', secretKey).update(input).digest('base64')}`;
  return hash.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function getPubNubRoutes(params: {
  pubNubPublishKey: string;
  pubNubSubscribeKey: string;
  pubNubSecretKey: string;
}) {
  const router = Router();

  router.post('/pubnub/token', async (req, res) => {
    try {
      if (!req.body.channelId) {
        return res.status(400).json({ error: 'Missing channelId' });
      }

      const endpoint = `/v3/pam/${params.pubNubSubscribeKey}/grant`;

      const queryParams = {
        // Converts Unix timestamp (milliseconds) to a PubNub timetoken
        // https://support.pubnub.com/hc/en-us/articles/360051495812-How-do-I-convert-the-PubNub-timetoken-to-Unix-timestamp-
        timestamp: Math.trunc(new Date().getTime() / 1000).toString(),
        uuid: 'events-server',
      };

      const body = JSON.stringify({
        ttl: 15, // 15 minutes
        permissions: {
          resources: {
            channels: {
              // https://www.pubnub.com/docs/sdks/rest-api#permission-bits
              [req.body.channelId]: 0b0000_0011,
            },
          },
        },
      });

      const signature = generateSignature(
        'POST',
        endpoint,
        queryParams,
        body,
        params.pubNubPublishKey,
        params.pubNubSecretKey,
      );

      const url = `${BASE_URL}${endpoint}?${new URLSearchParams({ signature, ...queryParams }).toString()}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      });
      const json = await response.json();

      return res.status(200).send({ token: json.data.token });
    } catch (e) {
      return res.status(500).send(e);
    }
  });

  return router;
}
