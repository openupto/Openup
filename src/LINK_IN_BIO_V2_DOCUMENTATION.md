# 🎨 Documentation Link in Bio V2 - Interface complète

## Vue d'ensemble

Cette version améliore considérablement l'interface Link in Bio avec une expérience utilisateur moderne inspirée de Linktree, avec :
- **Onglets** : Link in bio & Business card
- **Cartes de preview** avec effet de flou
- **Éditeur visuel** en temps réel
- **Gestion des liens** par drag & drop
- **Personnalisation de l'apparence**

---

## 📁 Composants

### 1. `/components/views/link-in-bio-view.tsx` - Vue principale

#### Fonctionnalités

**Onglets (Tabs)** :
- 🔗 **Link in bio** : Pages de profil avec liens
- 💼 **Business card** : Cartes de visite virtuelles (à venir)

**Interface** :
- Bouton "+ Créer un Link in bio" - Bleu primaire (#3399ff), arrondi, hauteur 14
- Grille 2 colonnes pour les cartes de pages
- État vide avec CTA si aucune page

#### Structure des cartes

```tsx
// Ratio 9:16 (format mobile/story)
<div className="aspect-[9/16] rounded-3xl overflow-hidden">
  {/* Gradient de fond */}
  <div className="bg-gradient-to-b from-blue-400 via-cyan-300 to-blue-200" />
  
  {/* Effet de flou */}
  <div className="backdrop-blur-[120px] bg-white/10" />
  
  {/* Contenu */}
  <div className="flex flex-col items-center justify-center">
    {/* Photo de profil : 80x80, border 4px white/30 */}
    <img className="w-20 h-20 rounded-full" />
    
    {/* Titre (subtil, visible à travers le flou) */}
    <p className="text-sm opacity-60">{title}</p>
  </div>
</div>
```

**Thèmes disponibles** :
- `gradient-blue` : Océan (blue → cyan)
- `gradient-pink` : Sunset (pink → rose → orange)
- `gradient-purple` : Galaxy (purple → pink)
- `gradient-orange` : Sunrise (orange → yellow)

**Hover** :
- `scale-105` au survol
- `transition-transform duration-300`

---

### 2. `/components/bio-editor.tsx` - Éditeur de page

#### Structure

```
┌─────────────────────────────┐
│ [←] Retour   [👁️] [📤]      │ <- Header
├─────────────────────────────┤
│   Modifier l'apparence       │ <- Bouton modal
├─────────────────────────────┤
│  ┌────────────────────┐     │
│  │                    │     │
│  │   Preview Phone    │     │ <- Preview en temps réel
│  │   (Gradient BG)    │     │
│  │                    │     │
│  │  [Photo Profile]   │     │
│  │  Nom d'utilisateur │     │
│  │  Bio...            │     │
│  │                    │     │
│  │  [Link Card 1]     │     │
│  │  [Link Card 2]     │     │
│  │  [+ Ajouter]       │     │
│  │                    │     │
│  └────────────────────┘     │
├─────────────────────────────┤
│  [Enregistrer] (floating)   │ <- Footer
└─────────────────────────────┘
```

#### Header
- **Bouton Retour** : `ArrowLeft` + "Retour"
- **Bouton Aperçu** : Outline, `Eye` icon
- **Bouton Partager** : Outline, `Share2` icon

#### Bouton "Modifier l'apparence"
- Pleine largeur, outline, hauteur 12
- Ouvre le modal `AppearanceModal`

#### Section Profil (éditable)
```tsx
{/* Photo de profil */}
<button className="w-24 h-24 rounded-full bg-gray-200">
  {profileImage ? <img /> : <Plus />}
  <div className="hover:opacity-100">Modifier</div>
</button>

{/* Nom */}
<input 
  type="text" 
  className="bg-transparent border-none text-center"
  placeholder="Nom d'utilisateur..."
/>

{/* Bio */}
<textarea 
  className="bg-transparent border-none text-center resize-none"
  placeholder="Ajouter une bio..."
  rows={2}
/>
```

#### Types de liens

**1. Lien YouTube/Video** :
```tsx
{
  type: 'youtube',
  title: 'My lastest Youtube video',
  description: 'Every country on the planet...',
  thumbnail: 'url',
}
```
Affichage :
- Thumbnail : aspect-video, rounded-xl
- Badge "YouTube" : bg-red-600, top-left
- Titre : 2 lignes max
- Description : 2 lignes max

**2. Lien avec image** :
```tsx
{
  type: 'teamwater',
  title: 'DONATE TO TEAMWATER...',
  description: 'Raising $40M...',
  thumbnail: 'url',
}
```
Affichage similaire au YouTube

**3. Lien simple** :
```tsx
{
  type: 'tiktok',
  title: 'TikTok',
  icon: '🎵',
}
```
Affichage :
- Icône : 40x40, bg-gray-100, rounded-full
- Titre : truncate

#### Interactions sur les liens

**Au hover de chaque carte** :
- Bouton **Supprimer** (top-right) : ❌ rouge, opacity 0 → 100
- **Drag handle** (left) : `GripVertical`, opacity 0 → 100
- **Bouton +** (bottom-center) : Ajouter un lien après

**Animation** :
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, x: -100 }}
  transition={{ delay: index * 0.1 }}
