# 🌐 Documentation Link in Bio - OpenUp

## Vue d'ensemble

Le système Link in Bio permet aux utilisateurs de créer des pages de profil personnalisées regroupant tous leurs liens importants, dans le style des créateurs modernes comme MrBeast, Linktree, etc.

---

## 📁 Architecture

### Composants principaux

1. **`/components/create-bio-wizard.tsx`** - Wizard de création/édition en 3 étapes
2. **`/components/views/link-in-bio-view.tsx`** - Vue liste des pages Link in Bio
3. **`/components/main-dashboard.tsx`** - Intégration des modals et handlers

---

## 🎨 Wizard de création (3 étapes)

### Étape 1 - Informations de base

**Champs obligatoires** :
- ✅ **Titre de la page*** 
  - Placeholder : "Ma page OpenUp"
  - Nom affiché sur la page publique
  
- ✅ **Slug (URL)***
  - Format : `openup.to/[slug]`
  - Validation : minimum 3 caractères, uniquement lettres minuscules, chiffres et tirets
  - Auto-génération depuis le titre

**Champs optionnels** :
- **Description**
  - Textarea, 3 lignes
  - Affichée sous le nom
  - Placeholder : "Créateur de contenu, entrepreneur..."

- **Photo de profil**
  - Input URL
  - Preview en temps réel avec fallback
  
- **Domaine personnalisé** 👑 Pro
  - Input texte
  - Placeholder : "www.monsite.com"

---

### Étape 2 - Réseaux sociaux

**8 réseaux disponibles** :

| Réseau | Icône | Placeholder | Préfixe |
|--------|-------|-------------|---------|
| Instagram | 📷 | @username | instagram.com/ |
| Twitter/X | 🐦 | @username | twitter.com/ |
| YouTube | ▶️ | @channel | youtube.com/ |
| Facebook | 📘 | username | facebook.com/ |
| LinkedIn | 💼 | username | linkedin.com/in/ |
| Site web | 🌐 | https://... | (none) |
| Email | ✉️ | contact@exemple.com | mailto: |
| Téléphone | 📞 | +33 6 12 34 56 78 | tel: |

**Options** :
- **Afficher les icônes sociales**
  - Switch toggle
  - Active par défaut
  - Affiche les icônes en haut de la page publique

---

### Étape 3 - Apparence

#### Thèmes (6 disponibles)

| ID | Nom | Gradient |
|----|-----|----------|
| `gradient-blue` | Océan | Blue → Cyan |
| `gradient-pink` | Sunset | Pink → Rose |
| `gradient-purple` | Galaxy | Purple → Pink |
| `gradient-orange` | Sunrise | Orange → Yellow |
| `solid-dark` | Dark | Gray-900 |
| `solid-light` | Light | White |

#### Styles de boutons (3 disponibles)

- **Rounded** (Arrondi) - `rounded-lg`
- **Square** (Carré) - `rounded-none`
- **Pill** (Pilule) - `rounded-full`

#### Options de publication

- **Publier la page**
  - Switch toggle
  - Brouillon par défaut
  - Rend la page visible publiquement

#### Résumé final

Affiche un récapitulatif :
- Titre
- URL (openup.to/slug)
- Thème
- Statut (Publié/Brouillon)

---

## 📊 Interface BioPage

```typescript
interface BioPage {
  id?: string;
  
  // Étape 1 - Informations
  title: string;                          // Titre de la page
  slug: string;                           // URL slug
  description: string;                    // Bio/description
  profileImage: string;                   // URL photo de profil
  customDomain: string;                   // Domaine personnalisé (Pro)
  
  // Étape 2 - Réseaux sociaux
  instagram: string;                      // @username
  twitter: string;                        // @username
  youtube: string;                        // @channel
  facebook: string;                       // username
  linkedin: string;                       // username
  website: string;                        // https://...
  email: string;                          // email@domain.com
  phone: string;                          // +33 6 12 34 56 78
  showSocialIcons: boolean;              // Afficher icônes
  
  // Étape 3 - Apparence
  theme: ThemeType;                       // gradient-blue | gradient-pink | etc.
  backgroundColor: string;                // Couleur de fond
  textColor: string;                      // Couleur du texte
  buttonStyle: ButtonStyleType;          // rounded | square | pill
  
  // Métadonnées
  isPublished: boolean;                  // Publié ou brouillon
  views?: string;                        // Nombre de vues (lecture seule)
  links?: number;                        // Nombre de liens (lecture seule)
}
```

