# Service Flow Architecture: Client → Order → Courier

## 📋 Overview
This document explains the complete flow of how orders work in the Curierul Perfect platform, from client order creation to courier fulfillment, broken down by service type.

---

## 🔄 High-Level Flow

```
CLIENT                    FIRESTORE                   COURIER
  │                          │                          │
  ├─ Select Service         │                          │
  ├─ Fill Order Form        │                          │
  ├─ Submit Order ──────────► comenzi (status: noua)  │
  │                          │                          │
  │                          │ ◄────────────────────── View All Orders
  │                          │                          │ (filtered by serviciiOferite)
  │                          │                          │
  │                          │ ◄────────────────────── Accept/Message
  │                          │ (status: noua → in_lucru)│
  │                          │                          │
  │ ◄──── Notification ──────┤                          │
  │                          │                          │
  │                          │ ◄────────────────────── Finalize
  │                          │ (status: in_lucru → livrata)
  │                          │                          │
  └─ Leave Review ──────────► recenzii                 │
                              │                          │
```

---

## 🎯 Service Types & Data Structure

### Common Data Fields (All Services)
Every order in the `comenzi` collection contains:

```typescript
{
  // Identification
  orderNumber: number,         // Sequential: CP141121, CP141122...
  uid_client: string,          // Owner of the order
  courierId?: string,          // Assigned courier (when accepted)
  
  // Service Type
  serviciu: string,            // 'colete', 'plicuri', 'persoane', etc.
  
  // Locations
  tara_ridicare: string,       // Pickup country code ('RO', 'GB', 'DE')
  judet_ridicare: string,      // Pickup region/county
  oras_ridicare: string,       // Pickup city
  adresa_ridicare: string,     // Pickup address
  
  tara_livrare: string,        // Delivery country
  judet_livrare: string,       // Delivery region
  oras_livrare: string,        // Delivery city
  adresa_livrare: string,      // Delivery address
  
  // Timing
  tip_programare: 'data_specifica' | 'range' | 'flexibil',
  data_ridicare: string,       // ISO date
  data_ridicare_end?: string,  // For 'range' type
  
  // Options
  optiuni: string[],           // e.g., ['asigurare', 'frigo']
  tip_ofertanti: string[],     // ['firme', 'persoane_private']
  
  // Status & Metadata
  status: 'noua' | 'in_lucru' | 'acceptata' | 'in_tranzit' | 'livrata' | 'anulata',
  timestamp: number,
  createdAt: Timestamp,
  statusUpdatedAt?: Timestamp
}
```

---

## 📦 Service-Specific Fields & Flow

### 1. **Colete** (Packages)
**Client Input:**
```typescript
{
  serviciu: 'colete',
  greutate: string,            // "5kg", "10kg"
  lungime: string,             // "50cm"
  latime: string,              // "40cm"
  inaltime: string,            // "30cm"
  cantitate: string,           // "2"
  descriere: string,           // "Colet fragil, electronice"
  optiuni: ['asigurare', 'frigo'],  // Optional
}
```

**Courier View:**
- Sees orders where `serviciu = 'colete'` (lowercase)
- Matches if courier's `serviciiOferite` includes `'Colete'` (capitalized)
- Displays: Weight, dimensions, quantity, description
- Special options: Insurance, Refrigerated transport

**Matching Logic:**
```typescript
// From courier dashboard
const userServices = user.serviciiOferite?.map(s => s.toLowerCase().trim()) || [];
const orderService = order.serviciu.toLowerCase().trim();
const matchesService = userServices.includes(orderService);
```

---

### 2. **Plicuri** (Documents/Envelopes)
**Client Input:**
```typescript
{
  serviciu: 'plicuri',
  greutate: string,            // Usually light
  cantitate: string,           // Number of envelopes
  descriere: string,           // "Contracte, acte notariale"
  optiuni: ['asigurare'],      // Optional
}
```

**Courier View:**
- Matches if `serviciiOferite` includes `'Plicuri'`
- Displays: Weight, quantity, description
- Special options: Insurance for valuable documents
- Often marked as urgent/express

---

### 3. **Persoane** (Person Transport)
**Client Input:**
```typescript
{
  serviciu: 'persoane',
  cantitate: string,           // Number of passengers
  descriere: string,           // "2 adulți + copil, bagaje mici"
  optiuni: ['asigurare', 'bagaje_extra', 'animale'],
}
```

