# 🚀 Guide d'intégration Stripe - Doctic Medical OS

## 📋 Vue d'ensemble

Cette application intègre Stripe pour gérer les abonnements professionnels et entreprise. Voici comment tout mettre en place.

---

## 1. Configuration Stripe

### Créer un compte Stripe
1. Allez sur https://dashboard.stripe.com/register
2. Créez votre compte (utilisez le mode Test pour commencer)
3. Récupérez vos clés API :
   - Dashboard → Developers → API keys
   - Clé publique (pk_test_...)
   - Clé secrète (sk_test_...)

### Créer les produits et prix
1. Dashboard → Products → Add Product
2. Créez deux produits :

**Produit 1 : Doctic Professional Monthly**
- Nom : Doctic Professional
- Prix : $49 / mois
- Type : Récurrent (monthly)
- Copiez l'ID du prix (prix_...)

**Produit 2 : Doctic Professional Annual**
- Nom : Doctic Professional (Annual)
- Prix : $504 / an ($42/mois)
- Type : Récurrent (yearly)
- Copiez l'ID du prix (prix_...)

### Configurer les webhooks
1. Dashboard → Developers → Webhooks → Add endpoint
2. URL : `https://votre-domaine.com/api/webhooks/stripe` (ou `http://localhost:5000/api/webhooks/stripe` pour local)
3. Événements à écouter :
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copiez le secret du webhook (whsec_...)

---

## 2. Configuration de l'environnement

### Fichier `.env`

Renommez `.env.example` en `.env` et remplissez les valeurs :

```bash
# Backend
PORT=5000
FRONTEND_URL=http://localhost:5173

# Stripe Keys
STRIPE_SECRET_KEY=sk_test_VOTRE_CLE_SECRETE
STRIPE_WEBHOOK_SECRET=whsec_VOTRE_WEBHOOK_SECRET

# Stripe Price IDs
STRIPE_PRICE_PRO_MONTHLY=price_VOTRE_ID_MENSUEL
STRIPE_PRICE_PRO_ANNUAL=price_VOTRE_ID_ANNUEL

# Frontend (Vite)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_VOTRE_CLE_PUBLIQUE
VITE_API_URL=http://localhost:5000
```

---

## 3. Tester localement

### 1. Démarrer le backend
```bash
node server.js
```

Vous devriez voir :
```
🚀 Backend server running on http://localhost:5000
💳 Stripe integration ✅ active
```

### 2. Démarrer le frontend
```bash
npm run dev
```

### 3. Tester le checkout

1. Allez sur `http://localhost:5173/pricing`
2. Cliquez sur "Start 14-day Trial" (plan Professional)
3. Vous serez redirigé vers Stripe Checkout
4. Utilisez une carte de test : `4242 4242 4242 4242`
   - Expiration : n'importe quelle date future
   - CVC : n'importe quel 3 chiffres
5. Complétez le paiement
6. Vous devriez être redirigé vers `/pricing?success=true`

### 4. Tester les webhooks localement (avec Stripe CLI)

```bash
# Installer Stripe CLI
# Windows: scoop install stripe
# Mac: brew install stripe/stripe-cli/stripe
# Linux: voir https://stripe.com/docs/stripe-cli

# Login
stripe login

# Écouter les webhooks
stripe listen --forward-to localhost:5000/api/webhooks/stripe

# Le CLI vous donnera un webhook secret (whsec_...)
# Copiez-le dans votre .env
```

---

## 4. Endpoints API disponibles

### POST `/api/create-checkout-session`
Crée une session Stripe Checkout

**Body:**
```json
{
  "plan": "professional",
  "billingPeriod": "monthly",
  "email": "user@example.com",
  "userId": "user-123"
}
```

**Response:**
```json
{
  "url": "https://checkout.stripe.com/c/pay/..."
}
```

### GET `/api/subscription?userId=user-1`
Récupère l'abonnement d'un utilisateur

**Response:**
```json
{
  "subscription": {
    "plan": "professional",
    "status": "active",
    "currentPeriodEnd": "2024-02-15T00:00:00Z",
    "cancelAtPeriodEnd": false
  }
}
```

### POST `/api/cancel-subscription`
Annule un abonnement à la fin de la période

**Body:**
```json
{
  "userId": "user-1",
  "subscriptionId": "sub_1234567890"
}
```

---

## 5. Cartes de test Stripe

### Succès
- `4242 4242 4242 4242` → Paiement réussi
- `5555 5555 5555 4444` → Mastercard
- `3782 822463 10005` → American Express

### Échecs
- `4000 0000 0000 0002` → Carte déclinée
- `4000 0000 0000 9995` → Insuffisamment de fonds

### 3D Secure (authentification)
- `4000 0025 0000 3155` → Requiert authentification 3DS

---

## 6. Production

### Avant de passer en production :

1. **Activer le mode Live** dans Stripe Dashboard
2. **Remplacer les clés** dans `.env` :
   - `pk_live_...` et `sk_live_...`
3. **Configurer le webhook** en production :
   - URL : `https://api.votre-domaine.com/api/webhooks/stripe`
4. **Activer les emails** Stripe pour les confirmations
5. **Configurer les taxes** (Stripe Tax si besoin)
6. **Vérifier la conformité PCI DSS** (Stripe s'en charge)

---

## 7. Gestion des abonnements

### Voir son abonnement
`/subscription` → Page de gestion

### Annuler un abonnement
L'utilisateur peut annuler depuis `/subscription`  
L'abonnement reste actif jusqu'à la fin de la période payée.

### Changer de plan
Redirection vers `/pricing?upgrade=true`

---

## 8. Sécurité

✅ **Clé secrète côté backend uniquement** (jamais exposée au frontend)  
✅ **Webhooks signés** (vérification avec `STRIPE_WEBHOOK_SECRET`)  
✅ **HTTPS en production** (obligatoire)  
✅ **PCI DSS compliant** (géré par Stripe)

---

## 9. Support & Ressources

- 📚 [Documentation Stripe](https://stripe.com/docs)
- 🎥 [Stripe Checkout Guide](https://stripe.com/docs/payments/checkout)
- 💬 [Stripe Discord Community](https://discord.gg/stripe)
- 📧 Support: support@stripe.com

---

## 🎉 Vous êtes prêt !

Votre intégration Stripe est maintenant complète. Testez tout en mode test, puis activez le mode production quand vous êtes prêt à lancer !

**Happy coding! 🚀**
