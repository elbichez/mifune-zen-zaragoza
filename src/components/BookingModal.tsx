import * as React from "react";
import { cn } from "@/lib/utils";
import { X, Calendar as CalendarIcon, Clock } from "lucide-react";
import { createBooking } from "@/lib/api/booking.functions";

interface BookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// --- CONSTANTES DE SEGURIDAD ESTRICTA ---
const MAX_NAME_LENGTH = 50;
const MAX_NOTES_LENGTH = 300;
const MAX_ATTEMPTS = 3;
const COOLDOWN_WINDOW_MS = 60_000; // 60 segundos (1 minuto)
const RATE_LIMIT_KEY = "mifune_booking_security_token";
const PHONE_REGEX = /^[+]?[0-9\s]{7,20}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Sanitiza cadenas de texto neutralizando vectores de ataque XSS comunes.
 * Escapa caracteres estructurales HTML para evitar interpretaciones en el renderizado.
 */
function sanitizeInput(value: string): string {
  if (!value) return "";
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, "") // Elimina bloques de script ejecutables
    .replace(/[<>&"']/g, (match) => {
      const entities: Record<string, string> = {
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        '"': "&quot;",
        "'": " &#x27;",
      };
      return entities[match] || match;
    })
    .trim();
}

/**
 * Obtiene las marcas de tiempo de las peticiones almacenadas en el cliente
 * filtrando aquellas que ya han expirado fuera de la ventana de cooldown.
 */
function getRecentAttempts(): number[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(RATE_LIMIT_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const now = Date.now();
    return parsed.filter((t) => typeof t === "number" && now - t < COOLDOWN_WINDOW_MS);
  } catch {
    return [];
  }
}

/**
 * Registra un nuevo intento de reserva bajo una marca de tiempo Unix actual.
 */
function recordAttempt(): number[] {
  const recent = [...getRecentAttempts(), Date.now()];
  try {
    window.localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(recent));
  } catch {
    // Failsafe pasivo si las politicas del navegador restringen el acceso a localStorage
  }
  return recent;
}

