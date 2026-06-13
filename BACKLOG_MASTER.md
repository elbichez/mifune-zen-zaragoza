# 📋 Backlog Master — Mifune Zen Zaragoza

> Lista de tareas por fase. Marca `[x]` cuando esté hecho. Esto es el "qué falta" — para el "qué soy" usa `PROJECT_MEMORY.md`.

---

## ✅ Fase 1 — Web institucional (CASI CERRADA)

- [x] Web desplegada en Cloudflare Workers
- [x] README.md completo con roadmap
- [x] Repo público con About/topics/descripción correctos
- [x] Corregido canonical/og:url/twitter:site (restos de Lovable)
- [x] Meta title/description optimizados con keywords (Zaragoza, omakase, Wagyu)
- [x] JSON-LD Schema.org tipo Restaurant añadido
- [x] Texto sobre SEO/GEO añadido al README
- [x] Borrado deploy duplicado de Vercel
- [x] Comprobar `sitemap.xml` (que cargue con la URL correcta)
- [x] Comprobar/crear `robots.txt`
- [x] (Opcional) Limpiar referencias a `reportLovableError` / `lib/lovable-error-reporting.ts`
- [ ] (Opcional) Comprar dominio propio
- [x] Marcar Fase 1 como cerrada en README

## ⬜ Fase 2 — Reservas con Notion

- [ ] Crear base de Notion para reservas (campos: nombre, fecha, turno, nº personas, alergias, teléfono)
- [ ] Conectar formulario de la web a Notion (vía API de Notion o servicio intermedio gratuito)
- [ ] Documentar en README cómo funciona

## ⬜ Fase 3 — Airtable

- [ ] Tabla `Clientes`
- [ ] Tabla `Reservas`
- [ ] Tabla `Turnos`
- [ ] Replicar lógica de Notion en Airtable (aprendizaje, no sustituye Notion todavía)

## ⬜ Fase 4 — Agentes IA locales

- [ ] Instalar/configurar Open WebUI
- [ ] Montar PostgreSQL local
- [ ] Diseñar esquema de BD: `clientes`, `reservas`, `turnos`, `inventario`, `recetas`, `ingresos`, `gastos`
- [ ] Crear agente "Recepcionista de Mifune" (prompt + herramientas: consultar/crear/cancelar reservas)
- [ ] Probar el agente con casos reales (reserva completa, turno lleno, cancelación)

## ⬜ Fase 5 — Automatización con n8n

- [ ] Instalar n8n (local o Docker)
- [ ] Flujo: Web → PostgreSQL → Email confirmación → Calendario
- [ ] Flujo: Lista de espera (sin hueco → espera → aviso si hay cancelación)
- [ ] Flujo: Notificaciones por Telegram

## ⬜ Fase 6 — CRM con memoria gastronómica (RAG)

- [ ] Instalar Qdrant
- [ ] Diseñar formato de "notas de cliente" (alergias, preferencias, visitas, aniversarios)
- [ ] Generar embeddings y guardarlos en Qdrant
- [ ] Conectar al agente recepcionista: búsqueda semántica antes de confirmar reserva

## ⬜ Fase 7 — Chef IA / Compras IA

- [ ] Tabla de recetas (plato → ingredientes + cantidades)
- [ ] Agente "Chef": sugiere menú según inventario + reservas
- [ ] Agente "Compras": genera lista de compra + coste estimado
- [ ] Automatizar descuento de inventario al confirmar reserva (food cost real)

## ⬜ Fase 8 — Dashboard (Metabase)

- [ ] Instalar Metabase
- [ ] Conectar a PostgreSQL
- [ ] Dashboard: ocupación por turno
- [ ] Dashboard: ingresos vs gastos vs beneficio
- [ ] Dashboard: estado del inventario

## 📣 Difusión / Portfolio

- [x] Post de LinkedIn (ES) — Fase 1
- [x] Post de LinkedIn (EN) — Fase 1
- [ ] Post de LinkedIn al cerrar Fase 2
- [ ] Vídeo demo corto de cada fase (1-2 min)
- [ ] Crear releases en GitHub por fase (v1.0, v2.0...)
