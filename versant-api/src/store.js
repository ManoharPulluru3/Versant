import fs from 'node:fs'
import path from 'node:path'
import { MongoClient } from 'mongodb'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const file = process.env.DB_PATH || path.join(root, 'data', 'db.json')
const COLLECTIONS = ['users', 'activities', 'questions', 'tests', 'assignments', 'attempts', 'notifications', 'speechResponses']

let memory = null
let client = null
let mongoDb = null
let writeQueue = Promise.resolve()

export function usesMongo() {
  return Boolean(process.env.MONGODB_URI) && !process.env.DB_PATH
}

export function dbPath() {
  if (usesMongo()) return `mongodb database ${process.env.MONGODB_DB || 'versant'}`
  return file
}

export async function initStore() {
  if (!usesMongo()) return
  if (!client) {
    client = new MongoClient(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 8000 })
    await client.connect()
    mongoDb = client.db(process.env.MONGODB_DB || 'versant')
  }
  if (process.env.VERSAN_FRESH === '1') {
    memory = null
    return
  }
  memory = await readAll()
  if (!memory.users?.length) memory = null
}

function strip(doc) {
  const { _id, ...rest } = doc
  return rest
}

async function readAll() {
  const next = {}
  for (const name of COLLECTIONS) {
    const docs = await mongoDb.collection(name).find({}).toArray()
    next[name] = docs.map(strip)
  }
  const settings = await mongoDb.collection('settings').findOne({ _id: 'app' })
  next.settings = settings ? strip(settings) : undefined
  return next
}

export function load() {
  if (!memory) {
    if (usesMongo()) {
      const error = new Error('Database is not loaded')
      error.status = 500
      throw error
    }
    memory = JSON.parse(fs.readFileSync(file, 'utf8'))
  }
  return memory
}

function writeFile() {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  const tmp = `${file}.tmp`
  fs.writeFileSync(tmp, JSON.stringify(memory, null, 2))
  fs.renameSync(tmp, file)
}

async function writeMongo(snapshot) {
  for (const name of COLLECTIONS) {
    const collection = mongoDb.collection(name)
    await collection.deleteMany({})
    const docs = snapshot[name] ?? []
    if (docs.length) await collection.insertMany(docs.map((doc) => ({ ...doc })))
  }
  await mongoDb.collection('settings').replaceOne(
    { _id: 'app' },
    { _id: 'app', ...snapshot.settings },
    { upsert: true },
  )
}

export function save() {
  if (!memory) return Promise.resolve()
  if (!usesMongo()) {
    writeFile()
    return Promise.resolve()
  }
  const snapshot = structuredClone(memory)
  const job = writeQueue.then(() => writeMongo(snapshot))
  writeQueue = job.catch((error) => {
    console.error('MongoDB save failed', error)
  })
  return job
}

export function replace(next) {
  memory = next
  return save().then(() => memory)
}

export function hasDatabase() {
  if (usesMongo()) return Boolean(memory?.users?.length)
  return fs.existsSync(file)
}

export function resetMemory() {
  memory = null
}

export async function putMedia(filename, buffer, contentType) {
  if (usesMongo()) {
    if (!mongoDb) {
      const error = new Error('Database is not loaded')
      error.status = 500
      throw error
    }
    await mongoDb.collection('media').replaceOne(
      { _id: filename },
      { _id: filename, contentType, data: buffer },
      { upsert: true },
    )
    return
  }
  const dir = path.join(path.dirname(file), 'audio')
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(path.join(dir, filename), buffer)
  fs.writeFileSync(path.join(dir, `${filename}.type`), contentType)
}

export async function getMedia(filename) {
  if (usesMongo()) {
    if (!mongoDb) return null
    const doc = await mongoDb.collection('media').findOne({ _id: filename })
    if (!doc?.data) return null
    const data = Buffer.isBuffer(doc.data) ? doc.data : Buffer.from(doc.data.buffer)
    return { contentType: doc.contentType || 'audio/mpeg', data }
  }
  const mediaPath = path.join(path.dirname(file), 'audio', filename)
  if (!fs.existsSync(mediaPath)) return null
  const typePath = `${mediaPath}.type`
  const contentType = fs.existsSync(typePath) ? fs.readFileSync(typePath, 'utf8') : 'audio/mpeg'
  return { contentType, data: fs.readFileSync(mediaPath) }
}

export async function closeStore() {
  await writeQueue
  if (client) {
    await client.close()
    client = null
    mongoDb = null
  }
}