**Courier View:**
- Matches if `serviciiOferite` includes `'Persoane'`
- Displays: Number of passengers, special needs
- Special options:
  - Extra luggage
  - Pet transport
  - Insurance for passengers

**Additional Data Source:**
- Couriers may also create routes in `transport_persoane` collection
- Route-based matching for regular trips

---

### 4. **Electronice** (Electronics)
**Client Input:**
```typescript
{
  serviciu: 'electronice',
  greutate: string,
  lungime: string,
  latime: string,
  inaltime: string,
  cantitate: string,
  descriere: string,           // "Laptop, TV 55 inch"
  valoare_marfa?: string,      // Value for insurance
  optiuni: ['asigurare', 'ambalare_speciala'],
}
```

**Courier View:**
- Matches if `serviciiOferite` includes `'Electronice'`
- Displays: Dimensions, weight, value, description
- Special options:
  - Insurance (important for high-value items)
  - Professional packaging for fragile equipment

---

### 5. **Animale** (Pet Transport)
**Client Input:**
```typescript
{
  serviciu: 'animale',
  cantitate: string,           // "1" (usually)
  greutate: string,            // Pet weight
  descriere: string,           // "Câine Labrador, 25kg, cușcă proprie"
  optiuni: ['asigurare', 'cusca_transport'],
}
```

**Courier View:**
- Matches if `serviciiOferite` includes `'Animale'`
- Displays: Pet type, weight, special requirements
- Special options:
  - Insurance
  - Professional transport cage/crate
- Requires vaccination certificates

---

### 6. **Platforma** (Platform Transport)
**Client Input:**
```typescript
{
  serviciu: 'platforma',
  greutate: string,            // Vehicle/equipment weight
  lungime: string,
  latime: string,
  descriere: string,           // "BMW Seria 3, 2018, funcțional"
  valoare_marfa?: string,
  optiuni: ['asigurare', 'incarcare_descarcare'],
}
```

**Courier View:**
- Matches if `serviciiOferite` includes `'Platforma'`
- Displays: Vehicle/equipment details, weight, dimensions
- Special options:
  - Insurance
  - Loading/unloading with specialized equipment

---

### 7. **Tractari** (Towing/Roadside Assistance)
**Client Input:**
```typescript
{
  serviciu: 'tractari',
  greutate: string,            // Vehicle weight
  descriere: string,           // "Dacia Logan, panã motor, A1 km 45"
  optiuni: ['asigurare'],
}
```

**Courier View:**
- Matches if `serviciiOferite` includes `'Tractari'`
- Displays: Vehicle type, issue, location
- Special options:
  - Insurance
- Often urgent/immediate need

---

### 8. **Mobila** (Furniture Moving)
**Client Input:**
```typescript
{
  serviciu: 'mobila',
  greutate: string,            // Total weight estimate
  cantitate: string,           // Number of pieces
  descriere: string,           // "Canapea 3 locuri, dulap 2m, masă"
  optiuni: ['asigurare', 'montaj_demontaj', 'ambalare'],
}
```

**Courier View:**
- Matches if `serviciiOferite` includes `'Mobila'`
- Displays: Furniture list, quantity, weight
- Special options:
  - Insurance
  - Disassembly/Assembly service
  - Professional packing materials

---

### 9. **Paleti** (Pallet Transport)
**Client Input:**
```typescript
{
  serviciu: 'paleti',
  greutate: string,            // Per pallet or total
  cantitate: string,           // Number of pallets
  descriere: string,           // "2 paleți produse alimentare, 500kg fiecare"
  optiuni: ['asigurare', 'frigo', 'incarcare_descarcare'],
}
```

**Courier View:**
- Matches if `serviciiOferite` includes `'Paleti'`
- Displays: Pallet count, weight, contents
- Special options:
  - Insurance
  - Refrigerated transport
  - Forklift loading/unloading

---

## 🔍 How Couriers See Orders

### Courier Service Activation
In `/dashboard/curier/servicii/page.tsx`:

```typescript
// Courier activates services in users collection
await updateDoc(doc(db, 'users', user.uid), {
  serviciiOferite: ['Colete', 'Plicuri', 'Persoane']  // Capitalized
});
```

### Order Filtering Logic
In `/dashboard/curier/comenzi/page.tsx`:

