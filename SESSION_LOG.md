# 🗒️ Session Log — Mifune Zen Zaragoza

> Una entrada por día de trabajo. Copia la plantilla de abajo y rellénala al terminar cada sesión. Sirve para recordar qué hiciste y para pegarlo en una nueva conversación si necesitas contexto reciente.

---

## Plantilla (copiar para cada nueva entrada)

```
## YYYY-MM-DD

**Hecho:**
-

**Problemas encontrados:**
-

**Decisiones tomadas:**
-

**Siguiente paso:**
-
```

---

## Historial

## 2026-06-15

**Hecho:**
- Diseñado el system prompt v1 del agente "Recepcionista de Mifune" y las 5 herramientas (function calling) en Open WebUI: `consultar_disponibilidad`, `buscar_cliente`, `crear_reserva`, `consultar_reservas_cliente`, `cancelar_reserva`
- Conectadas las 5 herramientas a PostgreSQL (`mi_postgres_dev`) vía `psycopg2`, usando `host.docker.internal`
- Modelo del agente: "Agente de Reservas Mifune" sobre `qwen2.5:7b`
- Probado el agente con casos reales end-to-end: disponibilidad, alta de cliente, crear/consultar/cancelar reserva
- Documentado el agente en el repo: carpeta `agente-recepcionista/` con README, ejemplo de herramienta y `.env.example`
- Redactado post de LinkedIn de cierre de Fases 2, 2.5 y 4
- Trabajo adicional (con Gemini) sobre `herramientas.py` y system prompt v2:
  - Añadida función `resolver_fecha()`: convierte expresiones temporales en lenguaje natural ("hoy", "mañana", días de la semana) a ISO YYYY-MM-DD usando el reloj del sistema; el LLM ya no calcula fechas
  - Añadido "freno de mano" `ERROR_FECHA_NO_SOPORTADA` si la expresión temporal no se entiende, evitando enviar texto inválido a una columna DATE de Postgres
  - System prompt v2: árbol de decisión de intenciones, reglas de ambigüedad (pedir fecha+turno si faltan, consultar ambos turnos si falta solo el turno), separación estricta de intenciones, regla de cancelación en dos pasos (buscar ID por teléfono antes de cancelar)
- Diseñada y ejecutada una batería de 10 pruebas de estrés sobre el agente v2

**Problemas encontrados:**
- Pruebas 1-5 (consultas básicas, "¿hay sitio para esta noche?" sin turno, etc.): funcionan correctamente con el system prompt v2
- Prueba 6 (modificar reserva sin herramienta dedicada, 2 intentos): el agente interpretó "modificar" como "cancelar + crear nueva" y **ejecutó `cancelar_reserva` de forma real sobre la reserva ID 6** antes de pedir confirmación, en ambos intentos — pese a una regla explícita añadida al system prompt prohibiéndolo. Verificado en BD con `psql` y reparado manualmente con `UPDATE reservas SET estado='confirmada' WHERE id=6` en ambas ocasiones
- Prueba 7 (cancelar sin ID ni teléfono): el agente intentó `cancelar_reserva("")` con ID vacío, violando la regla de cancelación en dos pasos; PostgreSQL rechazó la query por tipo de dato (`invalid input syntax for type integer`), evitando daño real por una protección incidental de la BD, no por diseño del agente. Salida con texto en chino mezclado en un punto (síntoma de inestabilidad del modelo)
- Prueba 8 (10 personas, aforo 8): ✅ rechazado correctamente, redacción algo confusa pero sin consecuencias
- Prueba 9 (fecha pasada, 1 enero 2020): **se creó una reserva real con fecha pasada** (ID 8) — ni el system prompt ni `resolver_fecha` validan que la fecha sea futura. Texto de respuesta contradictorio (decía "ya existe" una reserva que él mismo creó)
- Prueba 10 (turno "21:00", fuera de los 2 turnos válidos): **se creó una reserva real con turno="21:00"** (ID 9), corrompiendo integridad de datos; el agente consultó disponibilidad de 20:30 pero confirmó con 21:00
- IDs 8 y 9 borradas de la BD tras la prueba (`DELETE FROM reservas WHERE id IN (8,9)`)

**Decisiones tomadas:**
- Se confirma "lunes dicho un lunes = hoy" en `resolver_fecha` como decisión de diseño correcta (coherente con el uso natural del español: "el lunes que viene" se dice explícitamente así)
- Se descarta cambiar de modelo a DeepSeek R1 8B: los fallos de las pruebas 9 y 10 son de validación de datos determinista (fecha pasada, turno inválido), no de "razonamiento" — se resuelven en Python independientemente del modelo
- Hallazgo de seguridad documentado como prioritario: las reglas de confirmación en el system prompt NO son suficientes como única barrera para acciones irreversibles (`cancelar_reserva`) en modelos locales ~7B; requiere rediseño arquitectónico (separar "proponer" de "ejecutar", con confirmación a nivel de aplicación)
- Decisión de portfolio mantenida: código completo de las herramientas NO se sube al repo público (posible producto comercial)