---

## 🎯 Vue Liste (LinkInBioView)

### Affichage des pages

Chaque carte de page affiche :

**Header** :
- Titre de la page
- Badge "Publié" (vert) ou "Brouillon" (gris)
- URL : `openup.to/slug`
- Menu contextuel (3 points)

**Stats** :
- Vues (ex: "1.2M")
- Nombre de liens (ex: "8")
- Thème visuel (pastille colorée)

**Actions** :
- ✏️ **Modifier** - Bouton principal bleu
- 👁️ **Aperçu** - Ouvre dans nouvel onglet
- 📋 **Copier** - Copie le lien dans le presse-papier

**Menu contextuel** :
- ✏️ Modifier
- 📋 Dupliquer
- 👁️ Aperçu
- 🔗 Copier le lien
- 🗑️ Supprimer (rouge)

---

## 🔄 Flux utilisateur

### Créer une nouvelle page

```
1. Clic sur bouton "Créer une page Link in Bio"
   OU
   Menu de création → "Un nouveau Link in bio"
   ↓
2. Wizard s'ouvre (Étape 1)
   ↓
3. Remplir titre + slug (obligatoire)
   + Description et photo (optionnel)
   ↓
4. Clic "Suivant" → Validation
   ↓
5. Étape 2 - Ajouter réseaux sociaux (optionnel)
   ↓
6. Clic "Suivant"
   ↓
7. Étape 3 - Choisir thème + style boutons
   + Activer/désactiver publication
   ↓
8. Clic "Créer la page"
   ↓
9. Toast de succès
   ↓
10. Modal se ferme
    ↓
11. Nouvelle page apparaît dans la liste
```

### Modifier une page existante

```
1. Depuis la liste, clic sur "Modifier"
   OU
   Menu contextuel → "Modifier"
   ↓
2. Wizard s'ouvre en mode édition
   + Formulaire pré-rempli avec données existantes
   + Titre change : "Modifier un Link in Bio"
   + Bouton final : "Mettre à jour"
   ↓
3. Navigation dans les 3 étapes
   + Modification des champs souhaités
   ↓
4. Clic "Mettre à jour"
   ↓
5. Toast de succès : "Link in Bio mis à jour !"
   ↓
6. Modal se ferme
   ↓
7. Page mise à jour dans la liste
```

### Dupliquer une page

```
1. Menu contextuel → "Dupliquer"
   ↓
2. Nouvelle page créée avec :
   + Toutes les données copiées
   + Titre : "[Titre original] (copie)"
   + Slug : "[slug-original]-copy"
   + Vues : 0
   + Statut : Brouillon
   ↓
3. Toast de succès : "Page dupliquée"
   ↓
4. Nouvelle page apparaît dans la liste
```

### Supprimer une page

```
1. Menu contextuel → "Supprimer"
   ↓
2. Page supprimée immédiatement
   ↓
3. Toast de succès : "Page supprimée"
   ↓
4. Page disparaît de la liste
```

---

## ✅ Validation

### Étape 1

**Titre** :
```typescript
if (!formData.title.trim()) {
  newErrors.title = 'Le titre est obligatoire';
}
```

**Slug** :
```typescript
if (!formData.slug.trim()) {
  newErrors.slug = 'Le slug est obligatoire';
} else if (formData.slug.length < 3) {
  newErrors.slug = 'Le slug doit contenir au moins 3 caractères';
} else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
  newErrors.slug = 'Le slug ne peut contenir que des lettres minuscules, chiffres et tirets';
}
```

### Auto-format du slug

```typescript
const slug = value
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')  // Enlève les accents
  .replace(/[^a-z0-9]+/g, '-')       // Remplace non-alphanum par tiret
  .replace(/^-+|-+$/g, '');          // Enlève tirets début/fin
```

---

## 🎨 Thèmes détaillés

### Configuration des thèmes

