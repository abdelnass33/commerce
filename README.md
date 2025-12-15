# Sneaker Commerce - E-commerce Platform

Plateforme e-commerce complète pour la vente de sneakers et vêtements, construite avec Next.js, MongoDB, et Tailwind CSS.

## 🚀 Fonctionnalités

### Frontend Public
- ✅ Page d'accueil avec affichage des produits
- ✅ Barre de recherche et filtres (catégorie, prix)
- ✅ Modal produit avec sélection taille/couleur et quantité
- ✅ Panier complet avec modification/suppression
- ✅ Page checkout avec intégration paiements (Wave, Orange Money, Carte)
- ✅ Design responsive

### Backend (API Routes)
- ✅ CRUD produits et catégories
- ✅ CRUD promotions/codes promo
- ✅ Gestion utilisateurs (Admin/Client)
- ✅ Gestion panier et commandes
- ✅ Statistiques dashboard admin
- ✅ Auth JWT + bcrypt

### Admin Panel
- ✅ Dashboard avec statistiques clés
- ✅ Gestion produits, promotions, catégories
- ✅ Gestion commandes et utilisateurs
- ✅ Statistiques de ventes et produits populaires

### Intégrations
- ✅ Images stockées sur Cloudinary
- ✅ Données sur MongoDB Atlas
- ✅ Authentification sécurisée JWT

## 📦 Installation

1. **Cloner le projet**
```bash
git clone <repository-url>
cd commerce
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configuration environnement**
Copier `.env.example` vers `.env` et configurer:
```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=votre_secret_jwt
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

4. **Lancer le serveur de développement**
```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

## 🏗️ Structure du Projet

```
commerce/
├── app/                      # Pages Next.js
│   ├── api/                 # API Routes
│   │   ├── auth/           # Authentification
│   │   ├── products/       # CRUD produits
│   │   ├── categories/     # CRUD catégories
│   │   ├── promotions/     # CRUD promotions
│   │   ├── orders/         # Gestion commandes
│   │   ├── admin/          # Endpoints admin
│   │   └── upload/         # Upload images
│   ├── admin/              # Panel admin
│   ├── cart/               # Page panier
│   ├── checkout/           # Page checkout
│   └── login/              # Authentification
├── components/              # Composants React
├── lib/                     # Utilitaires
│   ├── mongodb.ts          # Connexion MongoDB
│   ├── auth.ts             # Helpers auth JWT
│   ├── cloudinary.ts       # Upload Cloudinary
│   └── api.ts              # Client API
├── models/                  # Modèles Mongoose
│   ├── User.ts
│   ├── Product.ts
│   ├── Category.ts
│   ├── Promotion.ts
│   └── Order.ts
└── store/                   # State management Zustand
    ├── cartStore.ts
    └── authStore.ts
```

## 🔐 API Endpoints

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion

### Produits
- `GET /api/products` - Liste produits (avec filtres)
- `GET /api/products/:id` - Détail produit
- `POST /api/products` - Créer produit (Admin)
- `PUT /api/products/:id` - Modifier produit (Admin)
- `DELETE /api/products/:id` - Supprimer produit (Admin)

### Catégories
- `GET /api/categories` - Liste catégories
- `POST /api/categories` - Créer catégorie (Admin)
- `PUT /api/categories/:id` - Modifier catégorie (Admin)
- `DELETE /api/categories/:id` - Supprimer catégorie (Admin)

### Promotions
- `GET /api/promotions` - Liste promotions
- `POST /api/promotions` - Créer promotion (Admin)
- `POST /api/promotions/validate` - Valider code promo

### Commandes
- `GET /api/orders` - Liste commandes
- `GET /api/orders/:id` - Détail commande
- `POST /api/orders` - Créer commande
- `PUT /api/orders/:id` - Modifier statut (Admin)

### Admin
- `GET /api/admin/stats` - Statistiques
- `GET /api/admin/users` - Liste utilisateurs (Admin)
- `POST /api/admin/users` - Créer utilisateur (Admin)

## 🎨 Technologies Utilisées

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Base de données**: MongoDB avec Mongoose
- **Authentification**: JWT, bcryptjs
- **Stockage images**: Cloudinary
- **State management**: Zustand
- **UI Components**: Headless UI, Lucide Icons
- **Notifications**: React Hot Toast

## 👤 Comptes par Défaut

Après avoir créé votre premier utilisateur, vous pouvez le promouvoir admin via MongoDB:

```javascript
// Dans MongoDB Compass ou shell
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

## 🚀 Déploiement

### Vercel (Recommandé pour Next.js)

1. Push sur GitHub
2. Importer sur Vercel
3. Configurer variables d'environnement
4. Déployer

### Variables d'environnement requises
- `MONGODB_URI`
- `JWT_SECRET`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`

## 📝 Fonctionnalités de Paiement

Les intégrations Wave, Orange Money et Carte bancaire sont configurées côté frontend. Pour une implémentation complète en production:

1. **Wave**: Intégrer l'API Wave (https://developer.wave.com)
2. **Orange Money**: Utiliser l'API Orange Money
3. **Carte bancaire**: Intégrer Stripe ou un autre processeur

## 🔒 Sécurité

- ✅ Authentification JWT sécurisée
- ✅ Mots de passe hashés avec bcrypt
- ✅ Validation des données
- ✅ Protection des routes admin
- ✅ Sanitization des entrées

## 📄 License

MIT

## 🤝 Support

Pour toute question ou problème, créer une issue sur GitHub.

---

**Développé avec ❤️ pour la vente de sneakers et streetwear**
