/**
 * Set true to hit production API while Metro is in dev mode.
 * Default false: the deployed versant-api.
 */
export const USE_PRODUCTION_API_IN_DEV = false

// The phone reaches this computer through adb reverse. Clips are served by that API.
const API_HOST = '127.0.0.1'

const PRODUCTION = {
  API_URL: 'https://api.elytedu.com/api',
  API_ROOT: 'https://api.elytedu.com',
  BASE_DOMAIN: 'elytedu.com',
  MAIN_TENANT_HOST: 'elytedu.com',
}

const LOCAL_DEV = {
  API_URL: `http://${API_HOST}:4000/api/v1`,
  API_ROOT: `http://${API_HOST}:4000`,
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
