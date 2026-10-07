import AsyncStorage from '@react-native-async-storage/async-storage'

const ACCESS_KEY = 'elytedu-token'
const REFRESH_KEY = 'elytedu-refresh-token'

let memoryAccess: string | null = null
let memoryRefresh: string | null = null

export async function getToken() {
  if (memoryAccess) return memoryAccess
  memoryAccess = await AsyncStorage.getItem(ACCESS_KEY)
  return memoryAccess
}

export async function getRefreshToken() {
  if (memoryRefresh) return memoryRefresh
  memoryRefresh = await AsyncStorage.getItem(REFRESH_KEY)
  return memoryRefresh
}

export async function sessionIsStored() {
  const [access, refresh] = await AsyncStorage.multiGet([ACCESS_KEY, REFRESH_KEY])
  return Boolean(access[1] || refresh[1])
}

export async function setSession(accessToken: string, refreshToken: string | null, persist: boolean) {
  memoryAccess = accessToken
  memoryRefresh = refreshToken
  if (!persist) {
    await AsyncStorage.multiRemove([ACCESS_KEY, REFRESH_KEY])
    return
  }
  const writes: [string, string][] = [[ACCESS_KEY, accessToken]]
  if (refreshToken) writes.push([REFRESH_KEY, refreshToken])
  await AsyncStorage.multiSet(writes)
  if (!refreshToken) await AsyncStorage.removeItem(REFRESH_KEY)
}

export async function clearSession() {
  memoryAccess = null
  memoryRefresh = null
  await AsyncStorage.multiRemove([ACCESS_KEY, REFRESH_KEY])
}
