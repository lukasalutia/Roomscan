import OpenAI from 'openai'

// Inicialización lazy para no crashear en startup si la key no está cargada aún
let _client = null
function getClient() {
  if (!_client) {
    _client = new OpenAI({
      apiKey: process.env.FIREWORKS_API_KEY,
      baseURL: 'https://api.fireworks.ai/inference/v1',
    })
  }
  return _client
}

const MODEL = 'accounts/fireworks/models/qwen3p6-plus'

// Prompt base definido en CLAUDE.md — no modificar sin consultar
const PROMPT = `Analizá esta imagen de una habitación y devolvé ÚNICAMENTE un objeto JSON válido,
sin texto adicional, sin backticks, sin explicaciones.

El JSON debe tener exactamente esta estructura:
{
  "overall_score": número entre 0 y 100,
  "level": "clean" | "moderate" | "messy",
  "summary": "descripción breve en español",
  "zones": [
    {
      "name": "nombre de la zona",
      "score": número entre 0 y 100,
      "issues": ["problema 1", "problema 2"]
    }
  ],
  "messy_items": [
    {
      "item": "nombre del objeto",
      "location": "dónde está",
      "priority": "high" | "medium" | "low",
      "action": "qué hacer con él"
    }
  ],
  "action_plan": [
    {
      "step": número,
      "duration_minutes": número,
      "action": "descripción de la acción",
      "impact": "high" | "medium" | "low"
    }
  ],
  "estimated_total_minutes": número,
  "tips": ["tip 1", "tip 2", "tip 3"]
}

Analizá estas zonas: piso, cama, escritorio, paredes y rincones.
Ordená el action_plan por impacto visual descendente (high primero).
Respondé siempre en español.`

// Intenta parsear JSON directo; si falla, extrae entre el primer { y el último }
function parseJSON(text) {
  try {
    return JSON.parse(text)
  } catch {
    const start = text.indexOf('{')
    const end = text.lastIndexOf('}')
    if (start === -1 || end === -1) {
      throw new Error(`No se encontró JSON en la respuesta: ${text.slice(0, 200)}`)
    }
    return JSON.parse(text.slice(start, end + 1))
  }
}

export async function analyzeImage(base64, mimeType) {
  const response = await getClient().chat.completions.create({
    model: MODEL,
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image_url',
            image_url: { url: `data:${mimeType};base64,${base64}` },
          },
          {
            type: 'text',
            text: PROMPT,
          },
        ],
      },
    ],
  })

  const choice = response.choices[0]
  const content = choice?.message?.content

  // Log para debug — muestra finish_reason y si vino contenido
  console.log('finish_reason:', choice?.finish_reason)
  console.log('content preview:', content?.slice(0, 200) ?? 'NULL')

  if (!content) {
    throw new Error(`El modelo no devolvió contenido (finish_reason: ${choice?.finish_reason ?? 'unknown'})`)
  }
  return parseJSON(content.trim())
}
