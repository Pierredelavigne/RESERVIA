import { test, expect } from "@playwright/test";

/**
 * Tests E2E — Authentification
 */

test.describe("Inscription", () => {
  test("affiche le formulaire d'inscription", async ({ page }) => {
    await page.goto("/register");
    await expect(page.getByRole("heading", { name: /créer/i })).toBeVisible();
    await expect(page.getByLabel(/nom/i)).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/mot de passe/i).first()).toBeVisible();
  });

  test("affiche une erreur si les mots de passe ne correspondent pas", async ({ page }) => {
    await page.goto("/register");
    await page.getByLabel(/nom/i).fill("Test User");
    await page.getByLabel(/email/i).fill(`test-${Date.now()}@example.com`);
    // Remplir mot de passe et confirmation différents
    const inputs = page.getByLabel(/mot de passe/i);
    await inputs.nth(0).fill("password123");
    await inputs.nth(1).fill("different456");
    await page.getByRole("button", { name: /créer/i }).click();
    // Une erreur doit s'afficher
    await expect(page.getByText(/correspondent pas/i)).toBeVisible();
  });
});

test.describe("Connexion", () => {
  test("affiche le formulaire de connexion", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("heading", { name: /connexion/i })).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/mot de passe/i)).toBeVisible();
  });

  test("affiche une erreur avec des identifiants incorrects", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel(/email/i).fill("inconnu@example.com");
    await page.getByLabel(/mot de passe/i).fill("mauvaismdp");
    await page.getByRole("button", { name: /se connecter/i }).click();
    // Un message d'erreur doit apparaître
    await expect(page.getByText(/invalide|incorrect|erreur/i)).toBeVisible({ timeout: 5000 });
  });

  test("connexion réussie redirige vers /account", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel(/email/i).fill("marie@example.fr");
    await page.getByLabel(/mot de passe/i).fill("password123");
    await page.getByRole("button", { name: /se connecter/i }).click();
    // Après connexion réussie, redirection vers /account
    await expect(page).toHaveURL(/\/account/, { timeout: 10000 });
  });
});

test.describe("Protection des routes", () => {
  test("/account redirige vers /login si non connecté", async ({ page }) => {
    await page.goto("/account");
    await expect(page).toHaveURL(/\/login/);
  });

  test("/admin redirige si non connecté", async ({ page }) => {
    await page.goto("/admin");
    // Doit rediriger (vers / ou /login)
    await expect(page).not.toHaveURL("/admin");
  });
});
