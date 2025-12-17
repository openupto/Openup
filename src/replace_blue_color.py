#!/usr/bin/env python3
"""
Script pour remplacer toutes les occurrences de #3399ff par #006EF7
dans tous les fichiers TypeScript React (.tsx) et CSS
"""

import os
import re

OLD_COLOR = "#3399ff"
NEW_COLOR = "#006EF7"

# Aussi remplacer les variations en minuscule/majuscule
OLD_COLOR_LOWER = "#3399ff"
OLD_COLOR_UPPER = "#3399FF"

def replace_in_file(filepath):
    """Remplace les couleurs dans un fichier"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Remplacer toutes les variations
        content = content.replace(OLD_COLOR_LOWER, NEW_COLOR)
        content = content.replace(OLD_COLOR_UPPER, NEW_COLOR)
        
        # Si le fichier a changé, le réécrire
        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✓ Mis à jour: {filepath}")
            return True
        return False
    except Exception as e:
        print(f"✗ Erreur avec {filepath}: {e}")
        return False

def main():
    """Fonction principale"""
    updated_files = 0
    
    # Parcourir tous les fichiers .tsx dans components/
    for root, dirs, files in os.walk('components'):
        for file in files:
            if file.endswith('.tsx'):
                filepath = os.path.join(root, file)
                if replace_in_file(filepath):
                    updated_files += 1
    
    print(f"\n{updated_files} fichier(s) mis à jour avec succès!")
    print(f"Couleur remplacée: {OLD_COLOR} → {NEW_COLOR}")

if __name__ == "__main__":
    main()
