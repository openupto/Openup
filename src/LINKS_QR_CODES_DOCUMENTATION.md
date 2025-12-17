# 🔗 Documentation Page Liens & QR Codes

## Vue d'ensemble

La page **Liens & QR Codes** est la page principale pour gérer tous vos liens raccourcis et QR codes personnalisés. Elle offre deux onglets distincts avec des fonctionnalités adaptées à chaque type de contenu.

---

## 🎨 Interface Utilisateur

### Structure à onglets

```
┌─────────────────────────────────────────┐
│  [Lien]  |  [QR Code]                   │
├─────────────────────────────────────────┤
│  + Créer un lien                        │
│  🔍 Chercher un lien...          [≡]    │
│  ─────────────────────────────────────  │
│  Liens                          Clics   │
│  ─────────────────────────────────────  │
│  ┌───────────────────────────────────┐  │
│  │ Mon Portfolio              1,2K   │  │
│  │ openup.to/fJV7dE          [⋮] [⎘]│  │
│  │ • 28/09/25                        │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

---

## 📋 Onglet 1 : Liens

### Composants

#### 1. Bouton de création
```tsx
+ Créer un lien
```
- **Couleur** : Bleu primaire (#3399ff)
- **Taille** : Pleine largeur, hauteur 56px
- **Coins** : Arrondis (rounded-xl)
- **Action** : Ouvre le wizard de création de lien

#### 2. Barre de recherche + filtre
```
🔍 Chercher un lien...        [≡]
```
- **Search input** :
  - Placeholder : "Chercher un lien..."
  - Icône loupe à gauche
  - Background : gris clair
  - Recherche en temps réel
- **Bouton filtre** :
  - Icône slider horizontal
  - Carré 48x48px
  - Même background que le search

#### 3. En-tête de liste
```
Liens                    Clics
```
- Texte gris secondaire
- Espacement horizontal

#### 4. Carte de lien
```
┌─────────────────────────────────────┐
│ Mon Portfolio                  1,2K │
│ openup.to/fJV7dE              [⋮][⎘]│
│ • 28/09/25                          │
└─────────────────────────────────────┘
```

**Structure** :
- **Background** : Gris clair (bg-gray-50)
- **Padding** : 16px
- **Coins** : Très arrondis (rounded-2xl)

**Contenu** :
1. **Titre** (h3)
   - Police : semibold
   - Couleur : texte primaire
   
2. **URL raccourcie**
   - Police : small
   - Couleur : texte secondaire
   - Tronquée si trop longue

3. **Date**
   - Très petit (xs)
   - Préfixe "•"
   - Couleur : gris

4. **Nombre de clics**
   - À droite
   - Police : medium
   - Couleur : texte primaire

5. **Actions** (2 boutons)
   - **Menu "..." (3 points)** :
     - Dropdown avec options :
       - ✏️ Modifier
       - 📋 Copier le lien
       - 🗑️ Supprimer (rouge)
   - **Copie rapide** :
     - Icône copie
     - Toast : "Lien copié !"

### Données affichées

| Titre | URL courte | Clics | Date |
|-------|------------|-------|------|
| Mon Portfolio | openup.to/fJV7dE | 1,2K | 28/09/25 |
| Lien tiktok | openup.to/NKST9Z | 946 | 20/09/25 |
| Collection été | openup.to/myshop | 49 | 08/09/25 |
| Linkedin | openup.to/Rihanna | 27,3K | 04/09/25 |
| Youtube | openup.to/Squeezie | 604K | 31/08/25 |

### Actions disponibles

#### Bouton principal
- **"+ Créer un lien"** → Ouvre `CreateLinkWizard`

#### Actions sur un lien
1. **Copie rapide** (icône) → Copie l'URL dans le presse-papier
2. **Menu dropdown** :
   - **Modifier** → Ouvre l'éditeur de lien
   - **Copier le lien** → Copie l'URL
   - **Supprimer** → Supprime le lien (avec confirmation)

#### Recherche
- Filtre par titre ou URL
- Recherche en temps réel
- Affiche "Aucun lien trouvé" si vide

---

## 🎨 Onglet 2 : QR Code

### Composants

#### 1. Bouton de création
```tsx
+ Créer un QR Code
```
- Identique au bouton de l'onglet Lien
- Action : Ouvre le wizard de création de QR Code

#### 2. Barre de recherche + filtre
```
🔍 Chercher un QR Code...     [≡]
```
- Placeholder : "Chercher un QR Code..."
- Même design que l'onglet Lien

#### 3. En-tête de liste
```
QR Codes
```
- Pas de colonne "Clics" (remplacé par "scans")

#### 4. Carte de QR Code
```
┌─────────────────────────────────────┐
│ Mon Portfolio              [QR IMG] │
│ 40 scans                   [⋮]  [⬇] │
│ • 28/09/25                          │
└─────────────────────────────────────┘
```

**Structure** :
- Même design que les cartes de liens
- **QR Code visuel** :
  - Taille : 56x56px
  - Background blanc
  - Coins arrondis
  - Couleurs variées :
    - Vert : `#00ff00` (Mon Portfolio)
    - Noir : `#000000` (défaut)
    - Rouge : `#ff0000` (Youtube)

