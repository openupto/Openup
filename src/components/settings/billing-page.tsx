import { ArrowLeft, CreditCard, Download, FileText } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { toast } from 'sonner@2.0.3';

interface BillingPageProps {
  onBack: () => void;
  isMobile?: boolean;
}

export function BillingPage({ onBack, isMobile = false }: BillingPageProps) {
  const invoices = [
    {
      id: '1',
      date: '01 Jan 2025',
      amount: '9.99€',
      status: 'Payé',
      plan: 'Pro'
    },
    {
      id: '2',
      date: '01 Déc 2024',
      amount: '9.99€',
      status: 'Payé',
      plan: 'Pro'
    },
    {
      id: '3',
      date: '01 Nov 2024',
      amount: '9.99€',
      status: 'Payé',
      plan: 'Pro'
    }
  ];

  const handleDownloadInvoice = (invoiceId: string) => {
    toast.success(`Facture #${invoiceId} téléchargée`);
  };

  const handleUpdatePayment = () => {
    toast.info('Ouverture du formulaire de paiement');
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
        <h1 className="text-gray-900 dark:text-white">Facturation</h1>
      </div>

      {/* Carte de paiement */}
      <Card className="p-6 bg-gradient-to-br from-[#3399ff] to-[#2680e6] text-white mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm opacity-80 mb-1">Moyen de paiement</p>
            <p className="text-lg">•••• •••• •••• 4242</p>
          </div>
          <CreditCard className="w-8 h-8 opacity-80" />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-80">Expire le</p>
            <p>12/25</p>
          </div>
          <Button
            onClick={handleUpdatePayment}
            variant="secondary"
            size="sm"
            className="bg-white/20 hover:bg-white/30 text-white border-0"
          >
            Modifier
          </Button>
        </div>
      </Card>

      {/* Prochain paiement */}
      <Card className="p-6 bg-gray-50 dark:bg-gray-800 border-0 mb-6">
        <h3 className="text-gray-900 dark:text-white mb-4">Prochain paiement</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Plan Pro - Mensuel
            </p>
            <p className="text-2xl text-gray-900 dark:text-white mt-1">
              9.99€
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Date
            </p>
            <p className="text-gray-900 dark:text-white mt-1">
              01 Fév 2025
            </p>
          </div>
        </div>
      </Card>

      {/* Historique des factures */}
      <div>
        <h3 className="text-gray-900 dark:text-white mb-4">
          Historique des factures
        </h3>
        <div className="space-y-3">
          {invoices.map((invoice) => (
            <Card
              key={invoice.id}
              className="p-4 bg-gray-50 dark:bg-gray-800 border-0"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#3399ff]/10 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-[#3399ff]" />
                  </div>
                  <div>
                    <p className="text-gray-900 dark:text-white">
                      Facture #{invoice.id}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {invoice.date} • Plan {invoice.plan}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right mr-2">
                    <p className="text-gray-900 dark:text-white">
                      {invoice.amount}
                    </p>
                    <Badge className="bg-green-500 hover:bg-green-500 text-white text-xs">
                      {invoice.status}
                    </Badge>
                  </div>
                  <Button
                    onClick={() => handleDownloadInvoice(invoice.id)}
                    variant="ghost"
                    size="sm"
                    className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
