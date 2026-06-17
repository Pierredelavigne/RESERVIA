# Guide utilisateur — Reservia

## Visiteur (non connecté)

### Parcourir les destinations
1. Depuis la **page d'accueil**, consultez les 6 destinations populaires
2. Cliquez sur **"Voir tout"** ou **"Destinations"** dans la navbar pour accéder au catalogue complet
3. Utilisez les **filtres** (recherche texte, pays, prix min/max) dans le panneau latéral
4. Naviguez entre les pages grâce à la **pagination** en bas de la liste

### Consulter une destination
- Cliquez sur une carte de destination pour accéder à sa **page détail**
- Parcourez la **galerie photos** en cliquant sur les images (lightbox)
- Consultez la description complète et le prix de base

> Le bouton **"Réserver maintenant"** redirige vers la page de connexion si vous n'êtes pas connecté.

---

## Créer un compte

1. Cliquez sur **"S'inscrire"** dans la navbar ou sur la page d'accueil
2. Remplissez le formulaire :
   - **Nom complet** (minimum 2 caractères)
   - **Email** valide
   - **Mot de passe** (minimum 8 caractères)
   - **Confirmation** du mot de passe
3. Cliquez sur **"Créer mon compte"**
4. Vous êtes redirigé vers la page de connexion

---

## Se connecter

1. Cliquez sur **"Connexion"** dans la navbar
2. Entrez votre email et mot de passe
3. Cliquez sur **"Se connecter"**

---

## Faire une réservation

1. Naviguez jusqu'à la page détail d'une destination
2. Cliquez sur **"Réserver maintenant"**
3. Remplissez le formulaire :
   - **Date d'arrivée** (aujourd'hui ou plus tard)
   - **Date de départ** (après la date d'arrivée)
   - **Nombre de personnes** (1 à 20)
4. Le **récapitulatif du prix** s'affiche automatiquement :
   `Prix de base × Personnes × Nuits`
5. Cliquez sur **"Confirmer la réservation"**
6. Vous êtes redirigé vers **"Mes réservations"** avec un message de confirmation

---

## Espace Mon compte

Accessible via **"Mon compte"** dans la navbar (utilisateur connecté).

### Mes informations
- Consultez votre nom, email, rôle et date d'inscription
- Nombre total de réservations effectuées

### Mes réservations
- Liste de toutes vos réservations (de la plus récente à la plus ancienne)
- Pour chaque réservation : destination, dates, nombre de personnes, prix total, statut
- **Statuts possibles** :
  - 🟢 **Confirmée** — réservation active
  - 🔴 **Annulée** — réservation annulée

### Annuler une réservation
1. Sur la ligne de la réservation, cliquez sur **"Annuler"**
2. Une confirmation s'affiche : cliquez sur **"Oui"** pour confirmer ou **"Non"** pour annuler l'action
3. Le statut passe instantanément à **"Annulée"**

> ⚠️ L'annulation est irréversible.

---

## Se déconnecter

Cliquez sur **"Déconnexion"** dans la navbar.

---

## Interface administrateur

Accessible uniquement avec un compte de rôle **ADMIN**.

### Tableau de bord `/admin`
Vue d'ensemble avec 4 statistiques :
- Nombre de destinations
- Nombre de réservations
- Nombre d'utilisateurs
- Chiffre d'affaires (réservations confirmées)

### Gérer les destinations `/admin/destinations`
| Action | Comment |
|--------|---------|
| **Créer** | Bouton "+ Nouvelle" en haut à droite |
| **Modifier** | Icône crayon sur la ligne |
| **Supprimer** | Icône poubelle → confirmation requise |

**Champs d'une destination** :
- Nom, pays, description courte, description complète
- Prix de base (€/nuit/personne)
- URL de l'image principale
- Galerie de photos (URLs Unsplash recommandées)

### Voir toutes les réservations `/admin/reservations`
Tableau complet avec : client, destination, dates, nombre de personnes, prix total, statut.

---

## Barre de recherche (page d'accueil)

La barre de recherche de la page d'accueil redirige vers `/destinations?search=<terme>` et lance automatiquement la recherche dans le catalogue.
