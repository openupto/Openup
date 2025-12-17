import { toast } from 'sonner@2.0.3';

/**
 * Copie du texte dans le presse-papiers avec fallback pour les environnements non sécurisés
 * @param text - Le texte à copier
 * @param successMessage - Message de succès optionnel
 * @returns Promise<boolean> - true si la copie a réussi
 */
export async function copyToClipboard(text: string, successMessage?: string): Promise<boolean> {
  try {
    // Essayer d'utiliser l'API Clipboard moderne
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      if (successMessage) {
        toast.success(successMessage);
      }
      return true;
    } else {
      // Fallback pour les environnements non sécurisés ou anciens navigateurs
      return fallbackCopyToClipboard(text, successMessage);
    }
  } catch (error) {
    // Utiliser le fallback silencieusement sans warning
    return fallbackCopyToClipboard(text, successMessage);
  }
}

/**
 * Méthode de fallback pour copier du texte
 */
function fallbackCopyToClipboard(text: string, successMessage?: string): boolean {
  try {
    // Créer un élément textarea temporaire
    const textArea = document.createElement('textarea');
    textArea.value = text;
    
    // Rendre l'élément invisible mais accessible
    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = '0';
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    textArea.style.opacity = '0';
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      // Tenter la copie avec execCommand (méthode dépréciée mais largement supportée)
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      if (successful) {
        if (successMessage) {
          toast.success(successMessage);
        }
        return true;
      } else {
        toast.error('Impossible de copier le texte');
        return false;
      }
    } catch (err) {
      document.body.removeChild(textArea);
      toast.error('Erreur lors de la copie');
      return false;
    }
  } catch (error) {
    console.error('Fallback copy failed:', error);
    toast.error('Impossible de copier dans le presse-papiers');
    return false;
  }
}

/**
 * Copie une image/blob dans le presse-papiers
 * @param blob - Le blob à copier
 * @param successMessage - Message de succès optionnel
 * @returns Promise<boolean> - true si la copie a réussi
 */
export async function copyBlobToClipboard(blob: Blob, successMessage?: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob
        })
      ]);
      if (successMessage) {
        toast.success(successMessage);
      }
      return true;
    } else {
      toast.error('Copie d\'image non supportée dans cet environnement');
      return false;
    }
  } catch (error) {
    console.error('Failed to copy blob to clipboard:', error);
    toast.error('Erreur lors de la copie de l\'image');
    return false;
  }
}
