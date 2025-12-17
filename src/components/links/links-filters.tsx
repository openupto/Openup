import React, { useState } from 'react';
import { SlidersHorizontal, X, Calendar as CalendarIcon, Tag as TagIcon, Check } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Slider } from '../ui/slider';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { cn } from '../ui/utils';

export interface LinksFilterState {
  status: 'all' | 'active' | 'disabled';
  period: 'all' | 'today' | '7d' | '30d' | 'custom';
  dateStart?: string;
  dateEnd?: string;
  sortBy: 'newest' | 'oldest' | 'clicks_desc' | 'clicks_asc' | 'alpha';
  tags: string[];
  minClicks: number;
  maxClicks: number;
}

export const defaultFilters: LinksFilterState = {
  status: 'all',
  period: 'all',
  sortBy: 'newest',
  tags: [],
  minClicks: 0,
  maxClicks: 10000,
};

interface LinksFiltersProps {
  currentFilters: LinksFilterState;
  onApply: (filters: LinksFilterState) => void;
}

export function LinksFilters({ currentFilters, onApply }: LinksFiltersProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<LinksFilterState>(currentFilters);
  const [tagInput, setTagInput] = useState('');

  // Reset draft when opening if needed, but keeping persistence is better UX usually.
  // We'll sync draft with props when opening or props change? 
  // Actually, we want persistence, so we initialize from props.
  // If props change externally, we might want to sync, but usually filters are local to this view.

  const hasActiveFilters = 
    draft.status !== 'all' || 
    draft.period !== 'all' || 
    draft.sortBy !== 'newest' || 
    draft.tags.length > 0 ||
    draft.minClicks > 0 ||
    draft.maxClicks < 10000;

  const handleReset = () => {
    setDraft(defaultFilters);
  };

  const handleApply = () => {
    onApply(draft);
    setOpen(false);
  };

  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!draft.tags.includes(tagInput.trim())) {
        setDraft({ ...draft, tags: [...draft.tags, tagInput.trim()] });
      }
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setDraft({ ...draft, tags: draft.tags.filter((t) => t !== tag) });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button 
          className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center transition-all relative border border-transparent",
            open || hasActiveFilters 
              ? "bg-[#006EF7] text-white shadow-lg shadow-blue-500/20" 
              : "bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800"
          )}
        >
          <SlidersHorizontal className="w-5 h-5" />
          {hasActiveFilters && (
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-white rounded-full ring-2 ring-[#006EF7]" />
          )}
        </button>
      </PopoverTrigger>
      
      <PopoverContent 
        align="end" 
        className="w-[340px] p-0 rounded-2xl border border-slate-800 bg-slate-900/95 backdrop-blur-xl shadow-2xl text-slate-200"
        sideOffset={8}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
          <h3 className="font-semibold text-white">Filtres</h3>
          <button 
            onClick={() => setOpen(false)}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
          
          {/* 1. Status */}
          <div className="space-y-3">
            <Label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Statut</Label>
            <div className="flex bg-slate-950/50 p-1 rounded-lg border border-slate-800">
              {(['all', 'active', 'disabled'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setDraft({ ...draft, status })}
                  className={cn(
                    "flex-1 text-sm font-medium py-1.5 rounded-md transition-all",
                    draft.status === status 
                      ? "bg-slate-800 text-white shadow-sm" 
                      : "text-slate-400 hover:text-slate-300"
                  )}
                >
                  {status === 'all' ? 'Tous' : status === 'active' ? 'Actifs' : 'Désactivés'}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Period */}
          <div className="space-y-3">
            <Label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Période</Label>
            <Select 
              value={draft.period} 
              onValueChange={(val: any) => setDraft({ ...draft, period: val })}
            >
              <SelectTrigger className="bg-slate-950/50 border-slate-800 text-slate-200 h-10 rounded-lg focus:ring-blue-500/20">
                <SelectValue placeholder="Sélectionner une période" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                <SelectItem value="all">Tout</SelectItem>
                <SelectItem value="today">Aujourd'hui</SelectItem>
                <SelectItem value="7d">7 derniers jours</SelectItem>
                <SelectItem value="30d">30 derniers jours</SelectItem>
                <SelectItem value="custom">Personnalisé</SelectItem>
              </SelectContent>
            </Select>

            {draft.period === 'custom' && (
              <div className="flex items-center gap-2 mt-2">
                <div className="relative flex-1">
                  <Input 
                    type="date" 
                    value={draft.dateStart || ''} 
                    onChange={(e) => setDraft({ ...draft, dateStart: e.target.value })}
                    className="bg-slate-950/50 border-slate-800 text-xs px-2 h-9 rounded-lg [color-scheme:dark]"
                  />
                </div>
                <span className="text-slate-500 text-xs">à</span>
                <div className="relative flex-1">
                   <Input 
                    type="date" 
                    value={draft.dateEnd || ''} 
                    onChange={(e) => setDraft({ ...draft, dateEnd: e.target.value })}
                    className="bg-slate-950/50 border-slate-800 text-xs px-2 h-9 rounded-lg [color-scheme:dark]"
                  />
                </div>
              </div>
            )}
          </div>

          {/* 3. Sort */}
          <div className="space-y-3">
            <Label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Tri</Label>
            <Select 
              value={draft.sortBy} 
              onValueChange={(val: any) => setDraft({ ...draft, sortBy: val })}
            >
              <SelectTrigger className="bg-slate-950/50 border-slate-800 text-slate-200 h-10 rounded-lg focus:ring-blue-500/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                <SelectItem value="newest">Plus récents</SelectItem>
                <SelectItem value="oldest">Plus anciens</SelectItem>
                <SelectItem value="clicks_desc">Plus de clics</SelectItem>
                <SelectItem value="clicks_asc">Moins de clics</SelectItem>
                <SelectItem value="alpha">A → Z</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 4. Tags */}
          <div className="space-y-3">
            <Label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Tags</Label>
            <div className="relative">
              <TagIcon className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={addTag}
                placeholder="Ajouter un tag..."
                className="pl-9 bg-slate-950/50 border-slate-800 text-slate-200 h-10 rounded-lg placeholder:text-slate-600 focus:ring-blue-500/20"
              />
            </div>
            {draft.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {draft.tags.map(tag => (
                  <Badge 
                    key={tag} 
                    variant="secondary" 
                    className="bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border-blue-500/20 px-2 py-1 gap-1 text-xs"
                  >
                    {tag}
                    <button onClick={() => removeTag(tag)} className="hover:text-white">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
            {/* Suggestions (Static for now, could be props) */}
            <div className="flex flex-wrap gap-2 pt-1">
               {['Instagram', 'Boutique', 'Pro'].filter(t => !draft.tags.includes(t)).map(t => (
                  <button 
                    key={t} 
                    onClick={() => setDraft({ ...draft, tags: [...draft.tags, t] })}
                    className="text-xs text-slate-500 hover:text-blue-400 transition-colors border border-slate-800 rounded-full px-2 py-0.5 bg-slate-950"
                  >
                    + {t}
                  </button>
               ))}
            </div>
          </div>

          {/* 5. Clicks */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Clics</Label>
              <span className="text-xs text-blue-400 font-mono">
                {draft.minClicks} – {draft.maxClicks === 10000 ? '10k+' : draft.maxClicks}
              </span>
            </div>
            <Slider
              defaultValue={[draft.minClicks, draft.maxClicks]}
              max={10000}
              step={100}
              min={0}
              value={[draft.minClicks, draft.maxClicks]}
              onValueChange={(val) => setDraft({ ...draft, minClicks: val[0], maxClicks: val[1] })}
              className="py-4"
            />
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/30 flex items-center justify-end gap-3 rounded-b-2xl">
          <Button 
            variant="ghost" 
            onClick={handleReset}
            className="text-slate-400 hover:text-white hover:bg-slate-800"
          >
            Réinitialiser
          </Button>
          <Button 
            onClick={handleApply}
            className="bg-[#006EF7] hover:bg-[#005AD4] text-white shadow-lg shadow-blue-500/20 rounded-lg px-6"
          >
            Appliquer
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
