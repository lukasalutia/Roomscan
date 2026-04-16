import sharp from 'sharp'
import { analyzeImage } from '../services/ai.js'

export async function analyzeRoute(app) {
  app.post('/analyze', async (request, reply) => {
    const { image, mimeType } = request.body

    if (!image) {
      return reply.code(400).send({ error: 'No se recibió ninguna imagen' })
    }

    // Decodificar base64 a buffer
    const buffer = Buffer.from(image, 'base64')
    const sizeKB = Math.round(buffer.length / 1024)
    request.log.info({ mimeType, sizeKB }, 'imagen recibida')

    // Comprimir a máx 1280px de ancho y calidad 75
    const compressed = await sharp(buffer)
      .resize({ width: 1280, withoutEnlargement: true })
      .jpeg({ quality: 75 })
      .toBuffer()

    const compressedKB = Math.round(compressed.length / 1024)
    request.log.info({ originalKB: sizeKB, compressedKB }, 'imagen comprimida')

    const base64 = compressed.toString('base64')

    try {
      const analysis = await analyzeImage(base64, 'image/jpeg')
      return reply.send(analysis)
    } catch (err) {
      request.log.error({ message: err.message, status: err.status, body: err.error }, 'error de Fireworks')
      return reply.code(500).send({ error: err.message })
    }
  })
}
