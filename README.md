# Mifune Zen Zaragoza

> Sitio web de **Mifune**, un restaurante japones omakase de alta cocina (ficticio) ubicado en Zaragoza. Proyecto desarrollado como pieza central de un portfolio de automatizacion y agentes IA aplicados a la gestion de un negocio de hosteleria real.

Demo en vivo: [mifune-zen-zaragoza.elbichez.workers.dev](https://mifune-zen-zaragoza.elbichez.workers.dev/)

---

## Sobre el proyecto

Mifune es un restaurante omakase ficticio de 8 plazas con dos turnos de cena (20:30 y 22:30), de martes a sabado. Esta web es el **punto de partida** de un proyecto mas amplio cuyo objetivo es construir, capa a capa, un sistema de gestion completo para un restaurante de alta cocina:

- Web publica (este repo) - presentacion, carta, ubicacion, reservas.
- Gestion de reservas y CRM de clientes (en curso).
- Control de inventario / despensa.
- Seguimiento de ingresos y gastos.
- Agentes IA locales (recepcionista, chef, compras) ejecutados con Ollama.
- Automatizaciones con n8n.
- Dashboards operativos con Metabase.

Cada fase se documenta y se versiona como un hito independiente (ver [Roadmap](#roadmap)).

La web incluye optimizacion SEO clasica (metadatos, sitemap, datos estructurados Schema.org) y esta pensada tambien para **GEO (Generative Engine Optimization)**: el contenido y el marcado estructurado estan disenados para que asistentes de IA (ChatGPT, Gemini, Perplexity...) puedan entender y recomendar correctamente el restaurante cuando un usuario les pregunte por opciones gastronomicas en Zaragoza.

---

## Stack tecnico

| Capa | Tecnologia |
|---|---|
| Frontend | React + TypeScript + Vite + TanStack Start |
| Estilos | Tailwind CSS |
| Backend | Funciones de servidor (TanStack Start `createServerFn`) |
| Base de datos de reservas | Notion (API) |
| Hosting | Cloudflare Workers |
| Generacion inicial | [Lovable](https://lovable.dev) |

---

## Desarrollo local

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo
npm run dev

# Build de produccion
npm run build
```

### Variables de entorno

Crea un archivo `.env` en la raiz (no se sube a git) con:

```
NOTION_API_KEY=tu_token_de_integracion_de_notion
NOTION_DATABASE_ID=tu_database_id
```

### Despliegue en Cloudflare Workers

El despliegue se realiza desde local con [Wrangler](https://developers.cloudflare.com/workers/wrangler/):

```bash
npm run build
npx wrangler deploy
```

Los secretos de produccion (`NOTION_API_KEY`, `NOTION_DATABASE_ID`) se configuran con:

```bash
npx wrangler secret put NOTION_API_KEY
npx wrangler secret put NOTION_DATABASE_ID
```

---

## Roadmap

- [x] **Fase 1 - Web institucional**: presentacion, carta, ubicacion, SEO/GEO completo (metadatos, sitemap, JSON-LD Restaurant).
- [x] **Fase 2 - Reservas (Notion)**: formulario de reservas conectado a una base de datos de Notion mediante una funcion de servidor (Cloudflare Worker).
- [x] **Fase 2.5 - Memoria gastronomica basica**: el formulario captura tambien email y alergias/preferencias del cliente, visibles para el equipo de sala y cocina en Notion.
- [ ] **Fase 3 - Airtable**: replica de la estructura de reservas (Clientes, Reservas, Turnos) para aprender la herramienta.
- [x] **Fase 4 - Agentes IA (Ollama + Open WebUI + PostgreSQL)**: agente recepcionista "Agente de Reservas Mifune" (qwen2.5:7b) con 5 herramientas para consultar disponibilidad, gestionar clientes, y crear/consultar/cancelar reservas. Ver [`agente-recepcionista/`](./agente-recepcionista/).
- [ ] **Fase 5 - Automatizacion (n8n)**: flujos de reserva, lista de espera, notificaciones.
- [ ] **Fase 6 - CRM con memoria gastronomica avanzada (RAG + Qdrant)**: historico de visitas y preferencias por cliente.
- [ ] **Fase 7 - Chef IA y Compras IA**: generacion de menus y listas de compra a partir del inventario y las reservas.
- [ ] **Fase 8 - Dashboard operativo (Metabase)**: ocupacion, ingresos, gastos y beneficio en tiempo real.

---

## El restaurante

**Mifune** - Calle del Temple, 9 - Zaragoza
Martes a sabado - Dos servicios (20:30 y 22:30) - Domingo y lunes cerrado
Omakase de 14 pases - Barra de 8 asientos

---

## Licencia

Proyecto educativo / portfolio. Todo el contenido (restaurante, platos, datos de contacto) es ficticio.
