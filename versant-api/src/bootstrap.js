import { hasDatabase, initStore, load, resetMemory, usesMongo } from './store.js'
import { seedDatabase } from './seed.js'

export async function ensureDatabase() {
  await initStore()
  if (!usesMongo() && process.env.VERSAN_FRESH === '1') resetMemory()
  if (!hasDatabase() || process.env.VERSAN_FRESH === '1') {
    await seedDatabase()
    return
  }
  if (!usesMongo()) load()
}
