import { describe, it, expect } from "vitest";
import { destinationSchema, destinationUpdateSchema } from "@/lib/validations/destination";

const valide = {
  name: "Santorini",
  country: "Grèce",
  shortDescription: "Villages blancs suspendus au-dessus de la mer Égée",
  description:
    "Santorini est une île volcanique connue pour ses maisons blanches aux toits bleus.",
  basePrice: 180,
  imageUrl: "https://images.unsplash.com/photo-123?w=800",
  gallery: [
    "https://images.unsplash.com/photo-456?w=800",
    "https://images.unsplash.com/photo-789?w=800",
  ],
};

describe("destinationSchema", () => {
  it("accepte une destination valide", () => {
    expect(destinationSchema.safeParse(valide).success).toBe(true);
  });

  it("accepte une galerie vide", () => {
    expect(destinationSchema.safeParse({ ...valide, gallery: [] }).success).toBe(true);
  });

  it("rejette un nom trop court", () => {
    expect(destinationSchema.safeParse({ ...valide, name: "A" }).success).toBe(false);
  });

  it("rejette une description courte trop courte (< 10 car.)", () => {
    expect(
      destinationSchema.safeParse({ ...valide, shortDescription: "Court" }).success
    ).toBe(false);
  });

  it("rejette une description trop courte (< 20 car.)", () => {
    expect(
      destinationSchema.safeParse({ ...valide, description: "Trop court." }).success
    ).toBe(false);
  });

  it("rejette un prix négatif", () => {
    expect(destinationSchema.safeParse({ ...valide, basePrice: -10 }).success).toBe(false);
  });

  it("rejette un prix à zéro", () => {
    expect(destinationSchema.safeParse({ ...valide, basePrice: 0 }).success).toBe(false);
  });

  it("rejette une imageUrl invalide", () => {
    expect(
      destinationSchema.safeParse({ ...valide, imageUrl: "pas-une-url" }).success
    ).toBe(false);
  });

  it("rejette une URL de galerie invalide", () => {
    expect(
      destinationSchema.safeParse({ ...valide, gallery: ["pas-une-url"] }).success
    ).toBe(false);
  });
});

describe("destinationUpdateSchema (partial)", () => {
  it("accepte une mise à jour partielle avec seulement le prix", () => {
    expect(destinationUpdateSchema.safeParse({ basePrice: 200 }).success).toBe(true);
  });

  it("accepte un objet vide", () => {
    expect(destinationUpdateSchema.safeParse({}).success).toBe(true);
  });

  it("rejette quand même un prix invalide", () => {
    expect(destinationUpdateSchema.safeParse({ basePrice: -5 }).success).toBe(false);
  });
});
