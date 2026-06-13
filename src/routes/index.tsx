import { createFileRoute } from "@tanstack/react-router";
import { useState, useCallback, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, MapPin, Clock, Phone } from "lucide-react";

import { BookingModal } from "@/components/BookingModal";

import heroTexture from "@/assets/hero-texture.jpg";
import dishOtoro from "@/assets/dish-otoro.jpg";
import dishWagyu from "@/assets/dish-wagyu.jpg";
import dishUni from "@/assets/dish-uni.jpg";
import dishSashimi from "@/assets/dish-sashimi.jpg";
import omakaseImg from "@/assets/omakase.jpg";
import mapDark from "@/assets/map-dark.jpg";

export const Route = createFileRoute("/")({
  head: () => {
    const title = "Mifune | Restaurante Japonés Omakase Exclusivo en Zaragoza";
    const description =
      "Descubra Mifune, el restaurante japonés más exclusivo de Zaragoza. Una experiencia omakase íntima de 14 pases con sushi de autor, Wagyu A5 y producto de temporada en pleno centro de Zaragoza. Reserva previa imprescindible.";
    const url = "https://mifune-zen-zaragoza.elbichez.workers.dev";
    const ogImage = `${url}${omakaseImg}`;

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": ["Restaurant", "FoodEstablishment"],
      name: "Mifune",
      description,
      url,
      image: ogImage,
      telephone: "+34 976 000 000",
      email: "reservas@mifune.es",
      priceRange: "$$$$",
      servesCuisine: ["Japonesa", "Omakase", "Alta Cocina", "Kaiseki"],
      acceptsReservations: "True",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Calle del Temple, 9",
        addressLocality: "Zaragoza",
        addressRegion: "Aragón",
        postalCode: "50003",
        addressCountry: "ES",
      },
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
          opens: "20:30",
          closes: "23:59",
        },
      ],
      hasMenu: {
        "@type": "Menu",
        name: "Carta Mifune",
        hasMenuSection: {
          "@type": "MenuSection",
          name: "Piezas Señaladas",
          hasMenuItem: [
            {
              "@type": "MenuItem",
              name: "Toro Carpaccio",
              description: "Ventresca de atún, ponzu yuzu y cebollino",
              offers: { "@type": "Offer", price: "38", priceCurrency: "EUR" },
            },
            {
              "@type": "MenuItem",
              name: "Wagyu Sumibi",
              description: "Wagyu A5 a la brasa con sal de yuzu",
              offers: { "@type": "Offer", price: "72", priceCurrency: "EUR" },
            },
            {
              "@type": "MenuItem",
              name: "Omakase Mifune",
              description: "Menú degustación de 14 pases",
              offers: { "@type": "Offer", price: "180", priceCurrency: "EUR" },
            },
          ],
        },
      },
    };

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "restaurant" },
        { property: "og:locale", content: "es_ES" },
        { property: "og:url", content: url },
        { property: "og:image", content: ogImage },
        { property: "og:site_name", content: "Mifune" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: ogImage },
      ],
      links: [
        { rel: "canonical", href: url },
        { rel: "preload", as: "image", href: heroTexture, fetchpriority: "high" },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(jsonLd),
        },
      ],
    };
  },
  component: Index,
});

const dishes = [
  {
    img: dishOtoro,
    name: "Otoro & Oro",
    note: "Nigiri de toro con pan de oro 24k",
    alt: "Nigiri de atún toro con lámina de oro de 24 quilates en el restaurante japonés Mifune de Zaragoza",
  },
  {
    img: dishWagyu,
    name: "Wagyu A5",
    note: "Lomo flameado, salsa tare madurada",
    alt: "Lomo de Wagyu A5 flameado con salsa tare madurada servido en el restaurante Mifune Zaragoza",
  },
  {
    img: dishUni,
    name: "Uni & Caviar",
    note: "Erizo de mar y caviar Oscietra",
    alt: "Erizo de mar uni con caviar Oscietra, plato de alta cocina japonesa del restaurante Mifune en Zaragoza",
  },
  {
    img: dishSashimi,
    name: "Sashimi de Autor",
    note: "Selección del día con caviar",
    alt: "Sashimi de autor con selección de pescado del día y caviar en el restaurante omakase Mifune Zaragoza",
  },
];