```typescript
const THEMES = [
  { 
    id: 'gradient-blue', 
    name: 'Océan', 
    class: 'from-blue-500 to-cyan-500', 
    preview: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)' 
  },
  { 
    id: 'gradient-pink', 
    name: 'Sunset', 
    class: 'from-pink-500 to-rose-500', 
    preview: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)' 
  },
  { 
    id: 'gradient-purple', 
    name: 'Galaxy', 
    class: 'from-purple-500 to-pink-500', 
    preview: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)' 
  },
  { 
    id: 'gradient-orange', 
    name: 'Sunrise', 
    class: 'from-orange-500 to-yellow-500', 
    preview: 'linear-gradient(135deg, #f97316 0%, #eab308 100%)' 
  },
  { 
    id: 'solid-dark', 
    name: 'Dark', 
    class: 'from-gray-900 to-gray-900', 
    preview: '#111827' 
  },
  { 
    id: 'solid-light', 
    name: 'Light', 
    class: 'from-white to-white', 
    preview: '#ffffff' 
  },
];
```

---

## 🔗 Configuration réseaux sociaux

```typescript
const SOCIAL_LINKS = [
  { 
    id: 'instagram', 
    label: 'Instagram', 
    icon: Instagram, 
    placeholder: '@username', 
    prefix: 'instagram.com/' 
  },
  { 
    id: 'twitter', 
    label: 'Twitter/X', 
    icon: Twitter, 
    placeholder: '@username', 
    prefix: 'twitter.com/' 
  },
  { 
    id: 'youtube', 
    label: 'YouTube', 
    icon: Youtube, 
    placeholder: '@channel', 
    prefix: 'youtube.com/' 
  },
  { 
    id: 'facebook', 
    label: 'Facebook', 
    icon: Facebook, 
    placeholder: 'username', 
    prefix: 'facebook.com/' 
  },
  { 
    id: 'linkedin', 
    label: 'LinkedIn', 
    icon: Linkedin, 
    placeholder: 'username', 
    prefix: 'linkedin.com/in/' 
  },
  { 
    id: 'website', 
    label: 'Site web', 
    icon: Globe, 
    placeholder: 'https://...', 
    prefix: '' 
  },
  { 
    id: 'email', 
    label: 'Email', 
    icon: Mail, 
    placeholder: 'contact@exemple.com', 
    prefix: 'mailto:' 
  },
  { 
    id: 'phone', 
    label: 'Téléphone', 
    icon: Phone, 
    placeholder: '+33 6 12 34 56 78', 
    prefix: 'tel:' 
  },
];
```

---

## 🎬 Animations

### Modal

```typescript
initial={{ opacity: 0, scale: 0.95, y: isMobile ? 20 : 0 }}
animate={{ opacity: 1, scale: 1, y: 0 }}
exit={{ opacity: 0, scale: 0.95, y: isMobile ? 20 : 0 }}
transition={{ type: "spring", duration: 0.3, bounce: 0.3 }}
```

### Navigation entre étapes

```typescript
<motion.div
  key={`step${currentStep}`}
  initial={{ opacity: 0, x: 20 }}
  animate={{ opacity: 1, x: 0 }}
  exit={{ opacity: 0, x: -20 }}
>
```

### Stepper

```typescript
animate={{
  backgroundColor: step === currentStep ? '#3399ff' : step < currentStep ? '#3399ff' : '#e5e7eb',
  scale: step === currentStep ? 1.1 : 1,
}}
```

---

## 📱 Responsive

### Mobile (< 768px)

```css
Modal: fixed inset-x-4 top-4 bottom-4
Content: max-height calc(100vh - 220px)
Cards: Full width with px-4 padding
Buttons: min-h-[44px] pour touch targets
```

### Desktop (≥ 768px)

```css
Modal: Centré, max-width 672px (2xl)
Content: max-height 60vh
Cards: Grid avec gap-4
Buttons: Taille standard
```

---

## 🎯 Fonctionnalités Premium

### 👑 Pro Features

- **Domaine personnalisé**
  - Permet de lier son propre nom de domaine
  - Ex: `www.monsite.com` au lieu de `openup.to/slug`

### 🌟 Starter Features

- Toutes les fonctionnalités de base incluses
- Unlimited pages Link in Bio
- Tous les thèmes
- Tous les réseaux sociaux

---

## 🔐 États de la page

### Publié

```typescript
isPublished: true
```

- Visible sur internet
- Accessible via `openup.to/slug`
- Badge vert "Publié"
- Peut recevoir des visites
- Compte les vues

### Brouillon

```typescript
isPublished: false
```

- Non visible publiquement
- Accessible uniquement en mode preview
- Badge gris "Brouillon"
- Vues = 0
- Permet de tester avant publication

