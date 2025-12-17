import React from 'react';
import { Card } from './ui/card';
import { Link2, Eye, MousePointer } from 'lucide-react';

interface DashboardWelcomeProps {
  userData: any;
}

export function DashboardWelcome({ userData }: DashboardWelcomeProps) {
  // Données d'exemple pour les statistiques
  const stats = [
    {
      label: 'Links',
      value: '5',
      icon: Link2,
      color: 'text-blue-600'
    },
    {
      label: 'Vues',
      value: '1,247',
      icon: Eye,
      color: 'text-green-600'
    },
    {
      label: 'Clics',
      value: '892',
      icon: MousePointer,
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Welcome Card */}
      <Card className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Welcome back, {userData?.name || 'Demo User'}!
        </h2>
        <p className="text-gray-600">
          Manage your link page and track your audience engagement.
        </p>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {stat.label}
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-lg bg-gray-50 ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}