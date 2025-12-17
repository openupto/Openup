import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { useAuth } from './auth-context';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line,
  AreaChart,
  Area
} from 'recharts';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Globe,
  Smartphone,
  Eye,
  Calendar,
  ArrowUp,
  ArrowDown,
  Target,
  Crown,
  Download,
  Mail,
  Filter,
  RefreshCw,
  MapPin,
  Clock,
  MousePointer,
  Share2,
  Zap,
  Activity
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface AdvancedAnalyticsProps {
  userTier: string;
}

interface AnalyticsData {
  overview: {
    total_clicks: number;
    unique_visitors: number;
    total_views: number;
    conversion_rate: number;
    avg_session_duration: number;
    bounce_rate: number;
  };
  performance: {
    top_links: Array<{
      id: string;
      title: string;
      clicks: number;
      conversion_rate: number;
      revenue?: number;
    }>;
    top_countries: Record<string, number>;
    top_devices: Record<string, number>;
    top_browsers: Record<string, number>;
    top_referrers: Record<string, number>;
    hourly_distribution: Record<string, number>;
    daily_performance: Array<{
      date: string;
      clicks: number;
      views: number;
      conversions: number;
    }>;
  };
  audience: {
    age_groups: Record<string, number>;
    languages: Record<string, number>;
    returning_visitors: number;
    new_visitors: number;
    social_sources: Record<string, number>;
  };
  real_time: {
    active_users: number;
    recent_clicks: Array<{
      timestamp: string;
      country: string;
      device: string;
      link: string;
    }>;
    live_countries: Record<string, number>;
  };
}

