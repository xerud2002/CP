# Order Status Transitions - Curierul Perfect

Acest document descrie fluxul de statusuri pentru comenzi și regulile de tranziție.

## Status Flow

```
Nouă → În Lucru → Livrată
  ↓         ↓         
Anulată   Anulată    
```

## Status Definitions

### 1. Nouă (noua)
- **Descriere**: Comandă nou creată, fără interacțiune de la curieri
- **Culoare**: Alb
- **Permisiuni**:
  - ✅ Editabilă (doar de client)
  - ✅ Ștergibilă (doar de client)
  - ✅ Anulabilă
- **Următorul Status**: În Lucru (automat când curier trimite mesaj/ofertă)

### 2. În Lucru (in_lucru)
- **Descriere**: Comandă cu cel puțin un mesaj sau ofertă de la un curier
- **Culoare**: Portocaliu
- **Permisiuni**:
  - ❌ Nu este editabilă
  - ❌ Nu este ștergibilă
  - ✅ Poate fi finalizată (de client sau curier)
  - ✅ Anulabilă
- **Tranziție Automată**: Din "Nouă" când primul curier:
  - Trimite un mesaj în colecția `mesaje`
  - Face o ofertă în colecția `oferte`
- **Următorul Status**: Livrată (manual, buton "Finalizează")

### 3. Acceptată (acceptata)
- **Descriere**: Curier a acceptat comanda (va fi implementat în viitor)
- **Culoare**: Galben
- **Status**: În dezvoltare

### 4. În Tranzit (in_tranzit)
- **Descriere**: Coletul este în curs de livrare (va fi implementat în viitor)
- **Culoare**: Albastru
- **Status**: În dezvoltare

### 5. Livrată (livrata)
- **Descriere**: Comandă finalizată cu succes
- **Culoare**: Verde (Emerald)
- **Permisiuni**:
  - ❌ Nu este editabilă
  - ❌ Nu este ștergibilă
  - ❌ Nu poate fi anulată
  - ✅ **Client poate lăsa recenzie**
  - ✅ **Curier poate cere recenzie de la client**
- **Reguli de Tranziție**:
  - Poate fi setată **DOAR** dacă statusul curent este "În Lucru"
  - Poate fi setată de client SAU curier
  - Acțiune manuală prin buton "Finalizează"
- **Acțiuni disponibile**:
  - Client: Buton "Recenzie" → redirectează la `/dashboard/client/recenzii?orderId={id}`
  - Curier: Buton "Cere recenzie de la client" → trimite notificare către client (va fi implementat)

### 6. Anulată (anulata)
- **Descriere**: Comandă anulată
- **Culoare**: Gri
- **Permisiuni**: Finală, fără editări

## Implementation Details

### Helper Functions

#### `transitionToInLucru(orderId, currentStatus)`
- **Locație**: `src/utils/orderStatusHelpers.ts`
- **Scop**: Schimbă statusul din "nouă" în "in_lucru"
- **Apelată automat**: Când curier trimite primul mesaj sau ofertă
- **Returnează**: `boolean` (true = success)
- **Validare**: Doar dacă `currentStatus === 'noua'`

#### `transitionToFinalizata(orderId, currentStatus)`
- **Locație**: `src/utils/orderStatusHelpers.ts`
- **Scop**: Schimbă statusul din "in_lucru" în "livrata"
- **Apelată manual**: Prin buton "Finalizează" (client/curier)
- **Returnează**: `boolean` (true = success)
- **Validare**: Doar dacă `currentStatus === 'in_lucru'`
- **Toast**: Success sau error automat

#### Validation Functions
```typescript
canEditOrder(status: string): boolean
  // Returns true only for 'noua'

canDeleteOrder(status: string): boolean
  // Returns true only for 'noua'

canFinalizeOrder(status: string): boolean
  // Returns true only for 'in_lucru'

canLeaveReview(status: string): boolean
  // Returns true only for 'livrata'
```

### UI Components

#### Butoane per Status

