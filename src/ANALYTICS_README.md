# 📊 Module Analytics OpenUp - Guide Complet

> **Version** : 2.0  
> **Status** : ✅ Opérationnel  
> **Date** : Janvier 2025

---

## 🎯 Vue d'Ensemble

Le module Analytics d'OpenUp offre une analyse complète et en temps réel des performances de vos liens avec :
- 📈 Graphiques interactifs (Recharts)
- 🔍 Filtres avancés (date, lien, comparaison)
- 🌍 Géolocalisation (pays)
- 📱 Détection d'appareil (iOS, Android, Desktop)
- 📊 Heatmap d'engagement (jour × heure)
- 💾 Export CSV de toutes les données
- 🔒 Sécurisé avec Supabase RLS

---

## 📁 Fichiers Créés

### Code Principal
```
/components/
  ├── analytics-context.tsx        # Context React avec états globaux
  ├── analytics-page.tsx            # Page principale avec graphiques
  ├── test-analytics-simple.tsx     # Outil de diagnostic
  └── views/
      └── analytics-view.tsx        # Wrapper avec mode test

/utils/supabase/
  └── analytics-queries.tsx         # 9 requêtes Supabase optimisées
```

### Documentation
```
/ANALYTICS_MODULE_SETUP.md     # 📖 Config complète (SQL, RLS)
/TEST_ANALYTICS.md             # 🧪 Guide de test pas à pas  
/ANALYTICS_FIX_SUMMARY.md      # 🔧 Corrections apportées
/ANALYTICS_README.md           # 📚 Ce fichier
```

---

## 🚀 Démarrage Rapide (5 minutes)

### 1. Vérifier que l'App Charge

```bash
# Ouvrez l'app et connectez-vous
# Allez sur "Analytics" dans le menu
```

**✅ Si ça charge** → Passez à l'étape 2  
**❌ Si erreur** → Activez le mode test (voir section Diagnostic)

### 2. Configurer Supabase

Copiez/collez dans **Supabase SQL Editor** :

```sql
-- Tables
CREATE TABLE links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  slug TEXT UNIQUE NOT NULL,
  title TEXT,
  url TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE link_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  link_id UUID REFERENCES links(id) ON DELETE CASCADE,
  click_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  device_type TEXT,
  country TEXT,
  referer TEXT
);

-- Index pour performance
CREATE INDEX idx_link_analytics_link_id ON link_analytics(link_id);
CREATE INDEX idx_link_analytics_timestamp ON link_analytics(click_timestamp);

-- RLS
ALTER TABLE links ENABLE ROW LEVEL SECURITY;
ALTER TABLE link_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own links" ON links FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users view own analytics" ON link_analytics FOR SELECT 
  USING (EXISTS (SELECT 1 FROM links WHERE links.id = link_analytics.link_id AND links.user_id = auth.uid()));
```

### 3. Ajouter des Données de Test

```sql
-- 1 lien + 100 clics aléatoires
INSERT INTO links (user_id, slug, title, url)
VALUES (auth.uid(), 'test-youtube', 'YouTube', 'https://youtube.com');

INSERT INTO link_analytics (link_id, click_timestamp, device_type, country, referer)
SELECT 
  (SELECT id FROM links WHERE user_id = auth.uid() LIMIT 1),
  NOW() - (random() * interval '7 days'),
  (ARRAY['ios', 'android', 'desktop', 'other'])[floor(random() * 4 + 1)],
  (ARRAY['France', 'USA', 'Canada', NULL])[floor(random() * 4 + 1)],
  (ARRAY['Direct', 'instagram.com', 'twitter.com', NULL])[floor(random() * 4 + 1)]
FROM generate_series(1, 100);
```

### 4. Tester

Rechargez la page Analytics → Vous devriez voir les graphiques remplis ! 🎉

---

## 🧪 Mode Diagnostic

Si la page ne charge pas, utilisez le mode test :

### Activer le Mode Test

