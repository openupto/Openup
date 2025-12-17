import { useState, useEffect } from 'react';
import { useAuth } from './auth-context';
import { useAnalytics } from './analytics-context';
import { analyticsQueries, exportToCSV } from '../utils/supabase/analytics-queries';
import type { TimeseriesData, HeatmapData, DeviceData, CountryData, TopLinkData, ReferrerData } from '../utils/supabase/analytics-queries';
import { useApp } from './app-context';
import { Calendar, TrendingUp, TrendingDown, Download, BarChart3, Globe, Smartphone, Link as LinkIcon, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Skeleton } from './ui/skeleton';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar as CalendarComponent } from './ui/calendar';
import { toast } from 'sonner@2.0.3';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Colors
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

const DEVICE_COLORS = ['#006EF7', '#4FC3F7', '#8b5cf6', '#ec4899'];

export function AnalyticsPage() {
  const { user } = useAuth();
  const { links } = useApp();
  const { filters, setDateRange, setCurrentLinkId, setCompareEnabled, applyPreset, loading, setLoading, error, setError, previousPeriodRange } = useAnalytics();

  // Data states
  const [timeseriesData, setTimeseriesData] = useState<TimeseriesData[]>([]);
  const [previousTimeseriesData, setPreviousTimeseriesData] = useState<TimeseriesData[]>([]);
  const [heatmapData, setHeatmapData] = useState<HeatmapData[]>([]);
  const [deviceData, setDeviceData] = useState<DeviceData[]>([]);
  const [countryData, setCountryData] = useState<CountryData[]>([]);
  const [topLinksData, setTopLinksData] = useState<TopLinkData[]>([]);
  const [referrerData, setReferrerData] = useState<ReferrerData[]>([]);

  // KPI states
  const [totalClicks, setTotalClicks] = useState(0);
  const [previousTotalClicks, setPreviousTotalClicks] = useState(0);
  const [distinctCountries, setDistinctCountries] = useState(0);
  const [previousDistinctCountries, setPreviousDistinctCountries] = useState(0);
  const [distinctDevices, setDistinctDevices] = useState(0);
  const [previousDistinctDevices, setPreviousDistinctDevices] = useState(0);

  // UI states
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Fetch all analytics data
  const fetchAnalyticsData = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const { from, to, currentLinkId } = filters;

      // Fetch current period data
      const [
        timeseriesResult,
        heatmapResult,
        deviceResult,
        countryResult,
        topLinksResult,
        referrerResult,
        totalClicksResult,
        distinctCountriesResult,
        distinctDevicesResult,
      ] = await Promise.all([
        analyticsQueries.timeseriesClicks(user.id, from, to, currentLinkId),
        analyticsQueries.hourlyHeatmap(user.id, from, to, currentLinkId),
        analyticsQueries.byDevice(user.id, from, to, currentLinkId),
        analyticsQueries.byCountry(user.id, from, to, currentLinkId),
        analyticsQueries.topLinks(user.id, from, to, 10),
        analyticsQueries.byReferrer(user.id, from, to, currentLinkId),
        analyticsQueries.totalClicks(user.id, from, to, currentLinkId),
        analyticsQueries.distinctCountries(user.id, from, to, currentLinkId),
        analyticsQueries.distinctDevices(user.id, from, to, currentLinkId),
      ]);

      if (timeseriesResult.error) throw timeseriesResult.error;
      if (heatmapResult.error) throw heatmapResult.error;
      if (deviceResult.error) throw deviceResult.error;
      if (countryResult.error) throw countryResult.error;
      if (topLinksResult.error) throw topLinksResult.error;
      if (referrerResult.error) throw referrerResult.error;

      setTimeseriesData(timeseriesResult.data || []);
      setHeatmapData(heatmapResult.data || []);
      setDeviceData(deviceResult.data || []);
      setCountryData(countryResult.data || []);
      setTopLinksData(topLinksResult.data || []);
      setReferrerData(referrerResult.data || []);
      setTotalClicks(totalClicksResult.data);
      setDistinctCountries(distinctCountriesResult.data);
      setDistinctDevices(distinctDevicesResult.data);

      // Fetch previous period data if compare is enabled
      if (filters.compareEnabled && previousPeriodRange) {
        const [
          prevTimeseriesResult,
          prevTotalClicksResult,
          prevDistinctCountriesResult,
          prevDistinctDevicesResult,
        ] = await Promise.all([
          analyticsQueries.timeseriesClicks(user.id, previousPeriodRange.from, previousPeriodRange.to, currentLinkId),
          analyticsQueries.totalClicks(user.id, previousPeriodRange.from, previousPeriodRange.to, currentLinkId),
          analyticsQueries.distinctCountries(user.id, previousPeriodRange.from, previousPeriodRange.to, currentLinkId),
          analyticsQueries.distinctDevices(user.id, previousPeriodRange.from, previousPeriodRange.to, currentLinkId),
        ]);

        setPreviousTimeseriesData(prevTimeseriesResult.data || []);
        setPreviousTotalClicks(prevTotalClicksResult.data);
        setPreviousDistinctCountries(prevDistinctCountriesResult.data);
        setPreviousDistinctDevices(prevDistinctDevicesResult.data);
      }
    } catch (err: any) {
      console.error('Error fetching analytics:', err);
      setError(err.message || 'Erreur lors du chargement des données');
      toast.error('Erreur lors du chargement des analytics');
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on mount and when filters change
  useEffect(() => {
    if (user) {
      fetchAnalyticsData();
    }
  }, [user, filters]);

  // Calculate percentage change
  const calculateChange = (current: number, previous: number): { percent: number; isPositive: boolean } => {
    if (previous === 0) return { percent: current > 0 ? 100 : 0, isPositive: current > 0 };
    const percent = ((current - previous) / previous) * 100;
    return { percent: Math.abs(percent), isPositive: percent >= 0 };
  };

  // Format number
  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl">Analytics</h1>
          <p className="text-gray-500 mt-1">Analysez les performances de vos liens</p>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Date Range Presets */}
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={filters.from.getTime() === new Date(Date.now() - 24 * 60 * 60 * 1000).getTime() ? 'default' : 'outline'}
              size="sm"
              onClick={() => applyPreset('24h')}
            >
              24h
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => applyPreset('7d')}
            >
              7 jours
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => applyPreset('30d')}
            >
              30 jours
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => applyPreset('90d')}
            >
              90 jours
            </Button>

            {/* Custom Date Picker */}
            <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  <Calendar className="w-4 h-4 mr-2" />
                  Personnalisé
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <div className="p-4 space-y-4">
                  <div>
                    <Label>Date de début</Label>
                    <input
                      type="date"
                      value={filters.from.toISOString().split('T')[0]}
                      onChange={(e) => {
                        const newFrom = new Date(e.target.value);
                        setDateRange(newFrom, filters.to);
                      }}
                      className="w-full mt-1 px-3 py-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <Label>Date de fin</Label>
                    <input
                      type="date"
                      value={filters.to.toISOString().split('T')[0]}
                      onChange={(e) => {
                        const newTo = new Date(e.target.value);
                        setDateRange(filters.from, newTo);
                      }}
                      className="w-full mt-1 px-3 py-2 border rounded-md"
                    />
                  </div>
                  <Button onClick={() => setShowDatePicker(false)} className="w-full">
                    Appliquer
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Link Selector */}
          <Select
            value={filters.currentLinkId || 'all'}
            onValueChange={(value) => setCurrentLinkId(value === 'all' ? null : value)}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Tous les liens" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les liens</SelectItem>
              {links.map((link) => (
                <SelectItem key={link.id} value={link.id}>
                  {link.slug || link.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Compare Toggle */}
          <div className="flex items-center space-x-2 ml-auto">
            <Switch
              id="compare"
              checked={filters.compareEnabled}
              onCheckedChange={setCompareEnabled}
            />
            <Label htmlFor="compare">Comparer périodes</Label>
          </div>
        </div>
      </Card>

      {/* Error State */}
      {error && (
        <Card className="p-4 bg-red-50 border-red-200">
          <p className="text-red-600">{error}</p>
        </Card>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Clics"
          value={totalClicks}
          icon={<BarChart3 className="w-5 h-5" />}
          change={filters.compareEnabled ? calculateChange(totalClicks, previousTotalClicks) : null}
          loading={loading}
        />
        <KPICard
          title="Pays"
          value={distinctCountries}
          icon={<Globe className="w-5 h-5" />}
          change={filters.compareEnabled ? calculateChange(distinctCountries, previousDistinctCountries) : null}
          loading={loading}
        />
        <KPICard
          title="Appareils"
          value={distinctDevices}
          icon={<Smartphone className="w-5 h-5" />}
          change={filters.compareEnabled ? calculateChange(distinctDevices, previousDistinctDevices) : null}
          loading={loading}
        />
        <KPICard
          title="Liens Actifs"
          value={links.filter(l => l.isActive).length}
          icon={<LinkIcon className="w-5 h-5" />}
          loading={loading}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Timeseries Chart */}
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl">Clics dans le temps</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportToCSV(timeseriesData, 'clicks-timeseries')}
              disabled={timeseriesData.length === 0}
            >
              <Download className="w-4 h-4 mr-2" />
              CSV
            </Button>
          </div>
          {loading ? (
            <Skeleton className="h-[300px]" />
          ) : timeseriesData.length === 0 ? (
            <div className="h-[300px] flex items-center justify-center text-gray-400">
              Aucune donnée sur cette période
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timeseriesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="clicks" stroke={COLORS.primary} strokeWidth={2} name="Clics" />
                {filters.compareEnabled && previousTimeseriesData.length > 0 && (
                  <Line
                    type="monotone"
                    dataKey="clicks"
                    data={previousTimeseriesData}
                    stroke={COLORS.secondary}
                    strokeDasharray="5 5"
                    name="Période précédente"
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          )}
        </Card>

        {/* Top Links */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl">Top Liens</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportToCSV(topLinksData, 'top-links')}
              disabled={topLinksData.length === 0}
            >
              <Download className="w-4 h-4 mr-2" />
              CSV
            </Button>
          </div>
          {loading ? (
            <Skeleton className="h-[300px]" />
          ) : topLinksData.length === 0 ? (
            <div className="h-[300px] flex items-center justify-center text-gray-400">
              Aucune donnée
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topLinksData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="slug" type="category" width={100} />
                <Tooltip />
                <Bar
                  dataKey="clicks"
                  fill={COLORS.primary}
                  onClick={(data) => setCurrentLinkId(data.link_id)}
                  cursor="pointer"
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>

        {/* Devices Pie Chart */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl">Appareils</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportToCSV(deviceData, 'devices')}
              disabled={deviceData.length === 0}
            >
              <Download className="w-4 h-4 mr-2" />
              CSV
            </Button>
          </div>
          {loading ? (
            <Skeleton className="h-[300px]" />
          ) : deviceData.length === 0 ? (
            <div className="h-[300px] flex items-center justify-center text-gray-400">
              Aucune donnée
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={deviceData}
                  dataKey="clicks"
                  nameKey="device"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {deviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={DEVICE_COLORS[index % DEVICE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </Card>

        {/* Top Countries */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl">Pays</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportToCSV(countryData, 'countries')}
              disabled={countryData.length === 0}
            >
              <Download className="w-4 h-4 mr-2" />
              CSV
            </Button>
          </div>
          {loading ? (
            <Skeleton className="h-[300px]" />
          ) : countryData.length === 0 ? (
            <div className="h-[300px] flex items-center justify-center text-gray-400">
              Aucune donnée
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={countryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="country" type="category" width={80} />
                <Tooltip />
                <Bar dataKey="clicks" fill={COLORS.secondary} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>

        {/* Top Referrers */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl">Sources de trafic</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportToCSV(referrerData, 'referrers')}
              disabled={referrerData.length === 0}
            >
              <Download className="w-4 h-4 mr-2" />
              CSV
            </Button>
          </div>
          {loading ? (
            <Skeleton className="h-[300px]" />
          ) : referrerData.length === 0 ? (
            <div className="h-[300px] flex items-center justify-center text-gray-400">
              Aucune donnée
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={referrerData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="referer" type="category" width={120} />
                <Tooltip />
                <Bar dataKey="clicks" fill={COLORS.purple} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>

        {/* Heatmap */}
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl">Engagement par Jour & Heure</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportToCSV(heatmapData, 'heatmap')}
              disabled={heatmapData.length === 0}
            >
              <Download className="w-4 h-4 mr-2" />
              CSV
            </Button>
          </div>
          {loading ? (
            <Skeleton className="h-[400px]" />
          ) : heatmapData.length === 0 ? (
            <div className="h-[400px] flex items-center justify-center text-gray-400">
              Aucune donnée
            </div>
          ) : (
            <HeatmapChart data={heatmapData} />
          )}
        </Card>
      </div>
    </div>
  );
}

// KPI Card Component
interface KPICardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  change?: { percent: number; isPositive: boolean } | null;
  loading?: boolean;
}

function KPICard({ title, value, icon, change, loading }: KPICardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-500">{title}</span>
        <div className="text-gray-400">{icon}</div>
      </div>
      {loading ? (
        <Skeleton className="h-8 w-24" />
      ) : (
        <div className="text-3xl mb-2">{value.toLocaleString()}</div>
      )}
      {change && !loading && (
        <div className={`flex items-center text-sm ${change.isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {change.isPositive ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
          {change.percent.toFixed(1)}% vs période précédente
        </div>
      )}
    </Card>
  );
}

// Heatmap Component
interface HeatmapChartProps {
  data: HeatmapData[];
}

function HeatmapChart({ data }: HeatmapChartProps) {
  const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Create matrix
  const matrix: number[][] = Array.from({ length: 7 }, () => Array(24).fill(0));
  
  data.forEach(({ dow, hour, clicks }) => {
    matrix[dow][hour] = clicks;
  });

  // Find max for color scale
  const maxClicks = Math.max(...data.map(d => d.clicks));

  const getColor = (clicks: number) => {
    if (clicks === 0) return '#f3f4f6';
    const intensity = clicks / maxClicks;
    if (intensity > 0.75) return '#006EF7';
    if (intensity > 0.5) return '#4FC3F7';
    if (intensity > 0.25) return '#93C5FD';
    return '#DBEAFE';
  };

  return (
    <div className="overflow-x-auto">
      <div className="inline-block min-w-full">
        <div className="flex">
          <div className="flex flex-col justify-around w-12">
            {days.map((day) => (
              <div key={day} className="text-xs text-gray-500 h-8 flex items-center">
                {day}
              </div>
            ))}
          </div>
          <div className="flex-1">
            <div className="flex justify-between mb-1 text-xs text-gray-500">
              {[0, 6, 12, 18, 23].map((hour) => (
                <span key={hour}>{hour}h</span>
              ))}
            </div>
            <div className="space-y-1">
              {matrix.map((row, dowIndex) => (
                <div key={dowIndex} className="flex gap-1">
                  {row.map((clicks, hourIndex) => (
                    <div
                      key={`${dowIndex}-${hourIndex}`}
                      className="h-8 flex-1 rounded transition-colors hover:ring-2 hover:ring-blue-500"
                      style={{ backgroundColor: getColor(clicks) }}
                      title={`${days[dowIndex]} ${hourIndex}h: ${clicks} clics`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
