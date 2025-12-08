// Shared constants across the application

export const countries = [
  { code: 'RO', name: 'România', flag: '/img/flag/ro.svg' },
  { code: 'GB', name: 'Anglia', flag: '/img/flag/gb.svg' },
  { code: 'IT', name: 'Italia', flag: '/img/flag/it.svg' },
  { code: 'ES', name: 'Spania', flag: '/img/flag/es.svg' },
  { code: 'DE', name: 'Germania', flag: '/img/flag/de.svg' },
  { code: 'FR', name: 'Franța', flag: '/img/flag/fr.svg' },
  { code: 'AT', name: 'Austria', flag: '/img/flag/at.svg' },
  { code: 'BE', name: 'Belgia', flag: '/img/flag/be.svg' },
  { code: 'NL', name: 'Olanda', flag: '/img/flag/nl.svg' },
  { code: 'GR', name: 'Grecia', flag: '/img/flag/gr.svg' },
  { code: 'PT', name: 'Portugalia', flag: '/img/flag/pt.svg' },
  { code: 'NO', name: 'Norvegia', flag: '/img/flag/no.svg' },
  { code: 'SE', name: 'Suedia', flag: '/img/flag/se.svg' },
  { code: 'DK', name: 'Danemarca', flag: '/img/flag/dk.svg' },
  { code: 'FI', name: 'Finlanda', flag: '/img/flag/fi.svg' },
  { code: 'IE', name: 'Irlanda', flag: '/img/flag/ie.svg' },
];

// Simple countries list (without flag) for forms
export const countriesSimple = countries.map(({ code, name }) => ({ code, name }));

// Județe by country for coverage zones
export const judetByCountry: Record<string, string[]> = {
  RO: ['București', 'Cluj', 'Timiș', 'Iași', 'Constanța', 'Brașov', 'Prahova', 'Dolj', 'Galați', 'Argeș', 'Sibiu', 'Bihor', 'Mureș', 'Bacău', 'Suceava', 'Hunedoara', 'Neamț', 'Arad', 'Maramureș', 'Alba'],
  GB: ['London', 'Manchester', 'Birmingham', 'Liverpool', 'Leeds', 'Sheffield', 'Bristol', 'Newcastle', 'Nottingham', 'Southampton'],
  IT: ['Milano', 'Roma', 'Napoli', 'Torino', 'Firenze', 'Bologna', 'Venezia', 'Verona', 'Palermo', 'Genova'],
  ES: ['Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Zaragoza', 'Málaga', 'Murcia', 'Palma', 'Bilbao', 'Alicante'],
  DE: ['Berlin', 'München', 'Hamburg', 'Köln', 'Frankfurt', 'Stuttgart', 'Düsseldorf', 'Dortmund', 'Essen', 'Leipzig'],
  FR: ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg', 'Montpellier', 'Bordeaux', 'Lille'],
  AT: ['Wien', 'Graz', 'Linz', 'Salzburg', 'Innsbruck'],
  BE: ['Bruxelles', 'Antwerpen', 'Gent', 'Charleroi', 'Liège'],
  NL: ['Amsterdam', 'Rotterdam', 'Den Haag', 'Utrecht', 'Eindhoven'],
  GR: ['Atena', 'Salonic', 'Patras', 'Heraklion', 'Larisa'],
  PT: ['Lisabona', 'Porto', 'Braga', 'Coimbra', 'Funchal'],
  NO: ['Oslo', 'Bergen', 'Trondheim', 'Stavanger', 'Drammen'],
  SE: ['Stockholm', 'Göteborg', 'Malmö', 'Uppsala', 'Västerås'],
  DK: ['Copenhaga', 'Aarhus', 'Odense', 'Aalborg', 'Esbjerg'],
  FI: ['Helsinki', 'Espoo', 'Tampere', 'Vantaa', 'Oulu'],
  IE: ['Dublin', 'Cork', 'Limerick', 'Galway', 'Waterford'],
};
