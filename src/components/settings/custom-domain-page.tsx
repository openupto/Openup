import { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Plus, 
  Globe, 
  Check, 
  X, 
  MoreHorizontal, 
  Copy, 
  Loader2, 
  AlertCircle, 
  Trash2, 
  RefreshCw,
  Power
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { toast } from 'sonner@2.0.3';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { cn } from '../ui/utils';

interface CustomDomainPageProps {
  onBack: () => void;
  isMobile?: boolean;
}

interface Domain {
  id: string;
  name: string;
  status: 'pending' | 'verified' | 'active' | 'error';
  dnsRecords: { type: string; name: string; value: string }[];
  errorMessage?: string;
}

export function CustomDomainPage({ onBack, isMobile = false }: CustomDomainPageProps) {
  // State
  const [domains, setDomains] = useState<Domain[]>([
    {
      id: '1',
      name: 'mikejohnson.com',
      status: 'active',
      dnsRecords: [{ type: 'CNAME', name: '@', value: 'target.openup.to' }]
    },
    {
      id: '2',
      name: 'mj.link',
      status: 'pending',
      dnsRecords: [{ type: 'CNAME', name: '@', value: 'target.openup.to' }]
    }
  ]);

  const [newDomainName, setNewDomainName] = useState('');
  const [selectedDomainId, setSelectedDomainId] = useState<string | null>(null);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState<1 | 2 | 3>(1);
  const [isVerifying, setIsVerifying] = useState(false);
  const [currentSetupDomain, setCurrentSetupDomain] = useState<Domain | null>(null);

  const selectedDomain = domains.find(d => d.id === selectedDomainId);

  // Actions
  const handleCopy = (text: string) => {
    if (!navigator.clipboard) {
      fallbackCopyTextToClipboard(text);
      return;
    }
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Copié dans le presse-papier');
    }).catch(err => {
      console.error('Async: Could not copy text: ', err);
      fallbackCopyTextToClipboard(text);
    });
  };

  const fallbackCopyTextToClipboard = (text: string) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    
    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand('copy');
      if (successful) {
        toast.success('Copié dans le presse-papier');
      } else {
        toast.error('Impossible de copier automatiquement');
      }
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
      toast.error('Impossible de copier automatiquement');
    }

    document.body.removeChild(textArea);
  };

  const handleStartAddDomain = () => {
    if (!newDomainName.trim()) {
      toast.error('Veuillez entrer un nom de domaine');
      return;
    }
    
    // Check if valid domain format (simple regex)
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
    if (!domainRegex.test(newDomainName)) {
      toast.error('Format de domaine invalide');
      return;
    }

    if (domains.some(d => d.name === newDomainName)) {
      toast.error('Ce domaine existe déjà');
      return;
    }

    const newDomain: Domain = {
      id: Date.now().toString(),
      name: newDomainName,
      status: 'pending',
      dnsRecords: [{ type: 'CNAME', name: '@', value: 'target.openup.to' }]
    };

    setDomains([...domains, newDomain]);
    setCurrentSetupDomain(newDomain);
    setNewDomainName('');
    setModalStep(1);
    setIsModalOpen(true);
  };

  const handleDeleteDomain = (id: string) => {
    if (confirm("Supprimer ce domaine ? Cette action est irréversible.")) {
      setDomains(domains.filter(d => d.id !== id));
      if (selectedDomainId === id) setSelectedDomainId(null);
      toast.success('Domaine supprimé');
    }
  };

  const handleSetActive = (id: string) => {
    setDomains(domains.map(d => ({
      ...d,
      status: d.id === id ? 'active' : (d.status === 'active' ? 'verified' : d.status)
    })));
    toast.success('Domaine défini comme actif');
  };

  const handleVerify = async () => {
    setIsVerifying(true);
    // Simulate API call
    setTimeout(() => {
      setIsVerifying(false);
      if (Math.random() > 0.3) { // 70% success chance for demo
        setModalStep(3);
        // Update domain status
        if (currentSetupDomain) {
           setDomains(prev => prev.map(d => 
             d.id === currentSetupDomain.id ? { ...d, status: 'verified' } : d
           ));
        }
      } else {
        toast.error("Propagation DNS incomplète. Veuillez réessayer dans quelques minutes.");
        // Stay on step 2 but show error? Or just toast.
      }
    }, 2000);
  };

  const handleActivateFromModal = () => {
    if (currentSetupDomain) {
      handleSetActive(currentSetupDomain.id);
      setIsModalOpen(false);
    }
  };

  const handleCheckNow = (id: string) => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 2000)),
      {
        loading: 'Vérification DNS en cours...',
        success: 'Vérification terminée',
        error: 'Erreur'
      }
    );
  };

  return (
    <div className={`${isMobile ? 'px-4 py-6' : 'p-8'} bg-white dark:bg-gray-900 min-h-full`}>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-gray-900 dark:text-white font-bold text-xl">Domaine personnalisé</h1>
      </div>

      {/* Info Banner */}
      <Card className="p-6 bg-blue-50/50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/50 mb-8 shadow-none">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg shrink-0">
             <Globe className="w-5 h-5 text-[#3399ff]" />
          </div>
          <div>
            <h3 className="text-gray-900 dark:text-white font-semibold mb-1">
              Utilisez votre propre domaine
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Remplacez openup.to par votre propre domaine pour une image de marque professionnelle.
            </p>
          </div>
        </div>
      </Card>

      {/* Mes domaines */}
      <div className="mb-8">
        <h3 className="text-gray-900 dark:text-white font-semibold mb-4 flex items-center gap-2">
            Mes domaines
            <Badge variant="outline" className="text-xs text-gray-500 border-gray-700">{domains.length}</Badge>
        </h3>
        
        {domains.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-gray-200 dark:border-gray-800 rounded-xl">
                <Globe className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">Aucun domaine configuré</p>
            </div>
        ) : (
            <div className="space-y-3">
            {domains.map((domain) => (
                <div
                key={domain.id}
                onClick={() => setSelectedDomainId(domain.id)}
                className={cn(
                    "group p-4 bg-white dark:bg-gray-800/50 border rounded-xl transition-all cursor-pointer flex items-center justify-between",
                    selectedDomainId === domain.id 
                        ? "border-[#3399ff] ring-1 ring-[#3399ff]/20 bg-blue-50/50 dark:bg-blue-900/10" 
                        : "border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700",
                    domain.status === 'active' && "shadow-lg shadow-blue-500/5 dark:shadow-blue-900/20"
                )}
                >
                <div className="flex items-center gap-4">
                    <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                        domain.status === 'active' ? "bg-[#3399ff]/10 text-[#3399ff]" : "bg-gray-100 dark:bg-gray-800 text-gray-500"
                    )}>
                        <Globe className="w-5 h-5" />
                    </div>
                    <div>
                    <p className="text-gray-900 dark:text-white font-medium">
                        {domain.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                        {domain.status === 'active' && (
                            <Badge className="bg-[#3399ff] hover:bg-[#3399ff] text-white text-[10px] px-2 h-5">
                                Actif
                            </Badge>
                        )}
                        {domain.status === 'verified' && (
                            <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] px-2 h-5">
                                <Check className="w-3 h-3 mr-1" />
                                Vérifié
                            </Badge>
                        )}
                        {domain.status === 'pending' && (
                            <Badge className="bg-amber-500 hover:bg-amber-600 text-white text-[10px] px-2 h-5">
                                En attente
                            </Badge>
                        )}
                        {domain.status === 'error' && (
                            <Badge className="bg-red-500 hover:bg-red-600 text-white text-[10px] px-2 h-5">
                                Erreur DNS
                            </Badge>
                        )}
                    </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                     {/* Actions Menu */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-gray-900 dark:hover:text-white">
                                <MoreHorizontal className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem 
                                onClick={() => handleSetActive(domain.id)}
                                disabled={domain.status === 'active' || domain.status === 'pending' || domain.status === 'error'}
                            >
                                <Power className="w-4 h-4 mr-2" />
                                Définir comme actif
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                                setCurrentSetupDomain(domain);
                                setIsModalOpen(true);
                                setModalStep(1);
                            }}>
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Instructions DNS
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleCheckNow(domain.id)}>
                                <Check className="w-4 h-4 mr-2" />
                                Revérifier maintenant
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                                className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/50"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteDomain(domain.id);
                                }}
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Supprimer
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                </div>
            ))}
            </div>
        )}
      </div>

      {/* Ajouter un domaine */}
      <Card className="p-6 bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 rounded-xl mb-8">
        <h3 className="text-gray-900 dark:text-white font-semibold mb-4">
          Ajouter un nouveau domaine
        </h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Label htmlFor="domain" className="sr-only">Nom de domaine</Label>
            <Input
              id="domain"
              placeholder="ex: monsite.com"
              value={newDomainName}
              onChange={(e) => setNewDomainName(e.target.value)}
              className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 h-11"
            />
          </div>
          <Button
            onClick={handleStartAddDomain}
            className="bg-[#3399ff] hover:bg-[#2680e6] text-white rounded-lg h-11 px-6 font-medium sm:w-auto w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter le domaine
          </Button>
        </div>
      </Card>

      {/* Configuration DNS Contextuelle */}
      <Card className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
        <div className="p-6">
            <h3 className="text-gray-900 dark:text-white font-semibold mb-4 flex items-center gap-2">
                Configuration DNS
                {selectedDomain && <span className="text-gray-400 font-normal text-sm ml-2">pour {selectedDomain.name}</span>}
            </h3>
            
            {!selectedDomain ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
                    Sélectionnez un domaine ci-dessus pour voir sa configuration
                </div>
            ) : (
                <div className="space-y-6 animate-in fade-in duration-300">
                    {selectedDomain.status === 'error' && (
                        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-lg flex gap-3 text-sm text-red-600 dark:text-red-400 mb-4">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <div>
                                <p className="font-medium">Enregistrements DNS incorrects</p>
                                <p className="opacity-80">Veuillez vérifier que les valeurs ci-dessous sont bien configurées chez votre hébergeur.</p>
                            </div>
                        </div>
                    )}
                    
                    <div className="space-y-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Ajoutez ces enregistrements DNS chez votre hébergeur (OVH, Cloudflare, etc.) :
                        </p>
                        
                        <div className="grid gap-3">
                            {selectedDomain.dnsRecords.map((record, i) => (
                                <div key={i} className="flex flex-col sm:flex-row items-center gap-3 p-3 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg">
                                    <div className="flex-1 w-full sm:w-auto grid grid-cols-3 gap-4 font-mono text-xs text-gray-700 dark:text-gray-300">
                                        <div>
                                            <span className="text-gray-400 block mb-1">Type</span>
                                            {record.type}
                                        </div>
                                        <div>
                                            <span className="text-gray-400 block mb-1">Nom</span>
                                            {record.name}
                                        </div>
                                        <div className="overflow-hidden text-ellipsis">
                                            <span className="text-gray-400 block mb-1">Valeur</span>
                                            {record.value}
                                        </div>
                                    </div>
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="shrink-0 h-8"
                                        onClick={() => handleCopy(record.value)}
                                    >
                                        <Copy className="w-3 h-3 mr-2" />
                                        Copier
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
      </Card>

      {/* Modal de Configuration */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
            <DialogHeader>
                <DialogTitle>Configurer votre domaine</DialogTitle>
                <DialogDescription>
                    {modalStep === 1 && "Étape 1/3 : Configuration DNS"}
                    {modalStep === 2 && "Étape 2/3 : Vérification"}
                    {modalStep === 3 && "Étape 3/3 : Activation"}
                </DialogDescription>
            </DialogHeader>

            <div className="py-4">
                {modalStep === 1 && currentSetupDomain && (
                    <div className="space-y-4">
                         <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg text-sm">
                            Connectez-vous chez votre hébergeur (OVH, GoDaddy...) et ajoutez l'enregistrement suivant :
                         </div>
                         <div className="space-y-3">
                            {currentSetupDomain.dnsRecords.map((record, i) => (
                                <div key={i} className="bg-gray-100 dark:bg-gray-950 p-4 rounded-lg space-y-3 border border-gray-200 dark:border-gray-800">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-gray-500 uppercase">Type</span>
                                        <span className="font-mono text-sm font-bold">{record.type}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-gray-500 uppercase">Nom</span>
                                        <span className="font-mono text-sm font-bold">{record.name}</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-800">
                                        <span className="text-xs text-gray-500 uppercase">Valeur</span>
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono text-sm">{record.value}</span>
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="h-6 w-6"
                                                onClick={() => handleCopy(record.value)}
                                            >
                                                <Copy className="w-3 h-3" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                         </div>
                    </div>
                )}

                {modalStep === 2 && (
                    <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
                        {isVerifying ? (
                            <>
                                <Loader2 className="w-12 h-12 text-[#3399ff] animate-spin" />
                                <div>
                                    <h3 className="font-medium text-lg">On vérifie vos enregistrements...</h3>
                                    <p className="text-sm text-gray-500 mt-1">Cela peut prendre quelques secondes.</p>
                                </div>
                            </>
                        ) : (
                            <>
                                <AlertCircle className="w-12 h-12 text-amber-500" />
                                <div>
                                    <h3 className="font-medium text-lg">Propagation en cours</h3>
                                    <p className="text-sm text-gray-500 mt-1 max-w-xs mx-auto">
                                        Les DNS peuvent mettre jusqu'à 24h à se propager. Nous n'avons pas encore détecté les changements.
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                )}

                {modalStep === 3 && (
                    <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                            <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <h3 className="font-bold text-xl">Félicitations !</h3>
                            <p className="text-sm text-gray-500 mt-1">
                                Votre domaine <strong>{currentSetupDomain?.name}</strong> est vérifié et prêt à être utilisé.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            <DialogFooter className="flex-col sm:flex-row gap-2">
                {modalStep === 1 && (
                    <>
                        <Button variant="outline" onClick={() => setIsModalOpen(false)}>Plus tard</Button>
                        <Button onClick={() => {
                            setModalStep(2);
                            handleVerify();
                        }}>
                            J'ai ajouté les enregistrements
                        </Button>
                    </>
                )}

                {modalStep === 2 && !isVerifying && (
                    <>
                        <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Fermer</Button>
                        <Button onClick={handleVerify}>Revérifier</Button>
                    </>
                )}

                {modalStep === 3 && (
                    <Button onClick={handleActivateFromModal} className="w-full bg-green-600 hover:bg-green-700 text-white">
                        Activer ce domaine
                    </Button>
                )}
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
