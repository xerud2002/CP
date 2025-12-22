'use client';
import { useState, useRef, useEffect } from 'react';

interface AnimalTypeDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

const animalTypes = [
  { value: 'caine', label: 'Câine', icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 576 512"><path d="M309.6 158.5L332.7 19.8C334.6 8.4 344.5 0 356.1 0c7.5 0 14.5 3.5 19 9.5L392 32h52.1c12.7 0 24.9 5.1 33.9 14.1L496 64h56c13.3 0 24 10.7 24 24v24c0 44.2-35.8 80-80 80H464 448 426.7l-5.1 30.5-112-64zM416 256.1L416 480c0 17.7-14.3 32-32 32H352c-17.7 0-32-14.3-32-32V364.8c-24 12.3-51.2 19.2-80 19.2s-56-6.9-80-19.2V480c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V249.8c-28.8-10.9-51.4-35.3-59.2-66.5L1 167.8c-4.3-17.1 6.1-34.5 23.3-38.8s34.5 6.1 38.8 23.3l3.9 15.5C70.5 182 83.3 192 98 192h30 16H303.8L416 256.1zM464 80a16 16 0 1 0 -32 0 16 16 0 1 0 32 0z"/></svg> },
  { value: 'pisica', label: 'Pisică', icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 576 512"><path d="M320 192h17.1c22.1 38.3 63.5 64 110.9 64c11 0 21.8-1.4 32-4v4 32V480c0 17.7-14.3 32-32 32s-32-14.3-32-32V339.2L280 448h56c17.7 0 32 14.3 32 32s-14.3 32-32 32H192c-53 0-96-43-96-96V192.5c0-16.1-12-29.8-28-31.8l-7.9-1c-17.5-2.2-30-18.2-27.8-35.7s18.2-30 35.7-27.8l7.9 1c48 6 84.1 46.8 84.1 95.3v85.3c34.4-51.7 93.2-85.8 160-85.8zm160 26.5v0c-10 3.5-20.8 5.5-32 5.5c-28.4 0-54-12.4-71.6-32h0c-3.7-4.1-7-8.5-9.9-13.2C357.3 164 352 146.6 352 128v0V32 12 10.7C352 4.8 356.7 .1 362.6 0h.2c3.3 0 6.4 1.6 8.4 4.2l0 .1L384 21.3l27.2 36.3L416 64h64l4.8-6.4L512 21.3 524.8 4.3l0-.1c2-2.6 5.1-4.2 8.4-4.2h.2C539.3 .1 544 4.8 544 10.7V12 32v96c0 17.3-4.6 33.6-12.6 47.6c-11.3 19.8-29.6 35.2-51.4 42.9zM432 128a16 16 0 1 0 -32 0 16 16 0 1 0 32 0zm48 16a16 16 0 1 0 0-32 16 16 0 1 0 0 32z"/></svg> },
  { value: 'pasare', label: 'Pasăre', icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 576 512"><path d="M160 512c53 0 96-43 96-96v-64h64v64c0 53 43 96 96 96s96-43 96-96V352c0-53-43-96-96-96H352V224h64c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64H352 320 160C71.6 0 0 71.6 0 160c0 77.4 54.9 142.2 128 156.8V416c0 53 43 96 96 96zm0-384a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg> },
  { value: 'rozator', label: 'Rozător', icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 512 512"><path d="M336 96c21.2 0 41.3 8.4 56.5 23.5s23.5 35.3 23.5 56.5v0 7.4c5.3-.4 10.6-.7 16-.7C485 182.7 528 225.7 528 279v65c0 63-28.5 122.7-77.7 163.1c-32.1 26.4-73.7 42.9-118.3 42.9c-55 0-102.6-24.9-132.3-62.9C192.9 497.2 186.5 504 176 504H120c-13.3 0-24-10.7-24-24s10.7-24 24-24h56c10.5 0 16.9 6.8 23.7 16.9c14.7 22.1 38.6 41.9 67.3 53.4c18.1 7.3 37.8 11.7 58.9 11.7c32.2 0 61.2-11.4 83.2-30.8C451.8 470.6 472 430.7 472 387V279c0-22.3-17.7-40-40-40s-40 17.7-40 40v39c0 13.3-10.7 24-24 24s-24-10.7-24-24V176 160c0-21.2-8.4-41.3-23.5-56.5S285.2 80 264 80c-43.1 0-79 33.1-82.7 75.1C187.8 152 192 148.1 192 144c0-13.3-10.7-24-24-24s-24 10.7-24 24c0 27.7-19.2 52.1-46.4 58.3c-4.2 1-8.6 1.7-13.1 1.7C55.6 204 32 180.4 32 151.5c0-27.3 21-49.9 48-51.9c13.2-.9 23.3-11.3 23.3-24.6c0-13.6-11-24.6-24.6-24.6H75.7C34 52.5 0 88.4 0 131.5v20C0 207.8 56.2 264 112.5 264c9.2 0 18.2-1.2 26.8-3.4c10.6 13.5 26.9 22.2 45.2 22.2c4.9 0 9.6-.6 14.2-1.7c1.3-.3 2.6-.7 3.9-1.1c7.9 21.4 21.4 40 38.6 54.1c-1.9 8.6-2.9 17.6-2.9 26.8c0 70.7 57.3 128 128 128s128-57.3 128-128v-55.4c0 0 0 0 0 .1c0 0 0 0 0-.1V176c0-10.3-1-20.4-2.9-30c2.5-.5 5-.9 7.5-1.3c5.3-.7 10.7-1.1 16.2-1.1c12.2 0 23.9 1.8 35 5.2c6.7-16.9 10.3-35.2 10.3-54.4c0-79.5-64.5-144-144-144C369.8 0 327.5 21.4 299 55.4C309.6 68.9 318 84.7 323 102c5 6.8 9.4 14.1 13 21.9c3.4-12 9.1-23 16.7-32.6C363.7 77.9 377.6 69 393 65.2c3.2-.8 6.4-1.3 9.7-1.7c-.2-1.8-.3-3.7-.3-5.5c0-17.7 14.3-32 32-32s32 14.3 32 32c0 11.5-6.1 21.5-15.2 27.2c-2.3 1.5-4.9 2.7-7.6 3.6c-14.5 4.9-27.8 13.1-38.7 23.8c-11.8 11.6-20.5 26.3-25 42.5c-1.7 6.1-2.7 12.5-3.1 19c4.1 21 6.9 42.6 8.2 64.7c.8 13.2 11.9 23.5 25.2 23.5s24.4-10.3 25.2-23.5c2-33.2 8.9-64.9 20.3-94.2c2.5-6.4 5.3-12.6 8.4-18.5c-4.6-10.4-7.2-21.8-7.2-33.9c0-46.4 37.6-84 84-84s84 37.6 84 84c0 27.3-13 51.6-33.1 67c-8.9 6.8-19.4 11.7-30.8 14.1c-4.2 .9-8.6 1.5-13.1 1.8c-13.2 .9-23.3 11.3-23.3 24.6c0 13.6 11 24.6 24.6 24.6h2.9c54 -1.8 97.5-46.8 97.5-101.5v-20c0-55.8-45.2-101.1-101-101.1H480c-6.3 0-12.4 .6-18.3 1.7C448.8 21.4 406.5 0 360 0c-30.1 0-57.9 9.2-81 25c23.5 14.3 43.6 33.6 58.5 56.5c5.9-3.6 12.6-5.7 19.8-5.7c21.5 0 38.9 17.4 38.9 38.9s-17.4 38.9-38.9 38.9c-1.4 0-2.8-.1-4.1-.2c-1.3 4.1-2.8 8.1-4.6 11.9c10.6 13.5 26.9 22.2 45.2 22.2c31.7 0 57.5-25.7 57.5-57.5c0-10.5-2.8-20.3-7.7-28.8c23.8 9.2 43.3 27 54.8 49.8c6.7-16.9 10.3-35.2 10.3-54.4c0-79.5-64.5-144-144-144zM256 352a80 80 0 1 0 0 160 80 80 0 1 0 0-160z"/></svg> },
  { value: 'alt', label: 'Alt animal', icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 512 512"><path d="M226.5 92.9c14.3 42.9-.3 86.2-32.6 96.8s-70.1-15.6-84.4-58.5s.3-86.2 32.6-96.8s70.1 15.6 84.4 58.5zM100.4 198.6c18.9 32.4 14.3 70.1-10.2 84.1s-59.7-.9-78.5-33.3S-2.7 179.3 21.8 165.3s59.7 .9 78.5 33.3zM69.2 401.2C121.6 259.9 214.7 224 256 224s134.4 35.9 186.8 177.2c3.6 9.7 5.2 20.1 5.2 30.5v1.6c0 25.8-20.9 46.7-46.7 46.7c-11.5 0-22.9-1.4-34-4.2l-88-22c-15.3-3.8-31.3-3.8-46.6 0l-88 22c-11.1 2.8-22.5 4.2-34 4.2C84.9 480 64 459.1 64 433.3v-1.6c0-10.4 1.6-20.8 5.2-30.5zM421.8 282.7c-24.5-14-29.1-51.7-10.2-84.1s54-47.3 78.5-33.3s29.1 51.7 10.2 84.1s-54 47.3-78.5 33.3zM310.1 189.7c-32.3-10.6-46.9-53.9-32.6-96.8s52.1-69.1 84.4-58.5s46.9 53.9 32.6 96.8s-52.1 69.1-84.4 58.5z"/></svg> }
];

export default function AnimalTypeDropdown({ value, onChange }: AnimalTypeDropdownProps) {
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

  const selectedAnimal = animalTypes.find(a => a.value === value);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="form-select w-full flex items-center justify-between"
      >
        <span className="flex items-center gap-2">
          {selectedAnimal ? (
            <>
              {selectedAnimal.icon}
              <span>{selectedAnimal.label}</span>
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
        <div className="absolute z-50 w-full mt-2 bg-slate-800 border border-white/10 rounded-xl shadow-xl max-h-80 overflow-y-auto">
          {animalTypes.map((animal) => (
            <button
              key={animal.value}
              type="button"
              onClick={() => {
                onChange(animal.value);
                setIsOpen(false);
              }}
              className="w-full px-4 py-3 text-left hover:bg-white/5 transition-colors flex items-center gap-3 text-gray-300 hover:text-white"
            >
              <span className="text-orange-400">{animal.icon}</span>
              <span>{animal.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
