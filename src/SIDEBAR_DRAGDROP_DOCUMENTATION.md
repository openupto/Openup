# 📱 Documentation Menu Latéral Simple + Drag & Drop Link in Bio

## Vue d'ensemble

Le menu latéral a été simplifié pour être plus épuré et responsive. L'éditeur Link in Bio dispose maintenant d'un système complet de **drag & drop** pour réorganiser les liens facilement.

---

## 🎨 Menu Latéral Simplifié

### Structure Desktop

```
┌──────────────────────┐
│  [Logo] OpenUp   [<] │  ← Collapse button
├──────────────────────┤
│  🏠  Accueil         │
│  🔗  Liens           │
│  ✨  Link in Bio     │
│  📊  Analytics       │
│  ⚙️  Paramètres      │
├──────────────────────┤
│  👑  Starter         │  ← Badge abonnement
│  🚪  Déconnexion     │
└──────────────────────┘
```

### États

#### Étendu (width: 256px)
- Logo + texte "OpenUp"
- Icône + label pour chaque menu
- Badge abonnement visible
- Bouton collapse visible

#### Collapsed (width: 80px)
- Logo seul
- Icônes seulement (6x6)
- Badge masqué
- Bouton expand visible

### Propriétés

```typescript
interface FuturisticSidebarProps {
  userData: UserData | null;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onSignOut: () => void;
  onCreateLink: () => void;
  isMobileOpen?: boolean;
  onMobileToggle?: () => void;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}
```

### Menu Items

| ID | Label | Icône | Route |
|----|-------|-------|-------|
| dashboard | Accueil | Home | / |
| design | Liens | Link2 | /links |
| link-in-bio | Link in Bio | Sparkles | /link-in-bio |
| analytics | Analytics | BarChart3 | /analytics |
| settings | Paramètres | Settings | /settings |

### Couleurs

```css
/* Item actif */
background: #3399ff
color: white

/* Item inactif */
color: gray-700/300
hover: gray-100/800

/* Badge abonnement */
Starter: orange-500
Pro: blue-500
Business: purple-500
```

---

## 📱 Menu Mobile

### Bottom Navigation

```
[Liens]  [Link in Bio]  [+]  [Analytics]  [Settings]
  🔗         ✨          🔵      📊           👤
```

**Changement important** :
- ❌ Avant : Dashboard en 2ème position
- ✅ Après : Link in Bio en 2ème position

### Boutons (ordre de gauche à droite)

1. **Liens** (Link2)
   - Route : 'design'
   - Actif si : activeView === 'design' || 'links'

2. **Link in Bio** (Sparkles) 
   - Route : 'link-in-bio'
   - Actif si : activeView === 'link-in-bio'

3. **FAB Create** (Plus)
   - Bouton bleu central surélevé (w-14 h-14)
   - Rounded-2xl avec shadow
   - Action : ouvre CreateMenu

4. **Analytics** (BarChart3)
   - Route : 'analytics'
   - Actif si : activeView === 'analytics'

5. **Paramètres** (Users)
   - Route : 'settings'
   - Actif si : activeView === 'settings'

---

## 🎯 Drag & Drop - Link in Bio Editor

### Aperçu

L'éditeur permet de **réorganiser les liens par glisser-déposer** exactement comme dans l'image fournie.

### Bibliothèque

**@dnd-kit** :
- `@dnd-kit/core` : DndContext, sensors
- `@dnd-kit/sortable` : SortableContext, useSortable
- `@dnd-kit/utilities` : CSS utilities

### Structure de l'éditeur

```tsx
<BioEditor>
  ├── Header (Retour, Modifier l'apparence, Œil, Partager)
  ├── Zone de preview (background gris)
  │   ├── Photo de profil
  │   ├── Nom d'utilisateur (input)
  │   ├── Bio (textarea)
  │   ├── Liste des liens (DndContext)
  │   │   └── SortableContext
  │   │       └── SortableLinkItem (x N)
  │   └── Bouton "+ Ajouter un lien"
  └── Bouton "Enregistrer"
</BioEditor>
```

### Composant SortableLinkItem

```tsx
interface SortableLinkItemProps {
  link: BioLink;
  onDelete: (id: string) => void;
}
```

