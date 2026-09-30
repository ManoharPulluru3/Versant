import AsyncStorage from '@react-native-async-storage/async-storage'

const TOKEN_KEY = 'elytedu-token'
let memoryToken: string | null = null

export async function getToken() {
  if (memoryToken) return memoryToken
  memoryToken = await AsyncStorage.getItem(TOKEN_KEY)
  return memoryToken
}

export async function setSession(token: string, persist: boolean) {
  memoryToken = token
  if (persist) await AsyncStorage.setItem(TOKEN_KEY, token)
  else await AsyncStorage.removeItem(TOKEN_KEY)
}

export async function clearSession() {
  memoryToken = null
  await AsyncStorage.removeItem(TOKEN_KEY)
}
