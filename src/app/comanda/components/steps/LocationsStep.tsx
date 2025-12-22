'use client';

import CountryDropdown from '../dropdowns/CountryDropdown';
import RegionDropdown from '../dropdowns/RegionDropdown';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FormDataType = any;

interface LocationsStepProps {
  formData: FormDataType;
  setFormData: React.Dispatch<React.SetStateAction<FormDataType>>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  errors: Record<string, string>;
  judetRidicareList: string[];
  judetLivrareList: string[];
}

export default function LocationsStep({
  formData,
  setFormData,
  handleInputChange,
  errors,
  judetRidicareList,
  judetLivrareList,
}: LocationsStepProps) {
  return (
    <div className="space-y-6">
      {/* Ridicare */}
      <div className="bg-linear-to-br from-slate-800/90 via-slate-800/80 to-slate-900/90 backdrop-blur-xl rounded-2xl border border-white/10 p-6 sm:p-8 shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-linear-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30 flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">Adresa de ridicare</h2>
            <p className="text-gray-400 text-sm">De unde ridicăm?</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CountryDropdown
              value={formData.tara_ridicare}
              onChange={(value) => setFormData((prev: FormDataType) => ({ ...prev, tara_ridicare: value, judet_ridicare: '' }))}
              label="Țara"
            />
            
            <div>
              <RegionDropdown
                value={formData.judet_ridicare}
                onChange={(value) => setFormData((prev: FormDataType) => ({ ...prev, judet_ridicare: value }))}
                label="Județ/Regiune"
                regions={judetRidicareList}
                countryCode={formData.tara_ridicare}
              />
              {errors.judet_ridicare && <p className="text-red-400 text-sm mt-1">{errors.judet_ridicare}</p>}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Oraș *</label>
            <input
              type="text"
              name="oras_ridicare"
              value={formData.oras_ridicare}
              onChange={handleInputChange}
              className="form-input w-full"
              placeholder="București"
            />
            {errors.oras_ridicare && <p className="text-red-400 text-sm mt-1">{errors.oras_ridicare}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Adresa completă</label>
            <input
              type="text"
              name="adresa_ridicare"
              value={formData.adresa_ridicare}
              onChange={handleInputChange}
              className="form-input w-full"
              placeholder="Str. Exemplu, Nr. 10, Sector 1"
            />
            {errors.adresa_ridicare && <p className="text-red-400 text-sm mt-1">{errors.adresa_ridicare}</p>}
          </div>
        </div>
      </div>

      {/* Livrare */}
      <div className="bg-linear-to-br from-slate-800/90 via-slate-800/80 to-slate-900/90 backdrop-blur-xl rounded-2xl border border-white/10 p-6 sm:p-8 shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-linear-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">Adresa de livrare</h2>
            <p className="text-gray-400 text-sm">Unde livrăm?</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CountryDropdown
              value={formData.tara_livrare}
              onChange={(value) => setFormData((prev: FormDataType) => ({ ...prev, tara_livrare: value, judet_livrare: '' }))}
              label="Țara"
            />
            
            <div>
              <RegionDropdown
                value={formData.judet_livrare}
                onChange={(value) => setFormData((prev: FormDataType) => ({ ...prev, judet_livrare: value }))}
                label="Județ/Regiune"
                regions={judetLivrareList}
                countryCode={formData.tara_livrare}
              />
              {errors.judet_livrare && <p className="text-red-400 text-sm mt-1">{errors.judet_livrare}</p>}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Oraș *</label>
            <input
              type="text"
              name="oras_livrare"
              value={formData.oras_livrare}
              onChange={handleInputChange}
              className="form-input w-full"
              placeholder="London"
            />
            {errors.oras_livrare && <p className="text-red-400 text-sm mt-1">{errors.oras_livrare}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Adresa completă</label>
            <input
              type="text"
              name="adresa_livrare"
              value={formData.adresa_livrare}
              onChange={handleInputChange}
              className="form-input w-full"
              placeholder="123 Example Street, London"
            />
            {errors.adresa_livrare && <p className="text-red-400 text-sm mt-1">{errors.adresa_livrare}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
