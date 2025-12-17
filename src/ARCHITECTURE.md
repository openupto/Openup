# Architecture OpenUp

## Vue d'ensemble

OpenUp est une application SaaS de type Linktree construite avec React, TypeScript et Tailwind CSS. L'architecture a été complètement remaniée pour être propre, sans doublons, et entièrement responsive.

## Structure du projet

```
/components
  /layout                  # Composants de mise en page
    - app-layout.tsx      # Layout principal responsive (mobile + desktop)
  
  /views                   # Vues principales de l'application
    - dashboard-view.tsx  # Page d'accueil / tableau de bord
    - links-view.tsx      # Gestion des liens
    - analytics-view.tsx  # Analytics et statistiques
    - settings-view.tsx   # Paramètres utilisateur
    - link-in-bio-view.tsx # Gestion des Link in Bio
  
  /public                  # Composants publics
    - public-profile.tsx  # Page publique de profil utilisateur
  
  /ui                      # Composants UI réutilisables (Shadcn)
  /figma                   # Composants protégés Figma
  
  - main-dashboard.tsx    # Dashboard principal orchestrant les vues
  - auth-context.tsx      # Contexte d'authentification
  - theme-context.tsx     # Contexte de thème (dark/light)
  - theme-toggle.tsx      # Toggle pour changer de thème
```

## Principes de conception

### 1. Mobile-First & Responsive
- Un seul composant par fonctionnalité (pas de version mobile/desktop séparée)
- Utilisation de la prop `isMobile` pour adapter l'affichage
- Classes Tailwind responsive (`md:`, `lg:`, etc.)
- Layout adaptatif : sidebar desktop → bottom nav mobile

### 2. Composants unifiés
- `AppLayout` : gère automatiquement le layout mobile ou desktop
- Views : s'adaptent via la prop `isMobile`
- Pas de duplication de code

### 3. Architecture modulaire
```
App.tsx
  └─ ThemeProvider
      └─ AuthProvider
          └─ AppContent
              ├─ MainDashboard (authentifié)
              │   └─ AppLayout
              │       └─ Views (dashboard, links, analytics, etc.)
              │
              └─ PublicProfile (page publique /u/username)
```

### 4. Gestion d'état
- `useState` pour l'état local des composants
- Context API pour l'authentification et le thème
- Props drilling minimal grâce à la structure simplifiée

## Composants principaux

### AppLayout
**Responsabilités :**
- Header responsive avec menu hamburger (mobile)
- Navigation bottom bar 5 icônes (mobile) : Links, Dashboard, FAB+, Analytics, Settings
- Sidebar FuturisticSidebar avec toutes les fonctionnalités (desktop)
- Gestion du thème et du badge d'abonnement
- Layout container pour les vues

**Props :**
- `activeView`: vue active (mappé pour compatibilité FuturisticSidebar)
- `onViewChange`: callback de changement de vue
- `onCreateClick`: callback du bouton création
- `onSignOut`: callback de déconnexion
- `subscriptionTier`: tier d'abonnement (starter/pro/business)
- `isMobile`: boolean pour mode mobile
- `userData`: données utilisateur pour FuturisticSidebar

### Views
Toutes les vues suivent le même pattern :

**Props communes :**
- `isMobile`: adaptation mobile/desktop
- `onCreateX`: callbacks pour les actions de création
- `onNavigate`: navigation vers d'autres vues

**Views disponibles :**
1. **DashboardView** : Accueil avec stats rapides et actions
2. **LinksView** : Liste et gestion des liens raccourcis
3. **AnalyticsView** : Statistiques et analytics
4. **SettingsView** : Paramètres utilisateur
5. **LinkInBioView** : Gestion des pages Link in Bio

### MainDashboard
Orchestrateur principal qui :
- Détecte si on est en mode mobile ou desktop
- Gère la navigation entre les vues
- Passe les props appropriées aux composants
- Coordonne les actions (création de liens, etc.)

