import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getServerConfig } from "../config.server";

export const createBooking = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      nombre: z.string().min(1),
      telefono: z.string().min(1),
      email: z.string().email(),
      fecha: z.string(),
      turno: z.enum(["20:30", "22:30"]),
      personas: z.number().min(1).max(8),
      notas: z.string().optional(),
    }),
  )
  .handler(async ({ data }) => {
    const config = getServerConfig();

    if (!config.notionApiKey || !config.notionDatabaseId) {
      throw new Error("Notion no está configurado en el servidor.");
    }

    const response = await fetch("https://api.notion.com/v1/pages", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.notionApiKey}`,
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28",
      },
      body: JSON.stringify({
        parent: { database_id: config.notionDatabaseId },
        properties: {
          Nombre: {
            title: [{ text: { content: data.nombre } }],
          },
          Teléfono: {
            phone_number: data.telefono,
          },
          Email: {
            email: data.email,
          },
          Fecha: {
            date: { start: data.fecha },
          },
          Turno: {
            select: { name: data.turno },
          },
          Personas: {
            number: data.personas,
          },
          "Alergias / Notas": {
            rich_text: [{ text: { content: data.notas ?? "" } }],
          },
          Estado: {
            select: { name: "Pendiente" },
          },
        },
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Error de Notion: ${errorBody}`);
    }

    return { success: true };
  });