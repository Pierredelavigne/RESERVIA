import { test, expect } from "@playwright/test";

/**
 * Tests E2E — Réservation (utilisateur connecté)
 * Ces tests nécessitent un compte existant dans la BDD seed.
 * Compte : marie@example.fr / password123
 */

// Connexion partagée entre les tests de ce fichier
test.beforeEach(async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel(/email/i).fill("marie@example.fr");
  await page.getByLabel(/mot de passe/i).fill("password123");
  await page.getByRole("button", { name: /se connecter/i }).click();
  await expect(page).toHaveURL(/\/account/, { timeout: 10000 });
});

test.describe("Création de réservation", () => {
  test("le formulaire de réservation est accessible depuis une destination", async ({ page }) => {
    await page.goto("/destinations");
    const premiereCarteLink = page.locator("[data-testid='destination-card'] a").first();
    await expect(premiereCarteLink).toBeVisible({ timeout: 10000 });
    await premiereCarteLink.click();
    await expect(page).toHaveURL(/\/destinations\/.+/);

    const btnReserver = page.getByRole("link", { name: /réserver/i });
    await expect(btnReserver).toBeVisible();
    await btnReserver.click();
    await expect(page).toHaveURL(/\/reserver/);
    await expect(page.getByRole("heading", { name: /réservation/i })).toBeVisible();
  });

  test("le récapitulatif du prix se met à jour automatiquement", async ({ page }) => {
    await page.goto("/destinations");
    const premiereCarteLink = page.locator("[data-testid='destination-card'] a").first();
    await expect(premiereCarteLink).toBeVisible({ timeout: 10000 });
    await premiereCarteLink.click();

    const btnReserver = page.getByRole("link", { name: /réserver/i });
    await btnReserver.click();
    await expect(page).toHaveURL(/\/reserver/);

    // Remplir les dates (demain et dans 3 jours)
    const demain = new Date();
    demain.setDate(demain.getDate() + 1);
    const dans3Jours = new Date();
    dans3Jours.setDate(dans3Jours.getDate() + 3);

    const formatDate = (d: Date) => d.toISOString().split("T")[0];

    await page.getByLabel(/arrivée/i).fill(formatDate(demain));
    await page.getByLabel(/départ/i).fill(formatDate(dans3Jours));
    await page.getByLabel(/personnes/i).fill("2");

    // Un récapitulatif avec un prix doit apparaître
    await expect(page.getByText(/total/i)).toBeVisible();
    await expect(page.getByText(/€/)).toBeVisible();
  });
});

test.describe("Espace Mon compte", () => {
  test("affiche les informations de l'utilisateur", async ({ page }) => {
    await page.goto("/account");
    await expect(page.getByText(/marie/i)).toBeVisible();
    await expect(page.getByText(/marie@example.fr/i)).toBeVisible();
  });

  test("affiche la liste des réservations", async ({ page }) => {
    await page.goto("/account/reservations");
    await expect(page.getByRole("heading", { name: /réservations/i })).toBeVisible();
  });
});
