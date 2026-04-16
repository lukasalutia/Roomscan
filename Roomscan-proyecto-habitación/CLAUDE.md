# CLAUDE.md — RoomScan

Este archivo define las reglas y el contexto del proyecto para Claude Code.
Leelo antes de cada tarea.

## ¿Qué es este proyecto?

Web app que analiza fotos de habitaciones con Claude Vision API y devuelve un score de orden + plan de acción priorizado para ordenar sin pensar.

## Stack

- **Frontend**: React + Vite + Tailwind CSS, corre en puerto 5173
- **Backend**: Node.js + Fastify, corre en puerto 3001
- **AI**: Claude claude-sonnet-4-20250514 via Anthropic SDK (Vision)
- **Comunicación**: REST API, JSON

## Convenciones de código

- JavaScript (no TypeScript para mantenerlo simple)
- Componentes React en PascalCase, archivos en PascalCase.jsx
- Funciones y variables en camelCase
- Rutas de API en kebab-case: `/analyze-image`
- Sin ORM ni base de datos en el MVP — todo en memoria/estado React
- Comentarios en español

## Estructura de carpetas (no cambiar)

```
roomscan/
├── frontend/src/components/   ← componentes React
├── frontend/src/              ← App.jsx y main.jsx
├── backend/src/routes/        ← rutas Fastify
├── backend/src/services/      ← lógica de negocio
```

## Reglas importantes

1. **El backend NUNCA guarda imágenes en disco** — todo en memoria, base64 en tránsito
2. **El prompt a Claude debe pedir SOLO JSON** — sin preamble, sin markdown, sin backticks
3. **Siempre validar** que la respuesta de Claude sea JSON parseable antes de retornar
4. **CORS habilitado** en el backend para `http://localhost:5173`
5. **Error handling** en todos los endpoints — nunca dejes crashear el servidor

## Prompt base para Claude Vision (NO modificar sin consultar)

```
Analizá esta imagen de una habitación y devolvé ÚNICAMENTE un objeto JSON válido,
sin texto adicional, sin backticks, sin explicaciones.

El JSON debe tener exactamente esta estructura:
{
  "overall_score": número entre 0 y 100,
  "level": "clean" | "moderate" | "messy",
  "summary": "descripción breve en español",
  "zones": [...],
  "messy_items": [...],
  "action_plan": [...],
  "estimated_total_minutes": número,
  "tips": [...]
}

Ver README.md para el schema completo de cada campo.
```

## Comandos útiles

```bash
# Instalar todo
cd frontend && npm install
cd ../backend && npm install

# Correr en desarrollo
cd backend && npm run dev
cd frontend && npm run dev

# Verificar que el backend responde
curl http://localhost:3001/health
```

## Estado actual del proyecto

Proyecto recién iniciado. Empezar por el backend (endpoint /analyze) y luego el frontend.
