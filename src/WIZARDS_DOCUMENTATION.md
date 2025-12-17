# 🧙 Documentation des Wizards - OpenUp

## Vue d'ensemble

Les wizards sont des formulaires multi-étapes guidés pour créer du contenu dans OpenUp. Chaque wizard suit une structure cohérente en 3 étapes avec stepper, validation et animations.

---

## 🔗 Create Link Wizard

**Fichier** : `/components/create-link-wizard.tsx`

### Étape 1 - Détails du lien

**Champs** :
- ✅ **URL de destination*** (obligatoire)
  - Validation : doit commencer par http:// ou https://
  - Placeholder : "Coller mon lien"
  
- **Titre du lien** (optionnel)
  - Placeholder : "Mon super projet"
  
- **Modifier le slug** 🌟 Starter
  - Format : `openup.to/[slug]`
  - Validation : minimum 5 caractères
  - Auto-format : lowercase, alphanumerique + tirets uniquement
  
- **Nom de domaine** 👑 Pro
  - Dropdown avec domaines disponibles
  - Défaut : `openup.to`
  
- **Générer un QR Code** (switch)
  - Active/désactive la génération automatique

### Étape 2 - Personnalisation

**Champs** :
- **Couleur de fond**
  - Color picker + input texte
  - Défaut : #3399ff
  
- **Style du bouton**
  - 3 options : Rounded, Square, Pill
  - Preview visuel pour chaque style
  
- **Aperçu en temps réel**
  - Preview du lien avec les paramètres appliqués

### Étape 3 - Options avancées

**Champs** :
- **Date d'expiration** 👑 Pro
  - Input date
  - Optionnel
  
- **Mot de passe** 👑 Pro
  - Input password
  - Protège l'accès au lien
  
- **Limite de clics** 🌟 Starter
  - Input number
  - Nombre maximum de clics autorisés
  
- **Analytics détaillées** (switch)
  - Active par défaut
  
- **Résumé**
  - Récapitulatif de tous les paramètres
  - Lecture seule

---

## 📱 Create QR Code Wizard

**Fichier** : `/components/create-qr-wizard.tsx`

### Étape 1 - Contenu du QR Code

**Champs** :
- ✅ **URL de destination*** (obligatoire)
  - Validation : doit commencer par http:// ou https://
  - Placeholder : "https://openup.to/monlien"
  
- **Titre du QR Code** (optionnel)
  - Pour identification interne
  - Placeholder : "Mon QR Code personnalisé"

### Étape 2 - Personnalisation

**Champs** :
- **Couleur principale**
  - Color picker + input texte
  - Défaut : #000000 (noir)
  
- **Couleur de fond**
  - Color picker + input texte
  - Défaut : #ffffff (blanc)
  
- **Style du QR Code**
  - 3 options : Square, Rounded, Dots
  - Preview visuel
  
- **Logo au centre** 👑 Pro
  - URL de l'image du logo
  - Optionnel
  
- **Aperçu**
  - Preview du QR Code en temps réel

### Étape 3 - Options d'export

**Champs** :
- **Taille du QR Code**
  - 512x512 px (Petit)
  - 1024x1024 px (Moyen) - Recommandé
  - 2048x2048 px (Grand)
  - 4096x4096 px (Très grand)
  
- **Format de fichier**
  - PNG (Recommandé)
  - SVG (Vectoriel)
  - PDF (Impression)
  
- **Niveau de correction d'erreur**
  - L - Faible (7%)
  - M - Moyen (15%) - Recommandé
  - Q - Élevé (25%)
  - H - Très élevé (30%)
  
- **Résumé**
  - URL, Titre, Format, Taille

---

## ⬛ Create Link in Bio Wizard

**Fichier** : À créer - `/components/create-bio-wizard.tsx`

### Étape 1 - Informations de base

**Champs** :
- Username
- Bio/Description
- Photo de profil
- Liens sociaux

### Étape 2 - Design et template

**Champs** :
- Choix du template
- Couleurs
- Polices
- Layout

### Étape 3 - Liens et contenu

**Champs** :
- Ajouter des liens
- Drag & drop pour réorganiser
- Preview final

---

## 🎨 Structure commune des wizards

### Header
```tsx
<div className="sticky top-0 bg-white dark:bg-gray-900 border-b">
  {/* Icône + Titre + Bouton fermeture */}
  {/* Stepper avec 3 étapes */}
</div>
```

