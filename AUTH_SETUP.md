# Configuration de l'Authentification avec Supabase

## Vue d'ensemble

Viralis Studio utilise **Supabase Auth** pour l'authentification complète avec 3 options :
- **Google OAuth** : Connexion en un clic avec Google
- **Email/Mot de passe** : Connexion manuelle avec email
- **Inscription** : Création de compte avec email et mot de passe

Cette solution est optimisée pour React + Vite et offre une expérience utilisateur complète.

## Prérequis

- Un compte Supabase (gratuit) : https://supabase.com
- Les utilisateurs connectés bénéficient de fonctionnalités supplémentaires :
  - 100 jetons gratuits pour démarrer
  - Sauvegarde des créations
  - Tableau de bord personnel

## Étape 1 : Créer un projet Supabase

1. Rendez-vous sur https://supabase.com et connectez-vous
2. Cliquez sur "New Project"
3. Choisissez votre organisation ou créez-en une
4. Configurez votre projet :
   - **Nom du projet** : `viralis-studio` (ou au choix)
   - **Database Password** : Générez un mot de passe fort
   - **Region** : Choisissez la région la plus proche (ex: Europe (Paris))
5. Cliquez sur "Create new project"

⏳ Attendez quelques minutes que le projet soit créé...

## Étape 2 : Activer les méthodes d'authentification

### Email/Password (Recommandé pour commencer)

Par défaut, Supabase active l'authentification par email/password. Pour vérifier :

1. Dans votre projet Supabase, allez dans **Authentication** > **Providers**
2. Assurez-vous que **Email** est activé
3. Configurez les paramètres :
   - **Confirm email** : Activez si vous voulez que les utilisateurs confirment leur email
   - **Secure email change** : Recommandé pour la sécurité

### Google OAuth (Optionnel)

1. Dans votre projet Supabase, allez dans **Authentication** > **Providers**
2. Recherchez **Google** dans la liste
3. Activez le provider Google :
   - Cliquez sur Google
   - Activez le toggle "Enable Sign in with Google"

### Configuration Google Cloud Console

Pour que Google OAuth fonctionne, vous devez créer des credentials OAuth 2.0 :

1. Rendez-vous sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un nouveau projet ou sélectionnez un projet existant
3. Activez l'API "Google+ API"
4. Allez dans **APIs & Services** > **Credentials**
5. Cliquez sur **Create Credentials** > **OAuth client ID**
6. Configurez l'écran de consentement OAuth si demandé
7. Choisissez **Web application** comme type d'application
8. Ajoutez les **Authorized redirect URIs** :
   ```
   https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback
   ```
   *(Remplacez `[YOUR-PROJECT-REF]` par votre référence de projet Supabase)*

9. Copiez le **Client ID** et **Client Secret** générés

### Retour sur Supabase

1. Retournez sur Supabase > Authentication > Providers > Google
2. Collez votre **Client ID** et **Client Secret** de Google
3. Cliquez sur **Save**

## Étape 3 : Récupérer les credentials Supabase

1. Dans votre projet Supabase, allez dans **Settings** (icône engrenage) > **API**
2. Notez les informations suivantes :
   - **Project URL** : `https://xxxxxxxxxx.supabase.co`
   - **anon public key** : `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## Étape 4 : Configurer les variables d'environnement dans Replit

1. Dans Replit, cliquez sur l'onglet **Secrets** (icône 🔒)
2. Ajoutez les variables suivantes :

| Key | Value |
|-----|-------|
| `VITE_SUPABASE_URL` | Votre Project URL de Supabase |
| `VITE_SUPABASE_ANON_KEY` | Votre anon public key de Supabase |

⚠️ **Important** : Les variables doivent commencer par `VITE_` pour être accessibles côté client avec Vite.

## Étape 5 : Créer la table users (optionnel mais recommandé)

Pour stocker les informations utilisateur et les jetons, créez une table `users` :

1. Dans Supabase, allez dans **SQL Editor**
2. Exécutez le script SQL suivant :

```sql
-- Créer la table users
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  avatar_url TEXT,
  provider TEXT NOT NULL DEFAULT 'google',
  tokens INTEGER NOT NULL DEFAULT 45,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activer Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Politique : Les utilisateurs peuvent voir leur propre profil
CREATE POLICY "Users can view their own profile"
  ON users
  FOR SELECT
  USING (auth.uid() = id);

