'use client';

import { useState, useRef, useCallback } from 'react';
import Tesseract from 'tesseract.js';

interface LicensePlateScannerProps {
  value: string;
  onChange: (value: string) => void;
  country?: string; // Country code for validation (e.g., 'RO', 'DE')
}

// European license plate patterns by country
const platePatterns: Record<string, { regex: RegExp; example: string; format: string }> = {
  RO: { 
    regex: /^([A-Z]{1,2})\s*(\d{2,3})\s*([A-Z]{3})$/i, 
    example: 'B 123 ABC',
    format: 'XX 00 XXX sau X 000 XXX'
  },
  DE: { 
    regex: /^([A-ZÄÖÜ]{1,3})\s*([A-Z]{1,2})\s*(\d{1,4})$/i, 
    example: 'M AB 1234',
    format: 'XXX XX 0000'
  },
  IT: { 
    regex: /^([A-Z]{2})\s*(\d{3})\s*([A-Z]{2})$/i, 
    example: 'AA 123 BB',
    format: 'XX 000 XX'
  },
  FR: { 
    regex: /^([A-Z]{2})\s*(\d{3})\s*([A-Z]{2})$/i, 
    example: 'AB 123 CD',
    format: 'XX-000-XX'
  },
  ES: { 
    regex: /^(\d{4})\s*([A-Z]{3})$/i, 
    example: '1234 ABC',
    format: '0000 XXX'
  },
  UK: { 
    regex: /^([A-Z]{2})(\d{2})\s*([A-Z]{3})$/i, 
    example: 'AB12 CDE',
    format: 'XX00 XXX'
  },
  AT: { 
    regex: /^([A-Z]{1,2})\s*(\d{1,6})\s*([A-Z]{1,2})$/i, 
    example: 'W 12345 A',
    format: 'X 00000 X'
  },
  HU: { 
    regex: /^([A-Z]{3})\s*(\d{3})$/i, 
    example: 'ABC 123',
    format: 'XXX-000'
  },
  PL: { 
    regex: /^([A-Z]{2,3})\s*([A-Z0-9]{4,5})$/i, 
    example: 'WA 12345',
    format: 'XX(X) 00000'
  },
  CZ: { 
    regex: /^(\d[A-Z]\d)\s*(\d{4})$/i, 
    example: '1A2 3456',
    format: '0X0 0000'
  },
  SK: { 
    regex: /^([A-Z]{2})\s*(\d{3})\s*([A-Z]{2})$/i, 
    example: 'BA 123 AB',
    format: 'XX 000 XX'
  },
  BG: { 
    regex: /^([A-Z]{1,2})\s*(\d{4})\s*([A-Z]{2})$/i, 
    example: 'A 1234 BC',
    format: 'X(X) 0000 XX'
  },
  NL: { 
    regex: /^([A-Z0-9]{2})\s*([A-Z0-9]{2,3})\s*([A-Z0-9]{1,2})$/i, 
    example: 'AB-12-CD',
    format: 'XX-00-XX'
  },
  BE: { 
    regex: /^(\d)\s*([A-Z]{3})\s*(\d{3})$/i, 
    example: '1 ABC 234',
    format: '0-XXX-000'
  },
  MD: { 
    regex: /^([A-Z]{1,3})\s*([A-Z]{2,3})\s*(\d{3})$/i, 
    example: 'C ABC 123',
    format: 'X XX(X) 000'
  },
  UA: { 
    regex: /^([A-Z]{2})\s*(\d{4})\s*([A-Z]{2})$/i, 
    example: 'AA 1234 BB',
    format: 'XX 0000 XX'
  },
};

// Clean OCR text for better plate recognition
function cleanOCRText(text: string): string {
  return text
    .toUpperCase()
    .replace(/[^A-Z0-9\s]/g, '') // Remove special characters
    .replace(/\s+/g, ' ')        // Normalize spaces
    .replace(/0/g, '0')          // Common OCR fixes
    .replace(/O(?=\d)/g, '0')    // O before digit -> 0
    .replace(/(?<=\d)O/g, '0')   // O after digit -> 0
    .replace(/I(?=\d)/g, '1')    // I before digit -> 1
    .replace(/(?<=\d)I/g, '1')   // I after digit -> 1
    .replace(/S(?=\d)/g, '5')    // S before digit -> 5
    .replace(/Z(?=\d)/g, '2')    // Z before digit -> 2
    .trim();
}

