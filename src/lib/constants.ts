// Shared constants across the application

// Countries sorted alphabetically by name
export const countries = [
  { code: 'GB', name: 'Anglia', flag: '/img/flag/gb.svg' },
  { code: 'AT', name: 'Austria', flag: '/img/flag/at.svg' },
  { code: 'BE', name: 'Belgia', flag: '/img/flag/be.svg' },
  { code: 'DK', name: 'Danemarca', flag: '/img/flag/dk.svg' },
  { code: 'FI', name: 'Finlanda', flag: '/img/flag/fi.svg' },
  { code: 'FR', name: 'Franța', flag: '/img/flag/fr.svg' },
  { code: 'DE', name: 'Germania', flag: '/img/flag/de.svg' },
  { code: 'GR', name: 'Grecia', flag: '/img/flag/gr.svg' },
  { code: 'IE', name: 'Irlanda', flag: '/img/flag/ie.svg' },
  { code: 'IT', name: 'Italia', flag: '/img/flag/it.svg' },
  { code: 'NO', name: 'Norvegia', flag: '/img/flag/no.svg' },
  { code: 'NL', name: 'Olanda', flag: '/img/flag/nl.svg' },
  { code: 'PT', name: 'Portugalia', flag: '/img/flag/pt.svg' },
  { code: 'RO', name: 'România', flag: '/img/flag/ro.svg' },
  { code: 'ES', name: 'Spania', flag: '/img/flag/es.svg' },
  { code: 'SE', name: 'Suedia', flag: '/img/flag/se.svg' },
];

// Simple countries list (without flag) for forms
export const countriesSimple = countries.map(({ code, name }) => ({ code, name }));

// Județe/Regions by country - sorted alphabetically within each country
export const judetByCountry: Record<string, string[]> = {
  RO: ['Alba', 'Arad', 'Argeș', 'Bacău', 'Bihor', 'Brașov', 'București', 'Cluj', 'Constanța', 'Dolj', 'Galați', 'Hunedoara', 'Iași', 'Maramureș', 'Mureș', 'Neamț', 'Prahova', 'Sibiu', 'Suceava', 'Timiș'],
  GB: ['Birmingham', 'Bristol', 'Leeds', 'Liverpool', 'London', 'Manchester', 'Newcastle', 'Nottingham', 'Sheffield', 'Southampton'],
  IT: ['Bologna', 'Firenze', 'Genova', 'Milano', 'Napoli', 'Palermo', 'Roma', 'Torino', 'Venezia', 'Verona'],
  ES: ['Alicante', 'Barcelona', 'Bilbao', 'Madrid', 'Málaga', 'Murcia', 'Palma', 'Sevilla', 'Valencia', 'Zaragoza'],
  DE: ['Berlin', 'Dortmund', 'Düsseldorf', 'Essen', 'Frankfurt', 'Hamburg', 'Köln', 'Leipzig', 'München', 'Stuttgart'],
  FR: ['Bordeaux', 'Lille', 'Lyon', 'Marseille', 'Montpellier', 'Nantes', 'Nice', 'Paris', 'Strasbourg', 'Toulouse'],
  AT: ['Graz', 'Innsbruck', 'Linz', 'Salzburg', 'Wien'],
  BE: ['Antwerpen', 'Bruxelles', 'Charleroi', 'Gent', 'Liège'],
  NL: ['Amsterdam', 'Den Haag', 'Eindhoven', 'Rotterdam', 'Utrecht'],
  GR: ['Atena', 'Heraklion', 'Larisa', 'Patras', 'Salonic'],
  PT: ['Braga', 'Coimbra', 'Funchal', 'Lisabona', 'Porto'],
  NO: ['Bergen', 'Drammen', 'Oslo', 'Stavanger', 'Trondheim'],
  SE: ['Göteborg', 'Malmö', 'Stockholm', 'Uppsala', 'Västerås'],
  DK: ['Aalborg', 'Aarhus', 'Copenhaga', 'Esbjerg', 'Odense'],
  FI: ['Espoo', 'Helsinki', 'Oulu', 'Tampere', 'Vantaa'],
  IE: ['Cork', 'Dublin', 'Galway', 'Limerick', 'Waterford'],
};
