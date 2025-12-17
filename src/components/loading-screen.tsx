import { useEffect, useState } from 'react';
import logoImage from 'figma:asset/10fb543094c34b061a3706fe85bbb343a6812697.png';

interface LoadingScreenProps {
  onLoadingComplete?: () => void;
}

export function LoadingScreen({ onLoadingComplete }: LoadingScreenProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Après 2 secondes, commencer le fade out
    const exitTimer = setTimeout(() => {
      setIsVisible(false);
    }, 2000);

    // Après le fade out (2.5 secondes au total), notifier que le chargement est terminé
    const completeTimer = setTimeout(() => {
      if (onLoadingComplete) {
        onLoadingComplete();
      }
    }, 2500);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [onLoadingComplete]);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center transition-opacity duration-500"
      style={{ 
        backgroundColor: '#006EF7',
        opacity: isVisible ? 1 : 0
      }}
    >
      <img 
        src={logoImage} 
        alt="OpenUp Logo" 
        className="w-32 h-32 object-contain"
      />
    </div>
  );
}
