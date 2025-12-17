import React, { useState } from 'react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { 
  Search,
  ExternalLink,
  Instagram,
  Youtube,
  Twitter,
  Globe,
  SlidersHorizontal,
  Eye,
  MoreVertical
} from 'lucide-react';

interface LinkItem {
  id: string;
  title: string;
  url: string;
  icon: any;
  clicks: number;
  isActive: boolean;
  date: string;
}

const demoLinks: LinkItem[] = [
  {
    id: '1',
    title: 'Mon Portfolio',
    url: 'https://portfolio.com',
    icon: ExternalLink,
    clicks: 1247,
    isActive: true,
    date: '2d'
  },
  {
    id: '2',
    title: 'Instagram',
    url: 'https://instagram.com/demo',
    icon: Instagram,
    clicks: 892,
    isActive: true,
    date: '3d'
  },
  {
    id: '3',
    title: 'Youtube Channel',
    url: 'https://youtube.com/@demo',
    icon: Youtube,
    clicks: 654,
    isActive: false,
    date: '5d'
  },
  {
    id: '4',
    title: 'Twitter Profile',
    url: 'https://twitter.com/demo',
    icon: Twitter,
    clicks: 432,
    isActive: true,
    date: '1w'
  },
  {
    id: '5',
    title: 'Website',
    url: 'https://mywebsite.com',
    icon: Globe,
    clicks: 321,
    isActive: true,
    date: '2w'
  }
];

interface MobileLinkInBioViewProps {
  userData: any;
}

export function MobileLinkInBioView({ userData }: MobileLinkInBioViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedView, setSelectedView] = useState<'grid' | 'list'>('list');

  const filteredLinks = demoLinks.filter(link =>
    link.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="px-4 py-4 space-y-4">
      {/* Profile Card */}
      <Card className="p-4 bg-white rounded-2xl shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarFallback className="bg-gradient-to-br from-[#0066ff] to-blue-600 text-white">
                {userData?.name?.[0] || 'D'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-gray-900">openup</h3>
              <p className="text-sm text-gray-600">@{userData?.username || 'demouser'}</p>
            </div>
          </div>
          <button className="px-4 py-2 bg-[#0066ff] text-white rounded-xl font-medium hover:bg-blue-600 transition-colors">
            Voir la page
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 pt-3 border-t border-gray-100">
          <div className="text-center">
            <p className="text-xl font-bold text-gray-900">12</p>
            <p className="text-xs text-gray-500">Liens</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-gray-900">4.2k</p>
            <p className="text-xs text-gray-500">Vues</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-gray-900">72%</p>
            <p className="text-xs text-gray-500">Taux de clic</p>
          </div>
        </div>
      </Card>

      {/* Search and Filter */}
      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-400" />
          <Input
            type="text"
            placeholder="Rechercher un lien..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-[#f5f5f5] border-0 rounded-xl h-11"
          />
        </div>
        <button className="w-11 h-11 flex items-center justify-center bg-[#f5f5f5] rounded-xl hover:bg-gray-200 transition-colors">
          <SlidersHorizontal className="w-[18px] h-[18px] text-gray-600" />
        </button>
      </div>

      {/* Links List */}
      <div className="space-y-3">
        {filteredLinks.map((link) => {
          const IconComponent = link.icon;
          return (
            <Card key={link.id} className="bg-[#f5f5f5] border-0 rounded-2xl shadow-none overflow-hidden">
              <div className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-5 h-5 text-gray-900" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{link.title}</h3>
                      <p className="text-sm text-gray-500 truncate">{link.url}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <Eye className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-xs text-gray-500">{link.clicks} vues</span>
                        <span className="text-gray-300">•</span>
                        <span className="text-xs text-gray-500">{link.date}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {!link.isActive && (
                      <Badge className="bg-gray-300 text-gray-700 hover:bg-gray-300 text-xs px-2 py-0.5">
                        Inactif
                      </Badge>
                    )}
                    <button className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors">
                      <MoreVertical className="w-5 h-5 text-gray-900" />
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredLinks.length === 0 && (
        <Card className="p-8 bg-white rounded-2xl shadow-sm">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Aucun lien trouvé</h3>
            <p className="text-sm text-gray-500">
              Essayez de modifier votre recherche
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
