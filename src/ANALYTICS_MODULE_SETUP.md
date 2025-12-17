# 📊 Module Analytics OpenUp - Configuration Complète

## ✅ Ce qui a été créé

### 1. Context Analytics (`/components/analytics-context.tsx`)
Gère l'état global du module Analytics avec :
- **Filtres** : Date range (from/to), Link ID, Compare mode
- **États** : Loading, Error
- **Actions** : Presets (24h, 7j, 30j, 90j), Reset
- **Persistance** : LocalStorage automatique

### 2. Requêtes Supabase (`/utils/supabase/analytics-queries.tsx`)
8 requêtes optimisées avec RLS :
- `timeseriesClicks` - Séries temporelles par jour
- `hourlyHeatmap` - Heatmap jour×heure (7×24)
- `byDevice` - Répartition par appareil
- `byCountry` - Top 15 pays
- `topLinks` - Top 10 liens avec slugs
- `byReferrer` - Top 15 sources de trafic
- `totalClicks` - Total de clics
- `distinctCountries` - Nombre de pays uniques
- `distinctDevices` - Nombre d'appareils uniques
- `exportToCSV` - Export CSV pour chaque dataset

### 3. Page Analytics (`/components/analytics-page.tsx`)
Interface complète avec :
- **Filtres globaux** : Date picker, Link selector, Compare toggle
- **4 KPI Cards** : Clics, Pays, Appareils, Liens (avec delta %)
- **6 Graphiques** :
  - Line chart : Clics dans le temps
  - Bar chart : Top liens (cliquable)
  - Pie chart : Appareils
  - Bar chart : Pays
  - Bar chart : Sources
  - Heatmap : Engagement jour×heure
- **Boutons Export CSV** sur chaque graphique
- **États** : Loading (skeletons), Empty, Error

### 4. Intégration
- ✅ `AnalyticsProvider` ajouté dans `App.tsx`
- ✅ `AnalyticsView` mise à jour dans `/components/views/`

---

## 🔧 Configuration Requise

### 1. Tables Supabase

Vous devez créer ces tables dans votre base Supabase :

```sql
-- Table des liens
CREATE TABLE links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  slug TEXT UNIQUE NOT NULL,
  title TEXT,
  url TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des analytics
CREATE TABLE link_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  link_id UUID REFERENCES links(id) ON DELETE CASCADE,
  click_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  device_type TEXT, -- 'ios', 'android', 'desktop', 'other'
  country TEXT,
  referer TEXT,
  user_agent TEXT
);

-- Index pour performance
CREATE INDEX idx_link_analytics_link_id ON link_analytics(link_id);
CREATE INDEX idx_link_analytics_timestamp ON link_analytics(click_timestamp);
CREATE INDEX idx_link_analytics_country ON link_analytics(country);
CREATE INDEX idx_link_analytics_device ON link_analytics(device_type);
CREATE INDEX idx_links_user_id ON links(user_id);
```

### 2. Row Level Security (RLS)

Activez RLS sur les tables et ajoutez ces policies :

```sql
-- RLS pour links
ALTER TABLE links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own links"
  ON links FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own links"
  ON links FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own links"
  ON links FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own links"
  ON links FOR DELETE
  USING (auth.uid() = user_id);

-- RLS pour link_analytics
ALTER TABLE link_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view analytics for their links"
  ON link_analytics FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM links
      WHERE links.id = link_analytics.link_id
      AND links.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can insert analytics"
  ON link_analytics FOR INSERT
  WITH CHECK (true); -- Les clics publics peuvent insérer
```

### 3. Credentials Supabase

Vérifiez que `/utils/supabase/info.tsx` contient vos credentials :

```typescript
export const projectId = "votre-project-id"
export const publicAnonKey = "votre-anon-key"
```

---

## 🚀 Comment Tester

### 1. Navigation
Allez dans l'app et cliquez sur **"Analytics"** dans le menu latéral.

### 2. Ajout de Données de Test

Pour tester avec des données, insérez manuellement dans Supabase :

