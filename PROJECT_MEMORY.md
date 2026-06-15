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
4. ✅ **Fase 4 — Agentes IA**: Ollama (qwen2.5:7b) + Open WebUI + PostgreSQL, agente recepcionista "Agente de Reservas Mifune" con 5 herramientas (consultar disponibilidad, buscar cliente, crear/consultar/cancelar reservas)
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

## ⚠️ Cosas pendientes / a vigilar

- Limpiar referencias residuales a "Lovable" en el código si se quiere un repo 100% propio (baja prioridad)
- Considerar comprar un dominio propio si el proyecto avanza mucho (mejoraría imagen y permitiría Search Console)
- El usuario edita archivos con VS Code (recién instalado) — cuando le pases código, dale el archivo completo, no fragmentos, porque copiar/pegar parcial le ha dado errores antes
- Al unificar en el futuro Notion ↔ PostgreSQL, revisar que coincidan los nombres de campo (ej. "Teléfono" con acento en Notion vs `telefono` sin acento en Postgres)

## 🐳 Infraestructura local (Fase 4)

- PostgreSQL corriendo via Docker, contenedor llamado `mi_postgres_dev` (imagen postgres:16-alpine)
- Archivo `docker-compose.yml` en `C:\dev\postgres-local\` (FUERA del repo de Mifune, no necesita .gitignore)
- Usuario: `mi_usuario` | Base de datos: `mi_base_datos` | Puerto: 5432 | Contraseña: anotada de forma segura por el usuario
- Volumen persistente: `postgres_data`
- Para conectar: `docker exec -it mi_postgres_dev psql -U mi_usuario -d mi_base_datos` (no pide password al ejecutar dentro del contenedor, es normal)
- Tablas creadas: `clientes` (id, nombre, telefono, email, alergias_notas, creado_en) y `reservas` (id, cliente_id FK, fecha, turno, personas, estado, creado_en)
- Open WebUI corriendo via Docker en `localhost:3000`, conectado a Ollama (host)

## 🤖 Agente Recepcionista (Fase 4 — completada 2026-06-15)

- Modelo: `qwen2.5:7b` (cambiado desde `qwen2.5-coder:7b` por mejor tool calling — el modelo "coder" alucinaba resultados de herramientas sin ejecutarlas, o las ejecutaba pero redactaba mal el resultado final)
- Interfaz: Open WebUI (localhost:3000), modelo configurado como "Agente de Reservas Mifune"
- Herramienta: "Mifune_disponibilidad", con 5 funciones Python (psycopg2) conectadas a `mi_postgres_dev`:
  - `consultar_disponibilidad` (fecha, turno) → plazas libres
  - `buscar_cliente` (telefono) → datos del cliente si existe
  - `crear_reserva` (nombre, telefono, fecha, turno, personas, email, alergias_notas) → crea cliente si no existe + reserva, comprobando aforo
  - `consultar_reservas_cliente` (telefono) → lista reservas confirmadas
  - `cancelar_reserva` (reserva_id) → marca reserva como cancelada
- System prompt incluye 2 reglas extra tras pruebas: (1) fidelidad estricta a los datos devueltos por las herramientas, sin mezclar con mensajes anteriores, (2) presentar listas de reservas de forma conversacional, no como volcado de datos
- Conexion Postgres desde Open WebUI usa `host.docker.internal` (no `localhost`, por estar en contenedores distintos)
- Decision de portfolio: codigo completo de las herramientas NO esta en el repo publico (posible producto comercial). Repo solo incluye README + 1 ejemplo (`consultar_disponibilidad`) en `agente-recepcionista/`
- Probado end-to-end con casos reales: alta de cliente (Ana García, tel. 600111222), consulta de disponibilidad, creación/consulta/cancelación de reservas — todo verificado directamente en PostgreSQL
