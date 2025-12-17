# 🚀 Configuration Supabase pour OpenUp

## ✅ Configuration Backend Complète

Votre application OpenUp est maintenant **entièrement connectée** à Supabase avec :

### 🔐 Authentification
- ✅ Sign up / Sign in avec email/password
- ✅ OAuth Google (nécessite configuration Supabase)
- ✅ Persistance de session
- ✅ Auto-refresh des tokens
- ✅ Protection des routes

### 📊 Contextes & États Globaux
- ✅ **AuthContext** - Gestion de l'authentification et du profil
- ✅ **AppContext** - État global de l'application (liens, plans, subscriptions, etc.)
- ✅ **LinksContext** - Gestion des liens avec API Supabase
- ✅ **ThemeContext** - Thème sombre/clair

### 🗄️ Tables Supabase Connectées

#### 1. **profiles**
- Profils utilisateurs avec rôles (free, pro, business, admin)
- Langue, avatar, statut d'onboarding

#### 2. **plans**
- Plans Free, Pro, Business
- Limites de liens, QR codes, membres d'équipe
- Pricing mensuel/annuel

#### 3. **subscriptions**
- Abonnements utilisateurs
- Intégration Stripe (IDs customer & subscription)
- Statuts : active, trialing, past_due, canceled

#### 4. **links**
- Liens intelligents avec redirections
- Slugs personnalisés
- Protection par mot de passe
- Dates d'expiration
- Limites de clics
- Statuts : active, disabled, expired

#### 5. **link_analytics**
- Tracking des clics
- Device type, browser, country
- IP, referer, timestamp

#### 6. **qr_codes**
- QR codes dynamiques
- Styles personnalisés
- Lié aux liens

#### 7. **teams**
- Équipes collaboratives
- Propriétaire et membres

#### 8. **team_members**
- Membres d'équipe avec rôles (member, manager)
- Statuts d'invitation (pending, accepted)

#### 9. **billing_history**
- Historique de facturation Stripe
- Invoices, montants, statuts

---

## 🛠️ Structure des Fichiers

```
/utils/supabase/
├── client.tsx         ✅ Client Supabase réactivé
├── api.tsx           ✅ Services API pour toutes les tables
└── info.tsx          ✅ Credentials Supabase

/components/
├── auth-context.tsx  ✅ Authentification réelle
├── app-context.tsx   ✅ État global de l'app
├── links-context.tsx ✅ Gestion des liens avec API
└── protected-route.tsx ✅ Protection des routes

/utils/
└── plan-limits.tsx   ✅ Hook pour vérifier les limites de plan
```

---

## 📋 APIs Disponibles

### Auth API
```typescript
import { authAPI } from './utils/supabase/api';

// Sign up
await authAPI.signUp(email, password, fullName);

// Sign in
await authAPI.signIn(email, password);

// Sign in with Google
await authAPI.signInWithGoogle();

// Sign out
await authAPI.signOut();

// Get current user
const { session } = await authAPI.getCurrentUser();
```

### Profiles API
```typescript
import { profilesAPI } from './utils/supabase/api';

// Get profile
const { data } = await profilesAPI.getProfile(userId);

// Update profile
await profilesAPI.updateProfile(userId, { full_name: 'New Name' });
```

### Links API
```typescript
import { linksAPI } from './utils/supabase/api';

// Get user's links
const { data } = await linksAPI.getUserLinks(userId);

// Create link
await linksAPI.createLink({
  user_id: userId,
  slug: 'custom-slug',
  original_url: 'https://example.com',
  title: 'My Link',
});

// Update link
await linksAPI.updateLink(linkId, { title: 'New Title' });

// Delete link
await linksAPI.deleteLink(linkId);
```

### Analytics API
```typescript
import { analyticsAPI } from './utils/supabase/api';

// Get link analytics
const { data } = await analyticsAPI.getLinkAnalytics(linkId);

// Get click counts for user's links
const { data } = await analyticsAPI.getUserLinksClickCount(userId);
```

### QR Codes API
```typescript
import { qrCodesAPI } from './utils/supabase/api';

// Get user's QR codes
const { data } = await qrCodesAPI.getUserQRCodes(userId);

// Create QR code
await qrCodesAPI.createQRCode({
  link_id: linkId,
  user_id: userId,
  qr_image_url: url,
  design_style: {},
  dynamic: true,
});
```

---

## 🎯 Utilisation dans les Composants

### Exemple 1 : Utiliser l'authentification
```typescript
import { useAuth } from './components/auth-context';

function MyComponent() {
  const { user, profile, loading, signIn, signOut } = useAuth();
  
  if (loading) return <div>Chargement...</div>;
  
  return (
    <div>
      {user ? (
        <div>
          <p>Bienvenue {profile?.full_name}</p>
          <button onClick={signOut}>Déconnexion</button>
        </div>
      ) : (
        <button onClick={() => signIn(email, password)}>Connexion</button>
      )}
    </div>
  );
}
```

