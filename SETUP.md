# Installation et Configuration

## 🚀 Guide de Démarrage Rapide

### 1. Installation des dépendances

```bash
npm install
```

### 2. Configuration de l'environnement

Créer un fichier `.env` à la racine du projet:

```env
# MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sneaker-commerce?retryWrites=true&w=majority

# JWT Secret (générer une clé aléatoire sécurisée)
JWT_SECRET=votre_cle_secrete_super_longue_et_aleatoire

# Cloudinary (créer un compte sur cloudinary.com)
CLOUDINARY_CLOUD_NAME=votre_cloud_name
CLOUDINARY_API_KEY=votre_api_key
CLOUDINARY_API_SECRET=votre_api_secret

# Next Auth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=votre_nextauth_secret

# Wave Payment (optionnel)
WAVE_API_KEY=votre_wave_api_key
WAVE_API_SECRET=votre_wave_api_secret

# Orange Money (optionnel)
ORANGE_MONEY_API_KEY=votre_orange_money_api_key
ORANGE_MONEY_API_SECRET=votre_orange_money_api_secret
```

### 3. Configuration MongoDB Atlas

1. Créer un compte sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Créer un nouveau cluster (gratuit)
3. Créer un utilisateur de base de données
4. Ajouter votre IP dans Network Access (ou autoriser 0.0.0.0/0 pour le développement)
5. Copier la connection string dans `.env`

### 4. Configuration Cloudinary

1. Créer un compte sur [Cloudinary](https://cloudinary.com/)
2. Aller dans Dashboard
3. Copier Cloud Name, API Key et API Secret dans `.env`

### 5. Initialiser la base de données avec des données de test

```bash
npm run seed
```

Cela créera:
- 5 catégories de produits
- 6 produits (sneakers, hoodies, t-shirts, etc.)
- 2 promotions actives
- 1 compte admin: `admin@sneakercommerce.com` / `admin123`
- 1 compte client: `client@test.com` / `client123`

### 6. Lancer le serveur de développement

```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

## 📋 Checklist Post-Installation

- [ ] MongoDB Atlas configuré et connexion OK
- [ ] Cloudinary configuré
- [ ] Base de données seedée avec succès
- [ ] Connexion admin fonctionne
- [ ] Affichage des produits sur la page d'accueil
- [ ] Ajout au panier fonctionne
- [ ] Panel admin accessible

## 🔐 Comptes de Test

### Admin
- **Email:** admin@sneakercommerce.com
- **Password:** admin123
- **Accès:** Dashboard admin complet

### Client
- **Email:** client@test.com
- **Password:** client123
- **Accès:** Shopping et commandes

## 📱 Fonctionnalités à Tester

### Client
1. Navigation et recherche de produits
2. Filtres par catégorie et prix
3. Ouverture modal produit
4. Ajout au panier avec taille/couleur
5. Modification panier
6. Checkout avec code promo
7. Création de commande

### Admin
1. Dashboard statistiques
2. CRUD Produits
3. CRUD Catégories
4. CRUD Promotions
5. Gestion commandes
6. Gestion utilisateurs
7. Upload d'images

## 🐛 Résolution de Problèmes

### Erreur de connexion MongoDB
- Vérifier la connection string dans `.env`
- Vérifier que votre IP est autorisée dans MongoDB Atlas
- Vérifier les identifiants de base de données

### Images ne s'affichent pas
- Vérifier la configuration Cloudinary dans `.env`
- Vérifier que le domaine est autorisé dans `next.config.mjs`

### Erreurs d'authentification
- Vérifier que `JWT_SECRET` est défini dans `.env`
- Vider le localStorage du navigateur
- Réessayer la connexion

## 🚀 Déploiement Production

### Vercel (Recommandé)

1. Push le code sur GitHub
2. Importer sur [Vercel](https://vercel.com)
3. Configurer toutes les variables d'environnement
4. Déployer

### Variables d'environnement Production

⚠️ **Important:** Utiliser des valeurs sécurisées en production:
- Générer un nouveau `JWT_SECRET` long et aléatoire
- Utiliser des secrets sécurisés pour tous les services
- Ne jamais committer le fichier `.env`

## 📚 Documentation API

### Endpoints Publics
- `GET /api/products` - Liste des produits
- `GET /api/products/:id` - Détail produit
- `GET /api/categories` - Liste catégories
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `POST /api/promotions/validate` - Valider code promo

### Endpoints Authentifiés
- `GET /api/orders` - Mes commandes
- `POST /api/orders` - Créer commande

### Endpoints Admin
- `POST /api/products` - Créer produit
- `PUT /api/products/:id` - Modifier produit
- `DELETE /api/products/:id` - Supprimer produit
- `GET /api/admin/stats` - Statistiques
- `GET /api/admin/users` - Liste utilisateurs

## 💡 Conseils de Développement

1. **Hot Reload:** Les changements de code sont automatiquement rechargés
2. **TypeScript:** Le projet utilise TypeScript pour la sécurité des types
3. **Tailwind CSS:** Classes utilitaires pour le styling
4. **Zustand:** State management simple et performant
5. **API Routes:** Backend intégré dans Next.js

## 🎨 Personnalisation

### Couleurs du thème
Modifier dans `tailwind.config.ts`:
```typescript
colors: {
  primary: {
    // Vos couleurs personnalisées
  }
}
```

### Logo et branding
- Modifier le nom dans `components/Header.tsx`
- Ajouter votre logo
- Personnaliser les métadonnées dans `app/layout.tsx`

## 📞 Support

Pour toute question ou problème:
1. Consulter la documentation complète dans `README.md`
2. Vérifier les erreurs dans la console
3. Créer une issue sur GitHub

---

**Bon développement! 🚀**
