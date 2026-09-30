import { getHealthCheckUrl } from '../config/env'

export type HealthResponse = {
  status: string
  service: string
  timestamp: string
}

export async function fetchHealth(): Promise<HealthResponse> {
  const res = await fetch(getHealthCheckUrl())
  if (!res.ok) {
    throw new Error(`Health check failed (${res.status})`)
  }
  return res.json() as Promise<HealthResponse>
}
