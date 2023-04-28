const defaulted = {
  VITE_API_PROXY_URL: 'http://localhost:4000',
} as const;

export function ungatedFeaturesEnabled(): boolean {
  const value = import.meta.env.VITE_ENABLE_UNGATED_FEATURES;

  return value === 'true';
}

/*
  This is a type-safe form of getting env vars, including some defaulted values.
  */

export const env = (name: keyof typeof defaulted): string => {
  const value = import.meta.env[name];
  const defaultVal = defaulted[name];

  if (!value && defaultVal) {
    return defaultVal;
  }

  if (!value) {
    throw new Error(`Missing: process.env['${name}'].`);
  }

  return value;
};
