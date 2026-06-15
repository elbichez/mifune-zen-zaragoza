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

| Herramienta | Qué hace |
|---|---|
| `consultar_disponibilidad` | Comprueba cuántas plazas quedan libres en un turno (aforo total: 8). Acepta expresiones temporales en lenguaje natural ("hoy", "mañana", "este viernes") |
| `buscar_cliente` | Busca un cliente existente por teléfono, para no duplicar fichas |
| `crear_reserva` | Crea una reserva nueva, dando de alta al cliente si no existe, comprobando aforo disponible |
| `consultar_reservas_cliente` | Lista las reservas confirmadas de un cliente |
| `cancelar_reserva` | Cambia el estado de una reserva a "cancelada" |

Una función interna `resolver_fecha()` normaliza expresiones temporales en
lenguaje natural ("hoy", "mañana", "pasado mañana", días de la semana) a
formato ISO `YYYY-MM-DD` usando el reloj del sistema. El LLM tiene
**prohibido calcular fechas por su cuenta**: siempre pasa la expresión
literal del usuario, y `resolver_fecha()` hace el cálculo real.

---

## 🧠 System prompt (resumen)

El agente actúa como recepcionista de Mifune: conoce el aforo (8 plazas),
los turnos (20:30 y 22:30, martes a sábado), pide siempre los datos
necesarios para reservar, evita inventar disponibilidad, y reutiliza la
ficha del cliente si ya existe.

### v1 → v2: reglas añadidas tras pruebas reales

1. **Fidelidad a resultados de herramientas**: la respuesta debe basarse
   únicamente en los datos exactos devueltos por la herramienta, sin
   mezclarlos con datos de mensajes anteriores.
2. **Presentación natural de listas**: al listar reservas, describirlas de
   forma conversacional, no como un volcado de datos.
3. **Delegación total de fechas a Python**: el LLM nunca calcula ni traduce
   expresiones temporales; siempre pasa el texto literal del usuario.
4. **Reglas de ambigüedad**: si falta fecha y/o turno, preguntar antes de
   ejecutar nada. Si falta solo el turno, consultar ambos turnos en paralelo.
5. **Separación estricta de intenciones**: disponibilidad, reservas
   existentes, creación, modificación y cancelación no deben mezclarse.
6. **Cancelación en dos pasos**: si no hay ID, buscar la reserva primero
   por teléfono y nunca inventar/adivinar un ID.

---

## 📚 Decisiones técnicas y lecciones aprendidas

- **Cambio de modelo**: se empezó con `qwen2.5-coder:7b` (especializado en
  código), con tool calling poco fiable — en algunos casos "alucinaba" el
  resultado de una herramienta sin ejecutarla. Se cambió a `qwen2.5:7b`
  (modelo general, entrenado para tool use), mismo tamaño/VRAM, con
  resultados consistentes en flujos simples.
- **Conexión Docker → host**: Open WebUI corre en un contenedor Docker, por
  lo que la conexión a PostgreSQL usa `host.docker.internal` en lugar de
  `localhost`.
- **Gestión de secretos**: la contraseña de la base de datos se gestiona
  mediante variable de entorno, nunca hardcodeada en el código.
- **Fechas en lenguaje natural**: delegadas a Python (`resolver_fecha`),
  con un "freno de mano" (`ERROR_FECHA_NO_SOPORTADA`) si la expresión no se
  entiende, evitando enviar texto inválido a una columna `DATE` de Postgres.

---

## 🚨 Hallazgos de las pruebas de estrés (2026-06-15)

Se diseñó una batería de 10 pruebas de estrés. El backend (Python + SQL)
se comportó correctamente en las 10; el LLM falló en varias al decidir
qué ejecutar y/o al redactar la respuesta. Resumen:

### 1. Modificación de reserva sin todos los datos (2 intentos)
El agente interpretó "modificar reserva" (sin herramienta dedicada) como
"cancelar + crear nueva", y **ejecutó `cancelar_reserva` sobre una reserva
real antes de pedir confirmación**, pese a que el system prompt lo prohibía
explícitamente — incluso tras añadir una regla específica de "pedir
confirmación antes de ejecutar". Se verificó en base de datos (`psql`) que
la reserva quedaba cancelada en ambos intentos.

**Conclusión**: las reglas de confirmación en el system prompt no bastan
como única barrera para acciones irreversibles en modelos locales ~7B. La
seguridad de operaciones destructivas no puede depender solo del prompt.

### 2. Cancelación sin ID ni teléfono
El agente intentó ejecutar `cancelar_reserva("")` con ID vacío, violando la
regla de "cancelación en dos pasos". **PostgreSQL rechazó la query**
(`invalid input syntax for type integer`) por validación de tipo, evitando
daño real — pero por una protección incidental de la base de datos, no por
diseño defensivo del agente.

### 3. Grupo mayor que el aforo total (10 personas, aforo 8)
✅ Rechazado correctamente, sin crear nada. Redacción algo confusa
("solo quedan 8 plazas" en vez de "el aforo total es 8"), pero sin
consecuencias.

### 4. Fecha en el pasado (1 de enero de 2020)
**Se creó una reserva real con fecha pasada** (ID 8). Ni el system prompt
ni `resolver_fecha()` validan que la fecha sea futura. Además, el texto de
respuesta fue contradictorio (afirmó que "ya existía" una reserva que él
mismo acababa de crear).

### 5. Turno fuera de rango ("21:00")
**Se creó una reserva real con `turno = "21:00"`** (ID 9), un valor que no
es uno de los dos turnos válidos del restaurante (20:30/22:30), corrompiendo
la integridad de los datos. El agente además consultó disponibilidad de
20:30 pero confirmó la reserva con 21:00 — incoherencia interna.

---

## 🔧 Próximos pasos identificados (no implementados todavía)

Los hallazgos 4 y 5 son fallos de **validación de datos**, no de
"razonamiento" del modelo — y se resuelven en Python, independientemente
del modelo usado:

- En `resolver_fecha()` / `crear_reserva`: rechazar fechas anteriores a la
  fecha actual del sistema, devolviendo un error limpio (mismo patrón que
  `ERROR_FECHA_NO_SOPORTADA`).
- En `crear_reserva` / `consultar_disponibilidad`: validar que `turno` sea
  exactamente `"20:30"` o `"22:30"`, devolviendo un error limpio en caso
  contrario.

El hallazgo 1 (modificación de reservas) requiere un **rediseño
arquitectónico**: separar "el LLM propone una acción" de "la acción se
ejecuta", con un paso de confirmación a nivel de aplicación (fuera del
LLM) para operaciones destructivas (`cancelar_reserva`, y cualquier futura
`modificar_reserva`).

Se descartó cambiar de modelo (ej. a DeepSeek R1 8B) como solución a estos
2 fallos: son validaciones deterministas que no dependen de la capacidad de
razonamiento del modelo.

---

## 📄 Ejemplo de implementación

Ver [`ejemplo_herramienta.py`](./ejemplo_herramienta.py) para un ejemplo
completo y funcional de una de las herramientas
(`consultar_disponibilidad`), incluyendo el manejo de errores y la
configuración mediante variables de entorno.

---

## ✅ Estado

Fase 4 del proyecto completada: las 5 herramientas funcionan correctamente
para flujos con datos completos y válidos desde el inicio (consultar
disponibilidad, alta de cliente, crear reserva, consultar reservas,
cancelar reserva dando ID o teléfono directamente), incluyendo soporte de
fechas en lenguaje natural.

Pendiente (próxima sesión): validaciones de fecha pasada y turno válido en
Python, y rediseño del flujo de confirmación para acciones destructivas.
