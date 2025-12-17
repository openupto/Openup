import React, { useState } from 'react';
import { MobileHeader } from './mobile-header';
import { 
  SlidersHorizontal,
  Upload,
  ChevronDown,
  Globe
} from 'lucide-react';

interface MobileAnalyticsViewProps {
  onMenuOpen: () => void;
}

export function MobileAnalyticsView({ onMenuOpen }: MobileAnalyticsViewProps) {
  const [deviceTab, setDeviceTab] = useState<'appareils' | 'os' | 'navigateur'>('appareils');
  const [locationTab, setLocationTab] = useState<'ville' | 'pays' | 'continent'>('pays');
  const [timeTab, setTimeTab] = useState<'heures' | 'jours'>('jours');

  const deviceData = [
    { name: 'Windows', count: 285, percentage: 40.0, color: '#3b82f6' },
    { name: 'MacOS', count: 198, percentage: 27.8, color: '#06b6d4' },
    { name: 'iOS', count: 134, percentage: 18.8, color: '#10b981' },
    { name: 'Android', count: 78, percentage: 11.0, color: '#f59e0b' },
    { name: 'Linux', count: 17, percentage: 2.4, color: '#ef4444' }
  ];

  const countryData = [
    { name: 'France', flag: '🇫🇷', count: 312, percentage: 43.8 },
    { name: 'Other', flag: '🌍', count: 165, percentage: 23.2 },
    { name: 'Belgium', flag: '🇧🇪', count: 89, percentage: 12.5 },
    { name: 'Switzerland', flag: '🇨🇭', count: 67, percentage: 9.4 },
    { name: 'Canada', flag: '🇨🇦', count: 45, percentage: 6.3 }
  ];

  const dailyData = [
    { day: 'Lundi', clicks: 2500, height: 50 },
    { day: 'Mardi', clicks: 3000, height: 60 },
    { day: 'Mercredi', clicks: 3500, height: 70 },
    { day: 'Jeudi', clicks: 3000, height: 60 },
    { day: 'Vendredi', clicks: 4200, height: 84 },
    { day: 'Samedi', clicks: 4700, height: 94 },
    { day: 'Dimanche', clicks: 3800, height: 76 }
  ];

  const topDays = [
    { name: 'Samedi', count: 312, percentage: 43.8, color: '#0066ff' },
    { name: 'Vendredi', count: 245, percentage: 34.5, color: '#0066ff' },
    { name: 'Dimanche', count: 156, percentage: 22.0, color: '#0066ff' }
  ];

  const sourcesData = [
    { 
      name: 'Instagram', 
      count: 312, 
      percentage: 43.8,
      icon: 'instagram',
      color: '#E4405F'
    },
    { 
      name: 'X', 
      count: 165, 
      percentage: 23.2,
      icon: 'x',
      color: '#000000'
    },
    { 
      name: 'Facebook', 
      count: 89, 
      percentage: 12.5,
      icon: 'facebook',
      color: '#1877F2'
    },
    { 
      name: 'Linkedin', 
      count: 67, 
      percentage: 9.4,
      icon: 'linkedin',
      color: '#0A66C2'
    },
    { 
      name: 'Internet', 
      count: 45, 
      percentage: 6.3,
      icon: 'internet',
      color: '#6B7280'
    }
  ];

  const renderSourceIcon = (iconName: string, color: string) => {
    switch (iconName) {
      case 'instagram':
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill={color}>
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        );
      case 'x':
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill={color}>
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        );
      case 'facebook':
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill={color}>
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        );
      case 'linkedin':
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill={color}>
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        );
      case 'internet':
        return <Globe className="w-4 h-4" style={{ color }} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <MobileHeader 
        onMenuOpen={onMenuOpen}
        subscriptionTier="starter"
      />

      {/* Content */}
      <div className="space-y-4 sm:space-y-6 pb-6 no-scrollbar">
        {/* Filtres en haut */}
        <div className="px-4 sm:px-6 md:px-8 pt-4 space-y-3 max-w-5xl mx-auto">
        {/* Dropdowns */}
        <div className="flex gap-3">
          <button className="flex-1 bg-[#f5f5f5] rounded-xl px-4 py-3 flex items-center justify-between">
            <span className="text-sm text-gray-900">30 derniers jours</span>
            <ChevronDown className="w-4 h-4 text-gray-600" />
          </button>
          <button className="flex-1 bg-[#f5f5f5] rounded-xl px-4 py-3 flex items-center justify-between">
            <span className="text-sm text-gray-900">Tous les liens</span>
            <ChevronDown className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <button className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-center justify-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-gray-900" />
            <span className="text-sm text-gray-900">Filter</span>
          </button>
          <button className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-center justify-center gap-2">
            <Upload className="w-4 h-4 text-gray-900" />
            <span className="text-sm text-gray-900">Exporter les données</span>
          </button>
        </div>
      </div>

      {/* Tabs Appareils/OS/Navigateur */}
      <div className="px-4 sm:px-6 md:px-8">
        <div className="bg-[#f5f5f5] rounded-xl p-1 flex gap-1 max-w-5xl mx-auto">
          <button
            onClick={() => setDeviceTab('appareils')}
            className={`flex-1 py-2.5 px-4 rounded-lg text-sm transition-colors ${
              deviceTab === 'appareils'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600'
            }`}
          >
            Appareils
          </button>
          <button
            onClick={() => setDeviceTab('os')}
            className={`flex-1 py-2.5 px-4 rounded-lg text-sm transition-colors ${
              deviceTab === 'os'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600'
            }`}
          >
            OS
          </button>
          <button
            onClick={() => setDeviceTab('navigateur')}
            className={`flex-1 py-2.5 px-4 rounded-lg text-sm transition-colors ${
              deviceTab === 'navigateur'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600'
            }`}
          >
            Navigateur
          </button>
        </div>
      </div>

      {/* Stats Card - Clics par type d'appareil */}
      <div className="px-4 sm:px-6 md:px-8">
        <div className="bg-white rounded-2xl p-4 sm:p-6 md:p-7 shadow-sm border border-gray-100 max-w-5xl mx-auto">
          <h3 className="text-base text-gray-900 mb-4">Clics par type d'appareil :</h3>
          
          <div className="space-y-3">
            {deviceData.map((device, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: device.color }}
                  />
                  <span className="text-sm text-gray-900">{device.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-900">{device.count}</span>
                  <span className="text-sm text-gray-500 min-w-[45px] text-right">{device.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs Ville/Pays/Continent */}
      <div className="px-4 sm:px-6 md:px-8">
        <div className="bg-[#f5f5f5] rounded-xl p-1 flex gap-1 max-w-5xl mx-auto">
          <button
            onClick={() => setLocationTab('ville')}
            className={`flex-1 py-2.5 px-4 rounded-lg text-sm transition-colors ${
              locationTab === 'ville'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600'
            }`}
          >
            Ville
          </button>
          <button
            onClick={() => setLocationTab('pays')}
            className={`flex-1 py-2.5 px-4 rounded-lg text-sm transition-colors ${
              locationTab === 'pays'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600'
            }`}
          >
            Pays
          </button>
          <button
            onClick={() => setLocationTab('continent')}
            className={`flex-1 py-2.5 px-4 rounded-lg text-sm transition-colors ${
              locationTab === 'continent'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600'
            }`}
          >
            Continent
          </button>
        </div>
      </div>

      {/* Stats Card - Top clics par pays */}
      <div className="px-4 sm:px-6 md:px-8">
        <div className="bg-white rounded-2xl p-4 sm:p-6 md:p-7 shadow-sm border border-gray-100 max-w-5xl mx-auto">
          <h3 className="text-base text-gray-900 mb-4">Top clics par pays :</h3>
          
          <div className="space-y-3">
            {countryData.map((country, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{country.flag}</span>
                  <span className="text-sm text-gray-900">{country.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-900">{country.count}</span>
                  <span className="text-sm text-gray-500 min-w-[45px] text-right">{country.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs Heures/Jours */}
      <div className="px-4 sm:px-6 md:px-8">
        <div className="bg-[#f5f5f5] rounded-xl p-1 flex gap-1 max-w-5xl mx-auto">
          <button
            onClick={() => setTimeTab('heures')}
            className={`flex-1 py-2.5 px-4 rounded-lg text-sm transition-colors ${
              timeTab === 'heures'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600'
            }`}
          >
            Heures
          </button>
          <button
            onClick={() => setTimeTab('jours')}
            className={`flex-1 py-2.5 px-4 rounded-lg text-sm transition-colors ${
              timeTab === 'jours'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600'
            }`}
          >
            Jours
          </button>
        </div>
      </div>

      {/* Chart - Clics par jour */}
      {timeTab === 'jours' && (
        <div className="px-4 sm:px-6 md:px-8">
          <div className="bg-white rounded-2xl p-4 sm:p-6 md:p-7 shadow-sm border border-gray-100 max-w-5xl mx-auto">
            <h3 className="text-base text-gray-900 mb-4">Clics par jour :</h3>
            
            {/* Graph */}
            <div className="mb-6">
              <div className="flex items-end justify-between gap-2 h-48 relative">
                {/* Y-axis labels */}
                <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-xs text-gray-500">
                  <span>5000</span>
                  <span>4000</span>
                  <span>3000</span>
                  <span>2000</span>
                  <span>1000</span>
                  <span>0</span>
                </div>
                
                {/* Bars */}
                <div className="flex-1 flex items-end justify-between gap-1 ml-8">
                  {dailyData.map((data, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full flex items-end h-40">
                        <div 
                          className="w-full bg-[#0066ff] rounded-t transition-all"
                          style={{ height: `${data.height}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-900">
                        {data.day.substring(0, 3)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Top 3 jours */}
            <div>
              <h4 className="text-base text-gray-900 mb-3">Top 3 jours :</h4>
              <div className="space-y-3">
                {topDays.map((day, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-2 h-2 rounded-full" 
                        style={{ backgroundColor: day.color }}
                      />
                      <span className="text-sm text-gray-900">{day.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-900">{day.count}</span>
                      <span className="text-sm text-gray-500 min-w-[45px] text-right">{day.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Section Sources */}
      <div className="px-4 sm:px-6 md:px-8">
        <div className="bg-white rounded-2xl py-3 shadow-sm border border-gray-100 max-w-5xl mx-auto">
          <h3 className="text-center text-base text-gray-900 px-4">Sources</h3>
        </div>
      </div>

      {/* Sources des clics */}
      <div className="px-4 sm:px-6 md:px-8">
        <div className="bg-white rounded-2xl p-4 sm:p-6 md:p-7 shadow-sm border border-gray-100 max-w-5xl mx-auto">
          <h3 className="text-base text-gray-900 mb-4">Sources des clics :</h3>
          
          <div className="space-y-3">
            {sourcesData.map((source, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 flex items-center justify-center">
                    {renderSourceIcon(source.icon, source.color)}
                  </div>
                  <span className="text-sm text-gray-900">{source.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-900">{source.count}</span>
                  <span className="text-sm text-gray-500 min-w-[45px] text-right">{source.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