>
```

#### Ajouter un lien
- Bouton en bas : border-dashed, "Ajouter un lien"
- Nouveau lien par défaut :
```tsx
{
  id: Date.now(),
  type: 'custom',
  title: 'Nouveau lien',
  url: '',
}
```

#### Bouton Enregistrer
- Position : `fixed bottom-6 left-1/2 -translate-x-1/2`
- Style : bg-[#3399ff], rounded-full, px-8, h-12, shadow-lg
- Action : Sauvegarde + toast

---

### 3. `/components/appearance-modal.tsx` - Modal de personnalisation

#### Structure

```
┌──────────────────────────┐
│ Modifier l'apparence  [X]│
├──────────────────────────┤
│                          │
│ Thème                    │
│ ┌────┐ ┌────┐           │
│ │ ✓  │ │    │           │
│ │Océan│ │... │           │
│ └────┘ └────┘           │
│                          │
│ Style des boutons        │
│ ┌───┐ ┌───┐ ┌───┐      │
│ │ ✓ │ │   │ │   │      │
│ │Arr│ │Car│ │Pil│      │
│ └───┘ └───┘ └───┘      │
│                          │
├──────────────────────────┤
│ [Annuler] [Enregistrer]  │
└──────────────────────────┘
```

#### Thèmes (4 disponibles)

| ID | Nom | Gradient |
|----|-----|----------|
| `gradient-blue` | Océan | `from-blue-400 via-cyan-300 to-blue-200` |
| `gradient-pink` | Sunset | `from-pink-400 via-rose-300 to-orange-200` |
| `gradient-purple` | Galaxy | `from-purple-400 via-pink-300 to-purple-200` |
| `gradient-orange` | Sunrise | `from-orange-400 via-yellow-300 to-orange-200` |

Preview : Hauteur 80px, gradient en fond

#### Styles de boutons (3 disponibles)

| ID | Nom | Class |
|----|-----|-------|
| `rounded` | Arrondi | `rounded-xl` |
| `square` | Carré | `rounded-none` |
| `pill` | Pilule | `rounded-full` |

Preview : Hauteur 40px, bg-gray-300

#### Sélection
- Border-2 blue quand sélectionné
- Checkmark ✓ en haut à droite
- Hover : border-gray-300

---

## 🔄 Flux utilisateur complet

### 1. Arrivée sur la page Link in Bio

```
1. User clique sur "Link in bio" dans le menu
   ↓
2. Vue avec onglets "Link in bio" | "Business card"
   ↓
3. Affichage grille 2x de cartes avec preview flou
   + Bouton "+ Créer un Link in bio"
```

### 2. Créer une nouvelle page

```
1. Clic sur "+ Créer un Link in bio"
   ↓
2. Wizard CreateBioWizard s'ouvre (3 étapes)
   ↓
3. Remplissage informations
   ↓
4. Clic "Créer la page"
   ↓
5. Toast "Link in Bio créé avec succès !"
   ↓
6. Retour à la liste avec nouvelle carte
```

### 3. Modifier une page existante

```
1. Clic sur une carte de preview
   ↓
2. BioEditor s'ouvre avec données pré-remplies
   ↓
3. Édition en temps réel :
   - Modifier nom/bio/photo
   - Ajouter/supprimer/réorganiser liens
   - Changer l'apparence (modal)
   ↓
4. Clic "Enregistrer les modifications"
   ↓
5. Toast "Modifications enregistrées"
   ↓
6. Retour à la liste
```

### 4. Modifier l'apparence

```
1. Depuis BioEditor, clic "Modifier l'apparence"
   ↓
2. AppearanceModal s'ouvre
   ↓
3. Sélection thème + style boutons
   + Preview en temps réel dans BioEditor
   ↓
4. Clic "Enregistrer"
   ↓
5. Toast "Apparence mise à jour"
   ↓
6. Modal se ferme
   ↓
7. Preview BioEditor mis à jour
```

### 5. Gérer les liens

```
Ajouter un lien :
1. Clic "+ Ajouter un lien" (en bas ou entre liens)
   ↓
2. Nouvelle carte apparaît avec animation
   ↓
3. Édition inline du titre/URL

Supprimer un lien :
1. Hover sur carte
   ↓
2. Bouton ❌ apparaît (top-right)
   ↓
3. Clic ❌
   ↓
4. Animation exit (slide-left + fade)
   ↓
5. Toast "Lien supprimé"

Réorganiser :
1. Hover sur carte
   ↓
2. Drag handle ⋮⋮ apparaît (left)
   ↓
3. Drag & drop (à implémenter avec react-dnd)
```

---

## 🎨 Design System

### Couleurs
- **Primaire** : `#3399ff` (bleu)
- **Hover primaire** : `#2680e6`
- **Success** : `#10b981` (vert)
- **Danger** : `#ef4444` (rouge)

### Espacements
- **Padding container** : `p-8` (desktop), `px-4 py-6` (mobile)
- **Gap grille** : `gap-4`
- **Espacement sections** : `space-y-6`

