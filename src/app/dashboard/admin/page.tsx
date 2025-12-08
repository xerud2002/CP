'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { collection, getDocs, query, orderBy, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { User, Order } from '@/types';

const tabs = [
  { id: 'users', label: 'Utilizatori' },
  { id: 'orders', label: 'Comenzi' },
  { id: 'couriers', label: 'Curieri' },
  { id: 'stats', label: 'Statistici' },
  { id: 'settings', label: 'Setări' },
];

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/login?role=admin');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user && user.role === 'admin') {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    setLoadingData(true);
    try {
      // Load users
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersData: User[] = [];
      usersSnapshot.forEach((doc) => {
        usersData.push({ uid: doc.id, ...doc.data() } as User);
      });
      setUsers(usersData);

      // Load orders
      const ordersSnapshot = await getDocs(
        query(collection(db, 'comenzi'), orderBy('timestamp', 'desc'))
      );
      const ordersData: Order[] = [];
      ordersSnapshot.forEach((doc) => {
        ordersData.push({ id: doc.id, ...doc.data() } as Order);
      });
      setOrders(ordersData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const updateUserRole = async (uid: string, newRole: string) => {
    try {
      await updateDoc(doc(db, 'users', uid), { role: newRole });
      loadData();
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-green-400 text-xl">Se încarcă...</div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') return null;

  const clientsCount = users.filter(u => u.role === 'client').length;
  const couriersCount = users.filter(u => u.role === 'curier').length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-green-400 mb-8">Admin Dashboard</h1>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="card text-center">
            <div className="text-3xl font-bold text-orange-500">{users.length}</div>
            <div className="text-gray-400">Total Utilizatori</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-green-400">{clientsCount}</div>
            <div className="text-gray-400">Clienți</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-blue-400">{couriersCount}</div>
            <div className="text-gray-400">Curieri</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-yellow-400">{pendingOrders}</div>
            <div className="text-gray-400">Comenzi în așteptare</div>
          </div>
        </div>

        {/* Tab Menu */}
        <div className="tab-menu mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="card">
          {activeTab === 'users' && (
            <div>
              <h2 className="text-2xl font-bold text-green-400 mb-6">Utilizatori</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-blue-800">
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Rol</th>
                      <th className="py-3 px-4">Acțiuni</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.uid} className="border-b border-blue-900">
                        <td className="py-3 px-4">{u.email}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded text-sm ${
                            u.role === 'admin' ? 'bg-red-500' :
                            u.role === 'curier' ? 'bg-orange-500' : 'bg-green-500'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <select
                            value={u.role}
                            onChange={(e) => updateUserRole(u.uid, e.target.value)}
                            className="form-select text-sm py-1"
                          >
                            <option value="client">Client</option>
                            <option value="curier">Curier</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div>
              <h2 className="text-2xl font-bold text-green-400 mb-6">Comenzi</h2>
              {orders.length === 0 ? (
                <p className="text-gray-400">Nu există comenzi.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-blue-800">
                        <th className="py-3 px-4">Client</th>
                        <th className="py-3 px-4">De la</th>
                        <th className="py-3 px-4">Către</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Data</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.id} className="border-b border-blue-900">
                          <td className="py-3 px-4">{order.nume}</td>
                          <td className="py-3 px-4">{order.tara_ridicare}</td>
                          <td className="py-3 px-4">{order.tara_livrare}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded text-sm ${
                              order.status === 'pending' ? 'bg-yellow-500' :
                              order.status === 'delivered' ? 'bg-green-500' : 'bg-blue-500'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">{order.data_ridicare}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'couriers' && (
            <div>
              <h2 className="text-2xl font-bold text-green-400 mb-6">Curieri</h2>
              <div className="grid gap-4">
                {users.filter(u => u.role === 'curier').map((courier) => (
                  <div key={courier.uid} className="bg-blue-900/50 p-4 rounded-lg flex justify-between items-center">
                    <div>
                      <div className="font-semibold">{courier.email}</div>
                      <div className="text-gray-400 text-sm">{courier.nume || 'Nume nesetat'}</div>
                    </div>
                    <span className="px-3 py-1 bg-green-500 rounded text-sm">Activ</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <div>
              <h2 className="text-2xl font-bold text-green-400 mb-6">Statistici</h2>
              <p className="text-gray-400">Statisticile detaliate vor fi disponibile în curând.</p>
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <h2 className="text-2xl font-bold text-green-400 mb-6">Setări</h2>
              <p className="text-gray-400">Setările platformei vor fi disponibile în curând.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
