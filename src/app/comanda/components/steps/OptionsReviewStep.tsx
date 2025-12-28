'use client';

import React from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FormDataType = any;

interface ServiceOption {
  id: string;
  name: string;
  price: string;
  description: string;
}

interface ServiceInfo {
  id: string;
  name: string;
  color: string;
  icon: React.ReactNode;
}

interface OptionsReviewStepProps {
  selectedService: string;
  formData: FormDataType;
  setFormData: React.Dispatch<React.SetStateAction<FormDataType>>;
  handleOfertantiToggle: (type: string) => void;
  handleOptionToggle: (optionId: string) => void;
  ridicareCountryName: string;
  livrareCountryName: string;
  currentServiceInfo: ServiceInfo | undefined;
  serviceOptions: ServiceOption[];
}

export default function OptionsReviewStep({
  selectedService,
  formData,
  setFormData,
  handleOfertantiToggle,
  handleOptionToggle,
  ridicareCountryName,
  livrareCountryName,
  currentServiceInfo,
  serviceOptions,
}: OptionsReviewStepProps) {

  return (
    <div className="space-y-6">
      {/* Tip ofertanți */}
      <div className="bg-linear-to-br from-slate-800/90 via-slate-800/80 to-slate-900/90 backdrop-blur-xl rounded-2xl border border-white/10 p-6 sm:p-8 shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-12 h-12 rounded-xl bg-linear-to-br ${currentServiceInfo?.color || 'from-blue-500 to-cyan-500'} bg-opacity-20 border ${selectedService === 'plicuri' ? 'border-yellow-500/30' : selectedService === 'persoane' ? 'border-rose-500/30' : 'border-blue-500/30'} flex items-center justify-center shadow-lg`}>
            <div className={selectedService === 'plicuri' ? 'text-yellow-400' : selectedService === 'persoane' ? 'text-rose-400' : 'text-blue-400'}>
              {currentServiceInfo?.icon || (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                </svg>
              )}
            </div>
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">De la cine dorești oferte?</h2>
            <p className="text-gray-400 text-sm">Selectează tipul de transportatori</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label
            className="flex items-start gap-4 p-5 rounded-xl border-2 cursor-pointer transition-all hover:border-white/20"
            style={{
              borderColor: formData.tip_ofertanti.includes('firme') ? '#10b981' : 'rgba(255,255,255,0.1)',
              backgroundColor: formData.tip_ofertanti.includes('firme') ? 'rgba(16,185,129,0.1)' : 'rgba(71,85,105,0.3)'
            }}
          >
            <input
              type="checkbox"
              checked={formData.tip_ofertanti.includes('firme')}
              onChange={() => handleOfertantiToggle('firme')}
              className="mt-1 w-5 h-5 rounded border-white/20 bg-slate-700 text-green-500 focus:ring-green-500"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span className="font-bold text-white text-lg">Firme Transport <span className="text-green-400">(Verificate)</span></span>
              </div>
              <p className="text-sm text-gray-400">Companii cu licență, asigurare și echipamente profesionale</p>
            </div>
          </label>

          <label
            className="flex items-start gap-4 p-5 rounded-xl border-2 cursor-pointer transition-all hover:border-white/20"
            style={{
              borderColor: formData.tip_ofertanti.includes('persoane_private') ? '#ef4444' : 'rgba(255,255,255,0.1)',
              backgroundColor: formData.tip_ofertanti.includes('persoane_private') ? 'rgba(239,68,68,0.1)' : 'rgba(71,85,105,0.3)'
            }}
          >
            <input
              type="checkbox"
              checked={formData.tip_ofertanti.includes('persoane_private')}
              onChange={() => handleOfertantiToggle('persoane_private')}
              className="mt-1 w-5 h-5 rounded border-white/20 bg-slate-700 text-red-500 focus:ring-red-500"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="font-bold text-white text-lg">Persoane Private <span className="text-red-400">(Neverificate)</span></span>
              </div>
              <p className="text-sm text-gray-400">Persoane înscrise care nu au completat procesul de verificare</p>
            </div>
          </label>
        </div>

        {formData.tip_ofertanti.length === 0 && (
          <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center gap-2">
            <svg className="w-5 h-5 text-amber-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p className="text-amber-400 text-sm font-medium">Selectează cel puțin un tip pentru a primi oferte</p>
          </div>
        )}

        {/* Limită număr oferte */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-white mb-1">Câte oferte vrei să primești?</h3>
            <p className="text-gray-400 text-sm">Alege câte companii pot să te contacteze</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <label
              className="flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all hover:border-white/20"
              style={{
                borderColor: formData.max_oferte === '1-3' ? '#8b5cf6' : 'rgba(255,255,255,0.1)',
                backgroundColor: formData.max_oferte === '1-3' ? 'rgba(139,92,246,0.1)' : 'rgba(71,85,105,0.3)'
              }}
            >
              <input
                type="radio"
                name="max_oferte"
                value="1-3"
                checked={formData.max_oferte === '1-3'}
                onChange={(e) => setFormData((prev: FormDataType) => ({ ...prev, max_oferte: e.target.value }))}
                className="w-4 h-4 text-violet-500 border-white/20 bg-slate-700 focus:ring-violet-500"
              />
              <div className="flex-1">
                <span className="font-semibold text-white text-sm sm:text-base">1-3 oferte</span>
                <p className="text-xs text-gray-400 mt-0.5">Selectiv</p>
              </div>
            </label>

            <label
              className="flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all hover:border-white/20"
              style={{
                borderColor: formData.max_oferte === '4-5' ? '#8b5cf6' : 'rgba(255,255,255,0.1)',
                backgroundColor: formData.max_oferte === '4-5' ? 'rgba(139,92,246,0.1)' : 'rgba(71,85,105,0.3)'
              }}
            >
              <input
                type="radio"
                name="max_oferte"
                value="4-5"
                checked={formData.max_oferte === '4-5'}
                onChange={(e) => setFormData((prev: FormDataType) => ({ ...prev, max_oferte: e.target.value }))}
                className="w-4 h-4 text-violet-500 border-white/20 bg-slate-700 focus:ring-violet-500"
              />
              <div className="flex-1">
                <span className="font-semibold text-white text-sm sm:text-base">4-5 oferte</span>
                <p className="text-xs text-gray-400 mt-0.5">Moderat</p>
              </div>
            </label>

            <label
              className="flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all hover:border-white/20"
              style={{
                borderColor: formData.max_oferte === 'nelimitat' ? '#8b5cf6' : 'rgba(255,255,255,0.1)',
                backgroundColor: formData.max_oferte === 'nelimitat' ? 'rgba(139,92,246,0.1)' : 'rgba(71,85,105,0.3)'
              }}
            >
              <input
                type="radio"
                name="max_oferte"
                value="nelimitat"
                checked={formData.max_oferte === 'nelimitat'}
                onChange={(e) => setFormData((prev: FormDataType) => ({ ...prev, max_oferte: e.target.value }))}
                className="w-4 h-4 text-violet-500 border-white/20 bg-slate-700 focus:ring-violet-500"
              />
              <div className="flex-1">
                <span className="font-semibold text-white text-sm sm:text-base">Nelimitat</span>
                <p className="text-xs text-gray-400 mt-0.5">Până găsesc ce trebuie</p>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Opțiuni suplimentare */}
      <div className="bg-linear-to-br from-slate-800/90 via-slate-800/80 to-slate-900/90 backdrop-blur-xl rounded-2xl border border-white/10 p-6 sm:p-8 shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-linear-to-br from-emerald-500/20 to-green-500/20 border border-emerald-500/30 flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Opțiuni suplimentare</h2>
            <p className="text-gray-400 text-sm">Servicii adiționale (opțional)</p>
          </div>
        </div>
        
        <div className="space-y-3">
          {serviceOptions.map((opt) => (
            <label
              key={opt.id}
              className="flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all hover:border-white/20"
              style={{
                borderColor: formData.optiuni.includes(opt.id) ? '#34d399' : 'rgba(255,255,255,0.1)',
                backgroundColor: formData.optiuni.includes(opt.id) ? 'rgba(52,211,153,0.1)' : 'rgba(71,85,105,0.3)'
              }}
            >
              <input
                type="checkbox"
                checked={formData.optiuni.includes(opt.id)}
                onChange={() => handleOptionToggle(opt.id)}
                className="mt-1 w-5 h-5 rounded border-white/20 bg-slate-700 text-green-500 focus:ring-green-500"
              />
              <div className="flex-1">
                <span className="font-semibold text-white block mb-1">{opt.name}</span>
                <p className="text-sm text-gray-400">{opt.description}</p>
              </div>
            </label>
          ))}
          {serviceOptions.length === 0 && (
            <p className="text-gray-400 text-center py-4">Nu există opțiuni suplimentare pentru acest serviciu</p>
          )}
        </div>
      </div>

      {/* Sumar comandă */}
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-white/10 p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">Sumar comandă</h2>
        </div>
        
        <div className="space-y-3 text-sm">
          <div className="flex justify-between py-2 border-b border-white/5">
            <span className="text-gray-400">Serviciu:</span>
            <span className="text-white font-medium">
              {currentServiceInfo?.name}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-white/5">
            <span className="text-gray-400">De la:</span>
            <span className="text-white font-medium text-right">
              {formData.oras_ridicare || formData.localitate_ridicare || '-'}, {formData.judet_ridicare}, {ridicareCountryName}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-white/5">
            <span className="text-gray-400">La:</span>
            <span className="text-white font-medium text-right">
              {formData.oras_livrare || formData.localitate_livrare || '-'}, {formData.judet_livrare}, {livrareCountryName}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-white/5">
            <span className="text-gray-400">Program ridicare:</span>
            <span className="text-white font-medium">
              {formData.tip_programare === 'data_specifica' && formData.data_ridicare ? formData.data_ridicare : ''}
              {formData.tip_programare === 'range' && formData.data_ridicare && formData.data_ridicare_end ? `${formData.data_ridicare} - ${formData.data_ridicare_end}` : ''}
              {formData.tip_programare === 'flexibil' ? 'Flexibil' : ''}
              {!formData.tip_programare ? '-' : ''}
            </span>
          </div>
          {formData.optiuni.length > 0 && (
            <div className="pt-3">
              <span className="text-gray-400 block mb-2">Opțiuni suplimentare:</span>
              <div className="flex flex-wrap gap-2">
                {formData.optiuni.map((optId: string) => {
                  const option = serviceOptions.find(o => o.id === optId);
                  return option ? (
                    <span key={optId} className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 rounded-lg text-xs border border-emerald-500/20">
                      {option.name}
                    </span>
                  ) : null;
                })}
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-6 p-4 bg-slate-700/30 rounded-xl border border-white/5">
          <p className="text-white font-medium mb-3 flex items-center gap-2">
            <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            Ce urmează:
          </p>
          <ul className="space-y-2">
            <li className="flex items-center gap-2 text-sm text-gray-300">
              <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Trimitem cererea către partenerii noștri
            </li>
            <li className="flex items-center gap-2 text-sm text-gray-300">
              <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Vei primi oferte în <strong className="text-white">24-48 ore</strong>
            </li>
            <li className="flex items-center gap-2 text-sm text-gray-300">
              <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Compari și alegi oferta potrivită
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
