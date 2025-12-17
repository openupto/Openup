# 📱 Configuration Menu Mobile & Desktop - OpenUp

## ✅ Mise à jour terminée

L'application OpenUp dispose maintenant de deux systèmes de navigation distincts et optimisés pour mobile et desktop.

---

## 📱 MENU MOBILE

### Bottom Navigation (5 icônes)

```
┌─────────────────────────────────────────┐
│   🔗      ⬛      ➕      📊      👥   │
│  Links  Dashboard  FAB  Analytics Team  │
└─────────────────────────────────────────┘
```

#### Configuration actuelle :

| Position | Icône     | Label        | Action              | Active Color |
|----------|-----------|--------------|---------------------|--------------|
| 1        | Link2     | -            | Vue Liens           | #3399ff      |
| 2        | Grid3x3   | -            | Vue Dashboard       | #3399ff      |
| 3        | Plus      | -            | Créer un lien (FAB) | -            |
| 4        | BarChart3 | -            | Vue Analytics       | #3399ff      |
| 5        | Users     | -            | Vue Settings        | #3399ff      |

#### Caractéristiques techniques :

```typescript
// FAB (Floating Action Button) - Bouton central
<div className="w-14 h-14 bg-[#3399ff] rounded-2xl shadow-lg">
  <Plus className="w-7 h-7 text-white" strokeWidth={3} />
</div>

// Icônes normales
<Icon 
  className={`w-6 h-6 ${isActive ? 'text-[#3399ff]' : 'text-gray-600'}`}
  strokeWidth={2}
/>
```

#### Styles :
- **Background** : `bg-white dark:bg-gray-900`
- **Border** : `border-t border-gray-200 dark:border-gray-800`
- **FAB** : 
  - Taille : 56px (w-14 h-14)
  - Couleur : #3399ff
  - Border radius : rounded-2xl (16px)
  - Position : -mb-3 (surélevé)
  - Shadow : shadow-lg
