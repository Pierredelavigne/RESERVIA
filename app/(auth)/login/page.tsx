import { Suspense } from "react";
import type { Metadata } from "next";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Connexion — Reservia",
  description: "Connectez-vous à votre compte Reservia",
};

// SSG : formulaire statique, pas de données dynamiques
export default function LoginPage() {
  return (
    // Suspense requis car LoginForm utilise useSearchParams
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
