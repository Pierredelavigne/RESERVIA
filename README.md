# Reservia

Plateforme de réservation de voyages développée dans le cadre d'un projet scolaire.  
Stack : **Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · Prisma · PostgreSQL · NextAuth v4**

---

## Lancement rapide

### Prérequis

- Node.js 20+
- PostgreSQL (base de données `reservia`)

### Installation

```bash
# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos valeurs (DATABASE_URL, NEXTAUTH_SECRET)

# Appliquer les migrations et peupler la base
npm run db:migrate
npm run db:seed

# Lancer le serveur de développement
npm run dev
```

L'application est disponible sur [http://localhost:3000](http://localhost:3000).

---

## Comptes de test

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Administrateur | admin@reservia.fr | admin1234 |
| Utilisateur | marie@example.fr | password123 |

---

## Commandes disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production |
| `npm run db:migrate` | Appliquer les migrations Prisma |
| `npm run db:seed` | Peupler la base (⚠️ efface les données existantes) |
| `npm run db:studio` | Interface visuelle Prisma Studio |
| `npm run db:reset` | Réinitialisation complète de la base |

---

## Stack technique

| Technologie | Version | Rôle |
|-------------|---------|------|
| Next.js | 16 | Framework full-stack (App Router) |
| React | 19 | UI |
| TypeScript | 5 | Typage strict |
| Tailwind CSS | 4 | Styles |
| Prisma | 7 | ORM |
| PostgreSQL | — | Base de données |
| NextAuth | 4 | Authentification |
| Zod | 4 | Validation schémas |
| React Hook Form | 7 | Formulaires |
| bcrypt | 6 | Hash des mots de passe |
| lucide-react | — | Icônes |

---

## Schéma de la base de données

```
┌─────────────────────────────────┐
│              User               │
├─────────────────────────────────┤
│ id           String  PK (cuid)  │
│ name         String             │
│ email        String  UNIQUE     │
│ password     String  (bcrypt)   │
│ role         Role    USER|ADMIN │
│ createdAt    DateTime           │
│ updatedAt    DateTime           │
└──────────────┬──────────────────┘
               │ 1
               │
               │ N
┌──────────────▼──────────────────┐
│           Reservation           │
├─────────────────────────────────┤
│ id           String  PK (cuid)  │
│ userId       String  FK → User  │
│ destinationId String FK → Dest. │
│ startDate    DateTime           │
│ endDate      DateTime           │
│ peopleCount  Int                │
│ totalPrice   Float              │
│ status       CONFIRMED|CANCELLED│
│ createdAt    DateTime           │
│ updatedAt    DateTime           │
└──────────────┬──────────────────┘
               │ N
               │
               │ 1
┌──────────────▼──────────────────┐
│          Destination            │
├─────────────────────────────────┤
│ id               String PK      │
│ name             String         │
│ country          String         │
│ shortDescription String         │
│ description      String         │
│ basePrice        Float          │
│ imageUrl         String         │
│ gallery          Json  (string[])│
│ createdAt        DateTime       │
│ updatedAt        DateTime       │
└─────────────────────────────────┘
```

**Calcul du prix total :** `basePrice × peopleCount × nombre de nuits`

---

## Architecture des dossiers

```
reservia/
├── app/
│   ├── (auth)/               # Login, register (SSG)
│   ├── account/              # Espace utilisateur (SSR, protégé)
│   │   └── reservations/     # Mes réservations + annulation
│   ├── admin/                # Interface admin (SSR, rôle ADMIN)
│   │   ├── destinations/     # CRUD destinations
│   │   └── reservations/     # Toutes les réservations
│   ├── api/
│   │   ├── auth/             # NextAuth + register
│   │   ├── destinations/     # CRUD destinations
│   │   └── reservations/     # Création + annulation
│   └── destinations/         # Liste (ISR) + détail (ISR + SSP)
│       └── [id]/reserver/    # Formulaire de réservation
├── components/
│   ├── features/             # FormulaireDestination
│   ├── layout/               # Navbar, Footer
│   └── ui/                   # DestinationCard, Skeleton
├── lib/
│   ├── auth.ts               # Config NextAuth
│   ├── prisma.ts             # Singleton Prisma
│   └── validations/          # Schémas Zod (auth, destination, reservation)
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
├── types/
│   └── next-auth.d.ts        # Augmentation types session
└── middleware.ts              # Protection /account et /admin
```

---

## Stratégie de rendu

| Route | Stratégie | Justification |
|-------|-----------|---------------|
| `/` | ISR (3600s) | Contenu semi-statique, SEO critique |
| `/destinations` | ISR via `unstable_cache` (60s) | Catalogue évoluant peu |
| `/destinations/[id]` | ISR (3600s) + `generateStaticParams` | SEO par destination, pré-génération au build |
| `/destinations/[id]/reserver` | SSR dynamique | Requiert une session active |
| `/account/*` | SSR dynamique (`force-dynamic`) | Données personnelles, jamais cachées |
| `/admin/*` | SSR dynamique (`force-dynamic`) | Données sensibles + vérification de rôle |
| `/login`, `/register` | SSG | Formulaires purement statiques |

---

## Sécurité

- Mots de passe hashés avec **bcrypt** (coût 12)
- **Validation Zod côté serveur** sur toutes les routes API, même quand déjà validé côté client
- Rôle **ADMIN vérifié à deux niveaux** : middleware (`middleware.ts`) + vérification dans chaque route API admin
- Un utilisateur ne peut annuler **que ses propres réservations**
- Variables d'environnement sensibles non committées (`.env` dans `.gitignore`)

---

## Pages de l'application

| URL | Description |
|-----|-------------|
| `/` | Accueil — hero, recherche, 6 destinations populaires |
| `/destinations` | Liste avec filtres (recherche, pays, prix) et pagination |
| `/destinations/[id]` | Détail — galerie lightbox, description, bouton réserver |
| `/destinations/[id]/reserver` | Formulaire de réservation avec calcul prix temps réel |
| `/login` | Connexion |
| `/register` | Inscription |
| `/account` | Infos personnelles |
| `/account/reservations` | Mes réservations + annulation |
| `/admin` | Dashboard (stats globales) |
| `/admin/destinations` | Tableau CRUD des destinations |
| `/admin/reservations` | Toutes les réservations |
