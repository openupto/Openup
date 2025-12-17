# 🎨 Guide visuel - Menu de création OpenUp

## Vue d'ensemble

Le menu de création est l'interface centrale pour créer du contenu dans OpenUp. Il est accessible via le bouton FAB "+" sur mobile et le bouton "Créer" sur desktop.

---

## 📱 Mobile (Portrait)

### État fermé
```
┌─────────────────────────┐
│ ☰  [Logo] [Starter] 🌙 │ ← Header
├─────────────────────────┤
│                         │
│                         │
│    Contenu de l'app     │
│                         │
│                         │
├─────────────────────────┤
│  🔗  ⬛  [+]  📊  👥   │ ← FAB + au centre
└─────────────────────────┘
```

### État ouvert (menu affiché)
```
┌─────────────────────────┐
│ ☰  [Logo] [Starter] 🌙 │
├─────────────────────────┤
│░░░░░░░░░░░░░░░░░░░░░░░░░│ ← Backdrop blur
│░░┌─────────────────┐░░░│
│░░│ [+] Créer... [X]│░░░│
│░░│ Choisissez ce   │░░░│
│░░│ que vous voulez │░░░│
│░░│ créer.          │░░░│
│░░│                 │░░░│
│░░│ ┌─────────────┐ │░░░│
│░░│ │🔗 Nouveau   │ │░░░│
│░░│ │   lien      │ │░░░│
│░░│ └─────────────┘ │░░░│
│░░│ ┌─────────────┐ │░░░│
│░░│ │📱 Nouveau   │ │░░░│
│░░│ │   QR Code   │ │░░░│
│░░│ └─────────────┘ │░░░│
│░░│ ┌─────────────┐ │░░░│
│░░│ │⬛ Nouveau   │ │░░░│
│░░│ │   Link bio  │ │░░░│
│░░│ └─────────────┘ │░░░│
│░░└─────────────────┘░░░│
├─────────────────────────┤
│  🔗  ⬛  [+]  📊  👥   │
└─────────────────────────┘
```

**Détails :**
- Menu positionné à `bottom: 80px` (au-dessus du nav)
- Marges latérales : 16px
- Backdrop : noir 50% avec blur
- Animation : slide-up + scale

---

## 🖥️ Desktop

### État fermé
```
┌────────────┬──────────────────────┐
│ [Logo]     │                      │
│ [Starter]  │                      │
│            │                      │
│ ┌────────┐ │                      │
│ │ Créer  │ │    Contenu de        │
│ └────────┘ │    l'application     │
│            │                      │
│ Dashboard  │                      │
│ Liens      │                      │
│ Analytics  │                      │
│            │                      │
└────────────┴──────────────────────┘
```

### État ouvert (menu affiché)
```
┌────────────┬──────────────────────┐
│ [Logo]     │░░░░░░░░░░░░░░░░░░░░░░│
│ [Starter]  │░░░░░░░░░░░░░░░░░░░░░░│
│            │░░░┌──────────────┐░░░│
│ ┌────────┐ │░░░│[+] Créer...[X]░░░│
│ │ Créer  │ │░░░│Choisissez ce │░░░│
│ └────────┘ │░░░│que vous      │░░░│
│            │░░░│voulez créer. │░░░│
│ Dashboard  │░░░│              │░░░│
│ Liens      │░░░│┌────────────┐│░░░│
│ Analytics  │░░░││🔗 Nouveau  ││░░░│
│            │░░░││   lien     ││░░░│
│            │░░░│└────────────┘│░░░│
│            │░░░│┌────────────┐│░░░│
│            │░░░││📱 Nouveau  ││░░░│
│            │░░░││   QR Code  ││░░░│
│            │░░░│└────────────┘│░░░│
│            │░░░│┌────────────┐│░░░│
│            │░░░││⬛ Nouveau  ││░░░│
│            │░░░││   Link bio ││░░░│
│            │░░░│└────────────┘│░░░│
│            │░░░└──────────────┘░░░│
│            │░░░░░░░░░░░░░░░░░░░░░░│
└────────────┴──────────────────────┘
```

**Détails :**
- Menu centré (50%, 50%)
- Max-width : 448px
- Backdrop : noir 50% avec blur
- Animation : scale uniquement

---

## 🎬 Séquence d'animation

### 1. Backdrop (0ms)
```
Opacité : 0% → 100%
Duration : 200ms
```

### 2. Menu container (50ms)
```
Scale : 0.95 → 1.0
Opacité : 0% → 100%
Y-position (mobile) : +20px → 0
Duration : 300ms (spring)
Bounce : 0.3
```

### 3. Items (100ms, 150ms, 200ms)
```
Item 1 (lien):    delay 0ms
Item 2 (QR):      delay 50ms
Item 3 (bio):     delay 100ms

Pour chaque :
  X-position : -20px → 0
  Opacité : 0% → 100%
  Duration : 200ms
```

