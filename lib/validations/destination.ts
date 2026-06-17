import { z } from "zod";

export const destinationSchema = z.object({
  name: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(100),
  country: z
    .string()
    .min(2, "Le pays doit contenir au moins 2 caractères")
    .max(100),
  shortDescription: z
    .string()
    .min(10, "La description courte doit contenir au moins 10 caractères")
    .max(200),
  description: z
    .string()
    .min(20, "La description doit contenir au moins 20 caractères"),
  basePrice: z
    .number({ error: "Le prix doit être un nombre" })
    .positive("Le prix doit être positif"),
  imageUrl: z.string().url("L'URL de l'image est invalide"),
  gallery: z.array(z.string().url("URL de galerie invalide")),
});

export const destinationUpdateSchema = destinationSchema.partial();

export type DestinationInput = z.infer<typeof destinationSchema>;
export type DestinationUpdateInput = z.infer<typeof destinationUpdateSchema>;