**Contenu** :
1. **Titre** (h3)
2. **Nombre de scans**
   - Format : "40 scans", "189 scans", "13K scans"
   - Police : small
   - Couleur : gris
3. **Date**
4. **QR Code preview** (SVG)
   - Mini QR code généré avec coins de position
   - Pattern aléatoire au centre
5. **Actions** (2 boutons)
   - **Menu "..."** :
     - ✏️ Modifier
     - 📥 Télécharger
     - 🗑️ Supprimer (rouge)
   - **Téléchargement rapide** :
     - Icône download
     - Toast : "QR Code téléchargé"

### Données affichées

| Titre | Scans | Date | Couleur QR |
|-------|-------|------|------------|
| Mon Portfolio | 40 scans | 28/09/25 | Vert |
| Lien tiktok | 189 scans | 20/09/25 | Noir |
| Collection été | 13K scans | 08/09/25 | Noir |
| Linkedin | 28K scans | 04/09/25 | Noir |
| Youtube | 8 scans | 31/08/25 | Rouge |

### Actions disponibles

#### Bouton principal
- **"+ Créer un QR Code"** → Ouvre `CreateQRWizard`

#### Actions sur un QR Code
1. **Téléchargement rapide** (icône) → Télécharge le QR en PNG
2. **Menu dropdown** :
   - **Modifier** → Ouvre l'éditeur de QR Code
   - **Télécharger** → Télécharge le QR
   - **Supprimer** → Supprime le QR Code

#### Recherche
- Filtre par titre uniquement
- Recherche en temps réel

---

## 🎨 Design System

### Couleurs

```css
/* Boutons principaux */
--primary-button: #3399ff
--primary-button-hover: #2680e6

/* Backgrounds */
--card-bg: #f9fafb (light) / #1f2937 (dark)
--search-bg: #f3f4f6 (light) / #1f2937 (dark)

/* Texte */
--text-primary: #111827 (light) / #ffffff (dark)
--text-secondary: #6b7280 (light) / #9ca3af (dark)
--text-muted: #9ca3af (light) / #6b7280 (dark)

/* QR Codes */
--qr-green: #00ff00
--qr-black: #000000
--qr-red: #ff0000
```

### Espacements

```css
/* Container */
padding: 16px (mobile), 32px (desktop)

/* Cards */
padding: 16px
gap: 12px
border-radius: 16px

/* Buttons */
height: 56px (create button)
height: 48px (icon buttons)
border-radius: 12px
```

### Typographie