---

## 📊 Métriques

### Par page

- **Vues** : Nombre total de visites uniques
- **Liens** : Nombre de liens ajoutés à la page
- **Thème** : Indicateur visuel du thème appliqué
- **Statut** : Publié ou Brouillon

---

## 🚀 Intégration

### MainDashboard

```typescript
// États
const [showBioWizard, setShowBioWizard] = useState(false);
const [bioToEdit, setBioToEdit] = useState<any>(null);

// Handlers
const handleCreateBio = () => {
  setShowCreateMenu(false);
  setBioToEdit(null);
  setShowBioWizard(true);
};

const handleEditBio = (bio: any) => {
  setBioToEdit(bio);
  setShowBioWizard(true);
};

// Modal
<CreateBioWizard
  isOpen={showBioWizard}
  onClose={() => {
    setShowBioWizard(false);
    setBioToEdit(null);
  }}
  bioToEdit={bioToEdit}
  subscriptionTier={userData.subscription_tier}
  isMobile={isMobile}
/>
```

---

## 💡 Bonnes pratiques

### Création de page

1. ✅ Choisir un slug court et mémorable
2. ✅ Ajouter une description claire
3. ✅ Utiliser une photo de profil professionnelle
4. ✅ Remplir au moins 2-3 réseaux sociaux
5. ✅ Choisir un thème cohérent avec sa marque
6. ✅ Tester en aperçu avant de publier
7. ✅ Commencer en brouillon puis publier

### Édition de page

1. ✅ Ne pas changer le slug si déjà partagé
2. ✅ Garder une cohérence visuelle
3. ✅ Mettre à jour régulièrement les liens
4. ✅ Vérifier l'aperçu après modifications

---

## 🐛 Gestion des erreurs

### Photo de profil

```typescript
<img 
  src={formData.profileImage} 
  alt="Preview" 
  onError={(e) => {
    (e.target as HTMLImageElement).src = 'data:image/svg+xml,...';
  }}
/>
```

### Validation temps réel

```typescript
if (errors[field]) {
  setErrors(prev => ({ ...prev, [field]: '' }));
}
```

---

## 📈 Prochaines améliorations

### Court terme
- [ ] Drag & drop pour réorganiser les liens
- [ ] Upload de photo de profil (pas seulement URL)
- [ ] Plus de thèmes (10+)
- [ ] Templates pré-configurés (Creator, Business, Artist...)
- [ ] Analytics détaillées par page

### Moyen terme
- [ ] Éditeur visuel WYSIWYG
- [ ] Custom CSS pour Pro
- [ ] Intégrations (Shopify, Gumroad, etc.)
- [ ] A/B testing de pages
- [ ] Programmation de publications

### Long terme
- [ ] Multi-langues
- [ ] SEO avancé (meta tags, OG images)
- [ ] Animations personnalisées
- [ ] Widgets interactifs (formulaires, newsletter)
- [ ] Mode dark/light automatique

---

## 📚 Exemples d'utilisation

### Créateur de contenu

```typescript
{
  title: "MrBeast",
  slug: "mrbeast",
  description: "Making the world better, one video at a time 🌎",
  theme: "gradient-blue",
  instagram: "@mrbeast",
  youtube: "@mrbeast",
  twitter: "@mrbeast",
  buttonStyle: "pill",
  isPublished: true
}
```

### Boutique e-commerce

```typescript
{
  title: "Ma Boutique",
  slug: "shop",
  description: "Collection Printemps 2025 disponible maintenant 🛍️",
  theme: "gradient-pink",
  website: "https://monsite.com",
  instagram: "@maboutique",
  email: "contact@maboutique.com",
  buttonStyle: "rounded",
  customDomain: "shop.monsite.com",
  isPublished: true
}
```

### Artiste/Musicien

```typescript
{
  title: "DJ Nova",
  slug: "djnova",
  description: "Electronic music producer 🎧 Bookings open",
  theme: "gradient-purple",
  instagram: "@djnova",
  twitter: "@djnova",
  youtube: "@djnovamusic",
  website: "https://djnova.music",
  email: "booking@djnova.music",
  buttonStyle: "square",
  isPublished: true
}
```

---

**Version** : 1.0  
**Date** : Janvier 2025  
**Status** : ✅ Production Ready  
**Auteur** : OpenUp Team
