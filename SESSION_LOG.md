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