```typescript
// 1. Ouvrez /components/views/analytics-view.tsx

// 2. Changez cette ligne :
const testMode = true; // ← mettez true

// 3. Rechargez la page Analytics
```

### Interpréter les Résultats

La page de test affiche 4 sections :

**✅ Test 1: Authentification**
- User ID affiché → Auth OK
- Email affiché → Session OK

**✅ Test 2: App Context**  
- Links Count > 0 → Context OK
- Liste des liens → Data OK

**✅ Test 3: Supabase**
- Connected → Client OK

**✅ Test 4: Prêt pour Analytics**
- Tous tests passés → Désactivez testMode
- Erreurs → Suivez instructions affichées

---

## 📊 Fonctionnalités

### Filtres Globaux

#### 1. Date Range
- **Presets** : 24h, 7j, 30j, 90j
- **Personnalisé** : Sélection manuelle de from/to
- **Persistance** : Sauvegardé dans localStorage

#### 2. Link Selector
- **Tous les liens** : Vue globale
- **Lien spécifique** : Filtré par ID

#### 3. Compare Mode
- **Toggle** : Active/désactive la comparaison
- **Calcul auto** : Période précédente de même durée
- **Affichage** : Delta % sur les KPIs

### KPI Cards (4 cartes en haut)

1. **Total Clics**
   - Somme de tous les clics
   - Delta % vs période précédente
   - Icône : TrendingUp/Down

2. **Pays**
   - Nombre de pays uniques
   - Delta % vs période précédente
   - Icône : Globe

3. **Appareils**
   - Nombre de types d'appareils
   - Delta % vs période précédente
   - Icône : Smartphone

4. **Liens Actifs**
   - Nombre de liens actifs
   - Pas de comparaison
   - Icône : Link

### Graphiques (6 charts)

#### 1. Line Chart : Clics dans le temps
- **Données** : timeseriesClicks
- **Axe X** : Date (YYYY-MM-DD)
- **Axe Y** : Nombre de clics
- **Compare** : Ligne pointillée pour période précédente

#### 2. Bar Chart : Top Liens
- **Données** : topLinks (top 10)
- **Axe X** : Slug du lien
- **Axe Y** : Clics
- **Interaction** : Cliquer sur une barre = filtrer ce lien

#### 3. Pie Chart : Appareils
- **Données** : byDevice
- **Répartition** : iOS, Android, Desktop, Other
- **Couleurs** : Bleu, cyan, violet, rose

#### 4. Bar Chart : Pays
- **Données** : byCountry (top 15)
- **Axe X** : Nombre de clics
- **Axe Y** : Nom du pays

#### 5. Bar Chart : Sources
- **Données** : byReferrer (top 15)
- **Axe X** : Nombre de clics
- **Axe Y** : Referer (ou "Direct")

#### 6. Heatmap : Jour × Heure
- **Données** : hourlyHeatmap
- **Matrice** : 7 jours × 24 heures
- **Couleurs** : Gradient du clair au foncé
- **Tooltip** : Jour, heure, nombre de clics

### Export CSV

Chaque graphique a un bouton **"CSV"** :
- Télécharge les données brutes
- Format : CSV compatible Excel
- Nom : `{dataset}-YYYY-MM-DD.csv`

---

## 🔧 Configuration Avancée

### Ajouter un Nouveau Graphique

#### 1. Créer la Query

```typescript
// Dans /utils/supabase/analytics-queries.tsx

export const analyticsQueries = {
  // ... queries existantes
  
  async newQuery(
    userId: string,
    from: Date,
    to: Date,
    linkId?: string | null
  ): Promise<{ data: NewData[] | null; error: any }> {
    // Votre requête Supabase
  }
};
```

#### 2. Ajouter l'État

```typescript
// Dans /components/analytics-page.tsx

const [newData, setNewData] = useState<NewData[]>([]);
```

#### 3. Fetch les Données

```typescript
// Dans fetchAnalyticsData()

const newResult = await analyticsQueries.newQuery(user.id, from, to, currentLinkId);
setNewData(newResult.data || []);
```

#### 4. Créer le Chart

