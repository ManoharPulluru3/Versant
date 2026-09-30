import 'dotenv/config'
import { closeStore, dbPath, initStore } from './store.js'
import { seedDatabase } from './seed.js'

await initStore()
await seedDatabase()
console.log('Seeded listening data in', dbPath())
await closeStore()
