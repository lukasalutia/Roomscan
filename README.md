# 🏠 RoomScan — AI Room Tidiness Analyzer

> Subís una foto de tu cuarto, la IA te dice qué está desordenado, qué no, y te da un plan de acción para ordenarlo sin tener que pensar.

---

## ¿Qué hace?

RoomScan analiza imágenes de habitaciones usando visión por computadora con Claude claude-sonnet-4-20250514 y devuelve:

- **Score de orden** (0–100) con nivel visual (semáforo)
- **Análisis por zona**: piso, cama, escritorio, paredes, rincones
- **Lista de items desordenados** con ubicación y prioridad
- **Plan de acción** paso a paso, ordenado por impacto visual
- **Recomendaciones** para mantener el orden a largo plazo

El objetivo no es juzgar — es eliminar la fricción cognitiva de "por dónde empiezo a ordenar".

---

## Stack técnico

```
Frontend   React + Vite + Tailwind CSS
Backend    Node.js + Fastify
AI         Claude claude-sonnet-4-20250514 (Vision API)
Deploy     Railway (backend) + Vercel (frontend)
```

---

## Estructura del proyecto

```
roomscan/
├── README.md
├── CLAUDE.md                  ← instrucciones para Claude Code
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       └── components/
│           ├── ImageUploader.jsx     ← drag & drop de imagen
│           ├── ScoreDisplay.jsx      ← gauge visual del score
│           ├── ZoneBreakdown.jsx     ← análisis por zona
│           ├── ActionPlan.jsx        ← lista de acciones priorizadas
│           └── RecommendationCard.jsx
├── backend/
│   ├── package.json
│   └── src/
│       ├── server.js                 ← Fastify entrypoint
│       ├── routes/
│       │   └── analyze.js            ← POST /analyze
│       └── services/
│           └── claude.js             ← lógica de Vision API
└── .env.example
```

---

## Flujo de la aplicación

```
Usuario sube imagen
        ↓
Frontend → POST /analyze (multipart/form-data)
        ↓
Backend convierte imagen a base64
        ↓
Llama a Claude claude-sonnet-4-20250514 Vision API con prompt estructurado
        ↓
Claude devuelve JSON con análisis completo
        ↓
Backend valida y retorna al frontend
        ↓
Frontend renderiza score + zonas + plan de acción
```

---

## Schema del análisis (respuesta de Claude)

```json
{
  "overall_score": 72,
  "level": "moderate",
  "summary": "El cuarto tiene zonas bien organizadas pero el piso y el escritorio necesitan atención.",
  "zones": [
    {
      "name": "Piso",
      "score": 45,
      "issues": ["Ropa tirada cerca de la cama", "Mochila en el medio del cuarto"]
    },
    {
      "name": "Escritorio",
      "score": 60,
      "issues": ["Papeles apilados sin organizar", "Vasos/tazas sin llevar"]
    },
    {
      "name": "Cama",
      "score": 85,
      "issues": ["Almohadas desacomodadas"]
    },
    {
      "name": "Paredes / rincones",
      "score": 90,
      "issues": []
    }
  ],
  "messy_items": [
    {
      "item": "Ropa",
      "location": "Piso, lado izquierdo de la cama",
      "priority": "high",
      "action": "Guardar en cajón o poner en cesto de ropa sucia"
    },
    {
      "item": "Papeles",
      "location": "Escritorio",
      "priority": "medium",
      "action": "Apilar en carpeta o tirar los que no sirven"
    }
  ],
  "action_plan": [
    {
      "step": 1,
      "duration_minutes": 2,
      "action": "Levantá la ropa del piso y ponerla en su lugar",
      "impact": "high"
    },
    {
      "step": 2,
      "duration_minutes": 3,
      "action": "Llevá los vasos y tazas a la cocina",
      "impact": "medium"
    },
    {
      "step": 3,
      "duration_minutes": 5,
      "action": "Organizá los papeles del escritorio",
      "impact": "medium"
    }
  ],
  "estimated_total_minutes": 10,
  "tips": [
    "Dedicar 5 minutos antes de dormir para dejar el piso libre reduce el desorden acumulado.",
    "Un cesto de ropa visible cerca de donde te cambiás elimina la ropa tirada en el 80% de los casos."
  ]
}
```

---

## Variables de entorno

```bash
# .env.example
ANTHROPIC_API_KEY=sk-ant-...
PORT=3001
FRONTEND_URL=http://localhost:5173
```

---

## Cómo correr el proyecto en local

```bash
# Backend
cd backend
npm install
cp ../.env.example .env   # agregar tu API key
npm run dev               # corre en :3001

# Frontend (en otra terminal)
cd frontend
npm install
npm run dev               # corre en :5173
```

---

## Roadmap MVP

- [x] Definición del proyecto y arquitectura
- [ ] Backend: endpoint `/analyze` con Claude Vision
- [ ] Frontend: upload de imagen + spinner de carga
- [ ] Frontend: mostrar score general con visualización
- [ ] Frontend: lista de items desordenados con prioridades
- [ ] Frontend: plan de acción paso a paso
- [ ] Deploy básico (Railway + Vercel)

### Fases futuras (post-MVP)
- Historial de análisis (comparar cuánto mejoró el cuarto)
- Modo "antes / después" con dos fotos
- Gamificación: racha de días con cuarto ordenado
- Análisis de múltiples fotos para cubrir todo el cuarto

---

## Notas de diseño

- La app tiene que ser **rápida de usar**: subís foto, ves resultado. Cero fricción.
- El plan de acción tiene que estar **ordenado por impacto visual** — la idea es que con 10 minutos el cuarto parezca otro.
- El tono del copy es **casual y directo** — no condescendiente, no perfeccionista.
- UI: limpia, mobile-first, resultados escaneables en 5 segundos.

---

## Contexto de desarrollo

Este proyecto es para practicar **vibe coding con Claude Code** — la idea es construir una web app funcional usando IA para generar la mayor parte del código, aprendiendo el flujo de desarrollo agéntico en el proceso.
