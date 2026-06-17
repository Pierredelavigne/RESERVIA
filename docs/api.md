# Référence API — Reservia

Base URL : `http://localhost:3000/api`

Toutes les réponses sont en JSON. Les erreurs retournent `{ "message": "..." }`.

---

## Authentification

### POST `/auth/register`
Créer un compte utilisateur.

**Corps de la requête**
```json
{
  "name": "Marie Dupont",
  "email": "marie@example.fr",
  "password": "motdepasse123",
  "confirmPassword": "motdepasse123"
}
```

**Réponses**
| Code | Description |
|------|-------------|
| 201 | Compte créé avec succès |
| 400 | Données invalides (Zod) |
| 409 | Email déjà utilisé |
| 500 | Erreur serveur |

---

### POST `/auth/[...nextauth]`
Géré par NextAuth v4. Utilisé pour la connexion (`signIn`) et déconnexion (`signOut`).

---

## Destinations

### GET `/destinations`
Liste publique des destinations avec filtres et pagination.

**Paramètres de requête**
| Paramètre | Type | Description |
|-----------|------|-------------|
| `search` | string | Recherche dans nom, pays, description |
| `country` | string | Filtrer par pays exact |
| `minPrice` | number | Prix minimum (€/nuit/personne) |
| `maxPrice` | number | Prix maximum |
| `page` | number | Page (défaut : 1, 9 résultats par page) |

**Réponse 200**
```json
{
  "destinations": [
    {
      "id": "clxxxxxxx",
      "name": "Santorini",
      "country": "Grèce",
      "shortDescription": "Villages blancs...",
      "basePrice": 180,
      "imageUrl": "https://..."
    }
  ],
  "total": 42,
  "pages": 5,
  "page": 1
}
```

---

### POST `/destinations`
Créer une destination. **Réservé aux admins.**

**En-têtes requis** : session NextAuth (cookie)

**Corps**
```json
{
  "name": "Kyoto",
  "country": "Japon",
  "shortDescription": "L'ancienne capitale...",
  "description": "Description complète...",
  "basePrice": 220,
  "imageUrl": "https://...",
  "gallery": ["https://...", "https://..."]
}
```

**Réponses**
| Code | Description |
|------|-------------|
| 201 | Destination créée |
| 400 | Données invalides |
| 403 | Non admin |

---

### GET `/destinations/[id]`
Détail complet d'une destination (public).

**Réponse 200**
```json
{
  "id": "clxxxxxxx",
  "name": "Santorini",
  "country": "Grèce",
  "shortDescription": "...",
  "description": "...",
  "basePrice": 180,
  "imageUrl": "https://...",
  "gallery": ["https://...", "https://..."],
  "createdAt": "2026-01-01T00:00:00.000Z",
  "updatedAt": "2026-01-01T00:00:00.000Z"
}
```

**Réponses**
| Code | Description |
|------|-------------|
| 200 | OK |
| 404 | Destination introuvable |

---

### PUT `/destinations/[id]`
Modifier une destination (champs partiels). **Réservé aux admins.**

**Corps** : même structure que POST, tous les champs optionnels.

**Réponses**
| Code | Description |
|------|-------------|
| 200 | Destination mise à jour |
| 400 | Données invalides |
| 403 | Non admin |
| 404 | Destination introuvable |

---

### DELETE `/destinations/[id]`
Supprimer une destination. **Réservé aux admins.** Supprime aussi en cascade les réservations associées.

**Réponses**
| Code | Description |
|------|-------------|
| 204 | Supprimée |
| 403 | Non admin |
| 404 | Destination introuvable |

---

## Réservations

### POST `/reservations`
Créer une réservation. **Utilisateur connecté requis.**

**Corps**
```json
{
  "destinationId": "clxxxxxxx",
  "startDate": "2027-06-15",
  "endDate": "2027-06-20",
  "peopleCount": 2
}
```

**Prix calculé côté serveur** : `basePrice × peopleCount × nuits`

**Réponse 201**
```json
{
  "id": "clyyyyyyy",
  "userId": "clzzzzzzz",
  "destinationId": "clxxxxxxx",
  "startDate": "2027-06-15T00:00:00.000Z",
  "endDate": "2027-06-20T00:00:00.000Z",
  "peopleCount": 2,
  "totalPrice": 1800,
  "status": "CONFIRMED",
  "createdAt": "2026-04-16T00:00:00.000Z"
}
```

**Réponses**
| Code | Description |
|------|-------------|
| 201 | Réservation créée |
| 400 | Dates invalides ou contrainte non respectée |
| 401 | Non connecté |
| 404 | Destination introuvable |

**Règles de validation**
- `startDate` ≥ aujourd'hui
- `endDate` > `startDate`
- `peopleCount` entre 1 et 20

---

### PATCH `/reservations/[id]`
Annuler une réservation. **Propriétaire ou admin.**

Aucun corps requis.

**Réponses**
| Code | Description |
|------|-------------|
| 200 | Statut passé à `CANCELLED` |
| 401 | Non connecté |
| 403 | Pas propriétaire (et pas admin) |
| 404 | Réservation introuvable |
| 409 | Déjà annulée |

---

## Codes d'erreur communs

| Code | Signification |
|------|---------------|
| 400 | Validation Zod échouée — `message` contient le détail |
| 401 | Non authentifié |
| 403 | Accès interdit (rôle insuffisant ou ressource d'un autre utilisateur) |
| 404 | Ressource introuvable |
| 409 | Conflit (email déjà pris, réservation déjà annulée) |
| 500 | Erreur interne |
