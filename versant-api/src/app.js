import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import { ensureDatabase } from './bootstrap.js'
import { getMedia, usesMongo } from './store.js'
import { adminRouter } from './routes/admin.js'
import { authRouter } from './routes/auth.js'
import { studentRouter } from './routes/student.js'

function guard(router) {
  for (const layer of router.stack) {
    if (!layer.route) continue
    for (const step of layer.route.stack) {
      const handle = step.handle
      step.handle = (req, res, next) => {
        Promise.resolve(handle(req, res, next)).catch(next)
      }
    }
  }
}

export async function createApp() {
  await ensureDatabase()
  const app = express()

  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))
  app.use(express.json({ limit: '1mb' }))

  const origins = [
    ...(process.env.CORS_ORIGIN ?? 'http://localhost:5173')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
    'http://13.207.57.80:5173',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
  ].filter((origin, index, list) => list.indexOf(origin) === index)

  app.use(
    cors({
      origin: origins,
      credentials: true,
    }),
  )

  app.get('/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'versant-api',
      database: usesMongo() ? 'mongodb' : 'json',
      timestamp: new Date().toISOString(),
    })
  })

  app.get('/api/v1', (_req, res) => {
    res.json({
      name: 'Versant API',
      version: '0.2.0',
      module: 'listening',
      endpoints: {
        health: '/health',
        auth: '/api/v1/auth',
        student: '/api/v1',
        admin: '/api/v1/admin',
      },
    })
  })

  app.get('/media/:file', async (req, res, next) => {
    try {
      const filename = req.params.file.replace(/[^a-zA-Z0-9._-]/g, '')
      const media = await getMedia(filename)
      if (!media) return res.status(404).json({ error: 'Recording not found' })
      res.setHeader('Content-Type', media.contentType)
      res.setHeader('Cache-Control', 'public, max-age=3600')
      res.send(media.data)
    } catch (error) {
      next(error)
    }
  })

  guard(authRouter)
  guard(adminRouter)
  guard(studentRouter)

  app.use('/api/v1/auth', authRouter)
  app.use('/api/v1/admin', adminRouter)
  app.use('/api/v1', studentRouter)

  app.use((_req, res) => {
    res.status(404).json({ error: 'Not found' })
  })

  app.use((error, _req, res, _next) => {
    const status = error.status || 500
    if (status >= 500) console.error(error)
    res.status(status).json({ error: status >= 500 ? 'Something went wrong' : error.message })
  })

  return app
}
