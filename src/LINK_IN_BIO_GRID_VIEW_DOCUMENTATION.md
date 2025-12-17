# 🎨 Documentation Link in Bio - Vue Grille

## Vue d'ensemble

La page **Link in Bio** affiche maintenant toutes vos pages de profil sous forme de **grille de cartes visuelles**, exactement comme l'image de référence. Chaque carte montre un aperçu visuel de la page avec sa photo de profil, son thème, et ses statistiques.

---

## 🎯 Interface

### Structure Générale

```
┌──────────────────────────────────────────────────────────┐
│  Link in Bio                    [+ Créer une page]       │
│  Gérez vos pages de profil et pages de liens            │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐    │
│  │  Card 1 │  │  Card 2 │  │  Card 3 │  │  Card 4 │    │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘    │
│                                                           │
│  ┌─────────┐  ┌─────────┐                               │
│  │  Card 5 │  │   [+]   │  ← Créer nouvelle            │
│  └─────────┘  └─────────┘                               │
└──────────────────────────────────────────────────────────┘
```

---

## 🎨 Carte de Page

### Structure d'une Carte

```
┌──────────────────────────────┐
│ [Publié]           [⋮]       │  ← Header avec badge + menu
│                               │
│      ┌──────────┐            │
│      │  Photo   │            │  ← Cover image + profile
│      │  Profil  │            │
│      └──────────┘            │
│                               │
├──────────────────────────────┤
│  Ma page principale          │  ← Titre
│  openup.to/mikejohnson       │  ← Slug
│  Créateur de contenu...      │  ← Description
│                               │
│  8 liens  👁 1247            │  ← Statistiques
│                               │
│  [Modifier]  [👁]  [↗]       │  ← Actions
└──────────────────────────────┘
```

### Éléments de la Carte

#### 1. Cover / Preview (Height: 192px)

**Avec cover image** :
```tsx
<div className="relative h-48">
  <img src={coverImage} />
  <div className="gradient-overlay opacity-40" />
  
  {/* Profile centered */}
  <div className="absolute inset-0 flex items-center justify-center">
    <img 
      src={profileImage} 
      className="w-20 h-20 rounded-full border-4 border-white"
    />
  </div>
</div>
```

**Sans cover image** :
```tsx
<div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600">
  <div className="absolute inset-0 flex items-center justify-center">
    <img 
      src={profileImage} 
      className="w-20 h-20 rounded-full border-4 border-white"
    />
  </div>
</div>
```

#### 2. Badge de Statut (Top Left)

```tsx
<Badge className={bio.isPublished ? 'bg-green-500' : 'bg-gray-500'}>
  {bio.isPublished ? 'Publié' : 'Brouillon'}
</Badge>
```

**Couleurs** :
- Publié : `bg-green-500` (vert)
- Brouillon : `bg-gray-500` (gris)

#### 3. Menu Actions (Top Right)

**Bouton** :
```tsx
<button className="w-8 h-8 bg-white rounded-lg opacity-0 group-hover:opacity-100">
  <MoreVertical className="w-4 h-4" />
</button>
```

**Items du menu** :
1. ✏️ Modifier
2. 👁 Aperçu
3. ↗ Partager
4. 📋 Dupliquer
5. 🗑️ Supprimer (rouge)

**État hover** :
- Visible uniquement au hover de la carte
- Transition : `opacity-0 group-hover:opacity-100`
- Shadow : `shadow-md`

#### 4. Section Contenu (Padding: 20px)

**Titre** :
```tsx
<h3 className="text-gray-900 dark:text-white line-clamp-1">
  {bio.title}
</h3>
```

**Slug** :
```tsx
<p className="text-sm text-gray-500 line-clamp-1">
  openup.to/{bio.slug}
</p>
```

**Description** :
```tsx
<p className="text-sm text-gray-600 line-clamp-2">
  {bio.description}
</p>
```

#### 5. Statistiques

```tsx
<div className="flex items-center gap-4">
  <span className="text-xs text-gray-500">
    {bio.linksCount} liens
  </span>
  <div className="flex items-center gap-1">
    <Eye className="w-3 h-3 text-gray-400" />
    <span className="text-xs text-gray-500">
      {bio.viewsCount}
    </span>
  </div>
</div>
```

**Métriques affichées** :
- Nombre de liens
- Nombre de vues (avec icône œil)

#### 6. Boutons d'Actions

```
[   Modifier   ]  [👁]  [↗]
```

**Structure** :
```tsx
<div className="flex gap-2">
  <Button variant="outline" className="flex-1 h-10 rounded-xl">
    <Edit className="w-4 h-4 mr-2" />
    Modifier
  </Button>
  
  <button className="w-10 h-10 border rounded-xl">
    <Eye className="w-4 h-4" />
  </button>
  
  <button className="w-10 h-10 border rounded-xl">
    <Share2 className="w-4 h-4" />
  </button>
</div>
```