**Design** :
```
┌─────────────────────────────────────────┐
│  [+]  Titre du lien            [🗑️]    │
│       Description...            [IMG]   │
└─────────────────────────────────────────┘
```

**Éléments** :

1. **Drag Handle** (gauche)
   - Icône : `Plus` (comme un grip)
   - Taille : 40x40px
   - Background : gray-100/700
   - Rounded-full
   - Cursor : grab / grabbing
   - Props : `{...attributes} {...listeners}`

2. **Contenu** (centre)
   - **Avec thumbnail** :
     - Titre + description (text-sm/xs)
     - Image 80x56px à droite
   - **Sans thumbnail** :
     - Icône emoji (si présent)
     - Titre seul

3. **Delete Button** (droite)
   - Icône : `Trash2`
   - Taille : 40x40px
   - Background : red-50/950
   - Rounded-full
   - Hover : red-100/900

### États visuels

```css
/* En cours de drag */
opacity: 0.5
cursor: grabbing

/* Normal */
opacity: 1
cursor: grab

/* Hover */
background: légèrement plus clair
```

### Sensors

```typescript
const sensors = useSensors(
  useSensor(PointerSensor, {
    activationConstraint: {
      distance: 8, // Déplace de 8px avant d'activer
    },
  }),
  useSensor(KeyboardSensor, {
    coordinateGetter: sortableKeyboardCoordinates,
  })
);
```

**Pourquoi `distance: 8` ?**
- Évite les drags accidentels
- Permet les clics sur les boutons sans déclencher le drag
- Meilleure UX mobile

### Gestion du drag

```typescript
const handleDragEnd = (event: DragEndEvent) => {
  const { active, over } = event;

  if (over && active.id !== over.id) {
    setLinks((items) => {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      return arrayMove(items, oldIndex, newIndex);
    });
    toast.success('Ordre des liens modifié');
  }
};
```

**Flux** :
1. User commence à drag (distance > 8px)
2. Item devient semi-transparent (opacity: 0.5)
3. User déplace au-dessus d'un autre item
4. User relâche
5. `handleDragEnd` est appelé
6. `arrayMove` réorganise le tableau
7. Toast de confirmation

---

## 🎨 Zone de Preview/Édition

### Container

```tsx
<div className="bg-gray-100 dark:bg-gray-800 rounded-3xl p-6">
  {/* Contenu */}
</div>
```

