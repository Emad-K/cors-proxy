import 'dotenv/config';
import process from 'node:process';

function getOrThrow(key, type = 'string') {
  const value = process.env[key];

  if (value === undefined || value === null || value === '') {
    throw new Error(`Environment variable ${key} is missing or empty`);
  }

  if (type === 'number') {
    const parsed = parseInt(value, 10);
    if (Number.isNaN(parsed)) {
      throw new Error(`Environment variable ${key} must be a valid number, got "${value}"`);
    }
    return parsed;
  }

  return value;
}

const env = {
  NODE_ENV: getOrThrow('NODE_ENV'),
  LOG_LEVEL: getOrThrow('LOG_LEVEL'),
  PORT: getOrThrow('PORT', 'number'),
  REDIS_URL: getOrThrow('REDIS_URL'),
  CACHE_DURATION: getOrThrow('CACHE_DURATION', 'number'), // In seconds
  TIMEOUT: getOrThrow('TIMEOUT', 'number'), // In milliseconds
  RATE_LIMIT_WINDOW: getOrThrow('RATE_LIMIT_WINDOW', 'number'), // In seconds
  RATE_LIMIT_MAX: getOrThrow('RATE_LIMIT_MAX', 'number'),
  USER_AGENT: getOrThrow('USER_AGENT'),
};

export default env;
