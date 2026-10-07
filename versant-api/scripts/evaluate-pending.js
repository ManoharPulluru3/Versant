import 'dotenv/config'
import { closeStore, initStore, load, save } from '../src/store.js'
import { reevaluatePending } from '../src/reevaluate.js'

await initStore()
const report = await reevaluatePending(load())
await save()
for (const item of report) {
  if (item.error) console.log(`pending ${item.title}: ${item.error}`)
  else console.log(`scored ${item.title}: ${item.score}${item.note ? ` — ${item.note}` : ''}`)
}
if (report.length === 0) console.log('No pending speech attempts.')
await closeStore()
