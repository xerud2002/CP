'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

interface ConfirmContextType {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextType | null>(null);

export function useConfirm() {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error('useConfirm must be used within a ConfirmProvider');
  }
  return context;
}

interface ConfirmProviderProps {
  children: ReactNode;
}

export function ConfirmProvider({ children }: ConfirmProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const [resolveRef, setResolveRef] = useState<((value: boolean) => void) | null>(null);

  const confirm = useCallback((opts: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setOptions(opts);
      setResolveRef(() => resolve);
      setIsOpen(true);
    });
  }, []);

  const handleConfirm = useCallback(() => {
    resolveRef?.(true);
    setIsOpen(false);
    setOptions(null);
    setResolveRef(null);
  }, [resolveRef]);

  const handleCancel = useCallback(() => {
    resolveRef?.(false);
    setIsOpen(false);
    setOptions(null);
    setResolveRef(null);
  }, [resolveRef]);

  const getVariantStyles = (variant: ConfirmOptions['variant'] = 'danger') => {
    switch (variant) {
      case 'danger':
        return {
          icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          ),
          iconBg: 'bg-red-500/20',
          iconColor: 'text-red-400',
          buttonBg: 'bg-red-500 hover:bg-red-600',
          borderColor: 'border-red-500/30',
        };
      case 'warning':
        return {
          icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          ),
          iconBg: 'bg-yellow-500/20',
          iconColor: 'text-yellow-400',
          buttonBg: 'bg-yellow-500 hover:bg-yellow-600',
          borderColor: 'border-yellow-500/30',
        };
      case 'info':
        return {
          icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          iconBg: 'bg-blue-500/20',
          iconColor: 'text-blue-400',
          buttonBg: 'bg-blue-500 hover:bg-blue-600',
          borderColor: 'border-blue-500/30',
        };
    }
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {isOpen && options && typeof window !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={handleCancel}
          />

          {/* Modal */}
          <div className="relative w-full max-w-sm bg-slate-900 rounded-2xl border border-white/10 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Content */}
            <div className="p-6">
              {/* Icon */}
              <div className="flex justify-center mb-4">
                <div className={`p-3 rounded-full ${getVariantStyles(options.variant)?.iconBg}`}>
                  <div className={getVariantStyles(options.variant)?.iconColor}>
                    {getVariantStyles(options.variant)?.icon}
                  </div>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold text-white text-center mb-2">
                {options.title}
              </h3>

              {/* Message */}
              <p className="text-gray-400 text-sm text-center leading-relaxed">
                {options.message}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 p-4 pt-0">
              <button
                onClick={handleCancel}
                className="flex-1 py-2.5 px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-colors font-medium text-sm"
              >
                {options.cancelText || 'Anulează'}
              </button>
              <button
                onClick={handleConfirm}
                className={`flex-1 py-2.5 px-4 ${getVariantStyles(options.variant)?.buttonBg} text-white rounded-xl transition-colors font-medium text-sm`}
              >
                {options.confirmText || 'Confirmă'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </ConfirmContext.Provider>
  );
}

// Standalone confirm function for use outside of React components
// This creates a temporary modal without needing context
export function showConfirm(options: ConfirmOptions): Promise<boolean> {
  return new Promise((resolve) => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    const cleanup = () => {
      document.body.removeChild(container);
    };

    const getVariantStyles = (variant: ConfirmOptions['variant'] = 'danger') => {
      switch (variant) {
        case 'danger':
          return {
            iconSvg: `<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>`,
            iconBg: 'bg-red-500/20',
            iconColor: 'text-red-400',
            buttonBg: 'bg-red-500 hover:bg-red-600',
          };
        case 'warning':
          return {
            iconSvg: `<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>`,
            iconBg: 'bg-yellow-500/20',
            iconColor: 'text-yellow-400',
            buttonBg: 'bg-yellow-500 hover:bg-yellow-600',
          };
        case 'info':
          return {
            iconSvg: `<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`,
            iconBg: 'bg-blue-500/20',
            iconColor: 'text-blue-400',
            buttonBg: 'bg-blue-500 hover:bg-blue-600',
          };
        default:
          return {
            iconSvg: `<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>`,
            iconBg: 'bg-red-500/20',
            iconColor: 'text-red-400',
            buttonBg: 'bg-red-500 hover:bg-red-600',
          };
      }
    };

    const styles = getVariantStyles(options.variant);

    container.innerHTML = `
      <div class="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" id="confirm-backdrop"></div>
        <div class="relative w-full max-w-sm bg-slate-900 rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
          <div class="p-6">
            <div class="flex justify-center mb-4">
              <div class="p-3 rounded-full ${styles.iconBg}">
                <div class="${styles.iconColor}">
                  ${styles.iconSvg}
                </div>
              </div>
            </div>
            <h3 class="text-lg font-semibold text-white text-center mb-2">${options.title}</h3>
            <p class="text-gray-400 text-sm text-center leading-relaxed">${options.message}</p>
          </div>
          <div class="flex gap-3 p-4 pt-0">
            <button id="confirm-cancel" class="flex-1 py-2.5 px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-colors font-medium text-sm">
              ${options.cancelText || 'Anulează'}
            </button>
            <button id="confirm-ok" class="flex-1 py-2.5 px-4 ${styles.buttonBg} text-white rounded-xl transition-colors font-medium text-sm">
              ${options.confirmText || 'Confirmă'}
            </button>
          </div>
        </div>
      </div>
    `;

    const handleConfirm = () => {
      cleanup();
      resolve(true);
    };

    const handleCancel = () => {
      cleanup();
      resolve(false);
    };

    container.querySelector('#confirm-ok')?.addEventListener('click', handleConfirm);
    container.querySelector('#confirm-cancel')?.addEventListener('click', handleCancel);
    container.querySelector('#confirm-backdrop')?.addEventListener('click', handleCancel);

    // Handle escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        document.removeEventListener('keydown', handleEscape);
        handleCancel();
      }
    };
    document.addEventListener('keydown', handleEscape);
  });
}
