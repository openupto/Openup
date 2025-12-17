import linkIconImage from 'figma:asset/3a304e1e94112bfebacc05eefa1de8a206255445.png';
import linkInBioIconImage from 'figma:asset/e3828bcfffba89569a280dd0f9456e5727c5893f.png';
import analyticsIconImage from 'figma:asset/1f38f949e63db9f0e7bb1170bce4f28f36afd1b2.png';
import profileIconImage from 'figma:asset/47b0affbc77cf0afb108a29665e5747264ceb8dd.png';

// Versions bleues pour l'état actif
import linkIconBlueImage from 'figma:asset/3b9746f4ee906298a06fc55df73c215e032746ec.png';
import linkInBioIconBlueImage from 'figma:asset/0eaf69b0376f76027eaa6e56932be2ce2dd00ace.png';
import analyticsIconBlueImage from 'figma:asset/e663e5fb45447da8614f538a925b712e256758ca.png';
import profileIconBlueImage from 'figma:asset/880f6ef6651f3ad5fb69594fc3fa15432a41d032.png';

interface CustomIconProps {
  className?: string;
  active?: boolean;
}

export function CustomLinkIcon({ className = "w-5 h-5", active = false }: CustomIconProps) {
  return (
    <img 
      src={active ? linkIconBlueImage : linkIconImage} 
      alt="Link" 
      className={`${className} ${!active && 'dark:brightness-0 dark:invert'}`} 
    />
  );
}

export function CustomLinkInBioIcon({ className = "w-5 h-5", active = false }: CustomIconProps) {
  return (
    <img 
      src={active ? linkInBioIconBlueImage : linkInBioIconImage} 
      alt="Link in Bio" 
      className={`${className} ${!active && 'dark:brightness-0 dark:invert'}`} 
    />
  );
}

export function CustomAnalyticsIcon({ className = "w-5 h-5", active = false }: CustomIconProps) {
  return (
    <img 
      src={active ? analyticsIconBlueImage : analyticsIconImage} 
      alt="Analytics" 
      className={`${className} ${!active && 'dark:brightness-0 dark:invert'}`} 
    />
  );
}

export function CustomProfileIcon({ className = "w-5 h-5", active = false }: CustomIconProps) {
  return (
    <img 
      src={active ? profileIconBlueImage : profileIconImage} 
      alt="Profile" 
      className={`${className} ${!active && 'dark:brightness-0 dark:invert'}`} 
    />
  );
}

// Icône Équipe (Users) - style filled
export function CustomTeamIcon({ className = "w-5 h-5" }: CustomIconProps) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      className={className}
    >
      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
    </svg>
  );
}

// Icône Paramètres (Settings) - style filled
export function CustomSettingsIcon({ className = "w-5 h-5" }: CustomIconProps) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      className={className}
    >
      <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
    </svg>
  );
}
