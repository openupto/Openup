import { useEffect, useState } from 'react';
import { useAuth } from '../auth-context';
import { teamsAPI } from '../../utils/supabase/api';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Loader2, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function AcceptInvitePage() {
  const { user, loading: authLoading } = useAuth();
  const [status, setStatus] = useState<'validating' | 'processing' | 'success' | 'error'>('validating');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // If auth is still loading, wait
    if (authLoading) return;

    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (!token) {
        setStatus('error');
        setErrorMessage('Lien d\'invitation invalide (token manquant).');
        return;
    }

    if (!user) {
        // Not logged in. Redirect to login but keep return url
        const returnUrl = encodeURIComponent(window.location.pathname + window.location.search);
        window.location.href = `/login?return_to=${returnUrl}`;
        return;
    }

    // Process invite
    const processInvite = async () => {
        setStatus('processing');
        try {
            await teamsAPI.acceptInviteEdge(token);
            setStatus('success');
            toast.success("Invitation acceptée avec succès !");
            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 1500);
        } catch (e: any) {
            console.error(e);
            setStatus('error');
            setErrorMessage(e.message || "Erreur lors de l'acceptation de l'invitation.");
        }
    };

    processInvite();

  }, [user, authLoading]);

  if (authLoading || status === 'validating') {
      return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
      );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <Card className="w-full max-w-md">
            <CardHeader className="text-center">
                <CardTitle>Invitation d'équipe</CardTitle>
                <CardDescription>Traitement de votre invitation...</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center py-6 space-y-4">
                {status === 'processing' && (
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
                        <p className="text-sm text-gray-500">Veuillez patienter pendant que nous validons votre invitation.</p>
                    </div>
                )}
                
                {status === 'success' && (
                    <div className="flex flex-col items-center gap-4 text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-medium text-green-700">Succès !</h3>
                            <p className="text-gray-500">Vous avez rejoint l'équipe.</p>
                        </div>
                        <Button onClick={() => window.location.href = '/dashboard'} className="w-full mt-2">
                            Aller au Dashboard <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                )}

                {status === 'error' && (
                    <div className="flex flex-col items-center gap-4 text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                            <XCircle className="w-8 h-8 text-red-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-medium text-red-700">Erreur</h3>
                            <p className="text-gray-500">{errorMessage}</p>
                        </div>
                        <Button variant="outline" onClick={() => window.location.href = '/dashboard'} className="w-full mt-2">
                            Retour à l'accueil
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    </div>
  );
}
