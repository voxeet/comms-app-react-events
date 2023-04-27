const defaulted = {
  VITE_API_PROXY_URL: '/.netlify/functions',
  VITE_ENABLE_UNGATED_FEATURES: undefined,
  VITE_PUBNUB_PUBLISH_KEY: undefined,
  VITE_PUBNUB_SUBSCRIBE_KEY: undefined,
} as const;

export function ungatedFeaturesEnabled(): boolean {
  const value = env('VITE_ENABLE_UNGATED_FEATURES');

  return value === 'true';
}

/**
 * Type-safe form of getting env vars, including some defaulted values.
 */
export const env = (name: keyof typeof defaulted): string => {
  return import.meta.env[name] ?? defaulted[name];
};
