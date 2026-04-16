import 'dotenv/config'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import multipart from '@fastify/multipart'
import { analyzeRoute } from './routes/analyze.js'

const app = Fastify({ logger: true })

// CORS: permite requests desde el frontend local
await app.register(cors, {
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'http://localhost:5174', // puerto alternativo de Vite
  ],
})

// Multipart: para recibir la imagen como form-data (máximo 10MB)
await app.register(multipart, {
  limits: { fileSize: 10 * 1024 * 1024 },
})

// Health check — usado para verificar que el server responde
app.get('/health', async () => ({ status: 'ok' }))

// Rutas
await app.register(analyzeRoute)

const port = Number(process.env.PORT) || 3001

try {
  await app.listen({ port, host: '0.0.0.0' })
} catch (err) {
  app.log.error(err)
  process.exit(1)
}