**Boutons** :
1. **Modifier** (flex-1) : Édite la page
2. **Aperçu** (40x40px) : Ouvre `/u/{slug}` dans nouvel onglet
3. **Partager** (40x40px) : Copie le lien

---

## 🎨 Thèmes de Pages

### Interface BioPage

```typescript
interface BioPage {
  id: string;
  title: string;
  slug: string;
  description?: string;
  profileImage?: string;
  coverImage?: string;
  theme: 'gradient-blue' | 'gradient-pink' | 'gradient-purple' | 'gradient-orange' | 'solid-white' | 'solid-black';
  isPublished: boolean;
  linksCount: number;
  viewsCount: number;
}
```

### Gradients Disponibles

```typescript
const getThemeGradient = (theme: string) => {
  switch (theme) {
    case 'gradient-blue':
      return 'bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600';
    case 'gradient-pink':
      return 'bg-gradient-to-br from-pink-500 via-rose-500 to-orange-500';
    case 'gradient-purple':
      return 'bg-gradient-to-br from-purple-500 via-violet-600 to-indigo-600';
    case 'gradient-orange':
      return 'bg-gradient-to-br from-orange-500 via-red-500 to-pink-500';
    case 'solid-white':
      return 'bg-white';
    case 'solid-black':
      return 'bg-gray-900';
  }
};
```

**Rendu** :
- Si `coverImage` existe : gradient en overlay (opacity: 40%)
- Sinon : gradient comme background complet

---

## 🆕 Carte "Créer une page"

### Design

```
┌─────────────────────────┐
│                         │
│       ┌──────┐         │
│       │  +   │         │  ← Icône + dans carré
│       └──────┘         │
│                         │
│  Créer une nouvelle     │
│        page             │
│                         │
│  Ajoutez une page       │
│    Link in Bio          │
└─────────────────────────┘
```

**Caractéristiques** :
- Border : `border-2 border-dashed`
- Couleur normal : `border-gray-300`
- Couleur hover : `border-[#3399ff]`
- Background hover : `bg-blue-50 dark:bg-blue-950`
- Min height : `min-h-[400px]`

**Icône centrale** :
```tsx
<div className="w-16 h-16 bg-gray-200 rounded-2xl group-hover:bg-[#3399ff] group-hover:scale-110">
  <Plus className="w-8 h-8 text-gray-400 group-hover:text-white" />
</div>
```

**Animations** :
- Hover : Border devient bleue
- Icône : Scale 1.1 + bg bleu + texte blanc
- Transition : `transition-all duration-300`

---

## 📱 Responsive

### Grille Adaptative

```typescript
const gridClasses = isMobile 
  ? 'grid-cols-1' 
  : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
```

**Breakpoints** :
- Mobile (< 768px) : 1 colonne
- Tablet (768px - 1024px) : 2 colonnes
- Desktop (1024px - 1280px) : 3 colonnes
- Large (≥ 1280px) : 4 colonnes

### Espacements

**Mobile** :
- Padding container : `px-4 py-6`
- Gap grille : `gap-6`
- Card height : Auto-adjust

**Desktop** :
- Padding container : `p-8`
- Gap grille : `gap-6`
- Card min-height : `400px`

---

## 🎯 Actions Disponibles

### 1. Modifier (Edit)

```typescript
const handleEdit = (bio: BioPage) => {
  if (onEditBio) {
    onEditBio(bio);
  }
};
```

**Comportement** :
- Appelle `onEditBio(bio)`
- Navigue vers le `BioEditor`
- Passe toutes les données de la page

### 2. Aperçu (Preview)

```typescript
const handlePreview = (bio: BioPage) => {
  window.open(`/u/${bio.slug}`, '_blank');
  toast.success('Aperçu ouvert dans un nouvel onglet');
};
```

**Comportement** :
- Ouvre `/u/{slug}` dans nouvel onglet
- Toast de confirmation

### 3. Partager (Share)

```typescript
const handleShare = (bio: BioPage) => {
  const url = `https://openup.to/${bio.slug}`;
  navigator.clipboard.writeText(url);
  toast.success('Lien copié dans le presse-papier');
};
```

**Comportement** :
- Copie `https://openup.to/{slug}` dans clipboard
- Toast de confirmation

### 4. Dupliquer (Duplicate)

```typescript
const handleDuplicate = (bio: BioPage) => {
  const newBio: BioPage = {
    ...bio,
    id: String(Date.now()),
    title: `${bio.title} (copie)`,
    slug: `${bio.slug}-${Date.now()}`,
    isPublished: false,
  };
  setBioPages([...bioPages, newBio]);
  toast.success('Page dupliquée');
};
```

