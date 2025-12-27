'use client';
import AnimalTypeDropdown from '../dropdowns/AnimalTypeDropdown';
import VehicleTypeDropdown from '../dropdowns/VehicleTypeDropdown';
import DatePicker from '../DatePicker';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FormDataType = any;

interface TransportDetailsStepProps {
  selectedService: string;
  formData: FormDataType;
  setFormData: (value: FormDataType | ((prev: FormDataType) => FormDataType)) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  errors: Record<string, string>;
}

export default function TransportDetailsStep({
  selectedService,
  formData,
  setFormData,
  handleInputChange,
  errors
}: TransportDetailsStepProps) {
  return (
    <div className="bg-linear-to-br from-slate-800/90 via-slate-800/80 to-slate-900/90 backdrop-blur-xl rounded-2xl border border-white/10 p-6 sm:p-8 shadow-2xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-linear-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center shadow-lg">
          <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Detalii transport</h2>
          <p className="text-gray-400 text-sm">Informații despre ce vrei să trimiți</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {/* Colete și Paleți - greutate, dimensiuni, cantitate */}
        {(selectedService === 'colete' || selectedService === 'paleti') && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Greutate (kg) *</label>
                <input
                  type="number"
                  name="greutate"
                  value={formData.greutate}
                  onChange={handleInputChange}
                  className="form-input w-full"
                  placeholder="10"
                  min="0"
                  step="0.1"
                />
                {errors.greutate && <p className="text-red-400 text-sm mt-1">{errors.greutate}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Lungime (cm)</label>
                <input
                  type="number"
                  name="lungime"
                  value={formData.lungime}
                  onChange={handleInputChange}
                  className="form-input w-full"
                  placeholder="50"
                  min="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Lățime (cm)</label>
                <input
                  type="number"
                  name="latime"
                  value={formData.latime}
                  onChange={handleInputChange}
                  className="form-input w-full"
                  placeholder="30"
                  min="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Înălțime (cm)</label>
                <input
                  type="number"
                  name="inaltime"
                  value={formData.inaltime}
                  onChange={handleInputChange}
                  className="form-input w-full"
                  placeholder="20"
                  min="0"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Cantitate ({selectedService === 'paleti' ? 'paleți' : 'colete'})
              </label>
              <input
                type="number"
                name="cantitate"
                value={formData.cantitate}
                onChange={handleInputChange}
                className="form-input w-full"
                placeholder="1"
                min="1"
              />
            </div>
          </>
        )}

        {/* Plicuri/Documente - doar cantitate */}
        {selectedService === 'plicuri' && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Număr plicuri/documente</label>
            <input
              type="number"
              name="cantitate"
              value={formData.cantitate}
              onChange={handleInputChange}
              className="form-input w-full"
              placeholder="1"
              min="1"
            />
          </div>
        )}

        {/* Electronice - greutate, dimensiuni, cantitate */}
        {selectedService === 'electronice' && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Greutate (kg)</label>
                <input
                  type="number"
                  name="greutate"
                  value={formData.greutate}
                  onChange={handleInputChange}
                  className="form-input w-full"
                  placeholder="5"
                  min="0"
                  step="0.1"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Lungime (cm)</label>
                <input
                  type="number"
                  name="lungime"
                  value={formData.lungime}
                  onChange={handleInputChange}
                  className="form-input w-full"
                  placeholder="40"
                  min="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Lățime (cm)</label>
                <input
                  type="number"
                  name="latime"
                  value={formData.latime}
                  onChange={handleInputChange}
                  className="form-input w-full"
                  placeholder="30"
                  min="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Înălțime (cm)</label>
                <input
                  type="number"
                  name="inaltime"
                  value={formData.inaltime}
                  onChange={handleInputChange}
                  className="form-input w-full"
                  placeholder="20"
                  min="0"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Număr produse</label>
              <input
                type="number"
                name="cantitate"
                value={formData.cantitate}
                onChange={handleInputChange}
                className="form-input w-full"
                placeholder="1"
                min="1"
              />
            </div>
          </>
        )}

        {/* Animale - câmpuri simple */}
        {selectedService === 'animale' && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Tip animal *</label>
                <AnimalTypeDropdown
                  value={formData.tip_animal}
                  onChange={(value) => setFormData((prev: FormDataType) => ({ ...prev, tip_animal: value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Greutate (kg)</label>
                <input
                  type="number"
                  name="greutate"
                  value={formData.greutate}
                  onChange={handleInputChange}
                  className="form-input w-full"
                  placeholder="ex: 25"
                  min="0"
                  step="0.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Nr. animale</label>
                <input
                  type="number"
                  name="cantitate"
                  value={formData.cantitate}
                  onChange={handleInputChange}
                  className="form-input w-full"
                  placeholder="1"
                  min="1"
                  max="10"
                />
              </div>
            </div>
            <div className="p-3 rounded-xl bg-pink-500/10 border border-pink-500/30">
              <p className="text-sm text-gray-400">💡 Menționează în descriere: rasa, dacă are cușcă proprie, vaccinuri la zi, etc.</p>
            </div>
          </>
        )}

        {/* Mașini - câmpuri simple */}
        {selectedService === 'masini' && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Tip vehicul *</label>
                <VehicleTypeDropdown
                  value={formData.tip_vehicul}
                  onChange={(value) => setFormData((prev: FormDataType) => ({ ...prev, tip_vehicul: value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Greutate (kg)</label>
                <input
                  type="number"
                  name="greutate"
                  value={formData.greutate}
                  onChange={handleInputChange}
                  className="form-input w-full"
                  placeholder="ex: 1500"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Funcțional?</label>
                <select
                  name="stare_vehicul"
                  value={formData.stare_vehicul || ''}
                  onChange={handleInputChange}
                  className="form-select w-full"
                >
                  <option value="">Selectează</option>
                  <option value="functional">Da, merge</option>
                  <option value="nefunctional">Nu, defect</option>
                </select>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30">
              <p className="text-sm text-gray-400">💡 Menționează în descriere: marca, modelul, anul fabricației</p>
            </div>
          </>
        )}

        {/* Platformă - câmpuri simple */}
        {selectedService === 'platforma' && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Tip vehicul *</label>
                <VehicleTypeDropdown
                  value={formData.tip_vehicul}
                  onChange={(value) => setFormData((prev: FormDataType) => ({ ...prev, tip_vehicul: value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Greutate (kg)</label>
                <input
                  type="number"
                  name="greutate"
                  value={formData.greutate}
                  onChange={handleInputChange}
                  className="form-input w-full"
                  placeholder="ex: 1500"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Funcțional?</label>
                <select
                  name="stare_vehicul"
                  value={formData.stare_vehicul || ''}
                  onChange={handleInputChange}
                  className="form-select w-full"
                >
                  <option value="">Selectează</option>
                  <option value="functional">Da, merge</option>
                  <option value="nefunctional">Nu, defect</option>
                </select>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30">
              <p className="text-sm text-gray-400">💡 Menționează în descriere: marca, modelul, anul fabricației</p>
            </div>
          </>
        )}

        {/* Tractări - câmpuri simple */}
        {selectedService === 'tractari' && (
          <>
            {/* Row 1: Tip vehicul + Număr înmatriculare */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <span className="text-orange-400">Tip vehicul</span> *
                </label>
                <VehicleTypeDropdown
                  value={formData.tip_vehicul}
                  onChange={(value) => setFormData((prev: FormDataType) => ({ ...prev, tip_vehicul: value }))}
                />
                {errors.tip_vehicul && <p className="text-red-400 text-sm mt-1">{errors.tip_vehicul}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Număr înmatriculare</label>
                <input
                  type="text"
                  name="numar_inmatriculare"
                  value={formData.numar_inmatriculare || ''}
                  onChange={handleInputChange}
                  className="form-input w-full uppercase tracking-wider"
                  placeholder="B 123 ABC"
                  maxLength={15}
                />
              </div>
            </div>
            
            {/* Row 2: Motiv + Roți */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Motiv tractare</label>
                <select
                  name="motiv_tractare"
                  value={formData.motiv_tractare || ''}
                  onChange={handleInputChange}
                  className="form-select w-full"
                >
                  <option value="">Selectează</option>
                  <option value="pana">Pană / Defecțiune</option>
                  <option value="accident">Accident</option>
                  <option value="relocare">Relocare</option>
                  <option value="alt">Alt motiv</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Roțile se rotesc?</label>
                <select
                  name="roti_functionale"
                  value={formData.roti_functionale || ''}
                  onChange={handleInputChange}
                  className="form-select w-full"
                >
                  <option value="">Selectează</option>
                  <option value="da">Da</option>
                  <option value="nu">Nu, blocate</option>
                </select>
              </div>
            </div>
          </>
        )}

        {/* Mobilă - info + dimensiuni */}
        {selectedService === 'mobila' && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Nr. piese mobilier</label>
                <input
                  type="number"
                  name="cantitate"
                  value={formData.cantitate}
                  onChange={handleInputChange}
                  className="form-input w-full"
                  placeholder="1"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Greutate estimată (kg)</label>
                <input
                  type="number"
                  name="greutate"
                  value={formData.greutate}
                  onChange={handleInputChange}
                  className="form-input w-full"
                  placeholder="ex: 150"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Necesită 2 persoane?</label>
                <select
                  name="echipa_necesara"
                  value={formData.echipa_necesara || ''}
                  onChange={handleInputChange}
                  className="form-select w-full"
                >
                  <option value="">Selectează</option>
                  <option value="nu">Nu, 1 persoană</option>
                  <option value="da">Da, 2+ persoane</option>
                </select>
              </div>
            </div>
          </>
        )}
        
        {/* Persoane - număr pasageri */}
        {selectedService === 'persoane' && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Număr pasageri</label>
            <input
              type="number"
              name="cantitate"
              value={formData.cantitate}
              onChange={handleInputChange}
              className="form-input w-full"
              placeholder="1"
              min="1"
              max="8"
            />
          </div>
        )}
        
        {/* Descriere - adaptată în funcție de serviciu */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {selectedService === 'plicuri' ? 'Descriere documente' : 
             selectedService === 'masini' ? 'Detalii vehicul *' :
             selectedService === 'persoane' ? 'Observații călătorie' :
             selectedService === 'animale' ? 'Tip animal și detalii *' :
             selectedService === 'electronice' ? 'Tip echipament *' :
             selectedService === 'platforma' ? 'Detalii vehicul/echipament *' :
             selectedService === 'tractari' ? 'Detalii vehicul și situație *' :
             selectedService === 'mobila' ? 'Descriere mobilier *' :
             selectedService === 'paleti' ? 'Descriere marfă' :
             'Descriere colet'} 
            {(selectedService === 'colete' || selectedService === 'paleti') && '*'}
          </label>
          <textarea
            name="descriere"
            value={formData.descriere}
            onChange={handleInputChange}
            className="form-input w-full"
            rows={2}
            placeholder={
              selectedService === 'plicuri' ? 'Descrie documentele (contracte, acte, corespondență)' :
              selectedService === 'masini' ? 'Ex: BMW X5, 2020, negru, funcțional/nefuncțional' :
              selectedService === 'persoane' ? 'Ex: bagaje, copii mici, nevoi speciale...' :
              selectedService === 'animale' ? 'Ex: Câine Labrador, 25kg, are cușcă, vaccinat' :
              selectedService === 'electronice' ? 'Ex: Laptop, TV 55", PlayStation 5' :
              selectedService === 'platforma' ? 'Ex: BMW Seria 3, 2018, 1.5t, funcțional' :
              selectedService === 'tractari' ? 'Ex: Dacia Logan, 2019, pană motor, A1 km 45' :
              selectedService === 'mobila' ? 'Ex: Canapea, dulap 2m, masă + 6 scaune' :
              selectedService === 'paleti' ? 'Ex: 2 paleți alimente, fiecare 500kg' :
              'Descrie ce trimiți (colet fragil, electronice, haine)'
            }
          />
          {errors.descriere && <p className="text-red-400 text-sm mt-1">{errors.descriere}</p>}
        </div>
        
        {/* Data colectare - Urgent + DatePicker pe aceeași linie */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Data colectare *</label>
          <div className="grid grid-cols-2 gap-3 items-stretch">
            {/* Urgent button - active if today or tomorrow */}
            {(() => {
              const today = new Date();
              const tomorrow = new Date();
              tomorrow.setDate(tomorrow.getDate() + 1);
              const todayStr = today.toISOString().split('T')[0];
              const tomorrowStr = tomorrow.toISOString().split('T')[0];
              const isUrgent = formData.data_ridicare === todayStr || formData.data_ridicare === tomorrowStr;
              
              return (
                <button
                  type="button"
                  onClick={() => {
                    setFormData((prev: FormDataType) => ({ 
                      ...prev, 
                      data_ridicare: todayStr,
                      urgent: true
                    }));
                  }}
                  className={`relative px-3 py-1.5 rounded-lg border transition-all flex items-center justify-center gap-1.5 text-xs font-medium ${
                    isUrgent
                      ? 'bg-linear-to-r from-orange-500 to-amber-500 border-orange-400 text-white shadow-lg shadow-orange-500/30'
                      : 'bg-slate-700/50 border-white/10 text-gray-400 hover:border-orange-500/50 hover:text-orange-400 hover:bg-slate-700'
                  }`}
                >
                  {isUrgent && (
                    <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-300"></span>
                    </span>
                  )}
                  <svg className={`w-4 h-4 ${isUrgent ? 'animate-pulse' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Urgent (azi/mâine)</span>
                </button>
              );
            })()}
            
            {/* Date picker */}
            <DatePicker
              value={formData.data_ridicare}
              onChange={(value) => setFormData((prev: FormDataType) => ({ ...prev, data_ridicare: value }))}
              label=""
              placeholder="Altă dată"
              accentColor="orange"
              error={errors.data_ridicare}
            />
          </div>
        </div>

        {formData.tip_programare === 'range' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DatePicker
              value={formData.data_ridicare}
              onChange={(value) => setFormData((prev: FormDataType) => ({ ...prev, data_ridicare: value }))}
              label="Data de la"
              placeholder="Dată start"
              accentColor="blue"
              error={errors.data_ridicare}
            />

            <DatePicker
              value={formData.data_ridicare_end}
              onChange={(value) => setFormData((prev: FormDataType) => ({ ...prev, data_ridicare_end: value }))}
              label="Data până la"
              placeholder="Dată final"
              accentColor="blue"
              error={errors.data_ridicare_end}
            />
          </div>
        )}

        {formData.tip_programare === 'flexibil' && (
          <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-green-400 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-green-400 font-medium mb-1">Program flexibil selectat</p>
                <p className="text-sm text-gray-400">Curierii vor putea ridica coletul în funcție de disponibilitatea lor. Vei fi contactat pentru confirmare.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
