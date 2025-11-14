# Viralis Studio

## Vue d'ensemble
Viralis Studio est une application web de génération de vidéos AI utilisant l'API KIE.ai pour accéder au modèle Veo 3.1 de Google. L'application permet aux utilisateurs de créer des vidéos virales pour TikTok et les réseaux sociaux à partir de prompts texte ou d'images de référence.

## État actuel
- ✅ Application configurée pour Replit
- ✅ Migration de Gemini API vers KIE API
- ✅ Serveur de développement fonctionnel sur le port 5000
- ✅ Support multilingue (Français, Anglais, Espagnol)
- ✅ Clé API KIE configurée et prête à l'emploi
- ✅ Import GitHub complété avec succès
- ✅ Authentification Google OAuth avec Supabase intégrée (08/11/2025)
- ✅ Système de jetons utilisateur
- ✅ Pages /auth et /dashboard fonctionnelles

## Architecture

### Stack technique
- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS (via CDN)
- **API de génération vidéo**: KIE.ai (Veo 3.1)
- **API de génération de scripts**: OpenAI GPT-4

### Structure du projet
```
├── components/          # Composants React
│   ├── Header.tsx
│   ├── VideoGenerator.tsx  # Composant principal de génération
│   ├── Hero.tsx
│   ├── Features.tsx
│   ├── Testimonials.tsx
│   └── ...
├── pages/              # Pages de l'application
│   ├── HomePage.tsx    # Page d'accueil publique
│   ├── AuthPage.tsx    # Page de connexion Google OAuth
│   ├── DashboardPage.tsx  # Tableau de bord utilisateur
│   └── AdminAuthReady.tsx # Page de vérification de l'auth
├── services/
│   ├── kieService.ts   # Service d'intégration KIE API
│   ├── supabaseClient.ts  # Client Supabase pour l'authentification
│   └── geminiService.ts (legacy)
├── data/
│   └── testimonials.ts
├── translations.ts     # Support i18n
├── App.tsx            # Composant racine avec routing
└── vite.config.ts     # Configuration Vite
```

## Configuration

### Variables d'environnement requises
- `KIE_API_KEY`: Clé API KIE.ai pour la génération de vidéos (https://kie.ai)
- `OPENAI_API_KEY`: Clé API OpenAI pour la génération de scripts (optionnel)
- `VITE_SUPABASE_URL`: URL du projet Supabase pour l'authentification
- `VITE_SUPABASE_ANON_KEY`: Clé publique anonyme Supabase

### Port et hosting
- **Port de développement**: 5000
- **Host**: 0.0.0.0 (pour compatibilité Replit)
- **HMR**: Configuré avec clientPort 443 pour le proxy Replit

## Fonctionnalités principales

### Génération de vidéos
- Génération à partir de prompts texte
- Génération à partir d'images de référence
- Support de plusieurs ratios d'aspect (9:16, 16:9, 1:1)
- Résolutions 720p et 1080p
- Mode thinking pour génération de scripts créatifs

### Interface utilisateur
- Design moderne avec animations
- Système de jetons pour limiter l'utilisation
- Preview en temps réel
- Modales pour affichage des vidéos générées
- Section de prix et FAQ
- Témoignages de la communauté

## API KIE Integration

### Endpoints utilisés
- `POST /api/v1/veo/generate` - Lancement de génération
- `GET /api/v1/veo/task/{taskId}` - Polling du statut

### Types de génération supportés
- `TEXT_2_VIDEO`: Génération depuis un prompt
- `REFERENCE_2_VIDEO`: Génération depuis une image

### Polling et résultats
- Polling toutes les 5 secondes
- Maximum 120 tentatives (10 minutes)
- Gestion des erreurs et timeout

## Changements récents (08/11/2025)

### Système d'authentification complet (Mise à jour majeure !)
- **3 méthodes d'authentification** intégrées via Supabase Auth :
  - **Google OAuth** : Connexion rapide en un clic avec Google
  - **Email/Password** : Connexion manuelle avec email et mot de passe
  - **Inscription** : Création de compte avec nom, email et mot de passe
- Page `/auth` avec interface à onglets moderne
- Validation des formulaires en temps réel avec messages d'erreur en français
- Page `/dashboard` avec :
  - Galerie de vidéos générées (10 vidéos par page)
  - Profil utilisateur et système de jetons
  - Générateur de vidéos intégré avec sauvegarde automatique
  - Fonctionnalités de suppression et rafraîchissement
- Table `videos` pour stocker l'historique des générations
- RLS (Row Level Security) pour sécuriser les données utilisateur
- Protection des routes avec redirection automatique
- Logo personnalisé (viralis-studio-logo.png)
- Documentation complète dans `AUTH_SETUP.md`

### Migration vers KIE API
- Remplacement de `geminiService.ts` par `kieService.ts`
- Adaptation de `VideoGenerator.tsx` pour utiliser KIE
- Correction du polling avec le bon endpoint `/veo/record-info`
- Gestion correcte des réponses API (successFlag: 0=en cours, 1=succès, 2/3=échec)
- Mise à jour de `vite.config.ts` pour les nouvelles variables d'environnement

### Configuration Replit
- Ajout du workflow `dev-server` sur port 5000
- Configuration HMR pour le proxy Replit
- Mise à jour .gitignore pour fichiers d'environnement
- Routing React Router pour navigation entre pages

## Commandes

### Développement
```bash
npm install      # Installation des dépendances
npm run dev      # Démarrage du serveur de développement (port 5000)
```

### Build
```bash
npm run build    # Build de production
npm run preview  # Preview du build
```

## Déploiement
- Type: Autoscale (stateless frontend)
- Build command: `npm run build`
- Run command: `npm run preview`

## Notes importantes
- L'API KIE nécessite un Bearer token pour l'authentification
- Les vidéos générées sont stockées pendant 14 jours sur KIE
- Le mode thinking utilise l'API OpenAI pour générer des scripts créatifs
- L'application est optimisée pour mobile (responsive design)

## Préférences utilisateur
- Language: Français (configurable dans l'interface)
- API préférée: KIE.ai pour la génération de vidéos
