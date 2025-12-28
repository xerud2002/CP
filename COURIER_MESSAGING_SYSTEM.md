![alt text]({5DDACDDC-2C13-481B-A8DC-CABD57BA4F71}.png)# Sistem de Mesaje Curieri - Reguli și Restricții

## Verificări la Trimiterea Primului Mesaj

Când un curier încearcă să trimită **primul mesaj** către un client pentru o comandă, sistemul face următoarele verificări în ordine:

### 1. Verificare Existență Comandă
- Se verifică dacă comanda încă există în baza de date
- Dacă NU → Mesaj eroare: "Comanda nu mai există"

### 2. Verificare Tip Ofertant (Verificat vs Neverificat)

#### Ce înseamnă "Verificat"?
- Curierul are `profil_curier` cu `verified: true`
- Acest status este setat de **ADMIN** după verificarea documentelor
- Adminul decide cine este firma de transport verificată

#### Ce înseamnă "Neverificat"?
- Persoană care s-a înscris dar NU are `verified: true`
- Nu a completat documentele SAU adminul nu a aprobat documentele

#### Logica de verificare:
```
IF (curier NU este verificat) AND (client NU acceptă "persoane_private")
  → BLOCAT
  → Mesaj: "Această comandă acceptă doar firme de transport verificate. Completează procesul de verificare pentru a putea trimite oferte."

ELSE
  → Continuă la verificarea următoare
```

### 3. Verificare Limită Oferte

#### Limitele disponibile:
- **1-3 oferte**: Maximum 3 curieri pot trimite mesaje
- **4-5 oferte**: Maximum 5 curieri pot trimite mesaje
- **Nelimitat**: Oricâți curieri pot trimite mesaje

#### Important:
- Limita se aplică pentru **TOȚI curierii** (verificați sau neverificați)
- Nu contează dacă curierul este verificat sau nu
- Dacă a trecut de verificarea tip ofertant, limita se aplică egal pentru toți

#### Logica de verificare:
```
IF (limita NU este "nelimitat")
  Numără curieri unici care au trimis mesaje pe această comandă
  
  IF (număr curieri >= limită) AND (curier curent NU este în listă)
    → BLOCAT
    → Mesaj: "Clientul acceptă maxim X oferte și limita a fost atinsă. Nu poți trimite mesaje până când clientul eliberează un slot."
  
  ELSE
    → Permite trimiterea mesajului
```

### 4. Trimitere Mesaj
Dacă toate verificările trec → Mesajul este trimis în baza de date

---

## Scenarii Practice

### Scenariul 1: Client selectează DOAR "Firme Transport (Verificate)"
**Opțiuni client:**
- `tip_ofertanti: ['firme']`
- `max_oferte: '1-3'`

**Rezultat:**
- ✅ Curier verificat (verified: true) → Verificare 2: TRECUT → Verificare 3: Depinde de limită (1-3)
- ❌ Curier neverificat (verified: false/null) → Verificare 2: BLOCAT → Nu ajunge la verificare 3

---

### Scenariul 2: Client selectează AMBELE opțiuni
**Opțiuni client:**
- `tip_ofertanti: ['firme', 'persoane_private']`
- `max_oferte: '4-5'`

**Rezultat:**
- ✅ Curier verificat → Verificare 2: TRECUT → Verificare 3: Depinde de limită (4-5)
- ✅ Curier neverificat → Verificare 2: TRECUT (acceptă persoane private) → Verificare 3: Depinde de limită (4-5)

**Exemple concrete:**
- Curier verificat A trimite mesaj → ✅ (1/5)
- Curier neverificat B trimite mesaj → ✅ (2/5)
- Curier verificat C trimite mesaj → ✅ (3/5)
- Curier neverificat D trimite mesaj → ✅ (4/5)
- Curier verificat E trimite mesaj → ✅ (5/5)
- Curier neverificat F încearcă → ❌ BLOCAT (limita 5/5 atinsă)

---

### Scenariul 3: Client selectează DOAR "Persoane Private"
**Opțiuni client:**
- `tip_ofertanti: ['persoane_private']`
- `max_oferte: 'nelimitat'`

**Rezultat:**
- ✅ Curier verificat → Verificare 2: TRECUT → Verificare 3: TRECUT (nelimitat)
- ✅ Curier neverificat → Verificare 2: TRECUT (acceptă persoane private) → Verificare 3: TRECUT (nelimitat)

---

### Scenariul 4: Client selectează DOAR "Firme Transport" + Limită 1-3
**Opțiuni client:**
- `tip_ofertanti: ['firme']`
- `max_oferte: '1-3'`

**Rezultat:**
- ✅ Curier verificat A → Verificare 2: TRECUT → Verificare 3: TRECUT (1/3) → Mesaj trimis
- ✅ Curier verificat B → Verificare 2: TRECUT → Verificare 3: TRECUT (2/3) → Mesaj trimis
- ❌ Curier neverificat C → Verificare 2: BLOCAT → Nu ajunge la verificare 3
- ✅ Curier verificat D → Verificare 2: TRECUT → Verificare 3: TRECUT (3/3) → Mesaj trimis
- ✅ Curier verificat E → Verificare 2: TRECUT → Verificare 3: BLOCAT (limita 3/3 atinsă)
- ❌ Curier neverificat F → Verificare 2: BLOCAT → Nu ajunge la verificare 3

---

## Continuarea Conversației

### Curieri care deja au trimis mesaje:
- Pot continua să trimită mesaje **fără restricții**
- Nu se mai fac verificări pentru mesajele ulterioare
- Limita se aplică doar la **primul mesaj** de la un curier nou

---

## Eliberarea Slot-urilor

### Cum se eliberează un slot:
1. **Arhivarea comenzii** de către client
   - Toate mesajele asociate sunt șterse automat
   - Toți curierii sunt "resetați"
   - Limita revine la 0/X

2. **Opțional - Feature viitor**: 
   - Buton "Refuză oferta" / "Închide conversație"
   - Client poate elibera slot-ul unui curier specific
   - Permite unui nou curier să contacteze

---

## Implementare Tehnică

### Fișier: `src/components/orders/CourierChatModal.tsx`

### Funcția: `handleSendMessage()`

### Verificări în ordine:
1. `orderDoc.exists()` → Comanda există?
2. `isVerified && !tipOfertanti.includes('persoane_private')` → Acceptă tipul de curier?
3. `uniqueCouriers.size >= limit` → Limita atinsă?

### Date verificate:
- `orderData.tip_ofertanti` - Array: `['firme', 'persoane_private']`
- `orderData.max_oferte` - String: `'1-3'` | `'4-5'` | `'nelimitat'`
- `courierProfileDoc.data().verified` - Boolean: `true` | `false` | `undefined`

---

## Notes Importante

1. **Adminul controlează verificarea**
   - Doar adminul setează `verified: true` în `profil_curier`
   - Curierul nu poate auto-verifica

2. **Limita este globală**
   - Se numără toți curierii unici care au trimis mesaje
   - Nu se face distincție între verificați/neverificați la numărare
   - Limita protejează clientul de spam

3. **Prima verificare este prioritară**
   - Dacă curierul este blocat la verificare tip, nu ajunge la verificare limită
   - Mesajul de eroare este specific fiecărei verificări

4. **Backward compatibility**
   - Comenzile vechi fără `max_oferte` → default `'nelimitat'`
   - Comenzile vechi fără `tip_ofertanti` → default `[]` (nicio restricție)