```typescript
// Step 1: Fetch courier's active services
const userQuery = query(collection(db, 'users'), where('uid', '==', user.uid));
const userData = (await getDocs(userQuery)).docs[0].data();
const activeServices = userData.serviciiOferite || [];

// Step 2: Normalize service names for matching
const normalizedActiveServices = activeServices.map(s => s.toLowerCase().trim());

// Step 3: Fetch all new orders
const ordersQuery = query(
  collection(db, 'comenzi'),
  where('status', '==', 'noua'),
  orderBy('timestamp', 'desc')
);

// Step 4: Filter by service match
snapshot.forEach((doc) => {
  const orderService = doc.data().serviciu.toLowerCase().trim();
  
  if (activeServices.length === 0 || 
      normalizedActiveServices.includes(orderService)) {
    // Show this order to the courier
    displayOrders.push(order);
  }
});
```

### What Couriers See
For each order, couriers see:
1. **Order header:**
   - Order number (e.g., "CP141122")
   - Service type with icon
   - Pickup/Delivery locations with flags
   - Pickup date

2. **Package details:**
   - Weight, dimensions (if applicable)
   - Quantity
   - Description
   - Special options (insurance, refrigeration, etc.)

3. **Route info:**
   - Full addresses for pickup and delivery
   - Country and region for both

4. **Actions:**
   - View details (modal)
   - Contact client (future: messaging)
   - Accept order (future: acceptance flow)
   - Finalize (when status = 'in_lucru')

---

## 📊 Status Transitions

### Status Flow
```
noua (New Order)
  │
  ├─── Courier sends message/offer ───► in_lucru (In Progress)
  │                                       │
  │                                       ├─── Finalize ───► livrata (Delivered)
  │                                       │
  │                                       └─── Cancel ───► anulata (Cancelled)
  │
  └─── Client cancels ───► anulata
```

### Permission Rules
- **Edit/Delete**: Only `noua` status
  - Client can modify order details
  - Client can delete order
  
- **Finalize**: Only `in_lucru` status
  - Only assigned courier can finalize
  - Uses `transitionToFinalizata()` helper
  
- **Review**: Only `livrata` status
  - Client can leave review for courier
  - Creates record in `recenzii` collection

---

## 🔐 Security & Ownership

### Firestore Rules
```javascript
match /comenzi/{docId} {
  // Clients read own orders, couriers read all orders
  allow read: if isAuthenticated() && 
    (resource.data.uid_client == request.auth.uid || 
     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'curier');
  
  // Clients create orders
  allow create: if isAuthenticated() && 
    request.resource.data.uid_client == request.auth.uid;
  
  // Both clients and couriers can update
  allow update: if isAuthenticated() && 
    (resource.data.uid_client == request.auth.uid || 
     resource.data.courierId == request.auth.uid ||
     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'curier');
}
```

### Query-Level Filtering
**Critical**: Firestore rules don't auto-filter results!

```typescript
// WRONG - Returns permission denied
const q = query(collection(db, 'comenzi'));

// CORRECT - Client queries
const q = query(
  collection(db, 'comenzi'),
  where('uid_client', '==', user.uid)  // MUST filter by owner
);

// CORRECT - Courier queries
const q = query(
  collection(db, 'comenzi'),
  where('status', '==', 'noua')  // Can see all new orders
);
```

---

## 🌍 Geographic Matching (Future)

### Coverage Zones
Couriers define coverage in `zona_acoperire`:

```typescript
{
  uid: 'courier123',
  tara: 'România',
  judet: 'Cluj'
}
```

### Future Enhancement
Match orders to couriers based on:
1. Service type (current implementation)
2. Coverage zones (pickup & delivery locations)
3. Availability calendar
4. Pricing (from `tarife_curier`)

---

## 💡 Key Takeaways

1. **Service Name Normalization is Critical**
   - Orders store: lowercase (`'colete'`)
   - Couriers store: capitalized (`'Colete'`)
   - Always normalize before comparison

2. **Owner-Based Security**
   - Rules enforce permissions
   - Queries MUST filter by owner
   - Never rely on rules alone to filter data

3. **Service-Specific Fields**
   - All services share base fields
   - Different services emphasize different fields
   - Optional fields depend on service type

4. **Status-Driven Workflow**
   - Status determines what actions are available
   - Status transitions are controlled by helpers
   - Never hardcode status logic

5. **Client & Courier Views**
   - Clients see their orders only
   - Couriers see all orders matching their services
   - Same data, different perspectives

---

## 📚 Related Documentation
- `FIRESTORE_STRUCTURE.md` - Complete database schema
- `STATUS_TRANSITIONS.md` - Order lifecycle rules
- `SECURITY_CHECKLIST.md` - Security validation
- `.github/copilot-instructions.md` - Development patterns
