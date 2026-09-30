import { io, type Socket } from 'socket.io-client'
import { ENV } from '../config/env'

let socket: Socket | null = null

/** Real-time chat / live updates — connect after student auth. */
export function connectSocket(options: {
  token: string
  tenantHost: string
}) {
  if (socket?.connected) {
    return socket
  }

  socket = io(ENV.API_ROOT, {
    path: '/socket.io',
    transports: ['websocket'],
    auth: { token: options.token },
    extraHeaders: {
      'X-Tenant-Host': options.tenantHost,
    },
  })

  return socket
}

export function disconnectSocket() {
  socket?.disconnect()
  socket = null
}

export function getSocket() {
  return socket
}
