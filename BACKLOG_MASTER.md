# 📋 Backlog Master — Mifune Zen Zaragoza

> Lista de tareas por fase. Marca `[x]` cuando esté hecho. Esto es el "qué falta" — para el "qué soy" usa `PROJECT_MEMORY.md`.

---

## ✅ Fase 1 — Web institucional (CERRADA)

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
- [x] Marcar Fase 1 como cerrada en README
- [x] Repo conectado a Git/GitHub desde local (push funcionando)
- [ ] (Opcional) Limpiar referencias a `reportLovableError` / `lib/lovable-error-reporting.ts`
- [ ] (Opcional) Comprar dominio propio

## 🟡 Fase 2 — Reservas con Notion (EN CURSO)

- [x] Crear base de Notion "Mifune - Reservas" (Nombre, Teléfono, Fecha, Turno, Personas, Alergias/Notas, Estado)
- [ ] Crear integración de Notion y obtener API key (NO subir nunca a GitHub — usar variable de entorno/secret)
- [ ] Compartir la base de datos de Notion con la integración
- [ ] Escribir función de servidor (Cloudflare Worker) que reciba el formulario y llame a la API de Notion
- [ ] Conectar `BookingModal.tsx` (sin lógica de envío todavía) a esa función
- [ ] Probar reserva de extremo a extremo (formulario → Notion)
- [ ] Documentar en README cómo funciona
- [ ] Post de LinkedIn al cerrar Fase 2

## 🛠️ Entorno de desarrollo (transversal)

- [x] Git instalado y configurado
- [x] Ollama + Continue instalados en VS Code
- [x] `qwen2.5-coder:7b` configurado como modelo local por defecto en Continue (modo Chat recomendado, Agent mode no funciona bien con tool calling)

## ⬜ Fase 3 — Airtable

- [ ] Tabla `Clientes`
- [ ] Tabla `Reservas`
- [ ] Tabla `Turnos`
- [ ] Replicar lógica de Notion en Airtable (aprendizaje, no sustituye Notion todavía)

## ✅ Fase 4 — Agentes IA locales (COMPLETADA)

- [x] Instalar/configurar Open WebUI
- [x] Montar PostgreSQL local
- [x] Diseñar esquema de BD: `clientes`, `reservas` (turnos, inventario, recetas, ingresos, gastos pendientes para fases posteriores)
- [x] Crear agente "Recepcionista de Mifune" (prompt + herramientas: consultar/crear/cancelar reservas)
- [x] Probar el agente con casos reales (reserva completa, turno lleno, cancelación)

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

---

## ACTUALIZACION 2026-06-14 (tarde)

## Fase 2.5 - Memoria gastronomica basica (COMPLETADA)

- [x] Anadir campo Email al formulario y a Notion (tipo Email)
- [x] Anadir campo Alergias/Notas (opcional) al formulario
- [x] Actualizar booking.functions.ts para enviar ambos campos
- [x] Probar en local y produccion
- [x] README recreado y actualizado (incluye esta fase)

## Fase 3 - Airtable (POSPUESTA)

- [ ] POSPUESTA: se hara al final, integrada con un futuro modulo de inventario/despensa (no como ejercicio aislado)

## Fase 4 - Agentes IA locales (EN CURSO)

- [x] Instalar Docker Desktop
- [x] Confirmar `docker --version` y `docker ps`
- [x] Levantar PostgreSQL via Docker (mi_postgres_dev / mi_usuario / mi_base_datos)
- [x] Disenar y crear esquema inicial de BD (tablas `clientes` y `reservas`)
- [x] Instalar Open WebUI (localhost:3000, conectado a qwen2.5-coder:7b)
- [ ] Disenar prompt de sistema del agente "Recepcionista de Mifune"
- [ ] Definir herramientas (function calling): consultar reservas, crear reservas, cancelar reservas
- [ ] Conectar herramientas a PostgreSQL
- [ ] Probar el agente con casos reales desde Open WebUI

## Notas de proceso (aplicar siempre a partir de ahora)

- [ ] Guardar SIEMPRE con Ctrl+S y verificar con `type archivo` antes de asumir que un cambio esta aplicado
- [ ] Si hay error de sintaxis raro que no se localiza visualmente -> regenerar archivo completo via descarga, no seguir editando a mano
- [ ] Build SIEMPRE antes de deploy: `npm run build` luego `npx wrangler deploy`

---

## ACTUALIZACION 2026-06-15

## Fase 4 - Agente Recepcionista de Mifune (COMPLETADA)

- [x] Disenar prompt de sistema del agente "Recepcionista de Mifune"
- [x] Definir herramientas (function calling): consultar_disponibilidad, buscar_cliente, crear_reserva, consultar_reservas_cliente, cancelar_reserva
- [x] Conectar herramientas a PostgreSQL (via Open WebUI Tools, psycopg2, host.docker.internal)
- [x] Probar el agente con casos reales (reserva completa, consulta de reservas, cancelacion)
- [x] Cambio de modelo: qwen2.5-coder:7b -> qwen2.5:7b (mejor tool calling con mismo VRAM)
- [x] Refinar system prompt: 2 reglas anadidas (fidelidad a resultados de herramientas, presentacion natural de listas)
- [x] Documentar agente en repo (carpeta agente-recepcionista/: README, ejemplo de herramienta, .env.example) sin exponer codigo completo de produccion

Nombres oficiales:
- Modelo en Open WebUI: "Agente de Reservas Mifune" (qwen2.5:7b)
- Herramienta: "Mifune_disponibilidad" (contiene las 5 funciones)

Decision: codigo completo de las 5 herramientas NO se sube al repo publico (posible producto vendible a restaurantes). Solo se documenta arquitectura + 1 ejemplo (consultar_disponibilidad).

## Pendiente unificacion Notion <-> PostgreSQL

- [ ] Revisar que los nombres de campo coincidan (ej. "Telefono" con acento en Notion vs `telefono` sin acento en Postgres) antes de cualquier migracion/sincronizacion

## Post de LinkedIn

- [ ] Post de LinkedIn al cerrar Fase 2 + Fase 2.5 + Fase 4 (agente recepcionista) - texto ya redactado, pendiente de publicar
