#!/bin/bash

# Script pour remplacer toutes les occurrences de #3399ff par #006EF7

# Remplacer dans tous les fichiers .tsx
find components -name "*.tsx" -type f -exec sed -i 's/#3399ff/#006EF7/g' {} \;

# Remplacer dans App.tsx
sed -i 's/#3399ff/#006EF7/g' App.tsx

# Remplacer dans les fichiers markdown (documentation)
find . -name "*.md" -type f -exec sed -i 's/#3399ff/#006EF7/g' {} \;

echo "Remplacement terminé: #3399ff -> #006EF7"