### PublicProfile
Page publique accessible via `/u/username` :
- Design adaptatif selon le thème choisi
- Affichage des liens avec thumbnails
- Support des réseaux sociaux
- Totalement responsive

## Responsive Design

### Breakpoints
```css
Mobile : < 768px
Desktop : >= 768px
```

### Adaptations Mobile
- **Header** : Menu hamburger + logo + badge abonnement + theme toggle
- **Navigation** : Bottom bar avec 5 icônes (Links, Dashboard, FAB+, Analytics, Settings)
- **Menu Sidebar** : FuturisticSidebar en overlay (accessible via hamburger)
- **Content** : Full width, padding réduit (px-4 py-4)
- **Grids** : 1-2 colonnes max
- **Cards** : Stack vertical

### Adaptations Desktop
- **Sidebar** : FuturisticSidebar fixe (320px / w-80) avec toutes les fonctionnalités
  - Dashboard, Links & QR Codes, Link in Bio, Analytics
  - Wallet Card (premium), Studio IA (premium), Espace Équipe (premium)
  - Automatisations (premium), Paramètres
  - Bouton Upgrade pour passer au plan supérieur
  - Collapse/Expand (w-20 en mode collapsed)
- **Content** : Largeur flexible (ml-80 pour compenser sidebar) avec padding généreux
- **Grids** : 3-4 colonnes
- **Cards** : Layout horizontal possible

## Thème

### Système de couleurs
- **Primary** : #3399ff (bleu OpenUp)
- **Starter** : Orange (#F97316)
- **Pro** : Bleu (#3B82F6)
- **Business** : Violet (#A855F7)

### Dark Mode
- Automatique via `ThemeProvider`
- Classes Tailwind : `dark:`
- Variables CSS personnalisées

## Data Flow

```
User Action
  ↓
View Component (onClick, onChange, etc.)
  ↓
MainDashboard (handler)
  ↓
State Update (useState)
  ↓
Re-render avec nouvelles props
  ↓
UI Update
```

## Prochaines étapes

### Fonctionnalités à implémenter
1. **Modals de création**
   - Modal de création de lien
   - Modal de création de Link in Bio
   - Modal de création de QR Code

2. **Intégration backend** (optionnelle avec Supabase)
   - Authentification réelle
   - Persistence des données
   - Analytics en temps réel

3. **Features premium**
   - Deep links intelligents
   - Domaines personnalisés
   - QR codes avec logo
   - Business cards digitales
   - Collaboration multi-utilisateurs

### Améliorations possibles
- Router (React Router) pour une vraie navigation
- State management global (Zustand/Redux) si nécessaire
- Tests unitaires et e2e
- PWA support
- Animations plus riches (Framer Motion)

## Conventions de code

### Naming
- Components : PascalCase (`DashboardView`)
- Files : kebab-case (`dashboard-view.tsx`)
- Props interfaces : `ComponentNameProps`
- Handlers : `handleActionName`

### Structure de fichier
```typescript
// Imports
import { ... } from '...'

// Types/Interfaces
interface ComponentProps { ... }

// Component
export function Component({ props }: ComponentProps) {
  // Hooks
  const [state, setState] = useState()
  
  // Handlers
  const handleAction = () => { ... }
  
  // Render
  return ( ... )
}
```

### Styling
- Tailwind classes uniquement
- Pas de CSS modules ou styled-components
- Classes conditionnelles avec template literals
- Responsive via breakpoints Tailwind

## Performance

### Optimisations actuelles
- Lazy loading des images (ImageWithFallback)
- Pas de scrollbars visibles (CSS)
- Transitions CSS hardware-accelerated
- Minimal re-renders grâce à la structure simplifiée

### À considérer
- Code splitting par route
- Virtual scrolling pour longues listes
- Image optimization
- Memoization (React.memo, useMemo) si nécessaire

---

**Version** : 2.0 (Architecture remaniée)
**Date** : Janvier 2025
**Framework** : React 18 + TypeScript + Tailwind CSS v4
