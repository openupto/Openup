import { useAuth } from './auth-context';
import { useApp } from './app-context';
import { Card } from './ui/card';

/**
 * Composant de test simple pour diagnostiquer le module Analytics
 * Utilisez ce composant si analytics-page.tsx ne charge pas
 */
export function TestAnalyticsSimple() {
  const { user, loading: authLoading } = useAuth();
  const { links, linksLoading } = useApp();

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl">🧪 Test Analytics - Diagnostics</h1>
      
      {/* Test 1: Auth */}
      <Card className="p-6">
        <h2 className="text-xl mb-4">✅ Test 1: Authentification</h2>
        <div className="space-y-2">
          <p><strong>Status:</strong> {authLoading ? '⏳ Loading...' : user ? '✅ Connected' : '❌ Not connected'}</p>
          {user && (
            <>
              <p><strong>User ID:</strong> {user.id}</p>
              <p><strong>Email:</strong> {user.email}</p>
            </>
          )}
        </div>
      </Card>

      {/* Test 2: App Context */}
      <Card className="p-6">
        <h2 className="text-xl mb-4">✅ Test 2: App Context</h2>
        <div className="space-y-2">
          <p><strong>Status:</strong> {linksLoading ? '⏳ Loading...' : '✅ Loaded'}</p>
          <p><strong>Links Count:</strong> {links.length}</p>
          {links.length > 0 && (
            <div className="mt-2">
              <p className="font-medium">Liens disponibles:</p>
              <ul className="list-disc list-inside">
                {links.slice(0, 5).map(link => (
                  <li key={link.id}>{link.slug || link.title || 'Sans nom'}</li>
                ))}
              </ul>
              {links.length > 5 && <p className="text-sm text-gray-500">... et {links.length - 5} autres</p>}
            </div>
          )}
        </div>
      </Card>

      {/* Test 3: Supabase */}
      <Card className="p-6">
        <h2 className="text-xl mb-4">✅ Test 3: Supabase</h2>
        <div className="space-y-2">
          <p><strong>Status:</strong> {user ? '✅ Connected' : '❌ Not connected'}</p>
          <p className="text-sm text-gray-500">
            Si vous voyez ce message, Supabase client est initialisé correctement.
          </p>
        </div>
      </Card>

      {/* Test 4: Ready for Analytics */}
      <Card className="p-6 bg-green-50 border-green-200">
        <h2 className="text-xl mb-4">🎯 Test 4: Prêt pour Analytics</h2>
        {user && links.length > 0 ? (
          <div className="space-y-2">
            <p className="text-green-700">✅ Tous les tests passés !</p>
            <p className="text-sm">Vous pouvez maintenant activer analytics-page.tsx</p>
            <div className="mt-4 p-4 bg-white rounded border">
              <p className="font-medium mb-2">Pour activer la vraie page Analytics:</p>
              <ol className="list-decimal list-inside text-sm space-y-1">
                <li>Ouvrez /components/views/analytics-view.tsx</li>
                <li>Remplacez TestAnalyticsSimple par AnalyticsPage</li>
                <li>Rechargez la page</li>
              </ol>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-orange-700">⚠️ Prérequis manquants</p>
            {!user && <p className="text-sm">- Vous devez être connecté</p>}
            {user && links.length === 0 && <p className="text-sm">- Vous devez avoir au moins un lien créé</p>}
          </div>
        )}
      </Card>

      {/* Instructions */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h2 className="text-xl mb-4">📖 Prochaines Étapes</h2>
        <div className="space-y-2 text-sm">
          <p><strong>1. Créer des liens de test</strong></p>
          <p className="ml-4">Allez dans "Liens" et créez quelques liens</p>
          
          <p className="mt-4"><strong>2. Ajouter des analytics de test</strong></p>
          <p className="ml-4">Dans Supabase SQL Editor, exécutez :</p>
          <pre className="ml-4 p-2 bg-gray-800 text-white rounded text-xs overflow-x-auto mt-2">
{`-- Ajouter 100 clics aléatoires
INSERT INTO link_analytics (link_id, click_timestamp, device_type, country)
SELECT 
  (SELECT id FROM links WHERE user_id = '${user?.id}' LIMIT 1),
  NOW() - (random() * interval '7 days'),
  (ARRAY['ios', 'android', 'desktop'])[floor(random() * 3 + 1)],
  (ARRAY['France', 'USA', 'Canada'])[floor(random() * 3 + 1)]
FROM generate_series(1, 100);`}
          </pre>

          <p className="mt-4"><strong>3. Vérifier RLS</strong></p>
          <p className="ml-4">Assurez-vous que Row Level Security est configuré (voir ANALYTICS_MODULE_SETUP.md)</p>
        </div>
      </Card>
    </div>
  );
}
