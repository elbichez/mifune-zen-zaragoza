import * as React from "react";
import { cn } from "@/lib/utils";
import { X, Calendar as CalendarIcon, Clock } from "lucide-react";

interface BookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// --- CONSTANTES DE SEGURIDAD ESTRICTA ---
const MAX_NAME_LENGTH = 50;
const MAX_ATTEMPTS = 3;
const COOLDOWN_WINDOW_MS = 60_000; // 60 segundos (1 minuto)
const RATE_LIMIT_KEY = "mifune_booking_security_token";
const PHONE_REGEX = /^[+]?[0-9\s]{7,20}$/;

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
    // Failsafe pasivo si las políticas del navegador restringen el acceso a localStorage
  }
  return recent;
}

export function BookingModal({ open, onOpenChange }: BookingModalProps) {
  // --- DECLARACIÓN UNIFICADA DE ESTADOS ---
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [date, setDate] = React.useState<string>("");
  const [time, setTime] = React.useState("");
  
  // Estados de control operativo e infraestructura de seguridad
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState("");
  const [cooldown, setCooldown] = React.useState(false);
  const [honeypot, setHoneypot] = React.useState("");

  // Re-evaluación del estado de bloqueo anti-DDoS local al abrir la interfaz
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

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || cooldown) return;

    // 1. Análisis de Honeypot: Si un bot ha interactuado con el campo oculto, abortamos.
    if (honeypot.trim() !== "") {
      console.warn("Actividad sospechosa de bot interceptada en Honeypot.");
      onOpenChange(false); // Cierre silencioso del canal de comunicación
      return;
    }

    // 2. Control de Inundación de Peticiones (Rate Limiting)
    const attempts = recordAttempt();
    if (attempts.length > MAX_ATTEMPTS) {
      setCooldown(true);
      setError("Demasiados intentos. Por favor, espere un minuto.");
      return;
    }

    // 3. Sanitización y validación semántica estricta
    const cleanName = sanitizeInput(name);
    const cleanPhone = sanitizeInput(phone).replace(/\s+/g, ""); // Remueve espacios para la verificación pura

    if (!cleanName || cleanName.length > MAX_NAME_LENGTH) {
      setError("Introduzca un nombre válido (máximo de 50 caracteres).");
      return;
    }

    if (!PHONE_REGEX.test(cleanPhone)) {
      setError("Introduzca un número de teléfono válido.");
      return;
    }

    if (!date || !time) {
      setError("Por favor, seleccione una fecha y hora válidas para su servicio.");
      return;
    }

    // Limpieza de estados de error ante validación conforme
    setError("");
    setIsSubmitting(true);

    // Simulación controlada del pipeline de persistencia de reservas
    setTimeout(() => {
      setIsSubmitting(false);
      // Reajuste y purga segura de variables sensibles post-transmisión
      setName("");
      setPhone("");
      setDate("");
      setTime("");
      setHoneypot("");
      onOpenChange(false);
    }, 1200);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md p-4">
      {/* Contenedor Principal: Estética Zen de Medianoche */}
      <div className="relative w-full max-w-md border border-border/60 bg-background shadow-2xl transition-all duration-300">
        
        {/* Cabecera del Modal */}
        <div className="flex items-center justify-between border-b border-border/40 px-6 py-5">
          <div>
            <h2 className="text-xl font-light uppercase tracking-[0.2em] text-foreground">Reservar Mesa</h2>
            <p className="text-[10px] uppercase tracking-widest text-gold/80 mt-1">Exclusividad · Barra de 8 Asientos</p>
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
          
          {/* Trampa Antitráfico Automatizado (Honeypot) */}
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
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={MAX_NAME_LENGTH}
              required
              disabled={cooldown || isSubmitting}
              placeholder="Ej. Carlos Mifune"
              className="flex h-11 w-full border border-border bg-secondary/20 px-4 text-sm font-light text-foreground placeholder:text-muted-foreground/30 transition-colors focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/30 disabled:opacity-40"
            />
          </div>

          {/* Input: Contacto Telefónico */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-light uppercase tracking-[0.2em] text-muted-foreground">
              Teléfono de Contacto
            </label>
            <input
              type="tel"
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

          {/* Alertas de Validación / Cooldown de Seguridad */}
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