```css
/* Titres de lien */
font-size: 16px
font-weight: 600
line-height: 1.5

/* URL / Scans */
font-size: 14px
font-weight: 400
color: secondary

/* Date */
font-size: 12px
color: muted
```

---

## 📱 Responsive

### Mobile (< 768px)
- Pleine largeur
- Padding : `px-4 py-4`
- Cards : Stack vertical
- Boutons : Tactiles (44px min)
- QR Code : Taille réduite si nécessaire

### Desktop (≥ 768px)
- Largeur maximale : Container
- Padding : `px-8 py-6`
- Cards : Même design
- Hover states actifs

---

## 🔧 Structure de Données

### Interface Link
```typescript
interface Link {
  id: string;
  title: string;
  shortUrl: string;
  clicks: string;
  date: string;
}
```

### Interface QRCode
```typescript
interface QRCode {
  id: string;
  title: string;
  scans: string;
  date: string;
  qrColor: string; // hex color
}
```

---

## 🎯 Fonctionnalités

### ✅ Implémentées

#### Onglet Lien
- [x] Navigation par onglets
- [x] Bouton "Créer un lien"
- [x] Barre de recherche en temps réel
- [x] Bouton filtre (UI)
- [x] Liste de liens avec données
- [x] Affichage titre + URL + date + clics
- [x] Bouton copie rapide avec toast
- [x] Menu dropdown (3 points)
- [x] Actions : Modifier, Copier, Supprimer
- [x] Toast notifications
- [x] État vide avec CTA
- [x] Responsive

#### Onglet QR Code
- [x] Navigation par onglets
- [x] Bouton "Créer un QR Code"
- [x] Barre de recherche en temps réel
- [x] Bouton filtre (UI)
- [x] Liste de QR codes avec données
- [x] Affichage titre + scans + date
- [x] Mini QR code SVG généré
- [x] QR codes colorés (vert, noir, rouge)
- [x] Bouton téléchargement rapide avec toast
- [x] Menu dropdown (3 points)
- [x] Actions : Modifier, Télécharger, Supprimer
- [x] Toast notifications
- [x] État vide avec CTA
- [x] Responsive

### 🔄 À implémenter

#### Fonctionnalités backend
- [ ] Intégration Supabase pour données réelles
- [ ] CRUD complet (Create, Read, Update, Delete)
- [ ] Téléchargement QR réel (PNG, SVG, PDF)
- [ ] Analytics par lien/QR
- [ ] Filtres avancés (par date, par performance)

#### Améliorations UI
- [ ] Tri par colonne (titre, clics, date)
- [ ] Sélection multiple
- [ ] Actions groupées (supprimer plusieurs)
- [ ] Pagination
- [ ] Infinite scroll
- [ ] Drag & drop pour réorganiser

#### QR Codes avancés
- [ ] Génération QR en haute résolution
- [ ] Formats : PNG, SVG, PDF, EPS
- [ ] QR codes avec logo au centre
- [ ] Personnalisation : couleurs, style, frames
- [ ] QR codes dynamiques (URL modifiable)

---

## 🎨 Mini QR Code SVG

### Génération

```typescript
const renderMiniQRCode = (color: string) => {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56">
      {/* Border */}
      <rect x="2" y="2" width="52" height="52" 
        stroke={color} strokeWidth="1" fill="white"/>
      
      {/* Top-left corner */}
      <rect x="6" y="6" width="12" height="12" 
        stroke={color} strokeWidth="2" fill="white"/>
      <rect x="9" y="9" width="6" height="6" fill={color}/>
      
      {/* Top-right corner */}
      <rect x="38" y="6" width="12" height="12" 
        stroke={color} strokeWidth="2" fill="white"/>
      <rect x="41" y="9" width="6" height="6" fill={color}/>
      
      {/* Bottom-left corner */}
      <rect x="6" y="38" width="12" height="12" 
        stroke={color} strokeWidth="2" fill="white"/>
      <rect x="9" y="41" width="6" height="6" fill={color}/>
      
      {/* Center pattern (random dots) */}
      {/* ... pattern pixels ... */}
    </svg>
  );
};
```

