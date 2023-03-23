import dotenv from 'dotenv';

dotenv.config();

type envVars = 'PORT' | 'HOSTNAME' | 'SSL' | 'KEY' | 'SECRET';

const defaulted = {
  PORT: '4000',
  HOSTNAME: 'localhost',
  SSL: 'false',
  KEY: undefined,
  SECRET: undefined,
} as const;

/*
This is a type-safe form of getting env vars, including some defaulted values.
*/
export const env = (name: envVars): string => {
  const value = process.env[name];
  const defaultVal = defaulted[name];

  if (!value && defaultVal) {
    return defaultVal;
  }

  if (!value) {
    throw new Error(`Missing: process.env['${name}'].`);
  }

  return value;
};
