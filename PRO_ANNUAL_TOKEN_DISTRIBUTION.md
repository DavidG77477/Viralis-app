# Distribution Mensuelle des Tokens pour Pro Annual

## Vue d'ensemble

Pour les abonnements **Pro Annual**, les tokens sont distribués **300 par mois pendant 14 mois** au lieu d'être donnés d'un coup (4200 tokens).

## Fonctionnement

### Pro Annual
- **Premier paiement** : 300 tokens immédiatement + planification de 13 distributions mensuelles supplémentaires
- **Distributions mensuelles** : 300 tokens chaque mois pendant 14 mois au total
- **Renouvellement** (après 12 mois) : Nouveau cycle de 14 mois avec 300 tokens par mois

### Pro Monthly
- **300 tokens** donnés directement chaque mois (pas de système de distribution)

## Configuration Vercel Cron

Le système utilise Vercel Cron pour distribuer automatiquement les tokens chaque mois.

### 1. Vérifier la configuration dans `vercel.json`

Le cron job est déjà configuré :
```json
{
  "crons": [
    {
      "path": "/api/distribute-subscription-tokens",
      "schedule": "0 0 * * *"
    }
  ]
}
```

Cela exécute le job **tous les jours à minuit UTC**.

### 2. Activer Vercel Cron (si nécessaire)

1. Allez dans **Vercel Dashboard** → **Settings** → **Cron Jobs**
2. Vérifiez que le cron job est activé
3. Si ce n'est pas le cas, activez-le

### 3. Optionnel : Ajouter une clé secrète

Pour sécuriser l'endpoint, vous pouvez ajouter une variable d'environnement `CRON_SECRET` dans Vercel et l'utiliser pour authentifier les requêtes cron.

## Base de données

La table `subscription_token_distributions` a été créée pour suivre :
- Le nombre de mois déjà distribués
- La date de la prochaine distribution
- Le statut de l'abonnement

## Test manuel

Vous pouvez tester l'endpoint manuellement :

```bash
curl -X GET https://viralis-studio.app/api/distribute-subscription-tokens
```

Ou avec authentification si `CRON_SECRET` est configuré :

```bash
curl -X GET https://viralis-studio.app/api/distribute-subscription-tokens \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

## Logs

Les logs de distribution sont disponibles dans :
- **Vercel Dashboard** → **Functions** → **distribute-subscription-tokens** → **Logs**

Vous verrez :
- Le nombre de distributions effectuées
- Les utilisateurs qui ont reçu des tokens
- Les erreurs éventuelles

## Gestion des erreurs

- Si une distribution échoue, elle sera réessayée le jour suivant
- Les distributions sont idempotentes (peuvent être exécutées plusieurs fois sans problème)
- Les tokens ne sont distribués que si le mois précédent est écoulé

## Annulation d'abonnement

Lorsqu'un abonnement Pro Annual est annulé :
- Le plan de distribution est automatiquement supprimé
- Les tokens déjà distribués restent dans le compte de l'utilisateur
- Aucune nouvelle distribution n'aura lieu