```sql
-- Créer un lien test
INSERT INTO links (user_id, slug, title, url)
VALUES (
  'YOUR_USER_ID', -- Remplacez par votre user_id
  'test-youtube',
  'Ma Chaîne YouTube',
  'https://youtube.com/@exemple'
);

-- Ajouter des clics test
INSERT INTO link_analytics (link_id, click_timestamp, device_type, country, referer)
SELECT 
  (SELECT id FROM links WHERE slug = 'test-youtube'),
  NOW() - (random() * interval '30 days'),
  (ARRAY['ios', 'android', 'desktop', 'other'])[floor(random() * 4 + 1)],
  (ARRAY['France', 'USA', 'Canada', 'Belgium', NULL])[floor(random() * 5 + 1)],
  (ARRAY['Direct', 'instagram.com', 'twitter.com', 'facebook.com', NULL])[floor(random() * 5 + 1)]
FROM generate_series(1, 500); -- Génère 500 clics aléatoires
```

### 3. Filtres à Tester

- **Presets** : 24h, 7j, 30j, 90j
- **Date personnalisée** : Cliquez sur "Personnalisé"
- **Sélecteur de lien** : Filtrer par lien spécifique ou "Tous"
- **Comparaison** : Toggle "Comparer périodes" pour voir les deltas

### 4. Exports

Cliquez sur les boutons **"CSV"** pour exporter chaque dataset.

---

## 🐛 Débogage

### Erreur : "No data"
✅ **Solution** : Vérifiez que :
- Vous avez des liens créés
- Vous avez des analytics dans `link_analytics`
- RLS est configuré correctement
- Votre `user_id` correspond

### Erreur : "RLS policy violation"
✅ **Solution** : Vérifiez les policies RLS ci-dessus

### Erreur : "Failed to fetch"
✅ **Solution** : 
- Vérifiez la connexion Supabase dans `/utils/supabase/client.tsx`
- Vérifiez les credentials dans `/utils/supabase/info.tsx`
- Testez la connexion dans la console Supabase

### Erreur de console JavaScript
✅ **Solution** : Ouvrez la console navigateur (F12) et regardez les erreurs détaillées

---

## 📊 Structure des Données

### Flux Analytics

```
1. User clique sur un lien → /u/slug
2. PublicProfile enregistre dans link_analytics
3. AnalyticsPage query link_analytics avec filters
4. Groupement côté client (Supabase limitations)
5. Affichage dans Recharts
```

### Performance

- **Groupement** : Client-side (Supabase n'a pas date_trunc en JS)
- **Limite** : Top 15 pour pays/referrers, Top 10 pour liens
- **Index** : Sur link_id, timestamp, country, device_type
- **Cache** : LocalStorage pour les filtres

---

## 🎨 Personnalisation

### Couleurs

Les couleurs sont définies dans `analytics-page.tsx` :

```typescript
const COLORS = {
  primary: '#006EF7',
  secondary: '#4FC3F7',
  success: '#10b981',
  danger: '#ef4444',
  warning: '#f59e0b',
  purple: '#8b5cf6',
  pink: '#ec4899',
  indigo: '#6366f1',
};
```

### Ajouter un Nouveau Graphique

1. Créer une nouvelle query dans `analytics-queries.tsx`
2. Ajouter un état dans `analytics-page.tsx`
3. Fetch dans `fetchAnalyticsData()`
4. Créer le composant graphique Recharts

---

## 🔗 Liens Utiles

- **Recharts Docs** : https://recharts.org/
- **Supabase RLS** : https://supabase.com/docs/guides/auth/row-level-security
- **Supabase Queries** : https://supabase.com/docs/reference/javascript

---

## ✅ Checklist de Mise en Production

- [ ] Tables créées dans Supabase
- [ ] RLS activé et policies configurées
- [ ] Index créés pour performance
- [ ] Credentials Supabase configurés
- [ ] Tests avec données réelles
- [ ] Export CSV fonctionnel
- [ ] Filtres et presets testés
- [ ] Mode comparaison testé
- [ ] Responsive mobile testé
- [ ] États vides/erreurs testés

---

**🎉 Module Analytics OpenUp est maintenant prêt !**

Pour toute question, référez-vous à ce document ou consultez les fichiers :
- `/components/analytics-context.tsx`
- `/components/analytics-page.tsx`
- `/utils/supabase/analytics-queries.tsx`
