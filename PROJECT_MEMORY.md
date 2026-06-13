# 🧠 Project Memory — Mifune Zen Zaragoza

> Este documento es el "pégalo al principio de una conversación nueva" para que cualquier IA (Claude, GPT, etc.) entienda el proyecto en 30 segundos.

---

## 🎯 Qué es esto

Proyecto de portfolio para un curso de Automatización e IA (**Infoser New Technologies**, fondos europeos). El objetivo: construir, capa a capa, el sistema de gestión completo de un restaurante ficticio, usando cada herramienta que enseñan en el curso (Notion, Airtable, agentes IA, n8n...) sobre un caso de uso real y coherente.

## 🍣 El restaurante (lore)

- **Nombre**: Mifune
- **Concepto**: omakase japonés de alta cocina, ficticio
- **Ubicación**: Calle del Temple, 9, Zaragoza (dirección ficticia)
- **Aforo**: 8 plazas en barra
- **Servicio**: solo cenas, dos turnos (20:30 y 22:30), martes a sábado
- **Especialidades**: sushi de autor, Wagyu A5, omakase de 14 pases
- **Teléfono ficticio**: +34 976 000 000

## 👤 Sobre mí (el usuario)

- Estudiante del curso de Infoser New Technologies (fondos europeos)
- Sin presupuesto → todo gratis / open source siempre que sea posible
- Tiene **Ollama** instalado localmente (PC: i5-12400F, 32GB RAM, RTX 5060 8GB VRAM)
- Probando modelos de código locales (`qwen2.5-coder:7b`) con Continue en VS Code
- Nivel: principiante en desarrollo/terminal — necesita explicaciones paso a paso, sin asumir conocimientos previos. Usa PowerShell en Windows.
- Tono que le gusta para contenido de LinkedIn: canalla, divertido, estudiante "a tope"

## 🛠️ Stack técnico actual (Fase 1 — Web)

- **Frontend**: React + TypeScript + Vite + TanStack Start/Router
- **Estilos**: Tailwind CSS v4
- **Gestor de paquetes**: npm (bun instalado pero usa npm sin problemas)
- **Hosting**: Cloudflare Workers (deploy manual con `npx wrangler deploy`)
- **Generado inicialmente con**: Lovable (de ahí restos de código tipo `reportLovableError`, que se dejaron a propósito por ser funcionales)
- **Repo**: https://github.com/elbichez/mifune-zen-zaragoza (público)
- **Web en vivo**: https://mifune-zen-zaragoza.elbichez.workers.dev

## 🗺️ Roadmap completo del proyecto

1. ✅ **Fase 1 — Web institucional**: React + SEO + GEO (datos estructurados Schema.org tipo Restaurant)
2. ⬜ **Fase 2 — Reservas (Notion)**: formulario → Notion
3. ⬜ **Fase 3 — Airtable**: tablas Clientes, Reservas, Turnos
4. ⬜ **Fase 4 — Agentes IA**: Ollama + Open WebUI + PostgreSQL, agente recepcionista (consultar/crear/cancelar reservas)
5. ⬜ **Fase 5 — n8n**: flujos de reserva, lista de espera, notificaciones
6. ⬜ **Fase 6 — CRM con memoria gastronómica (RAG + Qdrant)**: alergias, preferencias, visitas
7. ⬜ **Fase 7 — Chef IA / Compras IA**: menús y listas de compra automáticas
8. ⬜ **Fase 8 — Dashboard (Metabase)**: ocupación, ingresos, gastos, beneficio

## 🌟 Diferenciadores para el portfolio (ideas "out of the box")

- Memoria gastronómica por cliente (alergias, bebidas favoritas, aniversarios) vía RAG/Qdrant
- Chef IA que diseña menús según inventario + reservas
- Compras IA: lista de compra + coste estimado automático
- Sistema de food cost automático (recetas → descuento de inventario al confirmar reserva)
- Notificaciones de lista de espera por Telegram (gratis vía n8n)
- Panel "pregunta en lenguaje natural" para el jefe (consulta a Postgres)

## 📐 Decisiones ya tomadas (no las repreguntes)

- Stack final será local/open source: Ollama, PostgreSQL, n8n, Open WebUI, Metabase, Qdrant (opcional)
- Notion/Airtable/Base44/Emergent: se usan SOLO para aprender (fases del curso), no son la base del proyecto final
- No se usará Vercel (se intentó, dio problemas de build con este stack) — Cloudflare Workers es el hosting definitivo
- Dominio actual: `.workers.dev` (no se ha comprado dominio propio todavía)

## ⚠️ Cosas pendientes / a vigilar

- Limpiar referencias residuales a "Lovable" en el código si se quiere un repo 100% propio (baja prioridad)
- Considerar comprar un dominio propio si el proyecto avanza mucho (mejoraría imagen y permitiría Search Console)
- El usuario edita archivos con VS Code (recién instalado) — cuando le pases código, dale el archivo completo, no fragmentos, porque copiar/pegar parcial le ha dado errores antes