-- Politique : Les utilisateurs peuvent mettre à jour leur propre profil
CREATE POLICY "Users can update their own profile"
  ON users
  FOR UPDATE
  USING (auth.uid() = id);

-- Fonction pour décrémenter les jetons
CREATE OR REPLACE FUNCTION decrement_tokens(user_id UUID, tokens_to_use INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE users
  SET tokens = GREATEST(tokens - tokens_to_use, 0)
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour créer automatiquement un profil lors de l'inscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, avatar_url, provider, tokens)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', SPLIT_PART(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture'),
    COALESCE(NEW.raw_app_meta_data->>'provider', 'email'),
    45
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Créer le trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Créer la table videos pour l'historique des générations
CREATE TABLE IF NOT EXISTS videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT,
  prompt TEXT NOT NULL,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  aspect_ratio TEXT NOT NULL,
  resolution TEXT NOT NULL,
  tokens_used INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT videos_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Activer Row Level Security sur la table videos
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

-- Politique : Les utilisateurs peuvent voir uniquement leurs vidéos
CREATE POLICY "Users can view their own videos"
  ON videos
  FOR SELECT
  USING (auth.uid() = user_id);

-- Politique : Les utilisateurs peuvent créer leurs propres vidéos
CREATE POLICY "Users can insert their own videos"
  ON videos
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Politique : Les utilisateurs peuvent supprimer leurs propres vidéos
CREATE POLICY "Users can delete their own videos"
  ON videos
  FOR DELETE
  USING (auth.uid() = user_id);

-- Index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS videos_user_id_idx ON videos(user_id);
CREATE INDEX IF NOT EXISTS videos_created_at_idx ON videos(created_at DESC);
```

## Étape 6 : Tester l'authentification

1. Redémarrez votre application Replit
2. Visitez `/admin/auth_ready` pour vérifier que tout est configuré
3. Si tout est OK, vous verrez : **"Auth Google ready"**
4. Accédez à `/auth` et testez la connexion avec Google

## Structure des routes

- **`/`** : Page d'accueil publique
- **`/auth`** : Page de connexion Google OAuth
- **`/dashboard`** : Tableau de bord utilisateur (protégé)
- **`/admin/auth_ready`** : Vérification de la configuration

## Fonctionnalités

### Page /auth
- **3 onglets d'authentification** :
  - **Google** : Connexion rapide avec Google OAuth
  - **Connexion** : Connexion manuelle avec email et mot de passe
  - **Inscription** : Création de compte avec nom, email et mot de passe
- Design moderne avec effets de lueur
- Validation des formulaires en temps réel
- Messages d'erreur clairs et en français
- Redirection automatique vers `/dashboard` après connexion
- Affichage des avantages de la connexion

### Page /dashboard
- Affichage du profil utilisateur (nom, avatar, email)
- Compteur de jetons en temps réel
- Générateur de vidéos intégré
- Cartes de statistiques
- Bouton de déconnexion

### Protection des routes
- Les utilisateurs non connectés sont automatiquement redirigés vers `/auth`
- Les utilisateurs connectés ne peuvent pas accéder à `/auth` (redirection vers `/dashboard`)

## Dépannage

### "Configuration incomplète"
→ Vérifiez que les variables `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` sont bien définies dans Replit Secrets

### "Redirect URI mismatch" lors de la connexion Google
→ Vérifiez que l'URL de callback est bien configurée dans Google Cloud Console :
```
https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback
```

### Les jetons ne se mettent pas à jour
→ Vérifiez que la table `users` et la fonction `decrement_tokens` sont bien créées dans Supabase

### L'utilisateur n'est pas créé en base
→ Vérifiez que le trigger `on_auth_user_created` est actif et que les politiques RLS sont configurées

## Sécurité

- ✅ Les secrets sont stockés côté serveur (Supabase)
- ✅ Row Level Security (RLS) activé sur la table users
- ✅ Les tokens JWT sont gérés automatiquement par Supabase
- ✅ HTTPS obligatoire en production
- ⚠️ Ne jamais exposer `VITE_SUPABASE_ANON_KEY` dans le code source versionné

## Support

Pour toute question, contactez l'équipe de développement ou consultez la documentation officielle :
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Supabase Google OAuth](https://supabase.com/docs/guides/auth/social-login/auth-google)