### Caractéristiques
- Taille : 56x56px
- 3 coins de position (QR standard)
- Pattern aléatoire au centre
- Couleur personnalisable
- Background blanc
- Border de 1px

---

## 🚀 Intégration

### Dans MainDashboard

```typescript
import { LinksView } from './views/links-view';

// ...

const handleCreateLink = () => {
  setShowLinkWizard(true);
};

const handleCreateQRCode = () => {
  setShowQRWizard(true);
};

// Dans renderView()
case 'links':
  return (
    <LinksView 
      onCreateLink={handleCreateLink}
      onCreateQRCode={handleCreateQRCode}
      isMobile={isMobile}
    />
  );
```

### Props

```typescript
interface LinksViewProps {
  onCreateLink?: () => void;
  onCreateQRCode?: () => void;
  isMobile?: boolean;
}
```

---

## 📊 Analytics Possibles

### Par lien
- Total de clics
- Clics par jour/semaine/mois
- Géolocalisation des clics
- Appareils utilisés
- Sources de trafic
- Taux de conversion

### Par QR Code
- Total de scans
- Scans par jour/semaine/mois
- Géolocalisation des scans
- Appareils utilisés (iOS, Android)
- Heures de scan
- Localisation physique

---

## 🎯 Cas d'usage

### Liens raccourcis
1. **Partage sur réseaux sociaux**
   - URLs courtes et mémorables
   - Tracking des clics par plateforme
   
2. **Campagnes marketing**
   - URLs brandées (openup.to/campagne)
   - Analytics détaillées
   
3. **Bio Instagram/TikTok**
   - Lien unique à partager
   - Change de destination sans changer l'URL

### QR Codes
1. **Marketing physique**
   - Affiches, flyers, packaging
   - Téléchargement haute résolution
   
2. **Événements**
   - Entrées, badges
   - Tracking des scans
   
3. **Cartes de visite**
   - QR vers profil ou portfolio
   - Design personnalisé

---

## ✅ Checklist

### Interface
- [x] Onglets Lien / QR Code
- [x] Boutons de création (2)
- [x] Barres de recherche (2)
- [x] Boutons filtre (2)
- [x] En-têtes de liste
- [x] Cartes de liens (5)
- [x] Cartes de QR codes (5)
- [x] Mini QR codes SVG
- [x] Menus dropdown
- [x] Boutons d'action rapide
- [x] États vides
- [x] Toast notifications
- [x] Responsive design
- [x] Dark mode

### Interactions
- [x] Switch entre onglets
- [x] Recherche en temps réel
- [x] Copie de lien
- [x] Téléchargement QR
- [x] Ouvrir modals création
- [x] Actions dropdown
- [x] Feedback utilisateur

### Backend (À faire)
- [ ] Fetch liens depuis Supabase
- [ ] Fetch QR codes depuis Supabase
- [ ] Create/Update/Delete liens
- [ ] Create/Update/Delete QR codes
- [ ] Génération QR serveur
- [ ] Analytics tracking

---

## 📚 Composants utilisés

### Shadcn UI
- `Input` : Barres de recherche
- `Button` : Boutons principaux
- `Tabs` / `TabsList` / `TabsTrigger` : Navigation
- `DropdownMenu` : Menus contextuels

### Lucide Icons
- `Search` : Icône recherche
- `SlidersHorizontal` : Icône filtres
- `Plus` : Icône création
- `MoreVertical` : Menu 3 points
- `Copy` : Copie rapide
- `Download` : Téléchargement
- `QrCode` : Icône QR

### Autres
- `toast` (Sonner) : Notifications
- SVG custom : Mini QR codes

---

**Version** : 1.0  
**Date** : Janvier 2025  
**Statut** : ✅ Interface complète et fonctionnelle  
**Backend** : 🔄 À intégrer avec Supabase
