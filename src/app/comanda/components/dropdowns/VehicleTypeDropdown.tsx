'use client';
import { useState, useRef, useEffect } from 'react';

interface VehicleTypeDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

const vehicleTypes = [
  { value: 'autoturism', label: 'Autoturism', icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/></svg> },
  { value: 'suv', label: 'SUV / Crossover', icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 640 512"><path d="M171.3 96H224v96H111.3l30.4-75.9C146.5 104 158.2 96 171.3 96zM272 192V96h81.2c9.7 0 18.9 4.4 25 12l67.2 84H272zm256.2 1L428.2 68c-18.2-22.8-45.8-36-75-36H171.3c-39.3 0-74.6 23.9-89.1 60.3L40.6 196.4C16.8 205.8 0 228.9 0 256V368c0 17.7 14.3 32 32 32H65.3c7.6 45.4 47.1 80 94.7 80s87.1-34.6 94.7-80H385.3c7.6 45.4 47.1 80 94.7 80s87.1-34.6 94.7-80H608c17.7 0 32-14.3 32-32V320c0-65.2-48.8-119-111.8-127zM434.7 368a48 48 0 1 1 90.5 32 48 48 0 1 1 -90.5-32zM160 336a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"/></svg> },
  { value: 'camioneta', label: 'Camionetă / Van', icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 640 512"><path d="M64 104v88h96V96H72c-4.4 0-8 3.6-8 8zm482 88L465.1 96H384v96H546zm-226 0V96H224v96h96zM592 384H576c0 53-43 96-96 96s-96-43-96-96H256c0 53-43 96-96 96s-96-43-96-96H48c-26.5 0-48-21.5-48-48V104C0 64.2 32.2 32 72 32H192 320 465.1c18.9 0 36.8 8.3 49 22.8L625 186.5c9.7 10.6 15 24.5 15 38.7V336c0 26.5-21.5 48-48 48zm-64 0a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM160 432a48 48 0 1 0 0-96 48 48 0 1 0 0 96z"/></svg> },
  { value: 'motocicleta', label: 'Motocicletă', icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 640 512"><path d="M280 32c-13.3 0-24 10.7-24 24s10.7 24 24 24h57.7l16.4 30.3L256 192l-45.3-45.3c-12-12-28.3-18.7-45.3-18.7H64c-17.7 0-32 14.3-32 32v32h96c88.4 0 160 71.6 160 160c0 11-1.1 21.7-3.2 32h70.4c-2.1-10.3-3.2-21-3.2-32c0-52.2 25-98.6 63.7-127.8l15.4 28.6C402.4 276.3 384 312 384 352c0 70.7 57.3 128 128 128s128-57.3 128-128s-57.3-128-128-128c-13.5 0-26.5 2.1-38.7 6L418.2 128H480c17.7 0 32-14.3 32-32V64c0-17.7-14.3-32-32-32H459.6c-7.5 0-14.7 2.6-20.5 7.4L391.7 78.9l-14-26c-7-12.9-20.5-21-35.2-21H280zM462.7 311.2l28.2 52.2c6.3 11.7 20.9 16 32.5 9.7s16-20.9 9.7-32.5l-28.2-52.2c2.3-.3 4.7-.4 7.1-.4c35.3 0 64 28.7 64 64s-28.7 64-64 64s-64-28.7-64-64c0-15.5 5.5-29.7 14.7-40.8zM187.3 376c-9.5 23.5-32.5 40-59.3 40c-35.3 0-64-28.7-64-64s28.7-64 64-64c26.9 0 49.9 16.5 59.3 40h66.4C242.5 268.8 190.5 224 128 224C57.3 224 0 281.3 0 352s57.3 128 128 128c62.5 0 114.5-44.8 125.8-104H187.3zM128 384a32 32 0 1 0 0-64 32 32 0 1 0 0 64z"/></svg> },
  { value: 'camion', label: 'Camion', icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 640 512"><path d="M0 48C0 21.5 21.5 0 48 0H368c26.5 0 48 21.5 48 48V96h50.7c17 0 33.3 6.7 45.3 18.7L589.3 192c12 12 18.7 28.3 18.7 45.3V256v32 64c17.7 0 32 14.3 32 32s-14.3 32-32 32H576c0 53-43 96-96 96s-96-43-96-96H256c0 53-43 96-96 96s-96-43-96-96H48c-26.5 0-48-21.5-48-48V48zM416 256H544V237.3L466.7 160H416v96zM160 464a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm368-48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0z"/></svg> },
  { value: 'autobuz', label: 'Autobuz / Microbuz', icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 576 512"><path d="M288 0C422.4 0 512 35.2 512 80V96l0 32c17.7 0 32 14.3 32 32v64c0 17.7-14.3 32-32 32l0 160c0 17.7-14.3 32-32 32v32c0 17.7-14.3 32-32 32H416c-17.7 0-32-14.3-32-32V448H192v32c0 17.7-14.3 32-32 32H128c-17.7 0-32-14.3-32-32l0-32c-17.7 0-32-14.3-32-32l0-160c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h0V96h0V80C64 35.2 153.6 0 288 0zM128 160v96c0 17.7 14.3 32 32 32H272c17.7 0 32-14.3 32-32V160c0-17.7-14.3-32-32-32H160c-17.7 0-32 14.3-32 32zM304 128H416c17.7 0 32 14.3 32 32v96c0 17.7-14.3 32-32 32H304c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32zM144 400a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm288 32a32 32 0 1 0 0-64 32 32 0 1 0 0 64zM384 80c0-8.8-7.2-16-16-16H208c-8.8 0-16 7.2-16 16s7.2 16 16 16H368c8.8 0 16-7.2 16-16z"/></svg> },
  { value: 'rulota', label: 'Rulotă / Camping', icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 640 512"><path d="M0 112C0 67.8 35.8 32 80 32H416c44.2 0 80 35.8 80 80v272c17.7 0 32 14.3 32 32s-14.3 32-32 32H544c0 53-43 96-96 96s-96-43-96-96H160c0 53-43 96-96 96S-32 501 -32 448H32 48C21.5 448 0 426.5 0 400V112zm80 0v64H272V112H80zm0 112V288H176V224H80zm96 80H80v16c0 17.7 14.3 32 32 32H176V304zM272 272v16c0 26.5 21.5 48 48 48h96V272H272zM416 384c-17.7 0-32 14.3-32 32v32h64V416c0-17.7-14.3-32-32-32zm32-160V112H320V224H448zM224 400a32 32 0 1 1 0 64 32 32 0 1 1 0-64zm192 32a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg> },
  { value: 'utilaj', label: 'Utilaj / Echipament', icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 640 512"><path d="M96 64c0-35.3 28.7-64 64-64H266.3c26.2 0 49.7 15.9 59.4 40.2L373.7 160H480V126.2c0-24.8 5.8-49.3 16.9-71.6l2.5-5c7.9-15.8 27.1-22.2 42.9-14.3s22.2 27.1 14.3 42.9l-2.5 5c-6.7 13.3-10.1 28-10.1 42.9V160h56c22.1 0 40 17.9 40 40v45.4c0 16.5-8.5 31.9-22.6 40.7l-43.3 27.1c-14.2-5.9-29.8-9.2-46.1-9.2c-39.3 0-74.1 18.9-96 48H352c0 17.7-14.3 32-32 32h-8.2c-1.7 4.8-3.7 9.5-5.8 14.1l5.8 5.8c12.5 12.5 12.5 32.8 0 45.3l-22.6 22.6c-12.5 12.5-32.8 12.5-45.3 0l-5.8-5.8c-4.6 2.2-9.3 4.1-14.1 5.8V480c0 17.7-14.3 32-32 32H160c-17.7 0-32-14.3-32-32v-8.2c-4.8-1.7-9.5-3.7-14.1-5.8l-5.8 5.8c-12.5 12.5-32.8 12.5-45.3 0L40.2 449.1c-12.5-12.5-12.5-32.8 0-45.3l5.8-5.8c-2.2-4.6-4.1-9.3-5.8-14.1H32c-17.7 0-32-14.3-32-32V320c0-17.7 14.3-32 32-32h8.2c1.7-4.8 3.7-9.5 5.8-14.1l-5.8-5.8c-12.5-12.5-12.5-32.8 0-45.3l22.6-22.6c12.5-12.5 32.8-12.5 45.3 0l5.8 5.8c4.6-2.2 9.3-4.1 14.1-5.8V192c0-17.7 14.3-32 32-32h8.2c1.7-4.8 3.7-9.5 5.8-14.1l-5.8-5.8c-12.5-12.5-12.5-32.8 0-45.3l22.6-22.6c9-9 21.9-11.5 33.1-7.6V64zm64 64v48c0 17.7 14.3 32 32 32h48c17.7 0 32-14.3 32-32s-14.3-32-32-32H224c-17.7 0-32 14.3-32 32zM544 320a96 96 0 1 1 0 192 96 96 0 1 1 0-192z"/></svg> },
  { value: 'atv', label: 'ATV / Quad', icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 640 512"><path d="M171.3 96H224v96H111.3l30.4-75.9C146.5 104 158.2 96 171.3 96zm117.1 0H368c8.8 0 16 7.2 16 16v96h-96V96h.4zM448 96h32c8.8 0 16 7.2 16 16v96H448V96zM111.3 224H496c8.8 0 16 7.2 16 16V368c0 17.7-14.3 32-32 32h-3.6c-5 31.3-32.1 55.4-64.4 55.4c-32.4 0-59.4-24.2-64.4-55.4H292.4c-5 31.3-32.1 55.4-64.4 55.4c-32.3 0-59.4-24.2-64.4-55.4H144c-26.5 0-48-21.5-48-48V238.5c0-19 7.6-37.2 21.1-50.6l30.4-30.4c7.5-7.5 17.7-11.7 28.3-11.7zM176 368a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm272-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"/></svg> }
];

export default function VehicleTypeDropdown({ value, onChange }: VehicleTypeDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedVehicle = vehicleTypes.find(v => v.value === value);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="form-select w-full flex items-center justify-between min-h-12 sm:min-h-11 touch-manipulation"
      >
        <span className="flex items-center gap-2">
          {selectedVehicle ? (
            <>
              {selectedVehicle.icon}
              <span>{selectedVehicle.label}</span>
            </>
          ) : (
            <span className="text-gray-400">Selectează</span>
          )}
        </span>
        <svg className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="fixed sm:absolute inset-0 sm:inset-auto sm:top-full sm:left-0 sm:right-0 z-50 sm:mt-2 w-full sm:w-auto bg-slate-800 sm:border border-white/10 sm:rounded-xl shadow-xl max-h-screen sm:max-h-80 overflow-hidden flex flex-col">
          <div className="p-3 sm:p-0 border-b sm:border-0 border-white/10 flex sm:hidden items-center">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors touch-manipulation"
              aria-label="Închide"
            >
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <span className="flex-1 text-center text-sm font-medium text-gray-300">Tip vehicul</span>
            <div className="w-9"></div>
          </div>
          <div className="flex-1 overflow-y-auto">
          {vehicleTypes.map((vehicle) => (
            <button
              key={vehicle.value}
              type="button"
              onClick={() => {
                onChange(vehicle.value);
                setIsOpen(false);
              }}
              className="w-full px-4 py-4 sm:py-3 text-left hover:bg-white/5 active:bg-white/10 transition-colors flex items-center gap-3 text-gray-300 hover:text-white touch-manipulation"
            >
              <span className="text-orange-400">{vehicle.icon}</span>
              <span>{vehicle.label}</span>
            </button>
          ))}
          </div>
        </div>
      )}
    </div>
  );
}
