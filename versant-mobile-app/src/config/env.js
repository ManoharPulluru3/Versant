/**
 * Set true to hit https://api.elytedu.com while Metro is in dev mode.
 * Default false: the shared API at 13.207.57.80.
 */
export const USE_PRODUCTION_API_IN_DEV = false

const API_HOST = '13.207.57.80'

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
