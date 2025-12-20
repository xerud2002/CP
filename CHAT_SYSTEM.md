# Sistem de Chat Individual între Client și Curieri

## 📋 Prezentare Generală

Sistemul de chat permite comunicare directă **1-la-1** între client și fiecare curier în parte pentru o comandă specifică. Fiecare conversație este **privată și separată** - un client care vorbește cu mai mulți curieri pentru aceeași comandă va avea conversații distincte cu fiecare.

## 🎯 Caracteristici Principale

### 1. **Conversații Private și Separate**
- Fiecare pereche client-curier are o conversație **individuală** pentru o comandă
- Un client cu 3 curieri pe o comandă = 3 conversații separate
- Mesajele dintre client și curier A **nu sunt vizibile** pentru curier B

### 2. **Notificări în Timp Real**
- Badge verde cu ping animation pe butonul "Chat"
- Arată numărul de mesaje necitite
- Actualizare instant folosind Firestore `onSnapshot`
- Badge dispare automat când deschizi chat-ul (în viitor, cu marcare ca citit)

### 3. **Acces Rapid din Lista de Comenzi**
- Buton "Chat" direct în card-ul comenzii
- Expandare inline (nu mai e nevoie să deschizi modalul)
- Toggle simplu: click = deschide, click din nou = închide

## 🔧 Implementare Tehnică

### Structura Mesajelor în Firestore

```typescript
interface Message {
  id: string;              // Document ID
  orderId: string;         // ID-ul comenzii
  senderId: string;        // UID-ul celui care trimite
  senderName: string;      // Nume afișat
  senderRole: 'client' | 'curier';
  receiverId: string;      // UID-ul celui care primește
  clientId: string;        // UID-ul clientului (pentru filtrare)
  courierId: string;       // UID-ul curierului (pentru filtrare)
  message: string;         // Conținutul mesajului
  read: boolean;          // Status de citire
  createdAt: Timestamp;    // serverTimestamp()
}
```

### Query-uri pentru Conversații Separate

**Client vede doar mesajele cu curierul asignat:**
```typescript
query(
  collection(db, 'mesaje'),
  where('orderId', '==', orderId),
  where('clientId', '==', user.uid),
  where('courierId', '==', order.courierId),
  orderBy('createdAt', 'asc')
)
```

**Curier vede doar mesajele cu clientul comenzii:**
```typescript
query(
  collection(db, 'mesaje'),
  where('orderId', '==', orderId),
  where('clientId', '==', order.uid_client),
  where('courierId', '==', user.uid),
  orderBy('createdAt', 'asc')
)
```

### Query pentru Mesaje Necitite (Notificări)

```typescript
query(
  collection(db, 'mesaje'),
  where('orderId', '==', orderId),
  where('clientId', '==', clientId),
  where('courierId', '==', courierId),
  where('read', '==', false)
)
// Filtrare client-side: exclude mesajele trimise de user-ul curent
```

## 📐 Indexuri Firestore Necesare

```json
{
  "collectionGroup": "mesaje",
  "fields": [
    { "fieldPath": "orderId", "order": "ASCENDING" },
    { "fieldPath": "clientId", "order": "ASCENDING" },
    { "fieldPath": "courierId", "order": "ASCENDING" },
    { "fieldPath": "createdAt", "order": "ASCENDING" }
  ]
},
{
  "collectionGroup": "mesaje",
  "fields": [
    { "fieldPath": "orderId", "order": "ASCENDING" },
    { "fieldPath": "clientId", "order": "ASCENDING" },
    { "fieldPath": "courierId", "order": "ASCENDING" },
    { "fieldPath": "read", "order": "ASCENDING" }
  ]
}
```

## 🎨 UI/UX

### Buton Chat cu Badge
```tsx
<button className="relative ...">
  {unreadCounts[order.id] > 0 && (
    <span className="absolute -top-1 -right-1">
      <span className="animate-ping bg-green-400" />
      <span className="bg-green-500">{unreadCounts[order.id]}</span>
    </span>
  )}
  <ChatIcon />
  Chat
</button>
```

### Logica de Expandare
```typescript
const [expandedChatOrderId, setExpandedChatOrderId] = useState<string | null>(null);

// Toggle
onClick={() => setExpandedChatOrderId(
  expandedChatOrderId === order.id ? null : order.id
)}

// Render conditional
{expandedChatOrderId === order.id && (
  <OrderChat 
    orderId={order.id}
    courierId={courierId}
    clientId={clientId}
  />
)}
```

## 🔐 Reguli de Securitate

