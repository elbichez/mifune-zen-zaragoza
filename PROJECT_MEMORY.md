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
- Probando modelos locales con Continue en VS Code y Open WebUI
- Nivel: principiante en desarrollo/terminal (informática 4/10, código 1/10) — necesita explicaciones paso a paso, sin asumir conocimientos previos. Usa PowerShell en Windows.
- Tono que le gusta para contenido de LinkedIn: canalla, divertido, estudiante "a tope"
- Posible objetivo futuro: convertir este proyecto (o parte de él) en un producto vendible a restaurantes reales
- Trabaja también con Gemini en paralelo para iterar sobre el agente (system prompt + Python)

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
4. 🟡 **Fase 4 — Agentes IA**: Ollama (qwen2.5:7b) + Open WebUI + PostgreSQL, agente recepcionista "Agente de Reservas Mifune" con 5 herramientas — funcional para flujos con datos completos; pendientes 2 validaciones de datos (fecha pasada, turno válido) y rediseño de confirmación para acciones destructivas
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
- Modelo del agente recepcionista: `qwen2.5:7b` (no `-coder`) — el modelo "coder" tiene tool calling poco fiable como agente conversacional
- El código completo de las herramientas del agente recepcionista NO se sube al repo público (posible producto comercial); solo se documenta arquitectura + 1 ejemplo simple
- NO cambiar de modelo a DeepSeek R1 8B para resolver los hallazgos de las pruebas de estrés: son fallos de validación de datos deterministas (Python), no de razonamiento del LLM
- Las acciones destructivas (`cancelar_reserva`, futura `modificar_reserva`) requieren rediseño de arquitectura (confirmación fuera del LLM) — el system prompt por sí solo no es suficiente barrera

## ⚠️ Cosas pendientes / a vigilar

- Limpiar referencias residuales a "Lovable" en el código si se quiere un repo 100% propio (baja prioridad)
- Considerar comprar un dominio propio si el proyecto avanza mucho (mejoraría imagen y permitiría Search Console)
- El usuario edita archivos con VS Code (recién instalado) — cuando le pases código, dale el archivo completo, no fragmentos, porque copiar/pegar parcial le ha dado errores antes
- Al unificar en el futuro Notion ↔ PostgreSQL, revisar que coincidan los nombres de campo (ej. "Teléfono" con acento en Notion vs `telefono` sin acento en Postgres)
- **PENDIENTE Fase 4**: validar en Python que `fecha >= hoy` y que `turno` ∈ {"20:30","22:30"} antes de crear/consultar reservas
- **PENDIENTE Fase 4 (crítico)**: rediseñar confirmación de acciones destructivas (`cancelar_reserva`) — actualmente el LLM puede ejecutarlas antes de pedir confirmación real, pese a reglas explícitas en el prompt

## 🐳 Infraestructura local (Fase 4)

- PostgreSQL corriendo via Docker, contenedor llamado `mi_postgres_dev` (imagen postgres:16-alpine)
- Archivo `docker-compose.yml` en `C:\dev\postgres-local\` (FUERA del repo de Mifune, no necesita .gitignore)
- Usuario: `mi_usuario` | Base de datos: `mi_base_datos` | Puerto: 5432 | Contraseña: anotada de forma segura por el usuario
- Volumen persistente: `postgres_data`
- Para conectar: `docker exec -it mi_postgres_dev psql -U mi_usuario -d mi_base_datos` (no pide password al ejecutar dentro del contenedor, es normal)
- Tablas creadas: `clientes` (id, nombre, telefono, email, alergias_notas, creado_en) y `reservas` (id, cliente_id FK, fecha, turno, personas, estado, creado_en)
- Open WebUI corriendo via Docker en `localhost:3000`, conectado a Ollama (host)

## 🤖 Agente Recepcionista (Fase 4 — estado a 2026-06-15)

- Modelo: `qwen2.5:7b` (cambiado desde `qwen2.5-coder:7b` por mejor tool calling)
- Interfaz: Open WebUI (localhost:3000), modelo "Agente de Reservas Mifune"
- Herramienta: "Mifune_disponibilidad", con 5 funciones Python (psycopg2) + función interna `resolver_fecha()`:
  - `consultar_disponibilidad` (fecha en lenguaje natural o ISO, turno) → plazas libres
  - `buscar_cliente` (telefono) → datos del cliente si existe
  - `crear_reserva` (nombre, telefono, fecha, turno, personas, email, alergias_notas) → crea cliente si no existe + reserva, comprobando aforo
  - `consultar_reservas_cliente` (telefono) → lista reservas confirmadas
  - `cancelar_reserva` (reserva_id) → marca reserva como cancelada
  - `resolver_fecha` (interna): "hoy"/"mañana"/días de semana/ISO → YYYY-MM-DD; devuelve `ERROR_FECHA_NO_SOPORTADA` si no entiende la expresión
- System prompt v2 (evolución del v1, trabajado también con Gemini): árbol de decisión de intenciones (A-F), reglas estrictas de ambigüedad (sin fecha+turno no se ejecuta nada; sin turno se consultan ambos), separación estricta de intenciones, fidelidad a resultados de herramientas, presentación natural de listas, cancelación en dos pasos (buscar ID por teléfono antes de cancelar)
- Conexion Postgres desde Open WebUI usa `host.docker.internal`
- Decision de portfolio: codigo completo de las herramientas NO esta en el repo publico. Repo solo incluye README + 1 ejemplo (`consultar_disponibilidad` con `resolver_fecha`) en `agente-recepcionista/`

### Resultado de las 10 pruebas de estrés (2026-06-15)
- Pruebas 1-5 y 8: superadas correctamente (incluye "¿hay sitio para esta noche?" sin turno → consulta ambos turnos con fecha resuelta correctamente; rechazo correcto de grupo de 10 personas con aforo 8)
- Prueba 6 (modificar reserva, x2): **FALLO CRÍTICO** — el agente ejecutó `cancelar_reserva` real sobre una reserva existente sin confirmación del usuario, en ambos intentos, pese a regla explícita en el prompt prohibiéndolo. Reparado manualmente en BD (`UPDATE reservas SET estado='confirmada' WHERE id=6`) ambas veces
- Prueba 7 (cancelar sin ID/teléfono): el agente intentó `cancelar_reserva("")`; PostgreSQL lo bloqueó por tipo de dato (protección incidental)
- Prueba 9 (fecha pasada, 1 enero 2020): se creó una reserva real con fecha pasada (ID 8, borrada tras la prueba) — falta validación "fecha >= hoy"
- Prueba 10 (turno "21:00", inválido): se creó una reserva real con turno fuera de rango (ID 9, borrada tras la prueba) — falta validación de turno ∈ {"20:30","22:30"}

### Próximos pasos técnicos del agente (siguiente sesión)
1. Añadir validación "fecha >= hoy" en `resolver_fecha`/`crear_reserva` (rechazo limpio tipo `ERROR_FECHA_NO_SOPORTADA`)
2. Añadir validación de `turno` ∈ {"20:30","22:30"} en `crear_reserva`/`consultar_disponibilidad`
3. Rediseñar el flujo de acciones destructivas (`cancelar_reserva`, futura `modificar_reserva`): separar "el LLM propone" de "se ejecuta", con confirmación a nivel de aplicación, no solo de prompt
4. Recalibrar con el usuario cuánto tiempo dedicar a endurecer Fase 4 vs avanzar a Fase 5 (n8n), según tiempo disponible antes de fin de curso