**Comportement** :
- Clone la page
- Ajoute "(copie)" au titre
- Génère nouveau slug (avec timestamp)
- Défini comme "Brouillon"
- Toast de confirmation

### 5. Supprimer (Delete)

```typescript
const handleDelete = (id: string) => {
  setBioPages(bioPages.filter(bio => bio.id !== id));
  toast.success('Page supprimée');
};
```

**Comportement** :
- Supprime de la liste
- Toast de confirmation
- ⚠️ À améliorer : Ajouter confirmation dialog

### 6. Toggle Publish

```typescript
const handleTogglePublish = (id: string) => {
  setBioPages(
    bioPages.map(bio =>
      bio.id === id ? { ...bio, isPublished: !bio.isPublished } : bio
    )
  );
  toast.success('Statut de publication modifié');
};
```

**Comportement** :
- Inverse `isPublished`
- Change couleur du badge
- Toast de confirmation

---

## 🎨 États Visuels

### Hover de Carte

```css
.group:hover {
  /* Card */
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  transform: translateY(-4px);
  
  /* Menu actions */
  opacity: 1; /* de 0 à 1 */
}
```

**Transitions** :
- Duration : `300ms`
- Easing : `ease-in-out`
- Properties : `all` (shadow, transform, opacity)

### Active State

Pas d'état "actif" car la grille ne sélectionne pas de carte. L'édition se fait via navigation.

---

## 🔄 Empty State

### Condition

```typescript
{bioPages.length === 0 && (
  <EmptyState />
)}
```

### Design

```
┌────────────────────────────────┐
│                                │
│         ┌──────────┐          │
│         │   Icon   │          │  ← Grid icon (opacity 50%)
│         └──────────┘          │
│                                │
│  Aucune page Link in Bio       │
│                                │
│  Créez votre première page...  │
│                                │
│  [+ Créer ma première page]    │
│                                │
└────────────────────────────────┘
```

**Éléments** :
- Container : `flex flex-col items-center py-20`
- Icon : 96x96px, bg-gray-100/800, rounded-3xl
- Titre : h3
- Description : max-w-md, text-center
- Bouton CTA : Bleu #3399ff

---

## 📊 Données Exemple

### Pages de Démonstration

```typescript
const bioPages = [
  {
    id: '1',
    title: 'Ma page principale',
    slug: 'mikejohnson',
    description: 'Créateur de contenu & entrepreneur',
    profileImage: 'https://...',
    coverImage: 'https://...',
    theme: 'gradient-blue',
    isPublished: true,
    linksCount: 8,
    viewsCount: 1247,
  },
  {
    id: '2',
    title: 'Boutique en ligne',
    slug: 'shop',
    description: 'Ma boutique officielle',
    theme: 'gradient-pink',
    isPublished: true,
    linksCount: 5,
    viewsCount: 892,
  },
  {
    id: '3',
    title: 'Portfolio',
    slug: 'portfolio',
    description: 'Mes projets créatifs',
    theme: 'gradient-purple',
    isPublished: false,
    linksCount: 12,
    viewsCount: 456,
  },
  {
    id: '4',
    title: 'Événements',
    slug: 'events',
    description: 'Mes événements et conférences',
    theme: 'gradient-orange',
    isPublished: true,
    linksCount: 3,
    viewsCount: 234,
  },
];
```

---

## 🎯 Intégration

### Dans MainDashboard

```typescript
case 'link-in-bio':
  if (showBioEditor && bioToEdit) {
    return (
      <BioEditor
        bio={bioToEdit}
        onBack={handleBackFromEditor}
        onSave={(data) => {
          console.log('Bio saved:', data);
          handleBackFromEditor();
        }}
        isMobile={isMobile}
      />
    );
  }
  
  return (
    <LinkInBioView 
      onCreateBio={handleCreateBio}
      onEditBio={handleEditBio}
      isMobile={isMobile}
    />
  );
```

### Callbacks

```typescript
const handleCreateBio = () => {
  setShowBioWizard(true);
};

const handleEditBio = (bio: BioPage) => {
  setBioToEdit(bio);
  setShowBioEditor(true);
};

const handleBackFromEditor = () => {
  setShowBioEditor(false);
  setBioToEdit(null);
};
```

---

## 🎨 Design Tokens

### Espacements

