@AGENTS.md
# Projet Reservia

## Contexte
Reservia est une plateforme de réservation de voyages développée dans le cadre
d'un projet scolaire évalué sur 20 points. L'objectif est de démontrer la
maîtrise de Next.js dans une application full-stack complète.

## Stack technique
- Next.js 16 (App Router)
- React 19
- TypeScript strict
- Tailwind CSS v4
- Prisma ORM + PostgreSQL
- NextAuth v4 avec provider Credentials
- Zod pour la validation _(à installer)_
- React Hook Form pour les formulaires _(à installer)_
- bcrypt pour le hash des mots de passe
- lucide-react pour les icônes _(à installer)_

## Fonctionnalités attendues

### Pages publiques
- Accueil : hero section, barre de recherche, destinations populaires
- Liste des destinations : recherche, filtres (prix/pays), pagination
- Détail d'une destination : galerie, description, bouton Réserver

### Utilisateur connecté
- Inscription / Connexion / Déconnexion
- Espace "Mon compte" : infos personnelles, liste des réservations, annulation
- Création de réservation (date, nombre de personnes, calcul prix total)

### Administrateur
- CRUD complet sur les destinations
- Vue de toutes les réservations
- Accès réservé aux users avec role="ADMIN"

### Backend
- API routes Next.js pour users, destinations, réservations
- Middleware de protection des routes /account et /admin
- Hash des mots de passe avec bcrypt

## Stratégie de rendu (SSR / SSG / ISR)

| Route | Stratégie | Justification |
|-------|-----------|---------------|
| `/` | ISR (revalidate 3600) | Contenu semi-statique, SEO critique |
| `/destinations` | ISR (revalidate 60) | Catalogue qui évolue peu, imposé par le sujet |
| `/destinations/[id]` | ISR + generateStaticParams | SEO par destination, pré-génération |
| `/account/*` | SSR dynamic | Données personnelles, jamais cacheables |
| `/admin/*` | SSR dynamic | Données sensibles + vérification de rôle |
| `/login`, `/register` | SSG | Formulaires statiques |

## Modèle de données

### User
- id, email (unique), password (hashé), name, role (USER|ADMIN), createdAt
- Relation 1-N avec Reservation

### Destination
- id, name, country, description, basePrice, imageUrl, gallery (JSON)
- createdAt, updatedAt
- Relation 1-N avec Reservation

### Reservation
- id, userId, destinationId, startDate, endDate, peopleCount, totalPrice
- status (CONFIRMED|CANCELLED), createdAt
- Relations N-1 avec User et Destination

## Architecture des dossiers
app/
├── (public)/              # Routes publiques (accueil, destinations)
├── (auth)/                # Login, register
├── account/               # Espace utilisateur (protégé par middleware)
├── admin/                 # Interface admin (protégée par middleware)
└── api/                   # API routes
lib/
├── prisma.ts              # Singleton Prisma
├── auth.ts                # Config NextAuth
└── validations/           # Schémas Zod
components/
├── ui/                    # Composants génériques réutilisables
├── layout/                # Navbar, Footer
└── features/              # Composants métier (destinations, réservations)
prisma/
├── schema.prisma
└── seed.ts                # 8 destinations réalistes avec images Unsplash
middleware.ts              # Protection routes /account et /admin

## Règles de développement

### Git
- Tu ne signes JAMAIS les commits (pas de "Generated with Claude Code",
  pas de "Co-Authored-By: Claude").
- Utilise uniquement l'identité git locale déjà configurée.
- Messages de commit en français, format conventional :
  - feat: nouvelle fonctionnalité
  - fix: correction de bug
  - chore: config, dépendances, outillage
  - docs: documentation
  - refactor: refactoring sans changement fonctionnel
  - style: mise en forme, CSS
- Un commit = une intention claire. Pas de commits fourre-tout.

### Code
- TypeScript strict, pas de `any` sauf justification écrite en commentaire.
- Commentaires et strings UI en français.
- Composants React : fonctionnels uniquement, pas de classes.
- Server Components par défaut, `"use client"` seulement si nécessaire.
- Validation Zod partagée entre client et serveur.
- Gestion d'erreur systématique dans les routes API (try/catch + status codes).

### Sécurité
- JAMAIS de mot de passe en clair (toujours bcrypt).
- JAMAIS commiter `.env` ou secrets.
- Validation côté serveur OBLIGATOIRE, même si déjà validée côté client.
- Vérifier le rôle ADMIN sur toutes les routes admin (pas seulement middleware).

### Avant toute commande destructive
Demander validation avant : rm, git reset --hard, git push --force, prisma migrate reset.

## Plan de développement (ordre d'exécution)

1. ✅ Setup : dépendances, scripts, .env
2. ✅ Schéma Prisma + seed avec 8 destinations
3. ✅ Singleton Prisma + config NextAuth + middleware
4. ✅ Pages auth : register, login
5. ✅ API routes destinations (GET public, CRUD admin)
6. ✅ Page accueil + Navbar + Footer
7. ✅ Page liste destinations (ISR + filtres)
8. ✅ Page détail destination (ISR + generateStaticParams)
9. ✅ API + UI réservation
10. ✅ Espace utilisateur (mes réservations, annulation)
11. ✅ Interface admin (CRUD destinations + liste réservations)
12. ✅ Polish : loading.tsx, error.tsx, not-found.tsx, responsive
13. ✅ README final + schéma BDD + .env.example

## Barème de notation (référence)
- Pages principales complètes : 2 pts
- Réservation fonctionnelle : 2 pts
- Authentification : 2 pts
- Interface admin : 2 pts
- Utilisation SSR/SSG/ISR : 2 pts
- API routes bien structurées : 2 pts
- Base de données bien conçue : 2 pts
- Optimisation (images, performances) : 1 pt
- Intégration propre (ORM) : 1 pt
- Design clair et moderne : 1 pt
- Responsive et ergonomie : 1 pt
- Présentation orale : 2 pts

## Commandes utiles
- `npm run dev` — serveur de dev
- `npm run db:migrate` — appliquer les migrations Prisma
- `npm run db:studio` — interface visuelle Prisma
- `npm run db:seed` — peupler la BDD
- `npm run db:reset` — reset complet de la BDD (⚠️ destructif)