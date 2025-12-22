// src/utils/documentRequirements.ts
import { DocumentRequirement } from '@/types/index';

/**
 * Returns the list of required documents for a courier based on country, services, and business type.
 * Used by both curier profile and verificare pages.
 */
export function getDocumentRequirements(
  countryCode: string,
  activeServices: string[],
  tipBusiness: 'firma' | 'pf'
): DocumentRequirement[] {
  const documents: DocumentRequirement[] = [];

  // === ALWAYS REQUIRED: ID Document ===
  documents.push({
    id: 'id_card',
    title: countryCode === 'gb'
      ? 'Driving Licence / Passport'
      : 'Carte de Identitate / Pașaport',
    description: countryCode === 'gb'
      ? 'Full UK Driving Licence or valid Passport'
      : 'Copie față-verso a actului de identitate valid',
    required: true,
    icon: countryCode === 'gb' ? 'license' : 'id',
    category: 'identity',
  });

  // === FIRMA (Company) specific documents ===
  if (tipBusiness === 'firma') {
    documents.push({
      id: 'company_registration',
      title: countryCode === 'ro' ? 'Certificat CUI/CIF' :
             countryCode === 'gb' ? 'Certificate of Incorporation' :
             countryCode === 'de' ? 'Handelsregisterauszug' :
             countryCode === 'fr' ? 'Extrait Kbis' :
             countryCode === 'it' ? 'Visura Camerale' :
             countryCode === 'es' ? 'Certificado de Inscripción' :
             'Certificat Înregistrare Firmă',
      description: 'Document oficial de înregistrare a companiei',
      required: true,
      icon: 'company',
      category: 'company',
    });
  }

  // === PF (Individual) specific documents ===
  if (tipBusiness === 'pf') {
    documents.push({
      id: 'pf_authorization',
      title: countryCode === 'ro' ? 'Autorizație PFA / II / IF' :
             countryCode === 'gb' ? 'Self-Employment Registration' :
             countryCode === 'de' ? 'Gewerbeanmeldung' :
             'Autorizație Persoană Fizică',
      description: 'Document care atestă activitatea ca persoană fizică autorizată',
      required: false,
      icon: 'company',
      category: 'company',
    });
  }

  // === SERVICE-SPECIFIC DOCUMENTS ===
  if (activeServices.includes('Animale')) {
    documents.push({
      id: 'pet_transport_cert',
      title: countryCode === 'ro' ? 'Autorizație ANSVSA' :
             countryCode === 'gb' ? 'APHA Pet Transport Licence' :
             countryCode === 'de' ? 'Tiertransport-Zulassung' :
             countryCode === 'fr' ? 'Agrément Transporteur' :
             'Certificat Transport Animale',
      description: 'Autorizație obligatorie pentru transportul animalelor',
      required: false,
      icon: 'pet',
      category: 'special',
      forServices: ['Animale'],
    });
  }
  if (activeServices.includes('Platformă')) {
    documents.push({
      id: 'platform_license',
      title: 'Atestat Platformă Auto',
      description: 'Atestat pentru operare platformă/trailer',
      required: false,
      icon: 'vehicle',
      category: 'transport',
      forServices: ['Platformă'],
    });
  }
  if (activeServices.includes('Paleți')) {
    documents.push({
      id: 'heavy_transport_cert',
      title: 'Certificat Transport Marfă',
      description: 'Atestat profesional pentru transport marfă',
      required: false,
      icon: 'transport',
      category: 'transport',
      forServices: ['Paleți'],
    });
  }
  if (activeServices.includes('Persoane')) {
    documents.push({
      id: 'passenger_transport_license',
      title: countryCode === 'ro' ? 'Licență Transport Persoane' :
             countryCode === 'gb' ? 'Private Hire / Taxi Licence' :
             countryCode === 'de' ? 'Personenbeförderungsschein' :
             countryCode === 'fr' ? 'Licence VTC / Taxi' :
             'Licență Transport Persoane',
      description: 'Autorizație obligatorie pentru transport persoane cu plată',
      required: false,
      icon: 'license',
      category: 'transport',
      forServices: ['Persoane'],
    });
  }
  if (activeServices.includes('Tractari')) {
    documents.push({
      id: 'towing_license',
      title: countryCode === 'ro' ? 'Atestat Tractare Auto' :
             countryCode === 'gb' ? 'Vehicle Recovery Licence' :
             countryCode === 'de' ? 'Abschleppgenehmigung' :
             countryCode === 'fr' ? 'Agrément Dépannage' :
             'Atestat Tractare Auto',
      description: 'Autorizație pentru servicii tractare și asistență rutieră',
      required: false,
      icon: 'vehicle',
      category: 'transport',
      forServices: ['Tractari'],
    });
  }
  if (activeServices.includes('Mobila')) {
    documents.push({
      id: 'furniture_transport_cert',
      title: countryCode === 'ro' ? 'Atestat Transport Mobilier' :
             countryCode === 'gb' ? 'Removal Services Licence' :
             countryCode === 'de' ? 'Umzugslizenz' :
             'Atestat Transport Mobilier',
      description: 'Certificat pentru servicii de mutări și transport mobilier',
      required: false,
      icon: 'transport',
      category: 'transport',
      forServices: ['Mobila'],
    });
  }

  // === INSURANCE DOCUMENTS ===
  if (countryCode === 'gb') {
    documents.push({
      id: 'gb_goods_insurance',
      title: 'Goods in Transit Insurance',
      description: 'Asigurare obligatorie pentru bunuri în tranzit (UK)',
      required: false,
      icon: 'insurance',
      category: 'insurance',
    });
  }
  if (activeServices.some(s => ['Colete', 'Express', 'Fragil', 'Electronice'].includes(s))) {
    documents.push({
      id: 'cmr_insurance',
      title: 'Asigurare CMR',
      description: 'Asigurare pentru transport internațional (recomandat)',
      required: false,
      icon: 'insurance',
      category: 'insurance',
    });
  }

  return documents;
}
