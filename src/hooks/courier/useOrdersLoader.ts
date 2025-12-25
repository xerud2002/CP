import { useState, useEffect, useCallback, useMemo } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { logError } from '@/lib/errorMessages';
import type { Order } from '@/types';

interface UseOrdersLoaderOptions {
  countryFilter?: string;
  serviceFilter?: string;
  searchQuery?: string;
  sortBy?: string;
}

/**
 * Custom hook to load courier orders from Firestore
 * Handles loading new orders (filtered by active services) and courier's assigned orders
 * 
 * @param userId - Current user ID (courier)
 * @param options - Filter and search options
 * @returns {orders, loading, reload}
 */
export function useOrdersLoader(userId: string | undefined, options: UseOrdersLoaderOptions = {}) {
  const { countryFilter = '', serviceFilter = '', searchQuery = '', sortBy = 'newest' } = options;
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const loadOrders = useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      // First, load courier's active services
      const userQuery = query(
        collection(db, 'users'),
        where('uid', '==', userId)
      );
      const userSnapshot = await getDocs(userQuery);
      let activeServices: string[] = [];
      
      if (!userSnapshot.empty) {
        const userData = userSnapshot.docs[0].data();
        activeServices = userData.serviciiOferite || [];
      }
      
      // Query 1: Get all new orders (not assigned to any courier yet)
      const qNew = query(
        collection(db, 'comenzi'),
        where('status', '==', 'noua'),
        orderBy('createdAt', 'desc')
      );
      
      // Query 2: Get orders assigned to or accepted by this courier
      const qMine = query(
        collection(db, 'comenzi'),
        where('courierId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const [snapshotNew, snapshotMine] = await Promise.all([
        getDocs(qNew),
        getDocs(qMine)
      ]);
      
      const loadedOrders: Order[] = [];
      const orderIds = new Set<string>();
      
      // Add new orders (filter by active services)
      snapshotNew.forEach((doc) => {
        if (!orderIds.has(doc.id)) {
          const data = doc.data();
          const orderService = data.serviciu || data.tipColet || 'Colete';
          
          // Normalize service names for comparison (case-insensitive)
          const normalizedOrderService = orderService.toLowerCase().trim();
          const normalizedActiveServices = activeServices.map(s => s.toLowerCase().trim());
          
          // Only show orders for services the courier has activated
          if (activeServices.length === 0 || normalizedActiveServices.includes(normalizedOrderService)) {
            orderIds.add(doc.id);
            loadedOrders.push({
              id: doc.id,
              orderNumber: data.orderNumber,
              uid_client: data.uid_client,
              clientName: data.nume || data.clientName || 'Client',
              clientPhone: data.telefon || data.clientPhone || '',
              expeditorTara: data.tara_ridicare || data.expeditorTara || '',
              expeditorJudet: data.judet_ridicare || data.expeditorJudet || '',
              oras_ridicare: data.oras_ridicare || '',
              destinatarTara: data.tara_livrare || data.destinatarTara || '',
              destinatarJudet: data.judet_livrare || data.destinatarJudet || '',
              oras_livrare: data.oras_livrare || '',
              tipColet: orderService,
              greutate: String(data.greutate || ''),
              status: 'noua',
              dataColectare: data.data_ridicare || data.dataColectare || '',
              ora: data.ora_ridicare || data.ora || '',
              createdAt: data.createdAt?.toDate() || new Date(),
              optiuni: data.optiuni || [],
              observatii: data.observatii || '',
              serviciu: data.serviciu || orderService,
              lungime: data.lungime,
              latime: data.latime,
              inaltime: data.inaltime,
              cantitate: data.cantitate,
              descriere: data.descriere,
              tip_animal: data.tip_animal,
              tip_vehicul: data.tip_vehicul,
            });
          }
        }
      });
      
      // Add courier's own orders
      snapshotMine.forEach((doc) => {
        if (!orderIds.has(doc.id)) {
          orderIds.add(doc.id);
          const data = doc.data();
          loadedOrders.push({
            id: doc.id,
            orderNumber: data.orderNumber,
            uid_client: data.uid_client,
            clientName: data.nume || data.clientName || 'Client',
            clientPhone: data.telefon || data.clientPhone || '',
            expeditorTara: data.tara_ridicare || data.expeditorTara || '',
            expeditorJudet: data.judet_ridicare || data.expeditorJudet || '',
            oras_ridicare: data.oras_ridicare || '',
            destinatarTara: data.tara_livrare || data.destinatarTara || '',
            destinatarJudet: data.judet_livrare || data.destinatarJudet || '',
            oras_livrare: data.oras_livrare || '',
            tipColet: data.serviciu || data.tipColet || 'Colete',
            greutate: String(data.greutate || ''),
            status: data.status || 'noua',
            dataColectare: data.data_ridicare || data.dataColectare || '',
            ora: data.ora_ridicare || data.ora || '',
            createdAt: data.createdAt?.toDate() || new Date(),
            optiuni: data.optiuni || [],
            observatii: data.observatii || '',
            serviciu: data.serviciu || data.tipColet || 'Colete',
            lungime: data.lungime,
            latime: data.latime,
            inaltime: data.inaltime,
            cantitate: data.cantitate,
            descriere: data.descriere,
            tip_animal: data.tip_animal,
            tip_vehicul: data.tip_vehicul,
          });
        }
      });
      
      setOrders(loadedOrders);
    } catch (error) {
      logError(error, 'Error loading orders for courier');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Client-side filtering by country (pickup OR delivery)
  const filteredByCountry = useMemo(() => {
    if (!countryFilter) return orders;
    return orders.filter(order => 
      order.expeditorTara === countryFilter || order.destinatarTara === countryFilter
    );
  }, [orders, countryFilter]);

  // Client-side filtering by service type
  const filteredByService = useMemo(() => {
    if (!serviceFilter) return filteredByCountry;
    return filteredByCountry.filter(order => {
      const orderService = (order.serviciu || order.tipColet || '').toLowerCase().trim();
      return orderService === serviceFilter.toLowerCase().trim();
    });
  }, [filteredByCountry, serviceFilter]);

  // Client-side filtering by search query (order number or city)
  const filteredBySearch = useMemo(() => {
    if (!searchQuery.trim()) return filteredByService;
    let query = searchQuery.toLowerCase().trim();
    
    // Remove # and CP/cp prefix for order number search
    // Supports: "#CP141140", "CP141140", "#141140", "141140"
    query = query.replace(/^#/, '').replace(/^cp/i, '');
    
    return filteredByService.filter(order => {
      const orderNum = order.orderNumber?.toString() || '';
      const pickupCity = (order.oras_ridicare || '').toLowerCase();
      const deliveryCity = (order.oras_livrare || '').toLowerCase();
      return orderNum.includes(query) || pickupCity.includes(query) || deliveryCity.includes(query);
    });
  }, [filteredByService, searchQuery]);

  // Client-side sorting
  const sortedOrders = useMemo(() => {
    const sorted = [...filteredBySearch];
    sorted.sort((a, b) => {
      const aTime = a.createdAt instanceof Date ? a.createdAt.getTime() : (a.createdAt?.toDate?.().getTime() || 0);
      const bTime = b.createdAt instanceof Date ? b.createdAt.getTime() : (b.createdAt?.toDate?.().getTime() || 0);
      return sortBy === 'oldest' ? aTime - bTime : bTime - aTime;
    });
    return sorted;
  }, [filteredBySearch, sortBy]);


  useEffect(() => {
    if (userId) {
      loadOrders();
    }
  }, [userId, loadOrders]);

  return { orders: sortedOrders, loading, reload: loadOrders };
}
