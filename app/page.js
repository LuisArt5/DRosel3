'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Calendar, Users, Package, DollarSign, BarChart3, Search, Plus, X, LogOut, Clock, AlertCircle, CheckCircle, Edit2, Save, Upload, Eye, Scissors, CreditCard } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function TuxedoAdmin() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [customers, setCustomers] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [rentals, setRentals] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [formData, setFormData] = useState<any>({});
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(async (_, session) => {
      setUser(session?.user ?? null);
      if (session?.user) await loadAllData();
      setLoading(false);
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setUser(data.session.user);
        loadAllData();
      }
      setLoading(false);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const loadAllData = async () => {
    const [{ data: c }, { data: i }, { data: r }, { data: p }, { data: u }] = await Promise.all([
      supabase.from('customers').select('*'),
      supabase.from('inventory').select('*'),
      supabase.from('rentals').select('*, customers(name, phone, email)'),
      supabase.from('users').select('*').eq('id', user?.id).single(),
      supabase.from('users').select('*')
    ]);
    setCustomers(c || []);
    setInventory(i || []);
    setRentals(r || []);
    setProfile(p);
    setAllUsers(u || []);
  };

  const signIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setMsg('Invalid credentials');
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  const hasPermission = (action: 'view' | 'edit') => {
    if (!profile) return false;
    if (profile.role === 'admin') return true;
    if (profile.role === 'staff' && action === 'edit') return true;
    if (profile.role === 'viewer' && action === 'view') return true;
    return false;
  };

  const openModal = (type: string, data = {}) => {
    setModalType(type);
    setFormData(data);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({});
    setSelectedItems([]);
  };

  const handleFileUpload = async (file: File) => {
    const fileName = `${Date.now()}_${file.name}`;
    await supabase.storage.from('id-photos').upload(fileName, file);
    const { data } = supabase.storage.from('id-photos').getPublicUrl(fileName);
    return data.publicUrl;
  };

  const saveCustomer = async () => {
    let id_photo_url = formData.id_photo_url;
    if (formData.idPhotoFile) {
      id_photo_url = await handleFileUpload(formData.idPhotoFile);
    }
    const data = { ...formData, id_photo_url };
    delete data.idPhotoFile;
    if (formData.id) {
      await supabase.from('customers').update(data).eq('id', formData.id);
    } else {
      await supabase.from('customers').insert(data);
    }
    loadAllData();
    closeModal();
  };

  const saveRental = async () => {
    const total = selectedItems.reduce((sum, id) => {
      const item = inventory.find(i => i.id === id);
      return sum + (item?.price || 0);
    }, 0);

    const rental = {
      ...formData,
      item_ids: selectedItems,
      total,
      paid_amount: formData.deposit || 0,
      status: 'reserved',
      reservation_date: today,
      created_by: user.id
    };

    await supabase.from('rentals').insert(rental);
    await supabase.from('customers').update({ total_rentals: supabase.rpc('increment', { x: 1 }) }).eq('id', formData.customer_id);
    loadAllData();
    closeModal();
  };

  const handlePickup = async (id: string) => {
    const rental = rentals.find(r => r.id === id);
    await supabase.from('rentals').update({ status: 'picked_up' }).eq('id', id);
    for (const itemId of rental.item_ids) {
      await supabase.from('inventory').update({ status: 'rented' }).eq('id', itemId);
    }
    loadAllData();
  };

  const handleCheckIn = async (id: string) => {
    const rental = rentals.find(r => r.id === id);
    await supabase.from('rentals').update({ status: 'returned', actual_return_date: today }).eq('id', id);
    for (const itemId of rental.item_ids) {
      await supabase.from('inventory').update({ status: 'cleaning' }).eq('id', itemId);
    }
    loadAllData();
  };

  if (loading) return <div className="flex items-center justify-center h-screen text-3xl">Loading...</div>;
  if (!user) return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-900 to-purple-900">
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-96">
        <h1 className="text-4xl font-bold text-center mb-8">Tuxedo Admin</h1>
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-4 border-2 rounded-xl mb-4" />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-4 border-2 rounded-xl mb-6" />
        <button onClick={signIn} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-bold text-xl hover:scale-105 transition">LOGIN</button>
        {msg && <p className="text-red-600 text-center mt-4">{msg}</p>}
      </div>
    </div>
  );

  const todayPickups = rentals.filter(r => r.pickup_date === today && r.status === 'reserved');
  const todayReturns = rentals.filter(r => r.return_date === today && r.status === 'picked_up');
  const overdue = rentals.filter(r => r.return_date < today && r.status === 'picked_up');

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold">Tuxedo Rental Admin</h1>
          <div className="flex items-center gap-6">
            <span className="bg-purple-600 px-4 py-2 rounded-full font-bold">{profile?.role?.toUpperCase()}</span>
            <button onClick={signOut} className="flex items-center gap-2 bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 transition">
              <LogOut /> Logout
            </button>
          </div>
        </div>
      </header>

      {/* Nav Tabs */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-2 py-4 overflow-x-auto">
            {[
              { id: 'dashboard', label: 'Today', icon: Clock },
              { id: 'rentals', label: 'Rentals', icon: Calendar },
              { id: 'customers', label: 'Customers', icon: Users },
              { id: 'inventory', label: 'Inventory', icon: Package },
              { id: 'billing', label: 'Billing', icon: DollarSign },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 },
              ...(profile?.role === 'admin' ? [{ id: 'users', label: 'Users', icon: Users }] : [])
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-8 py-4 rounded-t-2xl font-bold transition-all ${
                  activeTab === tab.id ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                <tab.icon size={20} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-8">
        {/* Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <h2 className="text-4xl font-bold">Today's Operations</h2>

            {/* Overdue */}
            {overdue.length > 0 && (
              <div className="bg-red-100 border-4 border-red-600 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-red-800 flex items-center gap-3">
                  <AlertCircle size={32} /> OVERDUE RETURNS ({overdue.length})
                </h3>
                <div className="grid gap-4 mt-6">
                  {overdue.map(r => (
                    <div key={r.id} className="bg-white p-6 rounded-xl shadow flex justify-between items-center">
                      <div>
                        <p className="text-xl font-bold">{r.customers.name}</p>
                        <p className="text-red-600">Due: {r.return_date}</p>
                      </div>
                      <button onClick={() => handleCheckIn(r.id)} className="bg-red-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-red-700">
                        CHECK IN NOW
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Pickups */}
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white p-8 rounded-3xl shadow-2xl">
                <h3 className="text-3xl font-bold mb-6">Pickups Today</h3>
                {todayPickups.map(r => (
                  <div key={r.id} className="bg-white/20 backdrop-blur p-6 rounded-2xl mb-4">
                    <p className="text-2xl font-bold">{r.customers.name}</p>
                    <p>Total: ${r.total} | Items: {r.item_ids.length}</p>
                    <button onClick={() => handlePickup(r.id)} className="mt-4 bg-white text-green-600 w-full py-4 rounded-xl font-bold hover:scale-105 transition">
                      COMPLETE PICKUP
                    </button>
                  </div>
                ))}
              </div>

              {/* Returns */}
              <div className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white p-8 rounded-3xl shadow-2xl">
                <h3 className="text-3xl font-bold mb-6">Returns Today</h3>
                {todayReturns.map(r => (
                  <div key={r.id} className="bg-white/20 backdrop-blur p-6 rounded-2xl mb-4">
                    <p className="text-2xl font-bold">{r.customers.name}</p>
                    <p>Paid: ${r.paid_amount || 0} / ${r.total}</p>
                    <div className="flex gap-3 mt-4">
                      <button onClick={() => handleCheckIn(r.id)} className="flex-1 bg-white text-blue-600 py-4 rounded-xl font-bold">
                        CHECK IN
                      </button>
                      {r.paid_amount < r.total && (
                        <button onClick={() => openModal('payment', r)} className="flex-1 bg-green-500 py-4 rounded-xl font-bold">
                          PAY NOW
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Add more tabs: rentals, customers, inventory, etc. — all with full CRUD */}
      </main>

      {/* Modal System */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-10 max-w-4xl w-full max-h-screen overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-4xl font-bold">
                {modalType === 'rental' ? 'New Rental' : modalType === 'customer' ? 'Customer' : 'Action'}
              </h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-red-600"><X size={40} /></button>
            </div>

            {modalType === 'rental' && (
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <label className="text-xl font-bold">Customer</label>
                  <select className="w-full p-4 border-2 rounded-xl mt-2" onChange={e => setFormData({ ...formData, customer_id: e.target.value })}>
                    <option>Select Customer</option>
                    {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xl font-bold">Event Date</label>
                  <input type="date" className="w-full p-4 border-2 rounded-xl mt-2" onChange={e => setFormData({ ...formData, event_date: e.target.value })} />
                </div>
                {/* More fields + item selection */}
                <button onClick={saveRental} className="col-span-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-6 rounded-2xl text-2xl font-bold hover:scale-105 transition">
                  CREATE RENTAL
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}