### Exemple 2 : Utiliser les données de l'app
```typescript
import { useApp } from './components/app-context';

function Dashboard() {
  const { 
    links, 
    currentPlan, 
    canCreateLink, 
    linksRemaining,
    refreshLinks 
  } = useApp();
  
  return (
    <div>
      <p>Plan actuel: {currentPlan?.name}</p>
      <p>Liens restants: {linksRemaining}</p>
      <p>Nombre de liens: {links.length}</p>
      
      {canCreateLink ? (
        <button>Créer un lien</button>
      ) : (
        <button onClick={() => window.location.href = '/settings/subscription'}>
          Mettre à niveau
        </button>
      )}
    </div>
  );
}
```

### Exemple 3 : Utiliser les limites de plan
```typescript
import { usePlanLimits, PLAN_FEATURES } from './utils/plan-limits';

function CreateLink() {
  const { checkLinkLimit, hasPlanFeature, showUpgradeModal } = usePlanLimits();
  
  const handleCreateLink = () => {
    if (!checkLinkLimit()) {
      return; // Limite atteinte
    }
    
    if (!hasPlanFeature(PLAN_FEATURES.CUSTOM_DOMAIN)) {
      showUpgradeModal('Domaines personnalisés');
      return;
    }
    
    // Créer le lien...
  };
  
  return <button onClick={handleCreateLink}>Créer</button>;
}
```

---

## 🔒 Row Level Security (RLS)

⚠️ **IMPORTANT** : Vous devez activer RLS sur toutes les tables dans Supabase UI :

### Policies à créer :

#### Table `profiles`
```sql
-- Users can read their own profile
CREATE POLICY "Users can read own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);
```

#### Table `links`
```sql
-- Users can read their own links
CREATE POLICY "Users can read own links"
ON links FOR SELECT
USING (auth.uid() = user_id);

-- Users can create links
CREATE POLICY "Users can create links"
ON links FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own links
CREATE POLICY "Users can update own links"
ON links FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own links
CREATE POLICY "Users can delete own links"
ON links FOR DELETE
USING (auth.uid() = user_id);

-- Anyone can read links by slug (for redirects)
CREATE POLICY "Anyone can read links by slug"
ON links FOR SELECT
USING (true);
```

#### Table `link_analytics`
```sql
-- Users can read analytics for their own links
CREATE POLICY "Users can read own analytics"
ON link_analytics FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM links 
    WHERE links.id = link_analytics.link_id 
    AND links.user_id = auth.uid()
  )
);

-- Anyone can insert analytics (for tracking)
CREATE POLICY "Anyone can insert analytics"
ON link_analytics FOR INSERT
WITH CHECK (true);
```

#### Table `qr_codes`
```sql
-- Users can read their own QR codes
CREATE POLICY "Users can read own qr codes"
ON qr_codes FOR SELECT
USING (auth.uid() = user_id);

-- Users can create QR codes
CREATE POLICY "Users can create qr codes"
ON qr_codes FOR INSERT
WITH CHECK (auth.uid() = user_id);
```

---

## 🎨 Prochaines Étapes

### 1. Créer les tables dans Supabase UI
Utilisez le SQL Editor dans Supabase pour créer toutes les tables avec le schéma défini.

### 2. Activer RLS
Activez Row Level Security sur toutes les tables et créez les policies ci-dessus.

### 3. Configurer Google OAuth (optionnel)
Suivez les instructions : https://supabase.com/docs/guides/auth/social-login/auth-google

### 4. Configurer Stripe (optionnel)
Pour les paiements, vous devrez intégrer Stripe et créer des webhooks.

### 5. Tester l'application
- Créez un compte
- Créez des liens
- Testez les limites de plan
- Vérifiez les analytics

---

## 🐛 Debugging

### Logs
Tous les appels API loggent les erreurs dans la console. Ouvrez DevTools pour voir :
```
Console → Errors
```

### Vérifier l'authentification
```typescript
import { supabase } from './utils/supabase/client';

// Check current session
const { data } = await supabase.auth.getSession();
console.log('Current session:', data);
```

### Vérifier les données
```typescript
import { linksAPI } from './utils/supabase/api';

const { data, error } = await linksAPI.getUserLinks(userId);
console.log('Links:', data, 'Error:', error);
```

---

## 📞 Support

Si vous rencontrez des erreurs :
1. Vérifiez que les tables existent dans Supabase
2. Vérifiez que RLS est activé avec les bonnes policies
3. Vérifiez les credentials dans `/utils/supabase/info.tsx`
4. Consultez les logs de la console

---

**✨ Votre application OpenUp est maintenant prête à fonctionner avec Supabase !**
