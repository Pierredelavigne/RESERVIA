import { z } from "zod";

export const reservationSchema = z
  .object({
    destinationId: z.string().min(1, "Destination requise"),
    startDate: z.coerce.date({ error: "Date de début invalide" }),
    endDate: z.coerce.date({ error: "Date de fin invalide" }),
    peopleCount: z.coerce
      .number({ error: "Nombre de personnes invalide" })
      .int()
      .min(1, "Minimum 1 personne")
      .max(20, "Maximum 20 personnes"),
  })
  .refine((data) => data.startDate >= new Date(new Date().toDateString()), {
    message: "La date de début ne peut pas être dans le passé",
    path: ["startDate"],
  })
  .refine((data) => data.endDate > data.startDate, {
    message: "La date de fin doit être après la date de début",
    path: ["endDate"],
  });

export type ReservationInput = z.infer<typeof reservationSchema>;