**Pentru status "Nouă":**
```tsx
<button onClick={handleEditOrder}>Modifică</button>
<button onClick={handleDeleteOrder}>Șterge</button>
```

**Pentru status "În Lucru":**
```tsx
<button ostatus "Livrată":**
```tsx
{/* Client */}
<button onClick={handleLeaveReview}>Recenzie</button>

{/* Curier */}
<button onClick={handleRequestReview}>Cere recenzie de la client</button>
```

**Pentru nClick={handleFinalizeOrder}>Finalizează</button>
```

**Pentru alte statusuri:**
- Nici un buton de acțiune

#### Badge-uri de Status

Folosesc configurația din `src/lib/constants.ts`:
```typescript
orderStatusConfig[order.status]
  .label   // Text afișat
  .color   // Culoare text
  .bg      // Culoare fundal
  .border  // Culoare bordură
  .icon    // Icon component
```

### Database Schema

#### Câmpuri Timestamp pe Orders
```typescript
{
  createdAt: serverTimestamp(),        // Când a fost creată
  timestamp: Date.now(),               // Pentru sortare
  statusUpdatedAt: serverTimestamp(),  // Când s-a schimbat statusul
  inLucruAt: serverTimestamp(),        // Când a devenit "În Lucru"
  finalizataAt: serverTimestamp(),     // Când a devenit "Livrată"
}
```

### Future Collections (To Be Implemented)

#### Mesaje Collection
```typescript
{
  orderId: string,
  senderId: string,        // uid curier
  senderRole: 'curier',
  message: string,
  createdAt: serverTimestamp(),
  read: boolean
}
```

**Trigger**: La primul mesaj → `transitionToInLucru(orderId, order.status)`

#### Oferte Collection
```typescript
{
  orderId: string,
  courierId: string,
  pret: number,
  estimatedDays: number,
  message?: string,
  status: 'pending' | 'accepted' | 'rejected',
  createdAt: serverTimestamp()
}
```

**Trigger**: La prima ofertă → `transitionToInLucru(orderId, order.status)`

## Tes**Butonul "Recenzie" apare doar pentru "livrata" (client)**
- [ ] **Butonul "Cere recenzie" apare doar pentru "livrata" (curier)**
- [ ] **Click pe "Recenzie" redirectează cu orderId în URL**
- [ ] **Formularul de recenzie se auto-deschide când există orderId în URL**
- [ ] **Cererea de recenzie afișează toast de succes**
- [ ] ting Checklist

- [ ] Comandă nouă creată → status = "noua"
- [ ] Butonul "Modifică" apare doar pentru "noua"
- [ ] Butonul "Șterge" apare doar pentru "noua"
- [ ] Editarea funcționează pentru "noua", afișează warning pentru altele
- [ ] Ștergerea funcționează pentru "noua", afișează warning pentru altele
- [ ] Butonul "Finalizează" apare doar pentru "in_lucru"
- [ ] Finalizarea funcționează pentru "in_lucru", afișează warning pentru altele
- [ ] Toast notifications apar corect pentru toate acțiunile
- [ ] Status badge afișează culoarea și iconul corect
- [ ] Filtrele de status funcționează pentru toate statusurile

## Security Rules (Firestore)

```javascript
// comenzi collection
match /comenzi/{orderId} {
  // Doar owner-ul poate edita statusul
  allow update: if request.auth.uid == resource.data.uid_client 
                || request.auth.uid == resource.data.courierId;
  
  // Validări pentru tranziții de status
  allow update: if request.resource.data.status == 'livrata'
                && resource.data.status == 'in_lucru';
  
  allow update: if request.resource.data.status == 'in_lucru'
                && resource.data.status == 'noua';
}
```

## Notes

1. **Tranziția automată** "nouă" → "în lucru" va fi implementată când colecțiile `mesaje` și `oferte` vor fi create
2. Toate statusurile folosesc **serverTimestamp()** pentru consistență
3. Toast notifications sunt centralizate în `src/lib/toast.ts`
4. Toate validările sunt duplicate: client-side (UX) + Firestore rules (security)
5. Status labels folosesc diacritice corecte în română

