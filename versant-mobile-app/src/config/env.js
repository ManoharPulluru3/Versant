/**
 * Set true to hit production API while Metro is in dev mode.
 * Default false: local versant-api in __DEV__.
 */
export const USE_PRODUCTION_API_IN_DEV = false

// Android talks to the computer through `adb reverse tcp:4000 tcp:4000`
// (USB phone or emulator). 10.0.2.2 is emulator-only and misses a real device.
const DEV_HOST = '127.0.0.1'

const PRODUCTION = {
  API_URL: 'https://api.elytedu.com/api',
  API_ROOT: 'https://api.elytedu.com',
  BASE_DOMAIN: 'elytedu.com',
  MAIN_TENANT_HOST: 'elytedu.com',
}

const LOCAL_DEV = {
  API_URL: `http://${DEV_HOST}:4000/api/v1`,
  API_ROOT: `http://${DEV_HOST}:4000`,
  BASE_DOMAIN: 'elytedu.com',
  MAIN_TENANT_HOST: 'elytedu.com',
}

export const ENV =
  __DEV__ && !USE_PRODUCTION_API_IN_DEV ? LOCAL_DEV : PRODUCTION

export function collegeTenantHost(subdomain) {
  return `${subdomain.toLowerCase()}.${ENV.BASE_DOMAIN}`
}

/** Liveness URL (versant-api uses GET /health; production may differ). */
export function getHealthCheckUrl() {
  return `${ENV.API_ROOT}/health`
}