**Caractéristiques** :
- Background gris clair (comme l'image)
- Max-width : max-w-md
- Centré : mx-auto
- Padding : p-6
- Coins très arrondis : rounded-3xl

### Photo de profil

```
┌─────────────────┐
│   ┌─────────┐   │
│   │         │   │  ← Photo 96x96px
│   │    +    │   │    ou image uploadée
│   │         │   │
│   └────[📷]─┘   │  ← Bouton caméra (bottom-right)
│                 │
│  Nom utilisateur│  ← Input centré
│  Ajouter bio... │  ← Textarea centrée
└─────────────────┘
```

**Bouton caméra** :
- Position : absolute bottom-0 right-0
- Taille : 32x32px
- Background : #3399ff
- Icône : Camera (white)
- Rounded-full
- Shadow-lg

### Inputs

**Username** :
```tsx
<Input
  value={username}
  className="text-center bg-white border-0 h-auto py-2"
  placeholder="Nom d'utilisateur..."
/>
```

**Bio** :
```tsx
<Textarea
  value={bioText}
  className="text-center text-sm bg-white border-0 resize-none"
  placeholder="Ajouter une bio..."
  rows={2}
/>
```

---

## 📋 Types de liens

### Interface BioLink

```typescript
interface BioLink {
  id: string;
  type: 'youtube' | 'teamwater' | 'tiktok' | 'custom';
  title: string;
  description?: string;
  url: string;
  thumbnail?: string;
  icon?: string;
}
```

### Exemples

#### Lien avec thumbnail (YouTube, TeamWater)

```typescript
{
  id: '1',
  type: 'youtube',
  title: '🎬 My lastest Youtube video',
  description: 'Every country on the planet competes...',
  url: 'https://youtube.com/...',
  thumbnail: 'https://images.unsplash.com/...',
}
```

**Rendu** :
```
┌─────────────────────────────────────────┐
│ [+]  🎬 My lastest Youtube video  [🗑️] │
│      Every country on the planet...     │
│                              [IMAGE]    │
└─────────────────────────────────────────┘
```

#### Lien simple (TikTok)

```typescript
{
  id: '3',
  type: 'tiktok',
  title: 'TikTok',
  url: 'https://tiktok.com/@...',
  icon: '🎵',
}
```

**Rendu** :
```
┌─────────────────────────────────────┐
│  [+]  🎵 TikTok             [🗑️]   │
└─────────────────────────────────────┘
```

---

## 🔘 Actions

### Boutons du header

#### 1. Retour (ArrowLeft)
```tsx
<Button variant="ghost" onClick={onBack}>
  <ArrowLeft />
</Button>
```

#### 2. Modifier l'apparence
```tsx
<Button
  onClick={() => setShowAppearanceModal(true)}
  variant="outline"
  className="h-12 px-6 rounded-xl"
>
  Modifier l'apparence
</Button>
```
- Ouvre le modal de thèmes et styles
- Permet de changer : couleur, style boutons, fonts

#### 3. Prévisualiser (Eye)
```tsx
<button onClick={() => window.open(`/u/${bio.slug}`, '_blank')}>
  <Eye />
</button>
```
- Ouvre la page publique dans un nouvel onglet
- URL : `/u/{slug}`

#### 4. Partager (Share2)
```tsx
<button onClick={handleShare}>
  <Share2 />
</button>
```
- Copie `https://openup.to/{slug}` dans le presse-papier
- Toast : "Lien copié dans le presse-papier"

### Boutons des liens

#### Drag Handle
- **Ne déclenche PAS** de navigation
- Permet uniquement le drag
- Feedback visuel : cursor grab/grabbing

#### Delete Button
```tsx
<button onClick={() => onDelete(link.id)}>
  <Trash2 />
</button>
```
- Supprime le lien du tableau
- Toast : "Lien supprimé"
- Pas de confirmation (à améliorer pour prod)

### Ajouter un lien

```tsx
<Button
  onClick={handleAddLink}
  variant="outline"
  className="w-full h-14 border-2 border-dashed rounded-2xl"
>
  <Plus /> Ajouter un lien
</Button>
```

**Action** :
```typescript
const handleAddLink = () => {
  const newLink: BioLink = {
    id: String(Date.now()),
    type: 'custom',
    title: 'Nouveau lien',
    url: '',
  };
  setLinks([...links, newLink]);
  toast.success('Nouveau lien ajouté');
};
```

---

## 🎯 Responsive

### Mobile (< 768px)

**Sidebar** :
- Overlay qui slide depuis la gauche
- Fermée par défaut
- Ouverte via bouton hamburger

**BioEditor** :
- Padding : px-4 py-6
- Preview zone : Full width - 2rem
- Touch-friendly drag (distance: 8px)

### Desktop (≥ 768px)

**Sidebar** :
- Fixed à gauche
- 2 états : collapsed (80px) / expanded (256px)
- Transition smooth (300ms)

**BioEditor** :
- Padding : p-8
- Preview zone : max-w-md centré
- Drag précis avec souris

---

## 🔧 Intégration

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

### Dans AppLayout

```typescript
const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

<FuturisticSidebar
  collapsed={sidebarCollapsed}
  onCollapsedChange={setSidebarCollapsed}
  // ... autres props
/>

<main className={`transition-all ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
  {children}
</main>
```

---

## 📊 Performance

### Optimisations

1. **Distance d'activation** (8px)
   - Réduit les drags accidentels
   - Améliore les performances (moins de re-renders)

2. **useCallback pour handleDragEnd**
   - Évite les re-créations de fonction
   - Stabilise les références

3. **Transform CSS**
   - GPU-accelerated
   - Smooth 60fps

4. **Transition sidebar**
   - Duration: 300ms
   - Easing: ease-in-out
   - Property: margin-left, width

---

## 🎨 Design Tokens

### Espacements

```css
/* Sidebar */
--sidebar-width-expanded: 16rem (256px)
--sidebar-width-collapsed: 5rem (80px)
--sidebar-padding: 0.75rem (12px)

/* BioEditor */
--preview-max-width: 28rem (448px)
--preview-padding: 1.5rem (24px)
--link-spacing: 0.75rem (12px)

/* Drag handles */
--handle-size: 2.5rem (40px)
--handle-icon-size: 1.25rem (20px)
```

### Couleurs

```css
/* Liens */
--link-bg: white / gray-800
--link-border: gray-200 / gray-700
--link-hover: gray-50 / gray-700

/* Drag handle */
--handle-bg: gray-100 / gray-700
--handle-hover: gray-200 / gray-600

/* Delete button */
--delete-bg: red-50 / red-950
--delete-hover: red-100 / red-900
--delete-icon: red-600 / red-400

/* Preview zone */
--preview-bg: gray-100 / gray-800
```

---

## ✅ Fonctionnalités

### ✅ Implémentées

#### Sidebar
- [x] Version desktop (expanded/collapsed)
- [x] Version mobile (overlay)
- [x] 5 items de menu
- [x] Badge abonnement
- [x] Bouton déconnexion
- [x] État actif/inactif
- [x] Transitions fluides
- [x] Dark mode

#### Menu Mobile
- [x] 5 boutons (Liens, Link in Bio, +, Analytics, Settings)
- [x] FAB central surélevé
- [x] États actifs/inactifs
- [x] Safe area (notch)

#### Drag & Drop
- [x] Réorganisation par drag
- [x] Drag handles visuels
- [x] Distance d'activation (8px)
- [x] Feedback visuel (opacity)
- [x] Toast confirmation
- [x] Keyboard support
- [x] Touch support mobile

#### BioEditor
- [x] Header avec 4 boutons
- [x] Photo de profil éditable
- [x] Input username
- [x] Textarea bio
- [x] Liste de liens draggable
- [x] Suppression de liens
- [x] Ajout de liens
- [x] Bouton sauvegarder
- [x] Modal apparence
- [x] Preview externe
- [x] Partage lien

### 🔄 À implémenter

#### Backend
- [ ] Upload photo de profil
- [ ] Sauvegarde en base de données
- [ ] Validation des URLs
- [ ] Upload d'images pour liens

#### UX
- [ ] Confirmation avant suppression
- [ ] Édition inline des liens
- [ ] Preview en temps réel (split screen)
- [ ] Undo/Redo
- [ ] Raccourcis clavier
- [ ] Bulk actions (sélection multiple)

#### Fonctionnalités
- [ ] Import de liens depuis d'autres plateformes
- [ ] Templates de liens prédéfinis
- [ ] Analytics par lien (clics)
- [ ] Programmation (liens temporaires)
- [ ] A/B testing de liens

---

## 🐛 Debug

### Logs utiles

```typescript
// Dans handleDragEnd
console.log('Drag ended:', {
  activeId: active.id,
  overId: over?.id,
  oldIndex,
  newIndex,
});

// Dans render
console.log('Current links order:', links.map(l => l.title));
```

### Problèmes courants

#### Le drag ne fonctionne pas
- ✅ Vérifier que `id` est unique
- ✅ Vérifier `distance: 8` dans sensors
- ✅ Vérifier `{...attributes} {...listeners}` sur le handle

#### Le click déclenche un drag
- ✅ Augmenter `activationConstraint.distance`
- ✅ Séparer le handle du bouton delete

#### Performance lente
- ✅ Utiliser `useCallback` pour handlers
- ✅ Éviter les re-renders inutiles
- ✅ Optimiser les images (lazy loading)

---

## 🚀 Prochaines étapes

### Court terme
1. Intégration Supabase pour persistence
2. Upload de photos (Supabase Storage)
3. Validation des formulaires
4. Confirmation avant suppression

### Moyen terme
1. Édition inline des liens (modal)
2. Preview en temps réel (split)
3. Templates de liens prédéfinis
4. Import depuis autres plateformes

### Long terme
1. Analytics par lien
2. A/B testing
3. Liens programmés
4. Collaborateurs multiples

---

**Version** : 2.0  
**Date** : Janvier 2025  
**Statut** : ✅ Drag & Drop fonctionnel  
**Library** : @dnd-kit (modern, performant)  
**Responsive** : Mobile + Desktop optimisé
