# Mise à jour de la couleur bleue principale

## Changement effectué
Remplacement de la couleur bleue principale de l'application :
- **Ancienne couleur** : `#3399ff`
- **Nouvelle couleur** : `#006EF7`

## Fichiers déjà mis à jour

### ✅ Fichiers CSS
- `/styles/globals.css` - Variables CSS principales et animations mises à jour

### ✅ Fichiers TypeScript
- `/App.tsx` - Spinner de chargement mis à jour
- `/components/auth-modal.tsx` - Composant d'authentification mis à jour
- `/components/futuristic-background.tsx` - Animation de fond mise à jour
- `/components/futuristic-sidebar.tsx` - Avatar et menu latéral mis à jour

## Fichiers restants à mettre à jour

Les fichiers suivants contiennent encore des occurrences de `#3399ff` et doivent être mis à jour :

###components/
1. `dashboard.tsx` (13 occurrences)
2. `create-link-modal.tsx` (5 occurrences)
3. `analytics.tsx` (15 occurrences)
4. `settings.tsx` (17 occurrences)
5. `public-page.tsx` (7 occurrences)
6. `page-designer.tsx` (3 occurrences)
7. `wallet-card.tsx` (7 occurrences)
8. `mobile-header.tsx` (2 occurrences)
9. `design-system.tsx` (7 occurrences)
10. `page-templates.tsx` (7 occurrences)
11. `page-layouts.tsx` (1 occurrence)
12. `modern-page-layouts.tsx` (1 occurrence)
13. `visual-link-editor.tsx` (2 occurrences)
14. `advanced-layout-editor.tsx` (2 occurrences)
15. `simple-visual-editor.tsx` (2 occurrences)
16. `qr-code-generator.tsx` (4 occurrences)
17. `wallet-card-generator.tsx` (1 occurrence)
18. `advanced-analytics.tsx` (7 occurrences)
19. `link-tab-navigation.tsx` (1 occurrence)
20. `mobile-link-in-bio-creator.tsx` (1 occurrence)
21. `mobile-appearance-editor.tsx` (11 occurrences)
22. `views/link-in-bio-view.tsx` (1 occurrence)
23. `create-menu.tsx` (1 occurrence)
24. `create-link-wizard.tsx` (1 occurrence)
25. `create-qr-wizard.tsx` (1 occurrence)
26. `create-bio-wizard.tsx` (2 occurrences)
27. `bio-editor.tsx` (1 occurrence)
28. `appearance-modal.tsx` (2 occurrences)

## Script de remplacement automatique

Deux scripts sont disponibles pour automatiser le remplacement :

### Script Bash
```bash
./replace-blue.sh
```

### Script Python
```python
python3 replace_blue_color.py
```

## Vérification après remplacement

Après avoir exécuté le script, vérifier que :
1. Toutes les occurrences de `#3399ff` ont été remplacées par `#006EF7`
2. Les gradients utilisant `from-[#3399ff]` ou `to-[#3399ff]` sont mis à jour
3. Les classes Tailwind avec `border-[#3399ff]`, `bg-[#3399ff]`, `text-[#3399ff]` sont mises à jour
4. Les valeurs rgba dans le CSS utilisent `rgba(0, 110, 247, ...)` au lieu de `rgba(51, 153, 255, ...)`

## Commande de recherche

Pour vérifier s'il reste des occurrences :
```bash
grep -r "#3399ff" components/ App.tsx styles/
grep -r "3399ff" components/ App.tsx styles/
grep -r "51, 153, 255" components/ App.tsx styles/
```

## Impact visuel

La nouvelle couleur `#006EF7` est un bleu légèrement plus foncé et plus saturé que l'ancien `#3399ff`, ce qui donne :
- Une meilleure accessibilité (contraste amélioré)
- Une apparence plus moderne et professionnelle
- Une cohérence avec les standards de design actuels