export function BookingModal({ open, onOpenChange }: BookingModalProps) {
  // --- DECLARACION UNIFICADA DE ESTADOS ---
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [date, setDate] = React.useState<string>("");
  const [time, setTime] = React.useState("");
  const [people, setPeople] = React.useState("");
  const [notes, setNotes] = React.useState("");

  // Estados de control operativo e infraestructura de seguridad
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState("");
  const [cooldown, setCooldown] = React.useState(false);
  const [honeypot, setHoneypot] = React.useState("");

  // Re-evaluacion del estado de bloqueo anti-DDoS local al abrir la interfaz
  React.useEffect(() => {
    if (open) {
      const attempts = getRecentAttempts();
      if (attempts.length >= MAX_ATTEMPTS) {
        setCooldown(true);
        setError("Demasiados intentos. Por favor, espere un minuto.");
      } else {
        setCooldown(false);
        setError("");
      }
    }
  }, [open]);

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || cooldown) return;

    // 1. Analisis de Honeypot: Si un bot ha interactuado con el campo oculto, abortamos.
    if (honeypot.trim() !== "") {
      console.warn("Actividad sospechosa de bot interceptada en Honeypot.");
      onOpenChange(false); // Cierre silencioso del canal de comunicacion
      return;
    }

    // 2. Control de Inundacion de Peticiones (Rate Limiting)
    const attempts = recordAttempt();
    if (attempts.length > MAX_ATTEMPTS) {
      setCooldown(true);
      setError("Demasiados intentos. Por favor, espere un minuto.");
      return;
    }

    // 3. Sanitizacion y validacion semantica estricta
    const cleanName = sanitizeInput(name);
    const cleanPhone = sanitizeInput(phone).replace(/\s+/g, ""); // Remueve espacios para la verificacion pura
    const cleanEmail = sanitizeInput(email).trim();
    const cleanNotes = sanitizeInput(notes);

    if (!cleanName || cleanName.length > MAX_NAME_LENGTH) {
      setError("Introduzca un nombre valido (maximo de 50 caracteres).");
      return;
    }

    if (!PHONE_REGEX.test(cleanPhone)) {
      setError("Introduzca un numero de telefono valido.");
      return;
    }

    if (!EMAIL_REGEX.test(cleanEmail)) {
      setError("Introduzca un correo electronico valido.");
      return;
    }

    if (!date || !time) {
      setError("Por favor, seleccione una fecha y hora validas para su servicio.");
      return;
    }

    const peopleNumber = Number(people);
    if (!peopleNumber || peopleNumber < 1 || peopleNumber > 8) {
      setError("El numero de comensales debe estar entre 1 y 8.");
      return;
    }

    if (cleanNotes.length > MAX_NOTES_LENGTH) {
      setError(`Las notas no pueden superar los ${MAX_NOTES_LENGTH} caracteres.`);
      return;
    }

    // Limpieza de estados de error ante validacion conforme
    setError("");
    setIsSubmitting(true);

    try {
      await createBooking({
        data: {
          nombre: cleanName,
          telefono: cleanPhone,
          email: cleanEmail,
          fecha: date,
          turno: time as "20:30" | "22:30",
          personas: peopleNumber,
          notas: cleanNotes || undefined,
        },
      });

      setIsSubmitting(false);
      // Reajuste y purga segura de variables sensibles post-transmision
      setName("");
      setPhone("");
      setEmail("");
      setDate("");
      setTime("");
      setPeople("");
      setNotes("");
      setHoneypot("");
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
      setError("No se ha podido completar la reserva. Intentelo de nuevo.");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md p-4">
      {/* Contenedor Principal: Estetica Zen de Medianoche */}
      <div className="relative w-full max-w-md border border-border/60 bg-background shadow-2xl transition-all duration-300 max-h-[90vh] overflow-y-auto">

        {/* Cabecera del Modal */}
        <div className="flex items-center justify-between border-b border-border/40 px-6 py-5">
          <div>
            <h2 className="text-xl font-light uppercase tracking-[0.2em] text-foreground">Reservar Mesa</h2>
            <p className="text-[10px] uppercase tracking-widest text-gold/80 mt-1">Exclusividad - Barra de 8 Asientos</p>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="text-muted-foreground hover:text-gold transition-colors focus:outline-none"
            aria-label="Cerrar ventana"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Formulario Controlado */}
        <form onSubmit={handleConfirm} className="space-y-5 px-6 py-6">

          {/* Trampa Antitrafico Automatizado (Honeypot) */}
          <div
            aria-hidden="true"
            className="absolute h-0 w-0 overflow-hidden opacity-0 pointer-events-none"
          >
            <label htmlFor="website_url_verification">No interactuar con este campo de control de seguridad</label>
            <input
              id="website_url_verification"
              type="text"
              name="website_url_verification"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </div>

          {/* Input: Nombre Completo */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-light uppercase tracking-[0.2em] text-muted-foreground">
              Nombre del Titular
            </label>
            <input
              type="text"
              id="nombre_reserva"
              name="nombre_reserva"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={MAX_NAME_LENGTH}
              required
              disabled={cooldown || isSubmitting}
              placeholder="Ej. Carlos Mifune"
              className="flex h-11 w-full border border-border bg-secondary/20 px-4 text-sm font-light text-foreground placeholder:text-muted-foreground/30 transition-colors focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/30 disabled:opacity-40"
            />
          </div>

          {/* Input: Contacto Telefonico */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-light uppercase tracking-[0.2em] text-muted-foreground">
              Telefono de Contacto
            </label>
            <input
              type="tel"
              id="telefono_reserva"
              name="telefono_reserva"
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/[^0-9+\s]/g, ""))}
              inputMode="tel"
              maxLength={20}
              required
              disabled={cooldown || isSubmitting}
              placeholder="+34 600 000 000"
              className="flex h-11 w-full border border-border bg-secondary/20 px-4 text-sm font-light text-foreground placeholder:text-muted-foreground/30 transition-colors focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/30 disabled:opacity-40"
            />
          </div>

          {/* Input: Email de Contacto */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-light uppercase tracking-[0.2em] text-muted-foreground">
              Correo Electronico
            </label>
            <input
              type="email"
              id="email_reserva"
              name="email_reserva"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              maxLength={100}
              required
              disabled={cooldown || isSubmitting}
              placeholder="cliente@email.com"
              className="flex h-11 w-full border border-border bg-secondary/20 px-4 text-sm font-light text-foreground placeholder:text-muted-foreground/30 transition-colors focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/30 disabled:opacity-40"
            />
          </div>

          {/* Bloque: Fecha y Hora del Servicio */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-light uppercase tracking-[0.2em] text-muted-foreground">
                Fecha
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  disabled={cooldown || isSubmitting}
                  className="flex h-11 w-full border border-border bg-secondary/20 px-4 pr-10 text-sm font-light text-foreground transition-colors focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/30 disabled:opacity-40"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-light uppercase tracking-[0.2em] text-muted-foreground">
                Turno Disponibles
              </label>
              <div className="relative">
                <select
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                  disabled={cooldown || isSubmitting}
                  className="flex h-11 w-full border border-border bg-secondary/20 px-4 text-sm font-light text-foreground transition-colors focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/30 disabled:opacity-40 appearance-none"
                >
                  <option value="" disabled className="bg-background text-muted-foreground">Seleccionar...</option>
                  <option value="20:30" className="bg-background text-foreground">Primer Servicio - 20:30</option>
                  <option value="22:30" className="bg-background text-foreground">Segundo Servicio - 22:30</option>
                </select>
                <Clock className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 pointer-events-none text-muted-foreground/60" />
              </div>
            </div>
          </div>

          {/* Input: Numero de Comensales */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-light uppercase tracking-[0.2em] text-muted-foreground">
              Comensales
            </label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[1-8]"
              id="pax_total_seats"
              name="pax_total_seats"
              autoComplete="new-password"
              value={people}
              onChange={(e) => {
                const val = e.target.value.replace(/[^1-8]/g, "");
                setPeople(val);
              }}
              required
              disabled={cooldown || isSubmitting}
              placeholder="Maximo 8"
              className="flex h-11 w-full border border-border bg-secondary/20 px-4 text-sm font-light text-foreground placeholder:text-muted-foreground/30 transition-colors focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/30 disabled:opacity-40"
            />
          </div>

          {/* Input: Alergias / Notas */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-light uppercase tracking-[0.2em] text-muted-foreground">
              Alergias o Comentarios (opcional)
            </label>
            <textarea
              id="notas_reserva"
              name="notas_reserva"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              maxLength={MAX_NOTES_LENGTH}
              disabled={cooldown || isSubmitting}
              placeholder="Ej. Alergia al marisco, celebracion de aniversario..."
              rows={3}
              className="flex w-full border border-border bg-secondary/20 px-4 py-2.5 text-sm font-light text-foreground placeholder:text-muted-foreground/30 transition-colors focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/30 disabled:opacity-40 resize-none"
            />
          </div>

          {/* Alertas de Validacion / Cooldown de Seguridad */}
          {error && (
            <div className="p-3 bg-crimson/10 border border-crimson/20 rounded-sm">
              <p className="text-xs font-light tracking-wide text-crimson" role="alert">
                {error}
              </p>
            </div>
          )}

          {/* Panel de Acciones */}
          <div className="flex items-center justify-end gap-4 pt-2">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => onOpenChange(false)}
              className="text-xs font-light uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors py-2 disabled:opacity-40"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || cooldown}
              className="group relative inline-flex items-center justify-center overflow-hidden border border-gold/40 bg-transparent px-8 py-3 text-xs font-light uppercase tracking-[0.3em] text-gold transition-all duration-500 hover:border-gold hover:text-background disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <span className="absolute inset-0 -translate-y-full bg-gold transition-transform duration-500 ease-out group-hover:translate-y-0" />
              <span className="relative z-10 font-medium">
                {isSubmitting ? "Procesando..." : "Confirmar Acceso"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