const menu = [
  { name: "Toro Carpaccio", desc: "Ventresca, ponzu yuzu, cebollino", price: "38€" },
  { name: "Kinmedai Yaki", desc: "Besugo dorado, miso blanco, sake", price: "44€" },
  { name: "Wagyu Sumibi", desc: "Wagyu A5 a la brasa, sal de yuzu", price: "72€" },
  { name: "Anago Nigiri", desc: "Anguila de mar, reducción dulce", price: "26€" },
  { name: "Hotate Tartar", desc: "Vieira, dashi gelée, wasabi fresco", price: "34€" },
  { name: "Omakase Mifune", desc: "Menú degustación de 14 pases", price: "180€" },
];

function ReserveButton({
  className = "",
  onClick,
}: {
  className?: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative inline-flex items-center justify-center overflow-hidden border border-gold/50 bg-transparent px-10 py-4 text-xs font-light uppercase tracking-[0.35em] text-gold transition-all duration-500 hover:border-gold hover:text-primary-foreground ${className}`}
    >
      <span className="absolute inset-0 -translate-y-full bg-gold transition-transform duration-500 ease-out group-hover:translate-y-0" />
      <span className="absolute inset-0 opacity-0 shadow-[0_0_40px_oklch(0.78_0.12_78/0.55)] transition-opacity duration-500 group-hover:opacity-100" />
      <span className="relative z-10">Reservar Mesa</span>
    </button>
  );
}

function Index() {
  const [active, setActive] = useState(0);
  const [bookingOpen, setBookingOpen] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startAutoplay = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActive((p) => (p + 1) % dishes.length);
    }, 4000);
  }, []);

  useEffect(() => {
    startAutoplay();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startAutoplay]);

  const go = useCallback(
    (dir: number) => {
      setActive((p) => (p + dir + dishes.length) % dishes.length);
      startAutoplay();
    },
    [startAutoplay],
  );

  const goTo = useCallback(
    (i: number) => {
      setActive(i);
      startAutoplay();
    },
    [startAutoplay],
  );

  return (
    <>
      <BookingModal open={bookingOpen} onOpenChange={setBookingOpen} />
      <main className="bg-background text-foreground">
      {/* HERO */}
      <section className="relative flex h-screen min-h-[640px] w-full items-center justify-center overflow-hidden">
        <img
          src={heroTexture}
          alt="Interior de piedra y oro del restaurante japonés Mifune, especializado en omakase de alta cocina en el centro de Zaragoza"
          width={1920}
          height={1280}
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full scale-110 object-cover opacity-50 blur-[2px]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/40 to-background" />

        <div className="absolute left-8 top-8 text-xs font-light uppercase tracking-[0.4em] text-foreground/70 md:left-14 md:top-10">
          Zaragoza
        </div>
        <div className="absolute right-8 top-8 hidden text-xs font-light uppercase tracking-[0.4em] text-foreground/70 md:right-14 md:top-10 md:block">
          Est. 2024
        </div>

        <div className="relative z-10 flex flex-col items-center px-6 text-center">
          <p className="mb-6 text-xs font-light uppercase tracking-[0.5em] text-gold/90">
            Alta Cocina Japonesa
          </p>
          <div className="flex items-start justify-center gap-5">
            <h1 className="text-[20vw] font-light leading-none tracking-[0.08em] text-foreground md:text-[12rem]">
              MIFUNE
            </h1>
            <span className="text-vertical mt-2 text-base font-light tracking-[0.3em] text-gold/80 md:text-xl">
              三船
            </span>
          </div>
          <p className="mt-8 max-w-md text-sm font-light leading-relaxed tracking-wide text-muted-foreground">
            Mifune es un restaurante japonés ubicado en el centro de Zaragoza,
            especializado en una experiencia omakase íntima de catorce pases.
            Mifune combina producto de temporada, sushi de autor y Wagyu A5 en
            una barra de ocho asientos.
          </p>
          <ReserveButton className="mt-12 animate-soft-float" onClick={() => setBookingOpen(true)} />
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-light uppercase tracking-[0.4em] text-muted-foreground">
          Desliza
        </div>
      </section>

      {/* CULINARY GALLERY SLIDER */}
      <section className="border-t border-border/40 px-6 py-28 md:px-14 md:py-40">
        <div className="mx-auto mb-16 flex max-w-7xl items-end justify-between">
          <div>
            <p className="mb-4 text-xs font-light uppercase tracking-[0.4em] text-gold/90">
              La Galería
            </p>
            <h2 className="text-4xl tracking-wide md:text-6xl">El Arte del Producto</h2>
          </div>
          <div className="hidden gap-3 md:flex">
            <button
              aria-label="Anterior"
              onClick={() => go(-1)}
              className="flex h-12 w-12 items-center justify-center border border-border text-foreground/70 transition-colors duration-300 hover:border-gold hover:text-gold"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              aria-label="Siguiente"
              onClick={() => go(1)}
              className="flex h-12 w-12 items-center justify-center border border-border text-foreground/70 transition-colors duration-300 hover:border-gold hover:text-gold"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="mx-auto max-w-7xl overflow-hidden">
          <div
            className="flex transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)]"
            style={{ transform: `translateX(-${active * 100}%)` }}
          >
            {dishes.map((d) => (
              <div key={d.name} className="w-full flex-shrink-0 px-2 md:px-0">
                <figure className="group relative mx-auto aspect-[4/3] max-w-5xl overflow-hidden">
                  <img
                    src={d.img}
                    alt={d.alt}
                    loading="lazy"
                    decoding="async"
                    width={1024}
                    height={768}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
                  <figcaption className="absolute bottom-0 left-0 flex w-full items-end justify-between p-8 md:p-10">
                    <div>
                      <h3 className="text-3xl tracking-wide md:text-4xl">{d.name}</h3>
                      <p className="mt-1 text-xs font-light uppercase tracking-[0.3em] text-muted-foreground">
                        {d.note}
                      </p>
                    </div>
                    <span className="font-serif text-2xl text-gold/70">
                      0{dishes.indexOf(d) + 1}
                    </span>
                  </figcaption>
                </figure>
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-10 flex max-w-7xl items-center justify-center gap-3 md:justify-start">
          {dishes.map((d, i) => (
            <button
              key={d.name}
              aria-label={`Ver ${d.name}`}
              onClick={() => goTo(i)}
              className={`h-px transition-all duration-500 ${
                i === active ? "w-12 bg-gold" : "w-6 bg-border"
              }`}
            />
          ))}
        </div>
      </section>

      {/* OMAKASE PHILOSOPHY */}
      <section className="grid grid-cols-1 border-t border-border/40 md:grid-cols-2">
        <div className="relative aspect-square overflow-hidden md:aspect-auto">
          <img
            src={omakaseImg}
            alt="Itamae del restaurante Mifune emplatando sushi en la barra de omakase de ocho asientos en Zaragoza"
            loading="lazy"
            decoding="async"
            width={1200}
            height={1400}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-col justify-center px-8 py-24 md:px-20 md:py-0">
          <p className="mb-6 text-xs font-light uppercase tracking-[0.4em] text-gold/90">
            Omakase
          </p>
          <h2 className="max-w-md text-4xl leading-tight tracking-wide md:text-6xl">
            El omakase de Mifune, en manos del maestro
          </h2>
          <p className="mt-10 max-w-sm text-sm font-light leading-loose text-muted-foreground">
            El menú omakase de Mifune se compone de catorce pases.
            Cada pieza nace del mercado del día y el itamae la sirve en su
            instante preciso, frente al comensal, en la barra del restaurante.
          </p>
          <p className="mt-6 max-w-sm text-sm font-light leading-loose text-muted-foreground">
            Una conversación silenciosa entre el itamae y el producto.
          </p>
          <div className="mt-12 flex items-center gap-10">
            <div>
              <p className="font-serif text-4xl text-gold">14</p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                Pases
              </p>
            </div>
            <div className="h-10 w-px bg-border" />
            <div>
              <p className="font-serif text-4xl text-gold">8</p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                Asientos
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MENU HIGHLIGHTS */}
      <section className="border-t border-border/40 px-6 py-28 md:px-14 md:py-40">
        <div className="mx-auto max-w-7xl">
          <div className="mb-20 text-center">
            <p className="mb-4 text-xs font-light uppercase tracking-[0.4em] text-gold/90">
              La Carta
            </p>
            <h2 className="text-4xl tracking-wide md:text-6xl">Piezas Señaladas</h2>
          </div>
          <div className="grid grid-cols-1 gap-x-16 gap-y-14 md:grid-cols-3">
            {menu.map((m) => (
              <div key={m.name} className="group">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-2xl tracking-wide transition-colors duration-300 group-hover:text-gold">
                    {m.name}
                  </h3>
                  <span className="font-serif text-xl text-muted-foreground transition-colors duration-300 group-hover:text-gold">
                    {m.price}
                  </span>
                </div>
                <p className="mt-3 text-sm font-light leading-relaxed text-muted-foreground">
                  {m.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LOCATION & CONTACT */}
      <section
        id="contacto"
        className="relative border-t border-border/40"
      >
        <div className="relative h-[420px] w-full overflow-hidden md:h-[520px]">
          <img
            src={mapDark}
            alt="Mapa nocturno de la ubicación del restaurante Mifune en la Calle del Temple, centro de Zaragoza"
            loading="lazy"
            decoding="async"
            width={1920}
            height={1080}
            className="h-full w-full object-cover opacity-40 grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-transparent to-background" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <MapPin className="h-7 w-7 text-gold" />
            <p className="mt-4 text-xs font-light uppercase tracking-[0.4em] text-foreground/80">
              Calle del Temple, 9 · Zaragoza
            </p>
          </div>
        </div>

        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 py-24 md:grid-cols-3 md:px-14">
          <div>
            <p className="mb-5 flex items-center gap-2 text-xs font-light uppercase tracking-[0.3em] text-gold/90">
              <Clock className="h-4 w-4" /> Horario
            </p>
            <p className="text-sm font-light leading-loose text-muted-foreground">
              Martes — Sábado
              <br />
              Dos servicios · 20:30 & 22:30
              <br />
              Domingo y Lunes cerrado
            </p>
          </div>
          <div>
            <p className="mb-5 flex items-center gap-2 text-xs font-light uppercase tracking-[0.3em] text-gold/90">
              <Phone className="h-4 w-4" /> Reservas
            </p>
            <p className="text-sm font-light leading-loose text-muted-foreground">
              +34 976 000 000
              <br />
              reservas@mifune.es
              <br />
              Solo bajo reserva previa.
            </p>
          </div>
          <div className="flex flex-col items-start justify-between gap-8">
            <p className="text-sm font-light italic leading-loose text-muted-foreground">
              “El silencio es el primer ingrediente.”
            </p>
            <ReserveButton onClick={() => setBookingOpen(true)} />
          </div>
        </div>

        <div className="border-t border-border/40 px-6 py-10 md:px-14">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-[10px] uppercase tracking-[0.3em] text-muted-foreground md:flex-row">
            <span className="font-serif text-base tracking-[0.2em] text-foreground">
              MIFUNE 三船
            </span>
            <span>© 2024 Mifune Omakase · Zaragoza</span>
          </div>
        </div>
      </section>
    </main>
    </>
  );
}