### Timeline totale
```
0ms    ──── Backdrop fade in
50ms   ──── Menu scale up (spring)
100ms  ──── Item 1 slide in
150ms  ──── Item 2 slide in
200ms  ──── Item 3 slide in
350ms  ──── Animation terminée ✓
```

---

## 🎨 États des boutons

### État normal
```
┌──────────────────────┐
│ [🔗] Un nouveau lien │
└──────────────────────┘
Border : gray-200 (2px)
Background : transparent
Icon bg : gray-100
```

### État hover
```
┌──────────────────────┐
│ [🔗] Un nouveau lien │
└──────────────────────┘
      ↓ hover
┌──────────────────────┐
│ [🔗] Un nouveau lien │ ← Border bleue
└──────────────────────┘
Border : #3399ff (2px)
Background : #3399ff/5 (5% opacity)
Icon bg : #3399ff
Icon color : white
```

### État active/pressed
```
┌──────────────────────┐
│ [🔗] Un nouveau lien │
└──────────────────────┘
Transform : scale(0.98)
Transition : 150ms
```

---

## 🌈 Couleurs par thème

### Light mode
```css
Menu background: #FFFFFF
Text primary:    #111827 (gray-900)
Text secondary:  #6B7280 (gray-500)
Border:          #E5E7EB (gray-200)
Icon bg:         #F3F4F6 (gray-100)
Backdrop:        rgba(0, 0, 0, 0.5)
```

### Dark mode
```css
Menu background: #1F2937 (gray-900)
Text primary:    #F9FAFB (gray-50)
Text secondary:  #9CA3AF (gray-400)
Border:          #374151 (gray-700)
Icon bg:         #1F2937 (gray-800)
Backdrop:        rgba(0, 0, 0, 0.5)
```

### Accent (commun)
```css
Primary blue:    #3399ff
Primary hover:   #2680e6
Primary light:   rgba(51, 153, 255, 0.05)
```

---

## 📐 Dimensions exactes

### Mobile
```css
Menu container:
  Width:         calc(100vw - 32px)
  Border-radius: 24px (rounded-3xl)
  Padding:       24px (p-6)
  Bottom:        80px
  Left/Right:    16px

Header:
  Icon size:     40x40px
  Icon padding:  10px
  Title size:    18px (default h2)

Options:
  Height:        auto (min 60px)
  Padding:       16px
  Border-radius: 16px (rounded-2xl)
  Gap:           8px (space-y-2)
  Icon size:     40x40px
  Icon inner:    20x20px
```

### Desktop
```css
Menu container:
  Width:         100%
  Max-width:     448px (28rem)
  Border-radius: 24px (rounded-3xl)
  Padding:       24px (p-6)

(Autres dimensions identiques)
```

---

## 🔍 Détails techniques

### Z-index layers
```
App content:         z-0
Bottom nav:          z-40
Sidebar:             z-50
Create menu backdrop: z-60
Create menu:         z-61
Modals:              z-70 (futur)
```

### Touch targets
```
Mobile FAB:          56x56px (w-14 h-14)
Menu close (X):      32x32px (w-8 h-8)
Menu options:        min 60px height
Icon containers:     40x40px (w-10 h-10)

✅ Tous supérieurs à 44x44px (recommandation Apple)
```

### Performance
```
Animation frames:    60fps target
Hardware accelerated: transform, opacity
CSS containment:     layout, paint
Will-change:         transform, opacity (durant animation)
Backdrop-filter:     GPU accelerated
```

---

## 🎯 Points d'attention UX

### Feedback visuel
- ✅ Hover : Border + background change
- ✅ Active : Scale down légèrement
- ✅ Focus : Ring visible (accessibilité)
- ✅ Disabled : Opacity 50% (si nécessaire)

### Transitions fluides
- ✅ Entrée : Spring naturelle
- ✅ Sortie : Scale down rapide
- ✅ Hover : 300ms cubic-bezier
- ✅ Click : 150ms ease-out

### Accessibilité
- ⚠️ À ajouter : aria-label sur boutons
- ⚠️ À ajouter : role="dialog"
- ⚠️ À ajouter : aria-modal="true"
- ⚠️ À ajouter : Focus trap
- ⚠️ À ajouter : ESC key handler

---

## 📱 Safe areas (iPhone X+)

### Portrait
```
Top:    env(safe-area-inset-top)     = ~44px
Bottom: env(safe-area-inset-bottom)  = ~34px

Menu position: 
  bottom: 80px + 34px = 114px (avec safe area)
```

### Paysage
```
Left:   env(safe-area-inset-left)    = ~44px
Right:  env(safe-area-inset-right)   = ~44px

Menu margins:
  left/right: 16px + 44px = 60px
```

---

**Version** : 1.0  
**Date** : Janvier 2025  
**Conforme** : iOS Human Interface Guidelines  
**Conforme** : Material Design 3
