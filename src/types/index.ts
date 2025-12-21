export type UserRole = 'client' | 'curier' | 'admin';

export interface User {
  uid: string;
  email: string;
  role: UserRole;
  displayName?: string;
  nume?: string;
  telefon?: string;
  createdAt?: Date;
}

export interface CoverageZone {
  id?: string;
  uid: string;
  tara: string;
  judet: string;
  addedAt?: Date;
}

export interface Order {
  id?: string;
  orderNumber?: number;
  uid_client?: string;
  courierId?: string;
  nume?: string;
  email?: string;
  telefon?: string;
  serviciu?: string;
  tara_ridicare?: string;
  judet_ridicare?: string;
  oras_ridicare?: string;
  adresa_ridicare?: string;
  tara_livrare?: string;
  judet_livrare?: string;
  oras_livrare?: string;
  adresa_livrare?: string;
  greutate?: string;
  lungime?: string;
  latime?: string;
  inaltime?: string;
  cantitate?: string;
  tip_vehicul?: string;
  descriere?: string;
  tip_programare?: 'data_specifica' | 'range' | 'flexibil';
  data_ridicare?: string;
  data_ridicare_end?: string;
  optiuni?: string[];
  tip_ofertanti?: string[];
  status?: 'noua' | 'acceptata' | 'in_tranzit' | 'livrata' | 'anulata' | 'in_lucru';
  observatii?: string;
  timestamp?: number;
  createdAt?: Date | { toDate: () => Date };
  nrOferte?: number;
  nrMesajeNoi?: number;
  // Curier-specific fields (legacy naming)
  tipColet?: string;
  expeditorTara?: string;
  expeditorJudet?: string;
  destinatarTara?: string;
  destinatarJudet?: string;
  dataColectare?: string;
  ora?: string;
  clientName?: string;
  clientPhone?: string;
}

export interface CourierProfile {
  uid: string;
  nume: string;
  telefon: string;
  denumire_firma?: string;
  adresa_sediu?: string;
  tara_sediu?: string;
  nr_inmatriculare?: string;
  cui?: string;
  iban?: string;
  services: string[];
  status: 'active' | 'pending' | 'suspended';
  rating?: number;
  reviewCount?: number;
  verificationStatus?: 'verified' | 'pending' | 'none';
  insuranceStatus?: 'verified' | 'pending' | 'none';
}
