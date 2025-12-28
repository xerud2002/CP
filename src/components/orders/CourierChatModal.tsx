'use client';

import { useState, useEffect, useRef } from 'react';
import { CloseIcon, ChatIcon } from '@/components/icons/DashboardIcons';
import { collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp, updateDoc, doc, getDocs, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { showSuccess, showError, showWarning } from '@/lib/toast';

interface Message {
  id: string;
  orderId: string;
  orderNumber?: string;
  clientId: string;
  courierId: string;
  senderId: string;
  senderName: string;
  senderRole: 'client' | 'curier';
  message: string;
  createdAt: Date;
  read: boolean;
}

interface CourierChatModalProps {
  orderId: string;
  orderNumber?: string;
  clientId: string;
  clientName: string;
  onClose: () => void;
}

export default function CourierChatModal({ orderId, orderNumber, clientId, clientName, onClose }: CourierChatModalProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load messages in real-time
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'mesaje'),
      where('orderId', '==', orderId),
      where('clientId', '==', clientId),
      where('courierId', '==', user.uid),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || new Date(),
      })) as Message[];
      
      setMessages(loadedMessages);

      // Mark messages as read
      snapshot.docs.forEach(async (messageDoc) => {
        const data = messageDoc.data();
        if (data.senderId !== user.uid && !data.read) {
          await updateDoc(doc(db, 'mesaje', messageDoc.id), { read: true });
        }
      });
    });

    return () => unsubscribe();
  }, [user, orderId, clientId]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user) return;

    setSending(true);
    try {
      // VERIFICARE 1: Obține detaliile comenzii
      const orderDoc = await getDoc(doc(db, 'comenzi', orderId));
      if (!orderDoc.exists()) {
        showError('Comanda nu mai există');
        setSending(false);
        return;
      }
      
      const orderData = orderDoc.data();
      const tipOfertanti = orderData.tip_ofertanti || [];
      const maxOferte = orderData.max_oferte || 'nelimitat';
      
      // VERIFICARE 2: Status curier în timp real (verificat/neverificat/suspendat/șters)
      // Se verifică la FIECARE mesaj pentru a reflecta schimbările în timp real
      const courierProfileDoc = await getDoc(doc(db, 'profil_curier', user.uid));
      
      // Verifică dacă contul curierului există și este activ
      if (!courierProfileDoc.exists()) {
        showError('Contul tău de curier nu există sau a fost șters. Contactează suportul.');
        setSending(false);
        return;
      }
      
      const courierProfile = courierProfileDoc.data();
      
      // Verifică dacă contul este suspendat
      if (courierProfile.suspended === true) {
        showError('Contul tău a fost suspendat. Nu poți trimite mesaje. Contactează suportul pentru detalii.');
        setSending(false);
        return;
      }
      
      // Verifică statusul de verificare
      const isVerified = courierProfile.verified === true;
      
      // Dacă curierul NU este verificat ȘI clientul NU acceptă persoane private → BLOCAT
      if (!isVerified && !tipOfertanti.includes('persoane_private')) {
        showWarning('Această comandă acceptă doar firme de transport verificate. Completează procesul de verificare pentru a putea trimite oferte.');
        setSending(false);
        return;
      }
      
      // VERIFICARE 3: Limita de oferte (doar pentru primul mesaj de la acest curier)
      const isFirstMessage = messages.length === 0 || !messages.some(m => m.courierId === user.uid);
      
      if (isFirstMessage && maxOferte !== 'nelimitat') {
        // Obține toate mesajele pentru această comandă
        const allMessagesQuery = query(
          collection(db, 'mesaje'),
          where('orderId', '==', orderId),
          where('senderRole', '==', 'curier')
        );
        const allMessagesSnap = await getDocs(allMessagesQuery);
        
        // Extrage curieri unici
        const uniqueCouriers = new Set<string>();
        allMessagesSnap.docs.forEach(docSnap => {
          const data = docSnap.data();
          if (data.courierId) {
            uniqueCouriers.add(data.courierId);
          }
        });
        
        // Determină limita numerică
        const limit = maxOferte === '1-3' ? 3 : maxOferte === '4-5' ? 5 : 999;
        
        // Verifică dacă limita a fost atinsă (și curierul curent nu este deja în listă)
        if (uniqueCouriers.size >= limit && !uniqueCouriers.has(user.uid)) {
          showWarning(`Clientul acceptă maxim ${limit} oferte și limita a fost atinsă. Nu poți trimite mesaje până când clientul eliberează un slot.`);
          setSending(false);
          return;
        }
      }
      
      // Toate verificările au trecut - trimite mesajul
      await addDoc(collection(db, 'mesaje'), {
        orderId,
        orderNumber: orderNumber || '',
        clientId,
        courierId: user.uid,
        senderId: user.uid,
        senderName: user.displayName || 'Curier',
        senderRole: 'curier',
        message: newMessage.trim(),
        createdAt: serverTimestamp(),
        read: false,
      });

      setNewMessage('');
      showSuccess('Mesaj trimis!');
    } catch (error) {
      console.error('Error sending message:', error);
      showError('Eroare la trimiterea mesajului');
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div className="relative w-full max-w-2xl bg-slate-900 rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-800/50 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
              <ChatIcon className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Conversație cu {clientName}</h3>
              {orderNumber && (
                <p className="text-xs text-gray-500">Comandă #{orderNumber}</p>
              )}
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
            title="Închide"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="h-96 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <ChatIcon className="w-8 h-8 text-gray-600" />
              </div>
              <p className="text-gray-500">Niciun mesaj încă</p>
              <p className="text-sm text-gray-600 mt-1">Începe conversația!</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isOwn = msg.senderId === user?.uid;
              return (
                <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-sm px-4 py-2.5 rounded-xl ${
                    isOwn 
                      ? 'bg-orange-500 text-white' 
                      : 'bg-slate-800 text-white'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap wrap-break-word">{msg.message}</p>
                    <p className={`text-[10px] mt-1 ${isOwn ? 'text-orange-100' : 'text-gray-500'}`}>
                      {msg.createdAt.toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="px-6 py-4 bg-slate-800/50 border-t border-white/10">
          <div className="flex gap-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Scrie un mesaj..."
              className="flex-1 px-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              disabled={sending}
            />
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || sending}
              className="px-6 py-2.5 bg-orange-500 hover:bg-orange-400 disabled:bg-slate-700 disabled:text-gray-500 text-white font-medium rounded-xl transition-colors disabled:cursor-not-allowed"
            >
              {sending ? 'Se trimite...' : 'Trimite'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
