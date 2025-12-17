import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Switch } from './ui/switch';
import { 
  Wallet, 
  Smartphone, 
  Download, 
  QrCode, 
  Palette, 
  Image as ImageIcon,
  Crown,
  Check,
  Apple,
  Plus,
  Eye,
  Settings,
  Sparkles
} from 'lucide-react';

interface UserData {
  id: string;
  email: string;
  name: string;
  subscription_tier: string;
  links_count: number;
  created_at: string;
}

interface WalletCardProps {
  userData: UserData | null;
}

export function WalletCard({ userData }: WalletCardProps) {
  const [cardEnabled, setCardEnabled] = useState(false);
  const [cardTitle, setCardTitle] = useState(userData?.name || 'My OpenUp Card');
  const [cardDescription, setCardDescription] = useState('Professional digital business card');
  const [selectedTheme, setSelectedTheme] = useState('gradient');
  
  const themes = [
    { id: 'gradient', name: 'Gradient Blue', preview: 'from-blue-500 to-purple-600' },
    { id: 'dark', name: 'Dark Mode', preview: 'from-gray-800 to-black' },
    { id: 'neon', name: 'Neon Cyber', preview: 'from-cyan-400 to-pink-500' },
    { id: 'minimal', name: 'Minimal White', preview: 'from-gray-100 to-white' },
    { id: 'pro', name: 'Professional', preview: 'from-slate-600 to-slate-800' }
  ];

  const features = [
    {
      icon: Smartphone,
      title: 'Apple Wallet Integration',
      description: 'Add your card to Apple Wallet for instant access',
      status: 'ready'
    },
    {
      icon: Plus,
      title: 'Google Wallet Support',
      description: 'Compatible with Google Pay and Android devices',
      status: 'ready'
    },
    {
      icon: Sparkles,
      title: 'Real-time Updates',
      description: 'Your card updates automatically when you change your profile',
      status: 'active'
    },
    {
      icon: QrCode,
      title: 'Dynamic QR Code',
      description: 'Built-in QR code that links to your OpenUp page',
      status: 'active'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-[#3399ff] to-blue-600 bg-clip-text text-transparent">
            Digital Wallet Card
          </h2>
          <p className="text-slate-600 mt-1">
            Create a digital business card for Apple Wallet & Google Wallet
          </p>
        </div>
        <Badge className="bg-gradient-to-r from-green-400 to-emerald-500 text-white">
          NEW
        </Badge>
      </div>

      {/* Card Preview */}
      <Card className="overflow-hidden">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Wallet className="w-5 h-5 text-[#3399ff]" />
              <span>Card Preview</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Switch
                checked={cardEnabled}
                onCheckedChange={setCardEnabled}
              />
              <Label className="text-sm">Enable Card</Label>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Wallet Card Preview */}
            <div className="relative mx-auto max-w-sm">
              <div className={`
                relative w-full aspect-[1.586/1] rounded-2xl p-6 text-white shadow-2xl
                bg-gradient-to-br ${themes.find(t => t.id === selectedTheme)?.preview || 'from-blue-500 to-purple-600'}
                transform hover:scale-105 transition-all duration-300 hover-lift
              `}>
                {/* Card Background Pattern */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-4 right-4 w-16 h-16 rounded-full border border-white/30"></div>
                  <div className="absolute bottom-4 left-4 w-8 h-8 rounded-full border border-white/30"></div>
                </div>
                
                {/* Card Content */}
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                        <Wallet className="w-5 h-5" />
                      </div>
                      <span className="font-semibold text-sm">OpenUp</span>
                    </div>
                    <div className="w-12 h-8 bg-white/20 rounded flex items-center justify-center">
                      <QrCode className="w-4 h-4" />
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-bold text-lg">{cardTitle}</h3>
                    <p className="text-sm opacity-90">{cardDescription}</p>
                    <div className="mt-2 text-xs opacity-75">
                      openup.com/u/{userData?.name?.toLowerCase().replace(/\s+/g, '') || 'user'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Settings */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cardTitle">Card Title</Label>
                  <Input
                    id="cardTitle"
                    value={cardTitle}
                    onChange={(e) => setCardTitle(e.target.value)}
                    placeholder="Enter card title"
                  />
                </div>
                <div>
                  <Label htmlFor="cardDescription">Description</Label>
                  <Input
                    id="cardDescription"
                    value={cardDescription}
                    onChange={(e) => setCardDescription(e.target.value)}
                    placeholder="Enter card description"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label>Card Theme</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                    {themes.map((theme) => (
                      <button
                        key={theme.id}
                        onClick={() => setSelectedTheme(theme.id)}
                        className={`
                          relative p-3 rounded-lg border-2 transition-all duration-200
                          ${selectedTheme === theme.id ? 'border-[#3399ff] ring-2 ring-[#3399ff]/20' : 'border-slate-200 hover:border-slate-300'}
                        `}
                      >
                        <div className={`w-full h-8 rounded bg-gradient-to-r ${theme.preview} mb-2`}></div>
                        <div className="text-sm font-medium">{theme.name}</div>
                        {selectedTheme === theme.id && (
                          <div className="absolute top-1 right-1">
                            <Check className="w-4 h-4 text-[#3399ff]" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add to Wallet Buttons */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-black rounded-2xl flex items-center justify-center">
                <Apple className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">Add to Apple Wallet</h3>
                <p className="text-sm text-slate-600">For iPhone and Apple Watch</p>
              </div>
              <Button 
                className="w-full bg-black hover:bg-gray-800 text-white"
                disabled={!cardEnabled}
              >
                <Download className="w-4 h-4 mr-2" />
                Add to Apple Wallet
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl flex items-center justify-center">
                <Plus className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">Add to Google Wallet</h3>
                <p className="text-sm text-slate-600">For Android devices</p>
              </div>
              <Button 
                className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white"
                disabled={!cardEnabled}
              >
                <Download className="w-4 h-4 mr-2" />
                Add to Google Wallet
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Features */}
      <Card>
        <CardHeader>
          <CardTitle>Features & Benefits</CardTitle>
          <CardDescription>
            What makes OpenUp digital wallet cards special
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-[#3399ff] to-blue-600 flex items-center justify-center">
                  <feature.icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-semibold">{feature.title}</h4>
                    {feature.status === 'active' && (
                      <Badge variant="default" className="text-xs bg-green-100 text-green-700">
                        Active
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 mt-1">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Usage Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-[#3399ff]">0</div>
            <div className="text-sm text-slate-600">Cards Added</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-[#3399ff]">0</div>
            <div className="text-sm text-slate-600">Card Views</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-[#3399ff]">0</div>
            <div className="text-sm text-slate-600">Interactions</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}