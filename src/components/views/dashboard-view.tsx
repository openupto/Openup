import { Plus, TrendingUp, Link2, Eye, QrCode, ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

interface DashboardViewProps {
  onCreateLink?: () => void;
  onNavigate?: (view: string) => void;
  isMobile?: boolean;
}

export function DashboardView({ onCreateLink, onNavigate, isMobile = false }: DashboardViewProps) {
  const stats = [
    { label: 'Total de liens', value: '12', icon: Link2, color: 'text-blue-500' },
    { label: 'Clics totaux', value: '834K', icon: Eye, color: 'text-green-500' },
    { label: 'QR Codes', value: '5', icon: QrCode, color: 'text-purple-500' },
    { label: 'Taux de clic', value: '12.4%', icon: TrendingUp, color: 'text-orange-500' }
  ];

  const recentLinks = [
    { title: 'Mon Portfolio', clicks: '1,2K', date: 'Il y a 2h' },
    { title: 'Lien tiktok', clicks: '946', date: 'Il y a 5h' },
    { title: 'Youtube', clicks: '604K', date: 'Hier' }
  ];

  return (
    <div className={`${isMobile ? 'px-4 py-6' : 'p-8'} bg-white dark:bg-gray-900 min-h-full`}>
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-gray-900 dark:text-white mb-2">Tableau de bord</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Bienvenue sur OpenUp
        </p>
      </div>

      {/* Quick Action */}
      <Button
        onClick={onCreateLink}
        className="w-full bg-[#3399ff] hover:bg-[#2680e6] text-white rounded-xl h-14 flex items-center justify-center gap-2 mb-6"
      >
        <Plus className="w-5 h-5" strokeWidth={2.5} />
        <span>Créer un nouveau lien</span>
      </Button>

      {/* Stats Grid */}
      <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-4'} gap-4 mb-8`}>
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-4 bg-gray-50 dark:bg-gray-800 border-0">
              <div className="flex items-start justify-between mb-2">
                <div className={`w-10 h-10 rounded-xl bg-white dark:bg-gray-900 flex items-center justify-center ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="text-2xl font-semibold text-gray-900 dark:text-white mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {stat.label}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Recent Links */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-gray-900 dark:text-white">Liens récents</h2>
          <button
            onClick={() => onNavigate?.('links')}
            className="text-[#3399ff] hover:underline text-sm flex items-center gap-1"
          >
            Voir tout
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-3">
          {recentLinks.map((link, index) => (
            <div
              key={index}
              className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-gray-900 dark:text-white mb-1">{link.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{link.date}</p>
                </div>
                <div className="text-right">
                  <div className="text-gray-900 dark:text-white">{link.clicks}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">clics</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
