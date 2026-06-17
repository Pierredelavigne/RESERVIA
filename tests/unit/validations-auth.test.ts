import { describe, it, expect } from "vitest";
import { loginSchema, registerSchema } from "@/lib/validations/auth";

describe("loginSchema", () => {
  it("accepte des identifiants valides", () => {
    const result = loginSchema.safeParse({
      email: "user@example.fr",
      password: "secret123",
    });
    expect(result.success).toBe(true);
  });

  it("rejette un email invalide", () => {
    const result = loginSchema.safeParse({ email: "pas-un-email", password: "secret" });
    expect(result.success).toBe(false);
  });

  it("rejette un mot de passe vide", () => {
    const result = loginSchema.safeParse({ email: "user@example.fr", password: "" });
    expect(result.success).toBe(false);
  });

  it("rejette si email absent", () => {
    const result = loginSchema.safeParse({ password: "secret" });
    expect(result.success).toBe(false);
  });
});

describe("registerSchema", () => {
  const valide = {
    name: "Marie Dupont",
    email: "marie@example.fr",
    password: "motdepasse123",
    confirmPassword: "motdepasse123",
  };

  it("accepte une inscription valide", () => {
    expect(registerSchema.safeParse(valide).success).toBe(true);
  });

  it("rejette un nom trop court (< 2 car.)", () => {
    const result = registerSchema.safeParse({ ...valide, name: "A" });
    expect(result.success).toBe(false);
  });

  it("rejette un mot de passe trop court (< 8 car.)", () => {
    const result = registerSchema.safeParse({
      ...valide,
      password: "court",
      confirmPassword: "court",
    });
    expect(result.success).toBe(false);
  });

  it("rejette si les mots de passe ne correspondent pas", () => {
    const result = registerSchema.safeParse({
      ...valide,
      confirmPassword: "different",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const champ = result.error.issues[0].path[0];
      expect(champ).toBe("confirmPassword");
    }
  });

  it("rejette un email invalide", () => {
    const result = registerSchema.safeParse({ ...valide, email: "invalide" });
    expect(result.success).toBe(false);
  });
});