```javascript
match /mesaje/{messageId} {
  // Oricine autentificat poate citi (pentru notificări în dashboard)
  allow read: if isAuthenticated();
  
  // Doar sender-ul poate crea mesaj
  allow create: if isAuthenticated() && 
    request.resource.data.senderId == request.auth.uid;
  
  // Doar sender-ul sau admin pot șterge/modifica
  allow update, delete: if isAuthenticated() && 
    (resource.data.senderId == request.auth.uid || isAdmin());
}
```

## 🚀 Flow-ul Conversației

### Pentru Client:
1. **Comanda nouă** (status: `noua`):
   - Chat disabled (mesaj: "Așteaptă un curier...")
   - Nu există `courierId` încă

2. **Curier acceptă** (status: `in_lucru`):
   - Chat enabled
   - `order.courierId` este setat
   - Conversația devine activă cu acel curier

3. **Mesaj nou de la curier**:
   - Badge verde apare pe butonul Chat
   - Număr afișat (ex: "2" mesaje necitite)
   - Badge dispare când se deschide chat-ul

### Pentru Curier:
1. **Vede comenzi noi**:
   - Poate deschide chat pentru orice comandă
   - Poate trimite mesaje pentru a oferta/negocia

2. **Mesaj nou de la client**:
   - Badge verde cu număr pe butonul Chat
   - Actualizare în timp real

3. **Conversații multiple**:
   - Fiecare client = conversație separată
   - Istoricul se păstrează per comandă

## 📱 Componenta OrderChat

### Props
```typescript
interface OrderChatProps {
  orderId: string;       // Obligatoriu
  orderNumber?: number;  // Pentru header
  courierId?: string;    // UID curier (poate lipsi pentru comenzi noi)
  clientId?: string;     // UID client
}
```

### Funcționalități
- ✅ Auto-scroll la mesaje noi
- ✅ Timestamps relative ("Acum", "5m", "2h", "3z")
- ✅ Culori diferite pentru roluri:
  - Client: verde (`emerald-500`)
  - Curier: portocaliu (`orange-500`)
  - Mesajele proprii: albastru (`blue-500`)
- ✅ Disabled state când nu există curier asignat
- ✅ Loading indicator la trimitere mesaj

## 🔄 Sincronizare în Timp Real

### Listener pentru Mesaje (în OrderChat)
```typescript
useEffect(() => {
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const loadedMessages = [];
    snapshot.forEach(doc => {
      loadedMessages.push({ id: doc.id, ...doc.data() });
    });
    setMessages(loadedMessages);
  });
  
  return () => unsubscribe();
}, [orderId, courierId, clientId]);
```

### Listener pentru Badge-uri (în dashboard pages)
```typescript
useEffect(() => {
  const unsubscribers = [];
  
  orders.forEach(order => {
    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const unreadCount = snapshot.docs
        .filter(doc => doc.data().senderId !== user.uid)
        .length;
      
      setUnreadCounts(prev => ({ ...prev, [order.id]: unreadCount }));
    });
    
    unsubscribers.push(unsubscribe);
  });
  
  return () => unsubscribers.forEach(unsub => unsub());
}, [orders]);
```

## 📝 To-Do / Viitor

- [ ] Marcare automată ca citit când se deschide chat-ul
- [ ] Sunet de notificare pentru mesaje noi
- [ ] Indicatori "typing..." când celălalt scrie
- [ ] Suport pentru imagini/fișiere atașate
- [ ] Istoric conversații în profil client/curier
- [ ] Delete/edit mesaje (cu time limit)

## 🐛 Debugging

### Verifică Indexurile în Firebase Console
1. Mergi la Firestore → Indexes
2. Caută "mesaje" collection
3. Verifică că există indexuri pentru:
   - `orderId + clientId + courierId + createdAt`
   - `orderId + clientId + courierId + read`

### Console Logs Utile
```typescript
// Verifică dacă query-ul returnează mesaje
console.log('Messages loaded:', messages.length);
console.log('Client ID:', clientId, 'Courier ID:', courierId);

// Verifică numărul de mesaje necitite
console.log('Unread counts:', unreadCounts);
```

### Probleme Comune
1. **Chat nu se deschide**: Verifică că `courierId` există în order
2. **Badge nu apare**: Verifică că listener-ul se execută și că `read: false` în mesaje
3. **Mesaje duplicate**: Verifică că `clientId` și `courierId` sunt setate corect

## 📞 Contact

Pentru probleme sau întrebări despre sistemul de chat, verifică:
- `src/components/orders/OrderChat.tsx` - componenta principală
- `src/app/dashboard/curier/comenzi/page.tsx` - implementare curier
- `src/app/dashboard/client/comenzi/page.tsx` - implementare client
- `firestore.rules` - reguli de securitate
- `firestore.indexes.json` - indexuri necesare
