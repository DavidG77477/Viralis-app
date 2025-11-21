# Configuration Stripe en Mode Test

## Problème

Vous utilisez une clé Stripe en mode **test** (`sk_test_...`), mais les Price IDs configurés sont en mode **live**. Stripe sépare les Price IDs entre test et production.

## Solution : Créer des Price IDs de Test

### Étape 1 : Accéder au Dashboard Stripe en Mode Test

1. Allez sur [Stripe Dashboard](https://dashboard.stripe.com)
2. Assurez-vous d'être en **mode Test** (toggle en haut à droite)
3. Allez dans **Products** → **Products**

### Étape 2 : Créer les Produits et Prices de Test

Pour chaque plan, créez un produit et un price en mode test :

#### 1. Token Pack (100 tokens)
- **Product name**: Token Pack
- **Price**: 9.99€ (ou votre prix)
- **Billing**: One time
- **Price ID**: Copiez le `price_xxxxx` généré

#### 2. Premium Token Pack (1200 tokens)
- **Product name**: Premium Token Pack
- **Price**: 99.99€ (ou votre prix)
- **Billing**: One time
- **Price ID**: Copiez le `price_xxxxx` généré

#### 3. Pro Monthly
- **Product name**: Pro Monthly
- **Price**: 19.99€/month (ou votre prix)
- **Billing**: Recurring (monthly)
- **Price ID**: Copiez le `price_xxxxx` généré

#### 4. Pro Annual
- **Product name**: Pro Annual
- **Price**: 199.99€/year (ou votre prix)
- **Billing**: Recurring (yearly)
- **Price ID**: Copiez le `price_xxxxx` généré

### Étape 3 : Configurer les Price IDs dans Vercel

Une fois que vous avez les 4 Price IDs de test, ajoutez-les comme variables d'environnement dans Vercel :

1. Allez dans **Vercel Dashboard** → **Settings** → **Environment Variables**
2. Ajoutez ces variables (pour tous les environnements) :

```
STRIPE_PRICE_ID_TOKEN_PACK_TEST=price_xxxxx
STRIPE_PRICE_ID_PREMIUM_TOKENS_TEST=price_xxxxx
STRIPE_PRICE_ID_PRO_MONTHLY_TEST=price_xxxxx
STRIPE_PRICE_ID_PRO_ANNUAL_TEST=price_xxxxx
```

### Étape 4 : Mettre à jour le Webhook

Après avoir créé les Price IDs de test, mettez à jour `api/stripe-webhook.ts` pour ajouter les mappings :

```typescript
const TOKEN_AMOUNTS: Record<string, number> = {
  // LIVE
  'price_1STdsSQ95ijGuOd86o9Kz6Xn': 100,
  'price_1STdtvQ95ijGuOd8hnKkQEE5': 1200,
  // TEST - Ajoutez vos Price IDs de test ici
  'price_xxxxx': 100,  // Token Pack Test
  'price_xxxxx': 1200, // Premium Tokens Test
};

const PRICE_TO_SUBSCRIPTION_STATUS: Record<string, 'pro_monthly' | 'pro_annual'> = {
  // LIVE
  'price_1STdvsQ95ijGuOd8DTnBtkkE': 'pro_monthly',
  'price_1STdyaQ95ijGuOd8OjQauruf': 'pro_annual',
  // TEST - Ajoutez vos Price IDs de test ici
  'price_xxxxx': 'pro_monthly', // Pro Monthly Test
  'price_xxxxx': 'pro_annual',  // Pro Annual Test
};
```

### Étape 5 : Redéployer

Après avoir configuré les variables d'environnement dans Vercel, redéployez l'application.

## Alternative : Utiliser les Price IDs de Test Directement

Si vous préférez hardcoder les Price IDs de test dans le code (moins flexible), vous pouvez modifier `api/create-checkout-session.ts` directement avec vos Price IDs de test.

## Vérification

Pour vérifier que tout fonctionne :
1. Testez le checkout avec une carte de test Stripe : `4242 4242 4242 4242`
2. Vérifiez que les tokens sont ajoutés correctement
3. Vérifiez que les abonnements sont créés correctement