### Stepper
- 3 cercles numérotés (1, 2, 3)
- Étape active : bleu (#3399ff) avec scale 1.1
- Étape complétée : bleu avec icône Check
- Étape future : gris
- Lignes de connexion entre les étapes

### Content
- Scroll vertical
- Animations slide (gauche → droite pour "Suivant", droite → gauche pour "Précédent")
- Espacements cohérents (space-y-6)

### Footer
- Sticky bottom
- Bouton "Annuler" / "Précédent" à gauche
- Bouton "Suivant" / "Créer" à droite
- Icônes dans les boutons (ChevronRight, Check, Download)

---

## 🎯 Badges de fonctionnalités

### 🌟 Starter Badge
```tsx
<Badge variant="secondary" className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
  <Sparkles className="w-3 h-3 mr-1" />
  Starter
</Badge>
```

**Fonctionnalités** :
- Slugs personnalisés
- Limites de clics
- Analytics basiques

### 👑 Pro Badge
```tsx
<Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
  <Crown className="w-3 h-3 mr-1" />
  Pro
</Badge>
```

**Fonctionnalités** :
- Domaines personnalisés
- Dates d'expiration
- Mots de passe
- Logos dans QR codes
- Analytics avancées

---

## 🔧 Props communes

```typescript
interface WizardProps {
  isOpen: boolean;              // État d'ouverture
  onClose: () => void;          // Callback de fermeture
  subscriptionTier?: string;    // 'free' | 'starter' | 'pro' | 'business'
  isMobile?: boolean;           // Mode mobile/desktop
}
```

---

## ✅ Validation

### Validation temps réel
- Les erreurs s'affichent sous les champs
- Les erreurs disparaissent quand l'utilisateur tape
- Border rouge sur les champs en erreur

### Validation par étape
- `validateStep1()` vérifie les champs obligatoires
- Empêche la navigation si validation échoue
- Messages d'erreur explicites

### Exemples de validation
```typescript
// URL obligatoire
if (!formData.url.trim()) {
  newErrors.url = "L'URL de destination est obligatoire";
}

// Format URL
if (!formData.url.match(/^https?:\/\/.+/)) {
  newErrors.url = "L'URL doit commencer par http:// ou https://";
}

// Slug minimum 5 caractères
if (formData.slug && formData.slug.length < 5) {
  newErrors.slug = "Le slug doit contenir au moins 5 caractères";
}
```

---

## 🎬 Animations

### Ouverture du modal
```typescript
initial={{ opacity: 0, scale: 0.95, y: isMobile ? 20 : 0 }}
animate={{ opacity: 1, scale: 1, y: 0 }}
exit={{ opacity: 0, scale: 0.95, y: isMobile ? 20 : 0 }}
transition={{ type: "spring", duration: 0.3, bounce: 0.3 }}
```

### Navigation entre étapes
```typescript
// Suivant
<motion.div
  key={`step${currentStep}`}
  initial={{ opacity: 0, x: 20 }}
  animate={{ opacity: 1, x: 0 }}
  exit={{ opacity: 0, x: -20 }}
>

// Précédent (inverse)
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
Position: fixed
Inset: 16px (4)
Full screen minus margins
Max-height content: calc(100vh - 220px)
```

### Desktop (≥ 768px)
```css
Position: fixed (centered)
Max-width: 672px (2xl)
Max-height: 90vh
Content: 60vh max
```

---

## 🔄 Flow utilisateur

```
User ouvre menu de création
    ↓
Clique "Un nouveau lien" / "Un nouveau QR Code"
    ↓
Wizard s'ouvre (Étape 1)
    ↓
User remplit les champs
    ↓
Clique "Suivant" → Validation
    ↓
Étape 2 (personnalisation)
    ↓
Clique "Suivant"
    ↓
Étape 3 (options avancées)
    ↓
Clique "Créer" → Submit
    ↓
Toast de succès
    ↓
Modal se ferme
    ↓
Item créé apparaît dans la liste
```

---

## 🎨 Design tokens

### Couleurs
```css
--primary: #3399ff;
--success: #10b981;
--warning: #f59e0b;
--error: #ef4444;

/* Badges */
--starter-bg: #fef3c7 / #78350f30;
--starter-text: #92400e / #fbbf24;
--pro-bg: #f3e8ff / #581c8730;
--pro-text: #6b21a8 / #c084fc;
```

### Espacements
```css
Gap entre champs: 24px (space-y-6)
Padding modal: 24px (p-6)
Margin boutons: 8px (gap-2)
```

### Bordures
```css
Modal: rounded-3xl (24px)
Inputs: rounded-lg (8px)
Badges: rounded-md (6px)
Stepper: rounded-full (50%)
```

---

## 🚀 Prochaines améliorations

### Fonctionnalités
- [ ] Sauvegarde brouillon automatique
- [ ] Navigation clavier (Tab, Enter, Esc)
- [ ] Indicateur de progression (% complété)
- [ ] Templates pré-remplis
- [ ] Import depuis URL (auto-fill)
- [ ] Historique des créations
- [ ] Dupliquer un lien existant

### UX
- [ ] Tooltips sur les badges Pro/Starter
- [ ] Liens vers upgrade pour fonctionnalités premium
- [ ] Validation asynchrone (slug disponible?)
- [ ] Preview en temps réel sur tous les champs
- [ ] Raccourcis clavier (Cmd+Enter pour submit)
- [ ] Swipe pour navigation mobile

### Technique
- [ ] Tests unitaires
- [ ] Accessibilité ARIA
- [ ] Focus trap
- [ ] Error boundary
- [ ] Analytics sur abandon de formulaire

---

## 📊 Métriques de succès

### Performance
- Time to interactive : < 200ms
- Animation framerate : 60fps
- Bundle size : ~8KB par wizard

### UX
- Taux de complétion : > 85%
- Taux d'abandon étape 1 : < 10%
- Temps moyen de complétion : < 60s

### Qualité
- Validation errors : < 5% après submit
- Bugs reported : 0
- Accessibility score : AAA

---

**Version** : 1.0  
**Date** : Janvier 2025  
**Status** : ✅ Production Ready  
**Auteur** : OpenUp Team
