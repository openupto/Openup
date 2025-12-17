import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  GripVertical, 
  Trash2, 
  ExternalLink,
  Instagram,
  Twitter,
  Youtube,
  Facebook,
  Linkedin,
  Globe,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';

interface LinkItem {
  id: string;
  title: string;
  url: string;
  description?: string;
  icon?: string;
  is_active: boolean;
  order_index: number;
  clicks: number;
  created_at: string;
}

interface DraggableLinkItemProps {
  link: LinkItem;
  isSelected: boolean;
  isDragging: boolean;
  isDragOver: boolean;
  onSelect: () => void;
  onUpdate: (field: keyof LinkItem, value: any) => void;
  onDelete: () => void;
  onDragStart: (e: React.DragEvent) => void;
  onDragEnd: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
}

const iconMap: { [key: string]: any } = {
  instagram: Instagram,
  twitter: Twitter,
  youtube: Youtube,
  facebook: Facebook,
  linkedin: Linkedin,
  website: Globe,
  email: Mail,
  phone: Phone,
  location: MapPin,
  link: ExternalLink,
};

export function DraggableLinkItem({
  link,
  isSelected,
  isDragging,
  isDragOver,
  onSelect,
  onUpdate,
  onDelete,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop
}: DraggableLinkItemProps) {
  const IconComponent = iconMap[link.icon?.toLowerCase() || 'link'] || ExternalLink;

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className={`
        p-4 rounded-xl border-2 transition-all duration-300 cursor-move
        ${isSelected 
          ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-purple-50 shadow-lg' 
          : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50'
        }
        ${isDragging ? 'opacity-50 scale-95 rotate-2' : ''}
        ${isDragOver ? 'border-green-400 bg-green-50 scale-105' : ''}
        hover:shadow-lg transform hover:scale-[1.02]
      `}
      onClick={onSelect}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <div className="flex items-center gap-2">
            <GripVertical className="w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors" />
            <div className={`p-2 rounded-lg ${isSelected ? 'bg-blue-100' : 'bg-gray-100'}`}>
              <IconComponent className={`w-5 h-5 ${isSelected ? 'text-blue-600' : 'text-gray-600'}`} />
            </div>
          </div>
          <div className="flex-1">
            <div className={`font-semibold ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
              {link.title}
            </div>
            <div className="text-sm text-gray-500 truncate max-w-xs">
              {link.url}
            </div>
            {link.description && (
              <div className="text-xs text-gray-400 mt-1">
                {link.description}
              </div>
            )}
            <div className="flex items-center gap-3 mt-2">
              <div className="text-xs text-gray-500">
                {link.clicks} clics
              </div>
              <div className={`w-2 h-2 rounded-full ${link.is_active ? 'bg-green-400' : 'bg-gray-300'}`} />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Switch
            checked={link.is_active}
            onCheckedChange={(checked) => onUpdate('is_active', checked)}
            className="data-[state=checked]:bg-blue-500"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {isSelected && (
        <div className="mt-6 pt-6 border-t border-gray-200 space-y-4 animate-in slide-in-from-top-2 duration-300">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-700">Titre</Label>
              <Input
                value={link.title}
                onChange={(e) => onUpdate('title', e.target.value)}
                className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Icône</Label>
              <Select 
                value={link.icon} 
                onValueChange={(value) => onUpdate('icon', value)}
              >
                <SelectTrigger className="mt-1 border-gray-300 focus:border-blue-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="link">Lien général</SelectItem>
                  <SelectItem value="website">Site web</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="twitter">Twitter</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="youtube">YouTube</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="phone">Téléphone</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label className="text-sm font-medium text-gray-700">URL</Label>
            <Input
              value={link.url}
              onChange={(e) => onUpdate('url', e.target.value)}
              className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              placeholder="https://example.com"
            />
          </div>
          
          <div>
            <Label className="text-sm font-medium text-gray-700">Description (optionnel)</Label>
            <Input
              value={link.description || ''}
              onChange={(e) => onUpdate('description', e.target.value)}
              className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              placeholder="Description courte du lien"
            />
          </div>
        </div>
      )}
    </div>
  );
}