```typescript
<Card className="p-6">
  <div className="flex items-center justify-between mb-6">
    <h3 className="text-xl">Nouveau Graphique</h3>
    <Button onClick={() => exportToCSV(newData, 'new-data')}>
      <Download className="w-4 h-4 mr-2" /> CSV
    </Button>
  </div>
  <ResponsiveContainer width="100%" height={300}>
    {/* Votre graphique Recharts */}
  </ResponsiveContainer>
</Card>
```

### Personnaliser les Couleurs

```typescript
// Dans analytics-page.tsx

const COLORS = {
  primary: '#006EF7',      // Bleu OpenUp
  secondary: '#4FC3F7',    // Cyan
  success: '#10b981',      // Vert
  danger: '#ef4444',       // Rouge
  warning: '#f59e0b',      // Orange
  purple: '#8b5cf6',       // Violet
  pink: '#ec4899',         // Rose
  indigo: '#6366f1',       // Indigo
};
```

---

## 🐛 Résolution de Problèmes

### "Aucune donnée sur cette période"

**Causes possibles** :
1. Pas de liens créés
2. Pas de clics enregistrés
3. Période sélectionnée sans données

**Solutions** :
1. Créez des liens dans la section Liens
2. Ajoutez des clics de test (voir SQL ci-dessus)
3. Changez la période à "30 jours"

### "Failed to fetch analytics"

**Causes possibles** :
1. Tables Supabase manquantes
2. RLS mal configuré
3. Credentials incorrects

**Solutions** :
1. Exécutez le SQL de création de tables
2. Vérifiez les policies RLS
3. Vérifiez `/utils/supabase/info.tsx`

### "useAnalytics must be used within AnalyticsProvider"

**Cause** : Provider manquant dans App.tsx

**Solution** :
```typescript
// Vérifiez l'ordre dans App.tsx
<AnalyticsProvider>
  <AppContent />
</AnalyticsProvider>
```

### Page blanche sans erreur

**Cause** : Erreur React silencieuse

**Solution** :
1. Ouvrez la console (F12)
2. Regardez l'onglet Console
3. Notez l'erreur rouge
4. Activez testMode pour diagnostiquer

---

## 📖 Ressources

### Documentation Complète
- **ANALYTICS_MODULE_SETUP.md** : Config SQL, RLS, credentials
- **TEST_ANALYTICS.md** : Tests pas à pas
- **ANALYTICS_FIX_SUMMARY.md** : Corrections apportées

### Liens Externes
- [Recharts Documentation](https://recharts.org/)
- [Supabase RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)

### Composants
- `/components/analytics-context.tsx` - États globaux
- `/components/analytics-page.tsx` - UI principale
- `/components/test-analytics-simple.tsx` - Diagnostics
- `/utils/supabase/analytics-queries.tsx` - Requêtes DB

---

## ✅ Checklist de Validation

Avant de déployer en production :

- [ ] Tables créées dans Supabase
- [ ] RLS activé et policies configurées
- [ ] Index créés pour performance
- [ ] Credentials Supabase corrects
- [ ] Page charge sans erreur
- [ ] Filtres fonctionnent (date, link, compare)
- [ ] KPIs affichent les bonnes valeurs
- [ ] Graphiques se remplissent avec données
- [ ] Export CSV fonctionne
- [ ] Mode test désactivé (`testMode = false`)
- [ ] Console sans erreurs
- [ ] Responsive mobile testé
- [ ] États vides/loading testés

---

## 🎉 Félicitations !

Votre module Analytics OpenUp est maintenant **opérationnel**.

**Prochaines étapes** :
1. ✅ Personnalisez les couleurs à votre marque
2. ✅ Ajoutez des graphiques spécifiques
3. ✅ Configurez des alertes email
4. ✅ Intégrez avec d'autres services (Slack, Discord)

**Questions ?** Consultez la documentation dans les fichiers MD ou activez le mode test pour diagnostiquer.

---

**OpenUp Analytics v2.0 - Made with 💙**
