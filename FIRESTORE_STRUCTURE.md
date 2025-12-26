# Firestore Database Structure & Data Flow

## 🎯 Overview
Această aplicație folosește Firebase Firestore pentru gestionarea datelor între clienți și curieri în sistemul de transport European.

## 📊 Collections Structure

### 1. **users** (Autentificare & Profile de bază)
```typescript
{
  uid: string,              // Firebase Auth UID (document ID)
  email: string,
  role: 'client' | 'curier' | 'admin',
  displayName?: string,
  nume?: string,
  telefon?: string,
  serviciiOferite?: string[], // Only for curieri - active services
  createdAt: Timestamp
}
```
**Security**: Read all, Write only own document  
**Indexes**: None needed (queries by document ID)

---

### 2. **comenzi** (Comenzi de transport)
```typescript
{
  // Order Identification
  orderNumber: number,       // Sequential: 141121, 141122, etc.
  uid_client: string,        // Client UID (owner)
  courierId?: string,        // Curier UID (when accepted)
  
  // Service Type
  serviciu: string,          // 'colete', 'plicuri', 'persoane', etc.
  
  // Pickup Location
  tara_ridicare: string,     // 'România', 'Anglia', etc.
  judet_ridicare: string,
  oras_ridicare: string,
  adresa_ridicare: string,
  
  // Delivery Location
  tara_livrare: string,
  judet_livrare: string,
  oras_livrare: string,
  adresa_livrare: string,
  
  // Package Details
  greutate: string,
  lungime?: string,
  latime?: string,
  inaltime?: string,
  cantitate: string,
  valoare_marfa?: string,
  descriere?: string,
  
  // Timing
  tip_programare: 'data_specifica' | 'range' | 'flexibil',
  data_ridicare: string,     // ISO date string
  data_ridicare_end?: string,
  
  // Options & Pricing
  optiuni: string[],         // ['asigurare', 'urgenta', etc.]
  tip_ofertanti: string[],   // ['firme', 'persoane_private']
  pret?: number,
  
  // Status & Metadata
  status: 'noua' | 'in_lucru' | 'acceptata' | 'in_tranzit' | 'livrata' | 'anulata',
  statusUpdatedAt?: Timestamp,  // When status last changed
  inLucruAt?: Timestamp,        // When transitioned to 'in_lucru'
  finalizataAt?: Timestamp,     // When marked as 'livrata'
  dismissedBy?: string[],       // Array of courier UIDs who dismissed this order
  observatii?: string,
  orderNumber?: number,         // Sequential order number (e.g., 141121)
  timestamp: number,
  createdAt: Timestamp
}
```
**Security**:
- Read: Own orders (client), assigned orders (curier), all pending orders (curier)
- Create: Clients only, status must be 'noua'
- Update: Owner or assigned courier
- Delete: Owner only, status must be 'noua'
- Status Transitions: See `STATUS_TRANSITIONS.md` for rules

**Indexes**:
- `uid_client` + `timestamp` DESC
- `courierId` + `timestamp` DESC
- `status` + `timestamp` DESC

---

### 3. **recenzii** (Review sistem)
```typescript
{
  clientId: string,          // Client UID (reviewer)
  orderId: string,           // Reference to comenzi doc
  courierId: string,         // Curier UID (reviewed)
  courierName: string,
  rating: number,            // 1-5
  comment: string,
  serviciu: string,          // Service type
  createdAt: Timestamp
}
```
**Security**:
- Read: Client (own reviews), Curier (reviews about them)
- Create: Clients only
- Update/Delete: Client (own reviews)

**Indexes**:
- `clientId` + `createdAt` DESC
- `courierId` + `createdAt` DESC

---

### 4. **zona_acoperire** (Curier coverage zones)
```typescript
{
  uid: string,              // Curier UID
  tara: string,             // 'România', 'Germania', etc.
  judet: string,            // Region/County
  addedAt: Timestamp
}
```
**Security**: Courier owns their zones  
**Indexes**: `uid` + `addedAt` DESC

---

### 5. **tarife_curier** (Curier pricing)
```typescript
{
  uid: string,              // Curier UID
  tara_origine: string,
  tara_destinatie: string,
  serviciu: string,         // 'Colete', 'Plicuri', etc.
  pret: number,
  suboptiuni?: string[],    // ['express', 'frigo', etc.]
  addedAt: Timestamp
}
```
**Security**: Courier owns their tariffs  
**Indexes**: `uid` + `addedAt` DESC

---

### 6. **profil_curier** (Extended courier profile)
```typescript
{
  uid: string,              // Document ID = UID
  nume: string,
  telefon: string,
  denumire_firma?: string,
  adresa_sediu?: string,
  tara_sediu?: string,
  nr_inmatriculare?: string,
  cui?: string,
  iban?: string,
  services: string[],       // Active services
  status: 'active' | 'pending' | 'suspended'
}
```
**Security**: Courier owns their profile  
**Indexes**: None needed

