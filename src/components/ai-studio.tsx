import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { 
  Brain, 
  Wand2, 
  Languages, 
  TrendingUp, 
  Sparkles,
  Eye,
  Target,
  Zap,
  Lightbulb,
  RefreshCw,
  Download,
  Palette,
  MessageCircle,
  BarChart3,
  Globe,
  Crown
} from 'lucide-react';

interface UserData {
  id: string;
  email: string;
  name: string;
  subscription_tier: string;
  links_count: number;
  created_at: string;
}

interface AIStudioProps {
  userData: UserData | null;
}

export function AIStudio({ userData }: AIStudioProps) {
  const [aiEnabled, setAiEnabled] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [logoUrl, setLogoUrl] = useState('');
  const [brandDescription, setBrandDescription] = useState('');
  const [selectedLanguages, setSelectedLanguages] = useState(['en']);

  const features = [
    {
      icon: Palette,
      title: 'Auto Design Generation',
      description: 'AI creates your perfect profile design based on your logo and brand',
      status: 'active',
      action: 'Generate Design'
    },
    {
      icon: MessageCircle,
      title: 'Smart Copy Optimization',
      description: 'AI improves your titles and call-to-actions for better engagement',
      status: 'active',
      action: 'Optimize Copy'
    },
    {
      icon: Languages,
      title: 'Multi-language Translation',
      description: 'Automatically translate your profile to reach global audiences',
      status: 'active',
      action: 'Translate Profile'
    },
    {
      icon: TrendingUp,
      title: 'Performance Insights',
      description: 'AI analyzes your metrics and suggests improvements',
      status: 'beta',
      action: 'Get Insights'
    },
    {
      icon: Target,
      title: 'Audience Targeting',
      description: 'AI identifies your best audience segments for optimization',
      status: 'coming-soon',
      action: 'Analyze Audience'
    },
    {
      icon: Lightbulb,
      title: 'Content Suggestions',
      description: 'AI suggests new links and content based on your niche',
      status: 'coming-soon',
      action: 'Get Suggestions'
    }
  ];

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' }
  ];

  const suggestions = [
    {
      type: 'design',
      title: 'Color Scheme Optimization',
      description: 'Your current blue theme could be enhanced with complementary orange accents for better contrast',
      impact: 'High',
      confidence: 92
    },
    {
      type: 'copy',
      title: 'Call-to-Action Improvement',
      description: 'Change "Visit Website" to "Explore My Work" for 23% better click-through rates',
      impact: 'Medium',
      confidence: 87
    },
    {
      type: 'layout',
      title: 'Link Order Optimization',
      description: 'Move your most popular social links to the top for better engagement',
      impact: 'High',
      confidence: 94
    }
  ];

  const handleGenerateDesign = async () => {
    setIsGenerating(true);
    // Simulate AI generation
    setTimeout(() => {
      setIsGenerating(false);
    }, 3000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-700">Active</Badge>;
      case 'beta':
        return <Badge className="bg-blue-100 text-blue-700">Beta</Badge>;
      case 'coming-soon':
        return <Badge className="bg-gray-100 text-gray-700">Coming Soon</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            AI Studio
          </h2>
          <p className="text-slate-600 mt-1">
            Supercharge your profile with artificial intelligence
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge className="bg-gradient-to-r from-purple-400 to-pink-500 text-white">
            NEW
          </Badge>
          <div className="flex items-center space-x-2">
            <Switch
              checked={aiEnabled}
              onCheckedChange={setAiEnabled}
            />
            <Label className="text-sm">AI Enabled</Label>
          </div>
        </div>
      </div>

      {/* Quick AI Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Wand2 className="w-5 h-5 text-purple-600" />
            <span>Quick AI Actions</span>
          </CardTitle>
          <CardDescription>
            Generate and optimize your profile with one click
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Logo Upload for AI Design */}
            <div className="space-y-4">
              <Label>Upload Your Logo (Optional)</Label>
              <div className="flex items-center space-x-4">
                <Input
                  placeholder="Paste logo URL or upload image"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  className="flex-1"
                />
                <Button variant="outline">
                  Upload Image
                </Button>
              </div>
            </div>

            {/* Brand Description */}
            <div className="space-y-2">
              <Label>Describe Your Brand/Purpose</Label>
              <Textarea
                placeholder="e.g., I'm a photographer specializing in wedding photography, or I run a tech startup focused on productivity apps..."
                value={brandDescription}
                onChange={(e) => setBrandDescription(e.target.value)}
                rows={3}
              />
            </div>

            {/* AI Generation Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Button
                onClick={handleGenerateDesign}
                disabled={isGenerating}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              >
                {isGenerating ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Palette className="w-4 h-4 mr-2" />
                )}
                Generate Design
              </Button>
              <Button
                variant="outline"
                className="border-purple-200 hover:bg-purple-50"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Optimize Copy
              </Button>
              <Button
                variant="outline"
                className="border-pink-200 hover:bg-pink-50"
              >
                <Languages className="w-4 h-4 mr-2" />
                Translate
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Features */}
      <Card>
        <CardHeader>
          <CardTitle>AI Features</CardTitle>
          <CardDescription>
            Advanced AI tools to enhance your OpenUp experience
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {features.map((feature, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-100 to-pink-100 flex items-center justify-center">
                      <feature.icon className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{feature.title}</h4>
                      {getStatusBadge(feature.status)}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-slate-600">{feature.description}</p>
                <Button
                  size="sm"
                  variant={feature.status === 'active' ? 'default' : 'outline'}
                  disabled={feature.status === 'coming-soon'}
                  className={feature.status === 'active' ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700' : ''}
                >
                  {feature.action}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            <span>AI Suggestions</span>
          </CardTitle>
          <CardDescription>
            Personalized recommendations to improve your profile performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {suggestions.map((suggestion, index) => (
              <div key={index} className="border-l-4 border-purple-400 bg-purple-50/50 rounded-r-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      {suggestion.type.toUpperCase()}
                    </Badge>
                    <span className={`text-xs px-2 py-1 rounded ${
                      suggestion.impact === 'High' ? 'bg-red-100 text-red-700' :
                      suggestion.impact === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {suggestion.impact} Impact
                    </span>
                  </div>
                  <div className="text-xs text-slate-500">
                    {suggestion.confidence}% confidence
                  </div>
                </div>
                <h4 className="font-semibold mb-1">{suggestion.title}</h4>
                <p className="text-sm text-slate-600 mb-3">{suggestion.description}</p>
                <div className="flex items-center space-x-2">
                  <Button size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                    Apply Suggestion
                  </Button>
                  <Button size="sm" variant="outline">
                    Learn More
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Language Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Languages className="w-5 h-5 text-blue-600" />
            <span>Multi-language Support</span>
          </CardTitle>
          <CardDescription>
            AI can automatically translate your profile to reach global audiences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Label>Select Languages to Support</Label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    if (selectedLanguages.includes(lang.code)) {
                      setSelectedLanguages(selectedLanguages.filter(l => l !== lang.code));
                    } else {
                      setSelectedLanguages([...selectedLanguages, lang.code]);
                    }
                  }}
                  className={`
                    p-3 rounded-lg border text-center transition-all duration-200
                    ${selectedLanguages.includes(lang.code) 
                      ? 'border-blue-500 bg-blue-50 text-blue-700' 
                      : 'border-slate-200 hover:border-slate-300'
                    }
                  `}
                >
                  <div className="text-lg mb-1">{lang.flag}</div>
                  <div className="text-xs font-medium">{lang.name}</div>
                </button>
              ))}
            </div>
            <Button className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Globe className="w-4 h-4 mr-2" />
              Generate Translations
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* AI Usage Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <Brain className="w-8 h-8 mx-auto mb-2 text-purple-600" />
            <div className="text-2xl font-bold text-purple-600">5</div>
            <div className="text-sm text-slate-600">AI Actions Used</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <div className="text-2xl font-bold text-green-600">23%</div>
            <div className="text-sm text-slate-600">Performance Boost</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Languages className="w-8 h-8 mx-auto mb-2 text-blue-600" />
            <div className="text-2xl font-bold text-blue-600">{selectedLanguages.length}</div>
            <div className="text-sm text-slate-600">Languages</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Sparkles className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
            <div className="text-2xl font-bold text-yellow-600">12</div>
            <div className="text-sm text-slate-600">Suggestions Applied</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}