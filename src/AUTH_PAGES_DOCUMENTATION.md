# 🔐 Pages d'Authentification OpenUp

## Vue d'ensemble

Les pages d'authentification d'OpenUp ont été redesignées avec un design moderne, épuré et professionnel, utilisant le gradient bleu signature (#006EF7) et des animations fluides.

---

## 📄 Pages Créées

### 1. **Page d'Accueil / Welcome** (`/`)
**Fichier** : `/components/auth/welcome-page.tsx`

**Caractéristiques** :
- Fond dégradé bleu dynamique
- Logo OpenUp animé au centre
- Icônes de réseaux sociaux flottantes (Google, Instagram, LinkedIn, X, Spotify, YouTube, Twitch)
- Deux boutons d'action :
  - "S'inscrire" (bleu plein)
  - "Se connecter" (transparent avec bordure au hover)
- Animations Motion (framer-motion)

**Navigation** :
- Bouton "S'inscrire" → `/signup`
- Bouton "Se connecter" → `/login`
- Si utilisateur déjà connecté → Redirection automatique vers `/dashboard`

---

### 2. **Page d'Inscription** (`/signup`)
**Fichier** : `/components/auth/signup-page.tsx`

**Fonctionnalités** :
- **Étape 1 : Email**
  - Champ email avec validation
  - Bouton "Continuer"
  - Séparateur "OU"
  - Bouton "S'inscrire avec Google" (fonctionnel avec OAuth)
  - Bouton "S'inscrire avec Apple" (désactivé - à implémenter)
  - Lien vers la page de connexion
  - Texte légal (politique de confidentialité + CGU)

- **Étape 2 : Informations**
  - Champ "Nom complet"
  - Champ "Mot de passe" (minimum 6 caractères)
  - Bouton "Créer mon compte"
  - Affichage de l'email avec option de modification

**Intégration Supabase** :
- ✅ Création de compte avec email/password
- ✅ Création automatique du profil dans la table `profiles`
- ✅ OAuth Google (nécessite configuration dans Supabase)
- ✅ Gestion des erreurs et toasts

**Validations** :
- Format email valide
- Mot de passe minimum 6 caractères
- Nom complet requis

---

### 3. **Page de Connexion** (`/login`)
**Fichier** : `/components/auth/login-page.tsx`

**Fonctionnalités** :
- Champ email
- Champ mot de passe
- Lien "Mot de passe oublié ?"
- Bouton "Se connecter"
- Séparateur "OU"
- Bouton "Se connecter avec Google" (fonctionnel)
- Bouton "Se connecter avec Apple" (désactivé)
- Lien vers la page d'inscription

**Intégration Supabase** :
- ✅ Connexion avec email/password
- ✅ OAuth Google
- ✅ Gestion des sessions
- ✅ Redirection automatique vers `/dashboard` après connexion

---

### 4. **Page Mot de Passe Oublié** (`/forgot-password`)
**Fichier** : `/components/auth/forgot-password-page.tsx`

**Fonctionnalités** :
- Icône mail
- Explication claire du processus
- Champ email
- Bouton "Envoyer le lien de réinitialisation"
- Lien retour vers la connexion

**Après envoi** :
- Animation de confirmation avec icône verte
- Message de succès
- Bouton "Retour à la connexion"
- Option "Renvoyer" si email non reçu

**Intégration Supabase** :
- ✅ Utilise `supabase.auth.resetPasswordForEmail()`
- ✅ Email de réinitialisation automatique
- ✅ Redirection vers `/reset-password` (à créer si nécessaire)

---

## 🎨 Design System

### Couleurs
- **Bleu principal** : `#006EF7`
- **Bleu clair** : `#4FC3F7`
- **Bleu hover** : `#29B6F6`
- **Dégradé** : `from-[#006EF7] via-[#4A9FFF] to-white`

### Composants
- **Inputs** : Fond gris clair (`bg-gray-50`), arrondis XL, hauteur 14 (56px)
- **Boutons** : Arrondis XL, hauteur 14, effet hover avec scale
- **Cards** : Arrondis 3XL, ombre 2XL, padding 8

### Animations
- Transitions fluides (300ms)
- Effets de hover avec scale (1.02)
- Animations Motion pour les entrées/sorties
- Icônes sociales flottantes sur la page d'accueil

---

## 🔄 Flux d'Authentification

```
Landing (/)
├── Non connecté → WelcomePage
│   ├── Clic "S'inscrire" → /signup
│   └── Clic "Se connecter" → /login
│
└── Connecté → Redirection /dashboard

Inscription (/signup)
├── Étape 1 : Email
│   ├── Google OAuth → Supabase Auth → Dashboard
│   └── Email/Continuer → Étape 2
│
└── Étape 2 : Nom + Mot de passe
    └── Créer compte → Supabase → Dashboard

Connexion (/login)
├── Email + Mot de passe → Supabase → Dashboard
├── Google OAuth → Supabase → Dashboard
└── Mot de passe oublié → /forgot-password

Mot de passe oublié (/forgot-password)
└── Email → Supabase email reset → Message de confirmation
```

---

## 🚀 Utilisation

### Navigation simple
L'application utilise le pathname pour router entre les pages :

```typescript
// Dans App.tsx
const path = window.location.pathname;

if (path === '/signup') return <SignUpPage />;
if (path === '/login') return <LoginPage />;
if (path === '/forgot-password') return <ForgotPasswordPage />;
```

### Protection des routes
Les routes protégées redirigent automatiquement vers `/login` si l'utilisateur n'est pas connecté :

```typescript
if (!user) {
  window.location.href = '/login';
  return null;
}
```

---

## 🔧 Configuration Requise

### 1. Supabase Auth
Les credentials doivent être configurés dans `/utils/supabase/info.tsx` :
```typescript
export const projectId = "your-project-id"
export const publicAnonKey = "your-anon-key"
```

### 2. Google OAuth (Optionnel)
Pour activer la connexion Google, suivez les instructions :
https://supabase.com/docs/guides/auth/social-login/auth-google

**Configuration requise** :
1. Créer une application OAuth dans Google Cloud Console
2. Ajouter les credentials dans Supabase Dashboard
3. Configurer les URLs de redirection

### 3. Apple Sign In (À implémenter)
Actuellement désactivé. Pour l'activer :
https://supabase.com/docs/guides/auth/social-login/auth-apple

---

## 📱 Responsive Design

Toutes les pages sont **100% responsive** :

- **Mobile** : 
  - Logos et icônes adaptés
  - Padding réduit
  - Inputs full width

- **Desktop** :
  - Logos plus grands
  - Icônes sociales animées
  - Max-width 28rem (448px) pour les formulaires

---

## ✅ Checklist de Fonctionnalités

### Inscription
- ✅ Validation email
- ✅ Validation mot de passe (min 6 caractères)
- ✅ Création de compte Supabase
- ✅ Création automatique du profil
- ✅ Google OAuth
- ✅ Toasts de feedback
- ✅ États de chargement
- ✅ Gestion des erreurs
- ⬜ Apple Sign In (à implémenter)

### Connexion
- ✅ Email + mot de passe
- ✅ Google OAuth
- ✅ Lien mot de passe oublié
- ✅ Toasts de feedback
- ✅ États de chargement
- ✅ Gestion des erreurs
- ⬜ Apple Sign In (à implémenter)

### Mot de passe oublié
- ✅ Envoi email de réinitialisation
- ✅ Message de confirmation
- ✅ Option de renvoi
- ⬜ Page de réinitialisation (à créer)

---

## 🐛 Gestion des Erreurs

Toutes les erreurs Supabase sont interceptées et affichées via des toasts :

```typescript
if (error) {
  toast.error(error.message || 'Message par défaut');
}
```

**Messages communs** :
- Email invalide
- Mot de passe trop court
- Email déjà utilisé
- Identifiants incorrects
- Erreurs réseau

---

## 🎯 Améliorations Futures

### Court terme
- [ ] Page de réinitialisation de mot de passe (`/reset-password`)
- [ ] Intégration Apple Sign In
- [ ] Emails transactionnels personnalisés
- [ ] Vérification email obligatoire

### Long terme
- [ ] Authentification à deux facteurs (2FA)
- [ ] Connexion avec Magic Link
- [ ] Connexion avec GitHub, Facebook, etc.
- [ ] SSO pour les entreprises

---

## 📞 Support

En cas de problème :
1. Vérifier que Supabase est correctement configuré
2. Consulter les logs de la console
3. Vérifier les credentials dans `/utils/supabase/info.tsx`
4. Tester la connexion Supabase dans le dashboard

---

**✨ Les pages d'authentification OpenUp sont maintenant prêtes à l'emploi !**
