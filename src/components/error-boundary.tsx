import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from './ui/button';
import { RefreshCcw, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] h-full p-6 text-center bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
          <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-full mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Quelque chose s'est mal passé</h2>
          <p className="text-gray-500 mb-6 max-w-md">
            Une erreur inattendue s'est produite. Nous avons été notifiés. Veuillez essayer de rafraîchir la page.
          </p>
          {this.state.error && (
            <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded mb-4 max-w-md overflow-auto text-left w-full text-red-500">
              {this.state.error.message}
            </pre>
          )}
          <Button 
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            className="gap-2"
          >
            <RefreshCcw className="w-4 h-4" />
            Rafraîchir la page
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