**Siguiente paso:**
- Implementar en Python (independiente del modelo): (1) rechazar fechas pasadas en `resolver_fecha`/`crear_reserva`, (2) validar que `turno` sea exactamente "20:30" o "22:30" en `crear_reserva`/`consultar_disponibilidad`
- Diseñar mecanismo de confirmación para acciones destructivas (`cancelar_reserva`, futura `modificar_reserva`) fuera del LLM
- Subir a GitHub: carpeta `agente-recepcionista/` actualizada (README v2, ejemplo con `resolver_fecha`), `BACKLOG_MASTER.md`, `PROJECT_MEMORY.md`, `SESSION_LOG.md`, README principal
- Recalibrar cuánto tiempo dedicar a endurecer el agente vs. avanzar a Fase 5 (n8n), según tiempo disponible antes de fin de curso
- Publicar post de LinkedIn de cierre de Fases 2, 2.5 y 4

## 2026-06-14

**Hecho:**
- Instalado Git y configurado (`user.name`, `user.email`)
- Repo local conectado a GitHub (`git remote add origin`), resuelto conflicto de historiales con `push --force`
- Fase 1 subida y cerrada oficialmente en GitHub (README, sitemap corregido, todo el código)
- Instalado Ollama + Continue en VS Code
- Configurado `qwen2.5-coder:7b` (local, vía Ollama) como modelo de Continue — ya no usa créditos de Claude/Copilot
- Test de velocidad: ~3-5 segundos por respuesta con `qwen2.5-coder:7b` en RTX 5060 — rendimiento muy bueno
- Detectada limitación: `qwen2.5-coder:7b` no maneja bien "tool calling" (modo Agent) en Continue — funciona mejor en modo Chat pegando el código directamente
- Usado el modelo local para analizar `BookingModal.tsx` y extraer los campos del formulario de reservas
- Diseñada la estructura de tabla de reservas para Notion (Nombre, Teléfono, Fecha, Turno, Personas, Alergias/Notas, Estado)
- Creada la base de datos "Mifune - Reservas" en Notion ✅

**Problemas encontrados:**
- `git push` inicial falló por conflicto de historiales (remoto tenía commits que el local no tenía) → resuelto con `--force` (seguro en este caso, local tenía la versión completa)
- Continue en modo "Agent" con Qwen intenta usar herramientas (`open_file`, `type_in_page`) pero las describe como texto en vez de ejecutarlas → solución: usar modo "Chat" y pegar el código manualmente

**Decisiones tomadas:**
- `qwen2.5-coder:7b` confirmado como modelo local por defecto para este proyecto (rápido y suficiente para tareas pequeñas/medias)
- El `BookingModal.tsx` actual no tiene lógica de envío — se construirá desde cero
- Plan de conexión Notion: Notion DB → integración/API key → función servidor en Cloudflare Workers → conectar botón "Reservar"

**Siguiente paso:**
- Crear integración de Notion (obtener API key) y compartir la base de datos con ella
- Escribir función de servidor que reciba el formulario y lo envíe a Notion
- Conectar `BookingModal.tsx` a esa función

## 2026-06-13

**Hecho:**
- Auditoría SEO/GEO inicial de la web (Cloudflare Workers)
- Corregidos canonical, og:url, twitter:site (restos de Lovable apuntando a otro dominio)
- Actualizados meta title/description/og/twitter con copy real del restaurante
- Añadido JSON-LD Schema.org tipo Restaurant
- Repo hecho público, README creado con roadmap completo
- Sección "About" del repo limpiada (descripción, topics, URL correcta)
- Borrado deploy duplicado en Vercel
- Añadido apartado SEO/GEO al README
- Creados posts de LinkedIn (ES y EN) anunciando el proyecto
- Resuelto problema de build (`bun`/`npm`, coma faltante, etiqueta `<a>` rota)
- Deploy correcto a Cloudflare Workers confirmado
- Investigado plan para usar IA local (Ollama + Continue) como asistente de código en VS Code

**Problemas encontrados:**
- `bun` no estaba instalado en el sistema → se instaló, pero también funciona con `npm`
- Notepad corrompía el código al copiar/pegar (perdió una etiqueta `<a`) → se recomienda usar VS Code
- Google Search Console no es viable con dominio `.workers.dev` (no se controla el DNS) → descartado por ahora

**Decisiones tomadas:**
- No usar Vercel, Cloudflare Workers es el hosting definitivo
- No usar Google Search Console hasta tener dominio propio
- VS Code instalado como editor principal a partir de ahora
- Modelo local recomendado para empezar: `qwen2.5-coder:7b` con Continue

**Siguiente paso:**
- Comprobar `sitemap.xml` y `robots.txt`
- Marcar Fase 1 como cerrada en el README
- Empezar Fase 2 (Notion + formulario de reservas)

## 2026-06-14 (continuacion - tarde)

