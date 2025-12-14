'use client';

import { Component, ErrorInfo, ReactNode } from 'react';
import { logError } from '@/lib/errorMessages';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logError(error, `ErrorBoundary: ${errorInfo.componentStack}`);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
          <div className="max-w-md w-full bg-slate-800/50 backdrop-blur-lg rounded-2xl border border-white/10 p-8 text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Ceva nu a funcționat</h2>
            <p className="text-gray-400 mb-6">
              Ne cerem scuze pentru inconvenient. Vă rugăm să reîncărcați pagina.
            </p>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-6 text-left bg-slate-900/50 rounded-lg p-4">
                <summary className="text-sm text-gray-500 cursor-pointer mb-2">Detalii eroare</summary>
                <pre className="text-xs text-red-400 overflow-auto">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
            <button
              onClick={() => window.location.reload()}
              className="btn-primary w-full"
            >
              Reîncarcă pagina
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