- **Icônes** :
  - Taille : 24px (w-6 h-6)
  - Active : text-[#3399ff]
  - Inactive : text-gray-600 dark:text-gray-400
- **Safe Area** : pb-safe (compatible iPhone)

### Menu Hamburger (Sidebar en overlay)

Accessible via le bouton hamburger en haut à gauche, affiche le **FuturisticSidebar** complet :

- Dashboard
- Links & QR Codes
- Link in Bio
- Statistiques
- **Premium** : Wallet Card, Studio IA, Équipe
- Automatisations
- Paramètres
- Bouton Upgrade
- Profil utilisateur

---

## 🖥️ MENU DESKTOP

### FuturisticSidebar (Sidebar fixe)

```
┌────────────┐
│  [Logo]    │
│  [Starter] │
│            │
│ ┌────────┐ │
│ │ Créer  │ │
│ └────────┘ │
│            │
│ ── Core ── │
│  Dashboard │
│  Links     │
│  Link Bio  │
│  Analytics │
│            │
│ ─Advanced─ │
│  Wallet 🆕 │
│  IA 🆕     │
│  Équipe 🆕 │
│  Automat.  │
│            │
│  Paramètres│
│            │
│ ────────── │
│  Upgrade   │
│  Thème 🌙  │
│  [User]    │
└────────────┘
   320px
```

#### Configuration :

**Largeur** : 
- Expanded : 320px (w-80)
- Collapsed : 80px (w-20)

**Sections** :

1. **Header**
   - Logo OpenUp
   - Badge abonnement (Starter/Pro/Business)
   - Bouton "Créer" bleu

2. **Core Features**
   - Dashboard (Home)
   - Links & QR Codes (Link2)
   - Link in Bio (Sparkles)
   - Statistiques (BarChart3)

3. **Advanced Features** (Premium)
   - Portefeuille Digital (Wallet) 🆕
   - Studio IA (Brain) 🆕
   - Espace Équipe (Users) 🆕
   - Automatisations (Workflow)

4. **Footer**
   - Paramètres (Settings)
   - Bouton "Upgrade" orange
   - Toggle thème
   - Profil utilisateur
   - Déconnexion

#### Styles :

```typescript
// Container
className="w-80 h-full fixed left-0 top-0 
  bg-white/95 dark:bg-gray-900/95 
  backdrop-blur-sm 
  border-r border-slate-200/50 dark:border-gray-700/50 
  shadow-xl z-50"

// Item actif
className="bg-gradient-to-r from-[#3399ff] to-blue-600 
  text-white shadow-lg shadow-blue-500/30"

// Item hover
className="hover:bg-slate-100/80 dark:hover:bg-gray-700/80 
  hover:shadow-md"

// Badge Premium
className="opacity-60" (si tier = free)

// Badge NEW
className="bg-gradient-to-r from-green-400 to-emerald-500 
  text-white text-[10px] px-1 py-0"
```

---

## 🔄 Mapping des IDs de vues

Le FuturisticSidebar utilise des IDs différents. Le mapping est géré automatiquement :

| FuturisticSidebar ID | Vue interne | Composant         |
|----------------------|-------------|-------------------|
| `design`             | `links`     | LinksView         |
| `dashboard`          | `dashboard` | DashboardView     |
| `analytics`          | `analytics` | AnalyticsView     |
| `link-in-bio`        | `link-in-bio` | LinkInBioView   |
| `settings`           | `settings`  | SettingsView      |

```typescript
// main-dashboard.tsx
const mapViewId = (id: string): string => {
  const mapping: Record<string, string> = {
    'design': 'links',
    'links': 'links',
    // ...
  };
  return mapping[id] || id;
};
```

---

## 📐 Dimensions et Espacements

### Mobile
```css
Header height: 57px
Bottom nav height: 72px
Content: calc(100vh - 57px - 72px)
Padding content: px-4 py-4
```

### Desktop
```css
Sidebar width: 320px (w-80)
Sidebar collapsed: 80px (w-20)
Content margin: ml-80
Content padding: p-8
```

---

## 🎨 Couleurs

```css
/* Primary */
--primary: #3399ff;

/* Badges Abonnement */
--starter: #F97316 (orange);
--pro: #3B82F6 (bleu);
--business: #A855F7 (violet);

/* États Bottom Nav */
--active: #3399ff;
--inactive: #6B7280 (gray-600);
--inactive-dark: #9CA3AF (gray-400);

/* FAB */
--fab-bg: #3399ff;
--fab-shadow: 0 10px 15px -3px rgba(51, 153, 255, 0.5);
```

---

## 🚀 Responsive Breakpoints

```typescript
const isMobile = window.innerWidth < 768;

// Mobile : < 768px
// Desktop : >= 768px
```

---

## 📝 Props de AppLayout

```typescript
interface AppLayoutProps {
  children: ReactNode;
  activeView: string;          // ID de la vue active (format FuturisticSidebar)
  onViewChange: (view: string) => void;
  onCreateClick?: () => void;   // Action du bouton FAB/Créer
  onSignOut?: () => void;       // Action de déconnexion
  subscriptionTier?: string;    // 'starter' | 'pro' | 'business'
  isMobile?: boolean;           // Mode mobile/desktop
  userData?: {                  // Données utilisateur
    id: string;
    email: string;
    name: string;
    subscription_tier: string;
    links_count: number;
    created_at: string;
  };
}
```

---

## ✨ Animations et Transitions

### Mobile
```css
/* FAB hover/active */
transition: transform 0.2s ease;
active: transform: scale(0.95);

/* Bottom nav icons */
transition: color 0.3s ease;
```

### Desktop
```css
/* Sidebar collapse */
transition: width 0.3s ease;

/* Item hover */
transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
transform: translateY(-2px);

/* Item active */
animation: pulse-scale 2s ease-in-out infinite;
box-shadow: 0 10px 15px rgba(51, 153, 255, 0.3);
```

---

## 🔒 Fonctionnalités Premium

Items marqués avec badge "PRO" pour utilisateurs free :
- Portefeuille Digital (Wallet Card)
- Studio IA
- Espace Équipe
- Automatisations

Items marqués "NEW" :
- Wallet Card
- Studio IA
- Espace Équipe

---

## ✅ Checklist de vérification

- [x] Menu mobile 5 icônes conforme à l'image
- [x] FAB central bleu avec rounded-2xl
- [x] FuturisticSidebar complet sur desktop
- [x] Menu hamburger ouvre sidebar sur mobile
- [x] Mapping automatique des IDs
- [x] Safe area pour iPhone
- [x] Dark mode fonctionnel
- [x] Transitions fluides
- [x] Badges abonnement
- [x] Items premium marqués
- [x] Bouton Upgrade présent

---

**Version** : 2.1  
**Date** : Janvier 2025  
**Status** : ✅ Opérationnel