// Validate plate against country patterns
function validatePlate(plate: string, country?: string): { valid: boolean; formatted: string } {
  const cleaned = cleanOCRText(plate);
  
  if (country && platePatterns[country]) {
    const pattern = platePatterns[country];
    const match = cleaned.match(pattern.regex);
    if (match) {
      return { valid: true, formatted: match.slice(1).join(' ').toUpperCase() };
    }
  }
  
  // Try all patterns if no country specified or country pattern didn't match
  for (const [, pattern] of Object.entries(platePatterns)) {
    const match = cleaned.match(pattern.regex);
    if (match) {
      return { valid: true, formatted: match.slice(1).join(' ').toUpperCase() };
    }
  }
  
  return { valid: false, formatted: cleaned };
}

export default function LicensePlateScanner({ value, onChange, country }: LicensePlateScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processImage = useCallback(async (file: File) => {
    setIsScanning(true);
    setError(null);
    setProgress(0);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);

    try {
      const result = await Tesseract.recognize(file, 'eng', {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setProgress(Math.round(m.progress * 100));
          }
        },
      });

      const rawText = result.data.text;
      console.log('OCR Raw:', rawText);

      // Find potential plate numbers in the text
      const lines = rawText.split('\n').filter(line => line.trim().length > 0);
      let bestMatch = '';
      
      for (const line of lines) {
        const cleaned = cleanOCRText(line);
        if (cleaned.length >= 5 && cleaned.length <= 12) {
          const validation = validatePlate(cleaned, country);
          if (validation.valid) {
            bestMatch = validation.formatted;
            break;
          }
          // Keep longest potential match
          if (cleaned.length > bestMatch.length) {
            bestMatch = cleaned;
          }
        }
      }

      if (bestMatch) {
        onChange(bestMatch);
        setError(null);
      } else {
        setError('Nu am putut detecta numărul. Încearcă altă poză sau introdu manual.');
      }
    } catch (err) {
      console.error('OCR Error:', err);
      setError('Eroare la procesarea imaginii. Încearcă din nou.');
    } finally {
      setIsScanning(false);
      setProgress(0);
    }
  }, [country, onChange]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('Imaginea e prea mare. Maximum 10MB.');
        return;
      }
      processImage(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      processImage(file);
    }
  };

  const clearPreview = () => {
    setPreview(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const currentPattern = country ? platePatterns[country] : null;

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Număr înmatriculare
      </label>

      {/* Manual input */}
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
          className="form-input w-full pr-24 uppercase tracking-wider font-mono"
          placeholder={currentPattern?.example || 'B 123 ABC'}
          maxLength={15}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isScanning}
          className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 text-sm rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Scanează
        </button>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Format hint */}
      {currentPattern && (
        <p className="text-xs text-gray-500">
          Format: {currentPattern.format} (ex: {currentPattern.example})
        </p>
      )}

      {/* Drop zone - shown when no preview */}
      {!preview && !isScanning && (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed border-gray-700 hover:border-orange-500/50 rounded-xl p-4 text-center cursor-pointer transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="flex flex-col items-center gap-2 text-gray-500">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm">Trage o poză aici sau apasă pentru a selecta</span>
          </div>
        </div>
      )}

      {/* Progress bar */}
      {isScanning && (
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-orange-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-sm text-gray-400 w-12">{progress}%</span>
          </div>
          <p className="text-sm text-gray-400 text-center">Se procesează imaginea...</p>
        </div>
      )}

      {/* Preview */}
      {preview && !isScanning && (
        <div className="relative">
          <img 
            src={preview} 
            alt="Preview" 
            className="w-full max-h-48 object-contain rounded-lg bg-gray-800"
          />
          <button
            type="button"
            onClick={clearPreview}
            className="absolute top-2 right-2 p-1.5 bg-gray-900/80 hover:bg-red-500/80 rounded-full transition-colors"
          >
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Error message */}
      {error && (
        <p className="text-sm text-red-400 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </p>
      )}

      {/* Validation feedback */}
      {value && !error && (
        <div className="flex items-center gap-2">
          {validatePlate(value, country).valid ? (
            <span className="text-sm text-emerald-400 flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Format valid
            </span>
          ) : (
            <span className="text-sm text-amber-400 flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Format nerecunoscut - verifică
            </span>
          )}
        </div>
      )}
    </div>
  );
}
