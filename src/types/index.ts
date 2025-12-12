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
  uid_client: string;
  nume: string;
  email: string;
  telefon: string;
  adresa_ridicare: string;
  adresa_livrare: string;
  tara_ridicare: string;
  judet_ridicare: string;
  tara_livrare: string;
  judet_livrare: string;
  greutate: string;
  data_ridicare: string;
  optiuni: string[];
  status: 'pending' | 'accepted' | 'in_transit' | 'delivered' | 'cancelled';
  timestamp: number;
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
}