export function AdvancedAnalytics({ userTier }: AdvancedAnalyticsProps) {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [selectedLink, setSelectedLink] = useState<string>('all');
  const [realTimeEnabled, setRealTimeEnabled] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);

  const COLORS = ['#3399ff', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  useEffect(() => {
    // Simuler le chargement des données analytics avancées
    const loadAdvancedAnalytics = () => {
      setLoading(true);
      
      // Données de démonstration enrichies
      const fakeData: AnalyticsData = {
        overview: {
          total_clicks: 12847,
          unique_visitors: 8934,
          total_views: 23456,
          conversion_rate: 3.2,
          avg_session_duration: 145, // en secondes
          bounce_rate: 24.5
        },
        performance: {
          top_links: [
            { id: '1', title: 'Mon Portfolio', clicks: 4523, conversion_rate: 5.2, revenue: 1250 },
            { id: '2', title: 'Boutique', clicks: 3401, conversion_rate: 4.8, revenue: 2100 },
            { id: '3', title: 'LinkedIn', clicks: 2145, conversion_rate: 2.1 },
            { id: '4', title: 'YouTube', clicks: 1876, conversion_rate: 3.8 },
            { id: '5', title: 'Instagram', clicks: 1234, conversion_rate: 1.9 }
          ],
          top_countries: {
            'France': 4521,
            'Canada': 1876,
            'Belgique': 1234,
            'Suisse': 987,
            'Maroc': 654,
            'Tunisie': 432,
            'Algérie': 321
          },
          top_devices: {
            'Mobile': 7834,
            'Desktop': 3912,
            'Tablet': 1101
          },
          top_browsers: {
            'Chrome': 6234,
            'Safari': 3456,
            'Firefox': 1876,
            'Edge': 1281
          },
          top_referrers: {
            'Direct': 5432,
            'Google': 2876,
            'LinkedIn': 1654,
            'Instagram': 1234,
            'Twitter': 987,
            'Facebook': 664
          },
          hourly_distribution: {
            '0': 45, '1': 23, '2': 12, '3': 8, '4': 15, '5': 34, '6': 67, '7': 123,
            '8': 189, '9': 234, '10': 267, '11': 298, '12': 321, '13': 287, '14': 256,
            '15': 234, '16': 198, '17': 176, '18': 145, '19': 134, '20': 112, '21': 98, '22': 76, '23': 54
          },
          daily_performance: [
            { date: '2024-01-15', clicks: 456, views: 892, conversions: 23 },
            { date: '2024-01-16', clicks: 523, views: 1043, conversions: 31 },
            { date: '2024-01-17', clicks: 612, views: 1176, conversions: 28 },
            { date: '2024-01-18', clicks: 578, views: 1098, conversions: 35 },
            { date: '2024-01-19', clicks: 689, views: 1234, conversions: 42 },
            { date: '2024-01-20', clicks: 734, views: 1345, conversions: 38 },
            { date: '2024-01-21', clicks: 812, views: 1456, conversions: 45 }
          ]
        },
        audience: {
          age_groups: {
            '18-24': 2341,
            '25-34': 4567,
            '35-44': 3123,
            '45-54': 1876,
            '55+': 1234
          },
          languages: {
            'Français': 8234,
            'English': 2876,
            'Español': 1234,
            'Deutsch': 654,
            'Italiano': 432
          },
          returning_visitors: 5432,
          new_visitors: 7415,
          social_sources: {
            'Instagram': 3456,
            'LinkedIn': 2134,
            'Twitter': 1876,
            'Facebook': 1234,
            'TikTok': 987,
            'YouTube': 654
          }
        },
        real_time: {
          active_users: 23,
          recent_clicks: [
            { timestamp: '2 min ago', country: 'France', device: 'Mobile', link: 'Portfolio' },
            { timestamp: '3 min ago', country: 'Canada', device: 'Desktop', link: 'Boutique' },
            { timestamp: '5 min ago', country: 'Belgique', device: 'Mobile', link: 'LinkedIn' },
            { timestamp: '7 min ago', country: 'Suisse', device: 'Tablet', link: 'YouTube' },
            { timestamp: '9 min ago', country: 'France', device: 'Mobile', link: 'Instagram' }
          ],
          live_countries: {
            'France': 12,
            'Canada': 5,
            'Belgique': 3,
            'Suisse': 2,
            'Maroc': 1
          }
        }
      };

      setTimeout(() => {
        setAnalytics(fakeData);
        setLoading(false);
      }, 1000);
    };

    loadAdvancedAnalytics();
  }, [selectedTimeRange, selectedLink]);

  const formatChartData = (data: Record<string, number>, limit = 5) => {
    return Object.entries(data)
      .sort(([,a], [,b]) => b - a)
      .slice(0, limit)
      .map(([name, value]) => ({ name, value }));
  };

  const exportData = async (format: 'csv' | 'pdf') => {
    if (userTier === 'free') {
      toast.error('Export disponible avec les plans payants');
      return;
    }

    toast.success(`Export ${format.toUpperCase()} démarré...`);
    // Simuler l'export
    setTimeout(() => {
      toast.success(`Données exportées en ${format.toUpperCase()}`);
    }, 2000);
  };

  const isPremiumFeature = (feature: string) => {
    const premiumFeatures = ['real-time', 'advanced-segments', 'export', 'api-access'];
    return premiumFeatures.includes(feature) && userTier !== 'premium';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse"></div>
          ))}
        </div>
        <div className="h-64 bg-gray-200 rounded-lg animate-pulse"></div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Activity className="w-16 h-16 text-slate-400 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Aucune donnée disponible</h3>
          <p className="text-slate-600 text-center">
            Les statistiques apparaîtront une fois que vous aurez des clics sur vos liens.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Contrôles */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-wrap gap-3">
          <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">24h</SelectItem>
              <SelectItem value="7d">7 jours</SelectItem>
              <SelectItem value="30d">30 jours</SelectItem>
              <SelectItem value="90d">90 jours</SelectItem>
              <SelectItem value="1y">1 an</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedLink} onValueChange={setSelectedLink}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les liens</SelectItem>
              <SelectItem value="1">Mon Portfolio</SelectItem>
              <SelectItem value="2">Boutique</SelectItem>
              <SelectItem value="3">LinkedIn</SelectItem>
              <SelectItem value="4">YouTube</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualiser
          </Button>
        </div>

        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => exportData('csv')}
            disabled={isPremiumFeature('export')}
          >
            <Download className="w-4 h-4 mr-2" />
            CSV
            {isPremiumFeature('export') && <Crown className="w-3 h-3 ml-1" />}
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => exportData('pdf')}
            disabled={isPremiumFeature('export')}
          >
            <Download className="w-4 h-4 mr-2" />
            PDF
            {isPremiumFeature('export') && <Crown className="w-3 h-3 ml-1" />}
          </Button>
        </div>
      </div>

      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clics Totaux</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#3399ff]">
              {analytics.overview.total_clicks.toLocaleString()}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowUp className="w-3 h-3 mr-1 text-green-500" />
              +18% vs période précédente
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visiteurs Uniques</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#3399ff]">
              {analytics.overview.unique_visitors.toLocaleString()}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowUp className="w-3 h-3 mr-1 text-green-500" />
              +12% vs période précédente
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux de Conversion</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#3399ff]">
              {analytics.overview.conversion_rate}%
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowUp className="w-3 h-3 mr-1 text-green-500" />
              +0.3% vs période précédente
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Temps Moyen</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#3399ff]">
              {Math.floor(analytics.overview.avg_session_duration / 60)}m {analytics.overview.avg_session_duration % 60}s
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowDown className="w-3 h-3 mr-1 text-red-500" />
              -5s vs période précédente
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Métriques temps réel */}
      {!isPremiumFeature('real-time') && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-green-600" />
                Analytics Temps Réel
                <Badge className="bg-green-100 text-green-700">LIVE</Badge>
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="real-time" className="text-sm">Activer</Label>
                <Switch 
                  id="real-time"
                  checked={realTimeEnabled}
                  onCheckedChange={setRealTimeEnabled}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {analytics.real_time.active_users}
                </div>
                <div className="text-sm text-green-700">Utilisateurs actifs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {Object.values(analytics.real_time.live_countries).reduce((a, b) => a + b, 0)}
                </div>
                <div className="text-sm text-green-700">Pays actifs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {analytics.real_time.recent_clicks.length}
                </div>
                <div className="text-sm text-green-700">Clics récents</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
          <TabsTrigger value="devices">Appareils</TabsTrigger>
          <TabsTrigger value="geographic">Géographie</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Performance Quotidienne</CardTitle>
                <CardDescription>Évolution des clics et conversions</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={analytics.performance.daily_performance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value) => new Date(value).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                    />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(value) => new Date(value).toLocaleDateString('fr-FR')}
                    />
                    <Area type="monotone" dataKey="clicks" stroke="#3399ff" fill="#3399ff" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="conversions" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Liens Performants</CardTitle>
                <CardDescription>Classement par nombre de clics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.performance.top_links.slice(0, 5).map((link, index) => (
                    <div key={link.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#3399ff] text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium">{link.title}</div>
                          <div className="text-sm text-slate-500">
                            {link.conversion_rate}% conversion
                            {link.revenue && ` • €${link.revenue}`}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-[#3399ff]">{link.clicks.toLocaleString()}</div>
                        <div className="text-xs text-slate-500">clics</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Distribution Horaire</CardTitle>
              <CardDescription>Activité par heure de la journée</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={Object.entries(analytics.performance.hourly_distribution).map(([hour, clicks]) => ({ hour: `${hour}h`, clicks }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="clicks" fill="#3399ff" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audience" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Groupes d'Âge</CardTitle>
                <CardDescription>Répartition par tranche d'âge</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={formatChartData(analytics.audience.age_groups)}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {formatChartData(analytics.audience.age_groups).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sources Sociales</CardTitle>
                <CardDescription>Trafic par réseau social</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={formatChartData(analytics.audience.social_sources)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3399ff" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Visiteurs</CardTitle>
                <CardDescription>Nouveaux vs récurrents</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Nouveaux visiteurs</span>
                    <span className="font-bold text-green-600">{analytics.audience.new_visitors.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Visiteurs récurrents</span>
                    <span className="font-bold text-blue-600">{analytics.audience.returning_visitors.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${(analytics.audience.new_visitors / (analytics.audience.new_visitors + analytics.audience.returning_visitors)) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Langues</CardTitle>
                <CardDescription>Top langues des visiteurs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {formatChartData(analytics.audience.languages, 5).map((lang, index) => (
                    <div key={lang.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span>{lang.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{lang.value.toLocaleString()}</span>
                        <Badge variant="secondary">
                          {((lang.value / analytics.overview.unique_visitors) * 100).toFixed(1)}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="devices" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Types d'Appareils</CardTitle>
                <CardDescription>Répartition par catégorie</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={formatChartData(analytics.performance.top_devices)}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {formatChartData(analytics.performance.top_devices).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Navigateurs</CardTitle>
                <CardDescription>Top navigateurs utilisés</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={formatChartData(analytics.performance.top_browsers)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3399ff" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="geographic" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Top Pays</CardTitle>
                <CardDescription>Trafic par localisation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {formatChartData(analytics.performance.top_countries, 8).map((country, index) => (
                    <div key={country.name} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <span className="font-medium">{country.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#3399ff]">{country.value.toLocaleString()}</span>
                        <Badge variant="secondary">
                          {((country.value / analytics.overview.total_clicks) * 100).toFixed(1)}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sources de Trafic</CardTitle>
                <CardDescription>D'où viennent vos visiteurs</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={formatChartData(analytics.performance.top_referrers, 6)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3399ff" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Fonction Premium - Rapports automatiques */}
      {userTier === 'premium' && (
        <Card className="border-purple-200 bg-purple-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-purple-600" />
              Rapports Automatiques
              <Badge className="bg-purple-100 text-purple-700">Premium</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-700 mb-2">
                  Recevez vos statistiques par email chaque semaine
                </p>
                <div className="flex items-center gap-2">
                  <Label htmlFor="auto-reports" className="text-sm">Rapports hebdomadaires</Label>
                  <Switch 
                    id="auto-reports"
                    checked={autoRefresh}
                    onCheckedChange={setAutoRefresh}
                  />
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Mail className="w-4 h-4 mr-2" />
                Configurer
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}