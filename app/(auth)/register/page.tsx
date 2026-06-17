import type { Metadata } from "next";
import RegisterForm from "./RegisterForm";

export const metadata: Metadata = {
  title: "Inscription — Reservia",
  description: "Créez votre compte Reservia",
};

// SSG : formulaire statique, pas de données dynamiques
export default function RegisterPage() {
  return <RegisterForm />;
}
