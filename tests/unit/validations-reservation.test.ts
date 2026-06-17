import { describe, it, expect } from "vitest";
import { reservationSchema } from "@/lib/validations/reservation";

// Utilitaire partagé avec l'API : basePrice × personnes × nuits
function calculerPrixTotal(basePrice: number, peopleCount: number, startDate: Date, endDate: Date) {
  const nuits = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  return basePrice * peopleCount * nuits;
}

const demain = new Date();
demain.setDate(demain.getDate() + 1);
const apresdemain = new Date();
apresdemain.setDate(apresdemain.getDate() + 3);

const valide = {
  destinationId: "clxxxxxxxxxxxxxxxx",
  startDate: demain,
  endDate: apresdemain,
  peopleCount: 2,
};

describe("reservationSchema", () => {
  it("accepte une réservation valide", () => {
    expect(reservationSchema.safeParse(valide).success).toBe(true);
  });

  it("rejette une date de début dans le passé", () => {
    const hier = new Date();
    hier.setDate(hier.getDate() - 1);
    const result = reservationSchema.safeParse({ ...valide, startDate: hier });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path[0]).toBe("startDate");
    }
  });

  it("rejette si endDate <= startDate", () => {
    const result = reservationSchema.safeParse({
      ...valide,
      startDate: apresdemain,
      endDate: demain,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path[0]).toBe("endDate");
    }
  });

  it("rejette si endDate == startDate", () => {
    const result = reservationSchema.safeParse({
      ...valide,
      startDate: demain,
      endDate: demain,
    });
    expect(result.success).toBe(false);
  });

  it("rejette 0 personne", () => {
    expect(reservationSchema.safeParse({ ...valide, peopleCount: 0 }).success).toBe(false);
  });

  it("rejette plus de 20 personnes", () => {
    expect(reservationSchema.safeParse({ ...valide, peopleCount: 21 }).success).toBe(false);
  });

  it("accepte 1 personne", () => {
    expect(reservationSchema.safeParse({ ...valide, peopleCount: 1 }).success).toBe(true);
  });

  it("accepte 20 personnes", () => {
    expect(reservationSchema.safeParse({ ...valide, peopleCount: 20 }).success).toBe(true);
  });
});

describe("calculerPrixTotal", () => {
  it("2 nuits, 1 personne à 100€ = 200€", () => {
    const start = new Date("2027-06-01");
    const end = new Date("2027-06-03");
    expect(calculerPrixTotal(100, 1, start, end)).toBe(200);
  });

  it("3 nuits, 2 personnes à 150€ = 900€", () => {
    const start = new Date("2027-06-01");
    const end = new Date("2027-06-04");
    expect(calculerPrixTotal(150, 2, start, end)).toBe(900);
  });

  it("1 nuit, 4 personnes à 80€ = 320€", () => {
    const start = new Date("2027-08-10");
    const end = new Date("2027-08-11");
    expect(calculerPrixTotal(80, 4, start, end)).toBe(320);
  });

  it("7 nuits, 3 personnes à 200€ = 4200€", () => {
    const start = new Date("2027-07-01");
    const end = new Date("2027-07-08");
    expect(calculerPrixTotal(200, 3, start, end)).toBe(4200);
  });
});
