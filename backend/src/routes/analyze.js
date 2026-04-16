import sharp from 'sharp'
import { analyzeImage } from '../services/ai.js'

export async function analyzeRoute(app) {
  app.post('/analyze', async (request, reply) => {
    // Leer el archivo del request multipart
    const data = await request.file()

    if (!data) {
      return reply.code(400).send({ error: 'No se recibió ninguna imagen' })
    }

    // Validar que sea una imagen
    if (!data.mimetype.startsWith('image/')) {
      return reply.code(400).send({ error: 'El archivo debe ser una imagen' })
    }

    // Leer en memoria — nunca guardar en disco
    const buffer = await data.toBuffer()
    const sizeKB = Math.round(buffer.length / 1024)
    request.log.info({ mimeType: data.mimetype, sizeKB }, 'imagen recibida')

    // Comprimir a máx 1280px de ancho y calidad 75 — suficiente para análisis visual
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
