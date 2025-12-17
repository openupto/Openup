import { useApp } from '../components/app-context';
import { toast } from 'sonner@2.0.3';

/**
 * Hook to check and enforce plan limits
 */
export function usePlanLimits() {
  const { currentPlan, links, qrCodes, teams, canCreateLink, linksRemaining } = useApp();

  const checkLinkLimit = (): boolean => {
    if (!currentPlan) {
      toast.error('Plan non trouvé');
      return false;
    }

    if (!canCreateLink) {
      toast.error(
        `Limite de liens atteinte (${currentPlan.max_links}). Passez à un plan supérieur.`,
        {
          action: {
            label: 'Voir les plans',
            onClick: () => window.location.href = '/settings/subscription',
          },
        }
      );
      return false;
    }

    return true;
  };

  const checkQRCodeLimit = (): boolean => {
    if (!currentPlan) {
      toast.error('Plan non trouvé');
      return false;
    }

    if (qrCodes.length >= currentPlan.max_qr_codes) {
      toast.error(
        `Limite de QR codes atteinte (${currentPlan.max_qr_codes}). Passez à un plan supérieur.`,
        {
          action: {
            label: 'Voir les plans',
            onClick: () => window.location.href = '/settings/subscription',
          },
        }
      );
      return false;
    }

    return true;
  };

  const checkTeamMemberLimit = (): boolean => {
    if (!currentPlan) {
      toast.error('Plan non trouvé');
      return false;
    }

    if (teams.length >= currentPlan.max_team_members) {
      toast.error(
        `Limite de membres d'équipe atteinte (${currentPlan.max_team_members}). Passez à un plan supérieur.`,
        {
          action: {
            label: 'Voir les plans',
            onClick: () => window.location.href = '/settings/subscription',
          },
        }
      );
      return false;
    }

    return true;
  };

  const getPlanFeature = (featureName: string): any => {
    if (!currentPlan || !currentPlan.features) {
      return null;
    }

    return currentPlan.features[featureName];
  };

  const hasPlanFeature = (featureName: string): boolean => {
    const feature = getPlanFeature(featureName);
    return !!feature;
  };

  const showUpgradeModal = (feature: string) => {
    toast.error(
      `Cette fonctionnalité (${feature}) n'est pas disponible sur votre plan actuel.`,
      {
        action: {
          label: 'Mettre à niveau',
          onClick: () => window.location.href = '/settings/subscription',
        },
        duration: 5000,
      }
    );
  };

  return {
    currentPlan,
    linksRemaining,
    checkLinkLimit,
    checkQRCodeLimit,
    checkTeamMemberLimit,
    getPlanFeature,
    hasPlanFeature,
    showUpgradeModal,
  };
}

/**
 * Plan features constants
 */
export const PLAN_FEATURES = {
  CUSTOM_DOMAIN: 'custom_domain',
  ANALYTICS_EXPORT: 'analytics_export',
  PASSWORD_PROTECTION: 'password_protection',
  EXPIRING_LINKS: 'expiring_links',
  GEO_TARGETING: 'geo_targeting',
  DEEP_LINKS: 'deep_links',
  BRANDED_QR: 'branded_qr',
  API_ACCESS: 'api_access',
  TEAM_COLLABORATION: 'team_collaboration',
  PRIORITY_SUPPORT: 'priority_support',
  WHITE_LABEL: 'white_label',
};