---

### 7. **profil_client** (Extended client profile)
```typescript
{
  uid: string,              // Document ID = UID
  nume: string,
  telefon: string,
  adresa?: string,
  tara?: string,
  judet?: string
}
```
**Security**: Client owns their profile  
**Indexes**: None needed

---

### 8. **calendar_colectii** (Courier availability calendar)
```typescript
{
  courierId: string,        // Curier UID
  data: string,             // ISO date
  dataTimestamp: number,    // Unix timestamp for sorting
  disponibil: boolean,
  observatii?: string
}
```
**Security**: Courier manages their calendar  
**Indexes**: `courierId` + `dataTimestamp` ASC

---

### 9. **transport_persoane** (Person transport routes)
```typescript
{
  uid: string,              // Curier UID
  oras_origine: string,
  oras_destinatie: string,
  tara_origine: string,
  tara_destinatie: string,
  pret: number,
  tip_vehicul?: string,
  nr_locuri?: number
}
```
**Security**: Courier owns their routes  
**Indexes**: None needed

---

### 11. **counters** (Sequential numbering)
```typescript
{
  current: number           // Current order number
}
```
Document ID: `orderNumber`  
**Security**: Read all, Write authenticated (with transactions)  
**Indexes**: None needed

---

## 🔄 Data Flow

### Order Creation Flow (Client → Curier)
```
1. Client fills form → /comanda
2. Validate & getNextOrderNumber()
3. Save to 'comenzi' with status='pending', uid_client=user.uid
4. Curiers see in /dashboard/curier/comenzi (filtered by active services)
5. Curier accepts → Update courierId, status='accepted'
6. Status progression: accepted → in_transit → completed
7. Client can review → Create doc in 'recenzii'
```

### Service Matching Logic
```typescript
// In comenzi/page.tsx
1. Load courier's active services from users.serviciiOferite
2. Filter orders where: 
   - status == 'pending' AND
   - serviciu.toLowerCase() IN activeServices.map(s => s.toLowerCase())
3. Case-insensitive comparison handles:
   - 'colete' (order) ←→ 'Colete' (curier service)
```

### Security Layers
1. **Firebase Auth**: Required for all operations
2. **Firestore Rules**: Field-level access control
3. **Client-side filtering**: Additional UX layer
4. **Transaction-based counters**: Atomic order numbering

---

## 🔐 Security Best Practices

### ✅ Implemented
- All collections require authentication
- Owner-based access control (uid fields)
- Status-based restrictions (can't delete non-pending orders)
- Couriers only see pending orders + their own
- Clients only see their own orders & reviews

### 🛡️ Recommendations
1. Add server-side Cloud Functions for:
   - Order validation
   - Price calculation
   - Email notifications
   - Status change validation

2. Add audit logging:
   - Order status changes
   - Profile modifications
   - Review submissions

3. Rate limiting:
   - Max orders per day per client
   - Max reviews per order

---

## 📝 Naming Conventions

### Collections
- lowercase with underscores: `zona_acoperire`, `profil_curier`

### Fields
- snake_case for data fields: `uid_client`, `tara_ridicare`
- camelCase for metadata: `createdAt`, `timestamp`, `courierId`

### Service Names
- **Storage**: lowercase (`'colete'`, `'plicuri'`, `'persoane'`)
- **Display**: Capitalized (`'Colete'`, `'Plicuri'`, `'Persoane'`)
- **Comparison**: Always normalize to lowercase

---

## 🚀 Query Optimization

### Most Used Queries
```typescript
// Client orders
query(collection(db, 'comenzi'), 
  where('uid_client', '==', user.uid),
  orderBy('timestamp', 'desc'))

// Pending orders for courier
query(collection(db, 'comenzi'),
  where('status', '==', 'pending'),
  orderBy('timestamp', 'desc'))

// Courier's accepted orders
query(collection(db, 'comenzi'),
  where('courierId', '==', user.uid),
  orderBy('timestamp', 'desc'))

// Client reviews
query(collection(db, 'recenzii'),
  where('clientId', '==', user.uid),
  orderBy('createdAt', 'desc'))
```

### Required Composite Indexes
All composite indexes are defined in `firestore.indexes.json` and must be deployed via Firebase CLI.

---

## 🔧 Maintenance Tasks

### Regular
- Monitor counter collection for accuracy
- Archive old completed orders (> 6 months)
- Backup reviews periodically

### On Schema Changes
1. Update this documentation
2. Update TypeScript interfaces in `src/types/index.ts`
3. Update Firestore rules in `firestore.rules`
4. Update indexes in `firestore.indexes.json`
5. Deploy: `firebase deploy --only firestore`

---

**Last Updated**: December 12, 2025  
**Version**: 1.0
