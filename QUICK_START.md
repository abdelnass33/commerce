# Guide Rapide - Commandes Essentielles

## 🚀 Installation et Démarrage

```bash
# Installation des dépendances
npm install

# Créer le fichier .env (copier depuis .env.example)
cp .env.example .env

# Initialiser la base de données avec des données de test
npm run seed

# Lancer le serveur de développement
npm run dev
```

## 🔑 Comptes de Test

Après avoir exécuté `npm run seed`:

**Admin:**
- Email: `admin@sneakercommerce.com`
- Password: `admin123`
- Accès: Dashboard admin complet

**Client:**
- Email: `client@test.com`
- Password: `client123`
- Accès: Shopping et commandes

## 📝 Scripts NPM

```bash
npm run dev        # Démarrer le serveur de développement (port 3000)
npm run build      # Compiler pour la production
npm run start      # Démarrer en mode production
npm run lint       # Vérifier le code avec ESLint
npm run seed       # Initialiser/réinitialiser la base de données
```

## 🌐 URLs Importantes

- **Homepage:** http://localhost:3000
- **Admin Panel:** http://localhost:3000/admin
- **Login:** http://localhost:3000/login
- **Panier:** http://localhost:3000/cart
- **Checkout:** http://localhost:3000/checkout

## 🗄️ MongoDB Atlas Setup

1. Créer compte sur https://www.mongodb.com/cloud/atlas
2. Créer un cluster gratuit (M0)
3. Créer un utilisateur database:
   - Database Access → Add New Database User
   - Username: `sneakercommerce`
   - Password: [générer ou choisir]
   - Built-in Role: `Read and write to any database`

4. Whitelist IP:
   - Network Access → Add IP Address
   - Pour dev: `0.0.0.0/0` (Allow access from anywhere)
   - Pour prod: Ajouter votre IP spécifique

5. Connection String:
   - Clusters → Connect → Connect your application
   - Copier la string et remplacer `<password>`
   - Ajouter dans `.env` comme `MONGODB_URI`

Exemple:
```
mongodb+srv://sneakercommerce:<password>@cluster0.xxxxx.mongodb.net/sneaker-commerce?retryWrites=true&w=majority
```

## ☁️ Cloudinary Setup

1. Créer compte sur https://cloudinary.com
2. Dashboard → Account Details
3. Copier dans `.env`:
   ```
   CLOUDINARY_CLOUD_NAME=votre_cloud_name
   CLOUDINARY_API_KEY=votre_api_key
   CLOUDINARY_API_SECRET=votre_api_secret
   ```

## 🔐 Configuration JWT

Générer une clé secrète forte:

```bash
# Sur Linux/Mac
openssl rand -base64 32

# Sur Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))

# Ou simplement utiliser une longue chaîne aléatoire
```

Ajouter dans `.env`:
```
JWT_SECRET=votre_cle_secrete_longue_et_aleatoire
```

## 📦 Structure de la Base de Données

Le script `npm run seed` créera:

**Categories (5):**
- Sneakers
- T-Shirts
- Hoodies
- Pants
- Accessories

**Products (6):**
- Nike Air Max 90
- Adidas Yeezy Boost 350
- Jordan 1 Retro High
- Supreme Box Logo Hoodie
- Off-White Graphic Tee
- Nike Tech Fleece Joggers

**Promotions (2):**
- `WELCOME10` - 10% de réduction
- `SUMMER2024` - 15000 FCFA de réduction

**Users (2):**
- Admin
- Client test

## 🛠️ Commandes MongoDB (via Compass ou Shell)

```javascript
// Se connecter à votre cluster puis:

// Voir tous les produits
db.products.find().pretty()

// Voir tous les utilisateurs (sans mot de passe)
db.users.find({}, { password: 0 }).pretty()

// Promouvoir un utilisateur en admin
db.users.updateOne(
  { email: "email@example.com" },
  { $set: { role: "admin" } }
)

// Voir toutes les commandes
db.orders.find().pretty()

// Stats rapides
db.products.countDocuments()  // Nombre de produits
db.users.countDocuments()     // Nombre d'utilisateurs
db.orders.countDocuments()    // Nombre de commandes
```

## 🐛 Résolution de Problèmes Courants

### Erreur: "Cannot connect to MongoDB"
- Vérifier `MONGODB_URI` dans `.env`
- Vérifier que votre IP est whitelistée dans MongoDB Atlas
- Vérifier les credentials de base de données

### Erreur: "JWT Secret not defined"
- Ajouter `JWT_SECRET` dans `.env`
- Redémarrer le serveur

### Images ne se chargent pas
- Vérifier Cloudinary config dans `.env`
- Vérifier domaine dans `next.config.mjs`

### Port 3000 déjà utilisé
```bash
# Trouver et tuer le processus (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Ou utiliser un autre port
PORT=3001 npm run dev
```

## 📱 Test des Fonctionnalités

### Workflow Client:
1. Ouvrir http://localhost:3000
2. Parcourir les produits
3. Utiliser la recherche et les filtres
4. Cliquer sur un produit
5. Sélectionner taille/couleur/quantité
6. Ajouter au panier
7. Aller au panier
8. Modifier quantités si besoin
9. Procéder au checkout
10. Remplir adresse
11. Appliquer code promo (WELCOME10)
12. Choisir méthode de paiement
13. Confirmer la commande

### Workflow Admin:
1. Se connecter avec compte admin
2. Aller sur http://localhost:3000/admin
3. Voir les statistiques du dashboard
4. Tester navigation vers chaque section
5. Ajouter/modifier/supprimer des produits
6. Gérer les catégories
7. Créer des promotions
8. Voir les commandes

## 🚀 Déploiement Vercel

```bash
# 1. Installer Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Déployer
vercel

# 4. Configurer les variables d'environnement sur Vercel Dashboard
# Settings → Environment Variables
```

Variables requises:
- `MONGODB_URI`
- `JWT_SECRET`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `NEXTAUTH_URL` (votre URL de production)
- `NEXTAUTH_SECRET`

## 📚 Documentation API

Tous les endpoints API sont dans `/app/api/`:

**Public:**
- `GET /api/products` - Liste produits
- `GET /api/categories` - Liste catégories
- `POST /api/auth/login` - Connexion
- `POST /api/auth/register` - Inscription

**Authentifié:**
- `GET /api/orders` - Mes commandes
- `POST /api/orders` - Créer commande

**Admin:**
- `POST /api/products` - Créer produit
- `PUT /api/products/:id` - Modifier produit
- `GET /api/admin/stats` - Statistiques

Voir `README.md` pour la liste complète.

## 💡 Astuces

- Utiliser React DevTools pour débugger
- Vérifier Network tab pour les appels API
- Consulter Console pour les erreurs
- Utiliser MongoDB Compass pour visualiser les données
- Tester responsive design avec DevTools mobile view

---

**Bon développement! 🎉**
