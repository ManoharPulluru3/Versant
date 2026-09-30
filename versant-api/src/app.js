import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import { ensureDatabase } from './bootstrap.js'
import { usesMongo } from './store.js'
import { adminRouter } from './routes/admin.js'
import { authRouter } from './routes/auth.js'
import { studentRouter } from './routes/student.js'

export async function createApp() {
  await ensureDatabase()
  const app = express()

  app.use(helmet())
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))
  app.use(express.json({ limit: '1mb' }))

  const origins = (process.env.CORS_ORIGIN ?? 'http://localhost:5173')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

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