**Hecho:**
- Anadidos campos Email y Alergias/Notas al formulario de reservas (Fase 2.5 - memoria gastronomica basica)
- Actualizada columna Email en Notion (tipo Email) y "Alergias / Notas" funcionando correctamente
- Corregido booking.functions.ts para enviar el campo Email a Notion
- Resuelto error de sintaxis en BookingModal.tsx (problema de encoding al copiar/pegar) regenerando el archivo completo via descarga directa
- Build + deploy a produccion exitoso (orden correcto: npm run build ANTES de npx wrangler deploy)
- Probado flujo completo en produccion (mifune-zen-zaragoza.elbichez.workers.dev): formulario -> Notion con todos los campos
- Detectado y resuelto: README.md habia desaparecido de GitHub (nunca existio en el repo local; un push --force anterior lo borro de GitHub sin que el local lo tuviera)
- README.md recreado y actualizado con roadmap (Fases 1, 2 y 2.5 marcadas como completadas) y subido a git correctamente
- Decision: Fase 3 (Airtable) se posterga al final del proyecto, integrandola con un futuro modulo de inventario/despensa (en vez de ser un ejercicio aislado)
- Iniciada planificacion de Fase 4 (agentes IA locales): se decide instalar Docker Desktop como base para PostgreSQL, n8n, Open WebUI, Metabase y Qdrant en fases futuras

**Problemas encontrados:**
- Encoding roto en BookingModal.tsx al copiar/pegar codigo con tildes (aparecian caracteres tipo "Ã³") y un error de sintaxis "Unexpected token" en JSX que no se pudo localizar manualmente -> solucionado regenerando el archivo completo como descarga y copiandolo directamente al proyecto (sin copy/paste)
- wrangler deploy se ejecuto sin build previo y desplego una version antigua (.output cacheado) -> recordar SIEMPRE: npm run build ANTES de npx wrangler deploy
- README.md desaparecido de GitHub por un push --force antiguo que no lo incluia en el repo local -> recreado

**Decisiones tomadas:**
- Fase 3 (Airtable) pospuesta al final, se integrara con modulo de inventario para que aporte valor real al proyecto (no sera un ejercicio aislado)
- Se instala Docker Desktop como base de infraestructura para Fases 4-8 (PostgreSQL, n8n, Open WebUI, Metabase, Qdrant)
- Lecciones de proceso para futuras sesiones: (1) SIEMPRE guardar archivos con Ctrl+S y verificar con `type` antes de asumir que un cambio esta aplicado, (2) si hay error de sintaxis raro y no se localiza visualmente, regenerar el archivo completo en vez de seguir editando a mano, (3) build siempre antes de deploy

**Siguiente paso:**
- Terminar instalacion de Docker Desktop (reinicio pendiente) y confirmar con `docker --version`
- Levantar PostgreSQL via Docker
- Instalar Open WebUI
- Disenar esquema inicial de base de datos (clientes, reservas, turnos como minimo)
- Crear primer agente "Recepcionista de Mifune" con herramientas (consultar/crear/cancelar reservas)

## 2026-06-14 (continuacion - noche)

**Hecho:**
- Docker Desktop instalado y funcionando correctamente
- PostgreSQL levantado via Docker Compose (contenedor `mi_postgres_dev`, imagen postgres:16-alpine, persistencia con volumen `postgres_data`)
- Creadas tablas `clientes` (id, nombre, telefono, email, alergias_notas, creado_en) y `reservas` (id, cliente_id FK, fecha, turno, personas, estado, creado_en) en la base `mi_base_datos`
- Open WebUI instalado via Docker, accesible en localhost:3000, conectado correctamente a Ollama (qwen2.5-coder:7b) corriendo en el host

**Problemas encontrados:**
- Confusion inicial entre dos docker-compose.yml distintos creados en sesiones distintas (uno con container_name "mifune-postgres" / usuario "mifune_chef", otro con "mi_postgres_dev" / usuario "mi_usuario") -> se confirmo que el que esta CORRIENDO es `mi_postgres_dev` con usuario `mi_usuario` y base `mi_base_datos`, ese es el que se usa de ahora en adelante
- docker exec no pidio password al conectar con psql -> normal y esperado (conexion local dentro del propio contenedor)

**Decisiones tomadas:**
- Stack de infraestructura local Fase 4 confirmado: Docker + PostgreSQL (mi_postgres_dev / mi_usuario / mi_base_datos) + Open WebUI (localhost:3000) + Ollama (qwen2.5-coder:7b)
- docker-compose.yml de Postgres vive en C:\dev\postgres-local\, fuera del repo de Mifune (no requiere gitignore)

**Siguiente paso:**
- Diseñar el prompt de sistema del agente "Recepcionista de Mifune"
- Definir las herramientas (function calling) que el agente necesita: consultar reservas, crear reservas, cancelar reservas -> contra las tablas clientes/reservas en PostgreSQL
- Probar el agente desde Open WebUI