```css
/* Container */
--padding-mobile: 1rem 1.5rem; /* px-4 py-6 */
--padding-desktop: 2rem; /* p-8 */

/* Grid */
--grid-gap: 1.5rem; /* gap-6 */

/* Card */
--card-padding: 1.25rem; /* p-5 */
--card-border-radius: 1rem; /* rounded-2xl */
--card-cover-height: 12rem; /* h-48 */

/* Profile photo */
--profile-size: 5rem; /* w-20 h-20 */
--profile-border: 4px solid white;

/* Buttons */
--button-height: 2.5rem; /* h-10 */
--icon-button-size: 2.5rem; /* w-10 h-10 */
```

### Couleurs

```css
/* Cards */
--card-bg: white / gray-800
--card-border: gray-200 / gray-700
--card-shadow-hover: 0 20px 25px -5px rgba(0, 0, 0, 0.1)

/* Badges */
--badge-published: green-500
--badge-draft: gray-500

/* Buttons */
--button-primary: #3399ff
--button-primary-hover: #2680e6
--button-border: gray-300 / gray-600
--button-hover-bg: gray-50 / gray-700

/* Create card */
--create-border: gray-300 / gray-600 (dashed)
--create-border-hover: #3399ff
--create-bg-hover: blue-50 / blue-950
--create-icon-bg: gray-200 / gray-700
--create-icon-bg-hover: #3399ff
```

### Animations

```css
/* Card hover */
transition: all 300ms ease-in-out
transform: translateY(-4px)
box-shadow: xl

/* Menu actions */
opacity: 0 → 1
transition: opacity 200ms

/* Create card icon */
transform: scale(1) → scale(1.1)
background: gray-200 → #3399ff
color: gray-400 → white
```

---

## ✅ Fonctionnalités

### ✅ Implémentées

#### Affichage
- [x] Grille responsive (1/2/3/4 colonnes)
- [x] Cartes avec cover + profile
- [x] 6 thèmes de gradient
- [x] Badge statut (Publié/Brouillon)
- [x] Statistiques (liens, vues)
- [x] Menu actions (hover)
- [x] Carte "Créer une page"
- [x] Empty state
- [x] Dark mode complet

#### Actions
- [x] Modifier (navigue vers BioEditor)
- [x] Aperçu (nouvel onglet)
- [x] Partager (copie lien)
- [x] Dupliquer
- [x] Supprimer
- [x] Toggle publish/draft
- [x] Créer nouvelle page

#### UX
- [x] Hover effects fluides
- [x] Toast notifications
- [x] Line-clamp sur textes
- [x] Menu dropdown
- [x] Transitions CSS

### 🔄 À implémenter

#### Backend
- [ ] Charger pages depuis Supabase
- [ ] Sauvegarder modifications
- [ ] Upload cover images
- [ ] Upload profile images
- [ ] Vraies statistiques (analytics)
- [ ] Soft delete (au lieu de hard delete)

#### UX
- [ ] Confirmation avant suppression
- [ ] Drag & drop pour réorganiser
- [ ] Recherche/filtre de pages
- [ ] Tri (date, nom, vues)
- [ ] Pagination si > 20 pages
- [ ] Bulk actions (sélection multiple)
- [ ] Preview en modal (sans ouvrir onglet)

#### Fonctionnalités
- [ ] Templates de pages
- [ ] Import depuis autres plateformes
- [ ] Archiver au lieu de supprimer
- [ ] Historique de versions
- [ ] Planification de publication
- [ ] Collaboration (partage avec équipe)

---

## 🐛 Debug

### Problèmes courants

#### Les images ne s'affichent pas
- ✅ Vérifier que `profileImage` et `coverImage` sont des URLs valides
- ✅ Ajouter fallback sur image error

#### Le menu dropdown ne s'ouvre pas
- ✅ Vérifier z-index de la card
- ✅ S'assurer que DropdownMenu est bien importé

#### La grille ne s'adapte pas
- ✅ Vérifier les classes `grid-cols-*`
- ✅ Tester avec `isMobile` prop

#### Le hover ne fonctionne pas
- ✅ S'assurer de la classe `group` sur la card
- ✅ Vérifier `group-hover:opacity-100`

---

## 🚀 Prochaines étapes

### Court terme
1. Intégration Supabase (fetch pages)
2. Confirmation dialog avant suppression
3. Upload d'images (cover + profile)
4. Recherche et filtres

### Moyen terme
1. Templates de pages prédéfinis
2. Drag & drop pour réorganiser
3. Preview en modal
4. Statistiques temps réel

### Long terme
1. Historique de versions
2. A/B testing de pages
3. Collaboration multi-utilisateurs
4. Import/Export

---

**Version** : 3.0  
**Date** : Janvier 2025  
**Statut** : ✅ Vue grille complète et fonctionnelle  
**Design** : Fidèle à l'image de référence  
**Responsive** : Mobile + Tablet + Desktop optimisé
