/**
 * Set true to hit https://api.elytedu.com while Metro is in dev mode.
 * Default false: the shared API at 13.207.57.80.
 */
export const USE_PRODUCTION_API_IN_DEV = false

const API_HOST = '13.207.57.80'
const slash = '/'

function joinUrl(scheme, host, path) {
  return scheme + slash + slash + host + path
}

const PRODUCTION = {
  API_URL: joinUrl('https:', 'api.elytedu.com', '/api'),
  API_ROOT: joinUrl('https:', 'api.elytedu.com', ''),
  BASE_DOMAIN: 'elytedu.com',
  MAIN_TENANT_HOST: 'elytedu.com',
}

const LOCAL_DEV = {
  API_URL: joinUrl('http:', API_HOST + ':4000', '/api/v1'),
  API_ROOT: joinUrl('http:', API_HOST + ':4000', ''),
  BASE_DOMAIN: 'elytedu.com',
  MAIN_TENANT_HOST: 'elytedu.com',
}

export const ENV = USE_PRODUCTION_API_IN_DEV ? PRODUCTION : LOCAL_DEV

export function collegeTenantHost(subdomain) {
  return `${subdomain.toLowerCase()}.${ENV.BASE_DOMAIN}`
}

/** Liveness URL (versant-api uses GET /health; production may differ). */
export function getHealthCheckUrl() {
  return `${ENV.API_ROOT}/health`
}
