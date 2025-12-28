/**
 * Business and tax registration information by country
 * Used for company profile forms across the application
 */

export interface CountryTaxInfo {
  taxLabel: string;       // Tax ID label (e.g., "CUI / CIF", "VAT Number")
  taxPlaceholder: string; // Example format
  regLabel: string;       // Business registration label
  regPlaceholder: string; // Example format
}

/**
 * Country-specific company tax and registration information
 * Maps country codes to their respective tax ID and business registration formats
 */
export const COUNTRY_TAX_INFO: Record<string, CountryTaxInfo> = {
  RO: { 
    taxLabel: 'CUI / CIF', 
    taxPlaceholder: 'RO12345678', 
    regLabel: 'Nr. înregistrare', 
    regPlaceholder: 'J40/1234/2024' 
  },
  GB: { 
    taxLabel: 'VAT Number', 
    taxPlaceholder: 'GB123456789', 
    regLabel: 'Company Number', 
    regPlaceholder: '12345678' 
  },
  DE: { 
    taxLabel: 'USt-IdNr.', 
    taxPlaceholder: 'DE123456789', 
    regLabel: 'Handelsregister', 
    regPlaceholder: 'HRB 12345' 
  },
  IT: { 
    taxLabel: 'Partita IVA', 
    taxPlaceholder: 'IT12345678901', 
    regLabel: 'REA', 
    regPlaceholder: 'MI-1234567' 
  },
  ES: { 
    taxLabel: 'NIF / CIF', 
    taxPlaceholder: 'ESA12345678', 
    regLabel: 'Registro Mercantil', 
    regPlaceholder: 'Tomo 1234, Folio 56' 
  },
  FR: { 
    taxLabel: 'N° TVA', 
    taxPlaceholder: 'FR12345678901', 
    regLabel: 'SIRET', 
    regPlaceholder: '123 456 789 00012' 
  },
  AT: { 
    taxLabel: 'UID-Nummer', 
    taxPlaceholder: 'ATU12345678', 
    regLabel: 'Firmenbuch', 
    regPlaceholder: 'FN 123456a' 
  },
  BE: { 
    taxLabel: 'N° TVA / BTW', 
    taxPlaceholder: 'BE0123456789', 
    regLabel: 'Nr. întreprindere', 
    regPlaceholder: '0123.456.789' 
  },
  NL: { 
    taxLabel: 'BTW-nummer', 
    taxPlaceholder: 'NL123456789B01', 
    regLabel: 'KVK-nummer', 
    regPlaceholder: '12345678' 
  },
  GR: { 
    taxLabel: 'ΑΦΜ (AFM)', 
    taxPlaceholder: 'EL123456789', 
    regLabel: 'ΓΕΜΗ', 
    regPlaceholder: '123456789000' 
  },
  PT: { 
    taxLabel: 'NIF', 
    taxPlaceholder: 'PT123456789', 
    regLabel: 'NIPC', 
    regPlaceholder: '501234567' 
  },
  IE: { 
    taxLabel: 'VAT Number', 
    taxPlaceholder: 'IE1234567T', 
    regLabel: 'CRO Number', 
    regPlaceholder: '123456' 
  },
  DK: { 
    taxLabel: 'CVR', 
    taxPlaceholder: 'DK12345678', 
    regLabel: 'Virksomhed', 
    regPlaceholder: '12345678' 
  },
  SE: { 
    taxLabel: 'Org.nr', 
    taxPlaceholder: 'SE123456789001', 
    regLabel: 'F-skattsedel', 
    regPlaceholder: '123456-7890' 
  },
  NO: { 
    taxLabel: 'Org.nr', 
    taxPlaceholder: 'NO123456789MVA', 
    regLabel: 'Foretaksregisteret', 
    regPlaceholder: '123 456 789' 
  },
  FI: { 
    taxLabel: 'Y-tunnus', 
    taxPlaceholder: 'FI12345678', 
    regLabel: 'Kaupparekisteri', 
    regPlaceholder: '1234567-8' 
  },
};

/**
 * Get tax info for a country, with fallback to generic labels
 */
export function getCountryTaxInfo(countryCode: string): CountryTaxInfo {
  return COUNTRY_TAX_INFO[countryCode] || {
    taxLabel: 'Tax ID',
    taxPlaceholder: 'Enter tax ID',
    regLabel: 'Registration Number',
    regPlaceholder: 'Enter registration number'
  };
}
