// VERSION 0 : Inline direct (si import échoue)
// Décommentez la ligne ci-dessous et commentez la ligne "return <AnalyticsSuperMinimal />;" si l'import échoue
/*
export function AnalyticsView() {
  return (
    <div style={{ padding: '40px', backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '32px', color: '#000' }}>✅ Analytics Inline</h1>
      <p>Version inline sans import - Si vous voyez ceci, l'import a échoué.</p>
    </div>
  );
}
*/

// VERSION 1 : Import du fichier
import { AnalyticsPage } from '../analytics-page';

interface AnalyticsViewProps {
  isMobile?: boolean;
}

export function AnalyticsView({ isMobile = false }: AnalyticsViewProps) {
  return <AnalyticsPage />;
}
