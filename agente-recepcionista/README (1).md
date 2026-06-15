# 🤖 Agente Recepcionista de Mifune

Agente de IA conversacional que gestiona reservas del restaurante Mifune,
ejecutándose **100% en local** (sin coste, sin servicios cloud).

> ℹ️ El código completo de las herramientas no se incluye en este repo público
> por estar en desarrollo activo como posible producto — disponible bajo petición.
> Aquí se documenta la arquitectura, las decisiones técnicas y un ejemplo de
> implementación.

---

## 🧱 Stack

- **Modelo**: [Ollama](https://ollama.com/) + `qwen2.5:7b`
- **Interfaz**: [Open WebUI](https://github.com/open-webui/open-webui) (Docker, `localhost:3000`)
- **Base de datos**: PostgreSQL 16 (Docker), tablas `clientes` y `reservas`
- **Función calling**: módulo "Tools" de Open WebUI (Python + `psycopg2`)

Todo el stack es gratuito y open source, corriendo en una GPU de 8GB VRAM
(RTX 5060).

---

## 🛠️ Herramientas (function calling)

El agente dispone de 5 herramientas que le permiten consultar y modificar
la base de datos de reservas en tiempo real:

| Herramienta | Qué hace |
|---|---|
| `consultar_disponibilidad` | Comprueba cuántas plazas quedan libres en un turno (aforo total: 8) |
| `buscar_cliente` | Busca un cliente existente por teléfono, para no duplicar fichas |
| `crear_reserva` | Crea una reserva nueva, dando de alta al cliente si no existe, comprobando aforo disponible |
| `consultar_reservas_cliente` | Lista las reservas confirmadas de un cliente |
| `cancelar_reserva` | Cambia el estado de una reserva a "cancelada" |

---

## 🧠 System prompt (resumen)

El agente actúa como recepcionista de Mifune: conoce el aforo (8 plazas),
los turnos (20:30 y 22:30, martes a sábado), pide siempre los datos
necesarios para reservar, evita inventar disponibilidad, y reutiliza la
ficha del cliente si ya existe.

Se añadieron dos reglas adicionales tras pruebas reales:

1. **Fidelidad a resultados de herramientas**: el agente debe basar su
   respuesta únicamente en los datos exactos devueltos por la herramienta
   (fechas, IDs, nombres), sin mezclarlos con datos de mensajes anteriores.
2. **Presentación natural de listas**: al listar reservas, debe describirlas
   de forma conversacional dirigida al cliente, no como un volcado de datos.

---

## 📚 Decisiones técnicas y lecciones aprendidas

- **Cambio de modelo**: se empezó con `qwen2.5-coder:7b` (especializado en
  generación de código), pero presentaba tool calling poco fiable —
  en algunos casos "alucinaba" el resultado de una herramienta sin
  ejecutarla realmente. Se cambió a `qwen2.5:7b` (modelo general,
  entrenado para seguir instrucciones y usar herramientas), mismo tamaño
  y requisitos de VRAM, con resultados consistentes en las 5 herramientas.
- **Conexión Docker → host**: como Open WebUI corre en un contenedor Docker,
  la conexión a PostgreSQL (que corre en otro contenedor en el mismo host)
  usa `host.docker.internal` en lugar de `localhost`.
- **Gestión de secretos**: la contraseña de la base de datos se gestiona
  mediante variable de entorno, nunca hardcodeada en el código (ver ejemplo
  más abajo).

---

## 📄 Ejemplo de implementación

Ver [`ejemplo_herramienta.py`](./ejemplo_herramienta.py) para un ejemplo
completo y funcional de una de las herramientas
(`consultar_disponibilidad`), incluyendo el manejo de errores y la
configuración mediante variables de entorno.

---

## ✅ Estado

Fase 4 del proyecto completada: las 5 herramientas probadas con casos
reales de extremo a extremo (consulta de disponibilidad, alta de cliente,
creación de reserva, consulta de reservas y cancelación).