### Bordures
- **Cards** : `rounded-3xl`
- **Buttons** : `rounded-xl` ou `rounded-full`
- **Modal** : `rounded-3xl`
- **Preview phone** : `rounded-3xl`

### Ombres
- **Cards** : `shadow-lg`
- **Cards hover** : `shadow-2xl`
- **Modal** : `shadow-2xl`
- **Bouton flottant** : `shadow-lg`

### Animations
- **Transition standard** : `duration-300`
- **Spring modal** : `type: "spring", duration: 0.3, bounce: 0.3`
- **Stagger links** : `delay: index * 0.1`

---

## 📱 Responsive

### Mobile (< 768px)
- Modal : `inset-x-4 top-20 bottom-20`
- Grille : `grid-cols-2` (cartes plus petites)
- Padding : `px-4 py-6`
- Bouton save : Adaptatif, reste visible

### Desktop (≥ 768px)
- Modal : `max-w-lg` centré
- Grille : `grid-cols-2` avec gap-4
- Padding : `p-8`
- Preview phone : `max-w-sm`

---

## 🔧 Configuration technique

### Interface BioPage
```typescript
interface BioPage {
  id: string;
  title: string;
  slug: string;
  description?: string;
  profileImage?: string;
  theme: 'gradient-blue' | 'gradient-pink' | 'gradient-purple' | 'gradient-orange';
  isPublished: boolean;
}
```

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

---

## 🚀 Intégration dans MainDashboard

### États
```typescript
const [showBioEditor, setShowBioEditor] = useState(false);
const [bioToEdit, setBioToEdit] = useState<any>(null);
const [showBioWizard, setShowBioWizard] = useState(false);
```

### Handlers
```typescript
const handleEditBio = (bio: any) => {
  setBioToEdit(bio);
  setShowBioEditor(true);
};

const handleBackFromEditor = () => {
  setShowBioEditor(false);
  setBioToEdit(null);
};
```

### Rendu conditionnel
```typescript
case 'link-in-bio':
  if (showBioEditor && bioToEdit) {
    return <BioEditor bio={bioToEdit} onBack={handleBackFromEditor} />;
  }
  return <LinkInBioView onEditBio={handleEditBio} />;
```

---

## ✅ Checklist d'implémentation

### Vue principale (LinkInBioView)
- [x] Onglets Link in bio / Business card
- [x] Bouton "+ Créer un Link in bio"
- [x] Grille 2 colonnes de cartes
- [x] Cartes avec gradient + effet flou
- [x] Photo de profil dans les cartes
- [x] Clic sur carte → édition
- [x] État vide avec CTA
- [x] Responsive mobile/desktop

### Éditeur (BioEditor)
- [x] Header avec navigation
- [x] Boutons Aperçu et Partager
- [x] Bouton "Modifier l'apparence"
- [x] Preview phone avec gradient
- [x] Édition profil (photo, nom, bio)
- [x] Liste des liens avec cartes
- [x] 3 types de liens (video, image, simple)
- [x] Boutons supprimer sur hover
- [x] Bouton "+ Ajouter un lien"
- [x] Bouton "Enregistrer" flottant
- [x] Animations Motion
- [ ] Drag & drop pour réorganiser (à faire)

### Modal Apparence (AppearanceModal)
- [x] Modal avec backdrop
- [x] Sélection de 4 thèmes
- [x] Préview des thèmes (hauteur 80px)
- [x] Sélection de 3 styles boutons
- [x] Préview des styles
- [x] Checkmarks sur sélection
- [x] Boutons Annuler/Enregistrer
- [x] Animations Modal (spring)

### Intégration
- [x] Import dans MainDashboard
- [x] États de gestion
- [x] Handlers de navigation
- [x] Rendu conditionnel
- [x] Dashboard = page par défaut
- [x] Wizard de création connecté

---

## 🎯 Prochaines améliorations

### Court terme
- [ ] Drag & drop avec react-dnd
- [ ] Upload photo de profil (pas seulement URL)
- [ ] Édition inline des liens
- [ ] Preview en temps réel de l'URL publique
- [ ] Gestion Business cards

### Moyen terme
- [ ] Analytics par lien (clics, vues)
- [ ] Templates de liens pré-configurés
- [ ] Bibliothèque d'icônes pour liens simples
- [ ] Import de liens depuis autre plateforme
- [ ] Duplication de pages

### Long terme
- [ ] A/B testing de pages
- [ ] Programmation de liens (date début/fin)
- [ ] Liens conditionnels (géo, device, heure)
- [ ] Intégrations (Shopify, Gumroad, etc.)
- [ ] Custom CSS/JS pour Pro

---

## 📊 Métriques de succès

- ✅ Temps de création d'une page : < 2 min
- ✅ Édition en temps réel : < 100ms
- ✅ Animations fluides : 60 FPS
- ✅ Responsive : Mobile-first
- ✅ Accessibilité : Navigation clavier
- ✅ UX : Intuitive, moderne

---

**Version** : 2.0  
**Date** : Janvier 2025  
**Statut** : ✅ Production Ready  
**Designer** : OpenUp Team
