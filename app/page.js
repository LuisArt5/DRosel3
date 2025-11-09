'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Calendar, Users, Package, DollarSign, BarChart3, Search, Plus, X, LogOut, Clock, AlertCircle, CheckCircle, Edit2, Save, Upload, Eye, Scissors, CreditCard, Printer, Trash2 } from 'lucide-react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase env vars! Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel.');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
    return () => listener?.subscription.unsubscribe();
  }, []);

  const loadAllData = async () => {
    const [{ data: c }, { data: i }, { data: r }, { data: p }, { data: u }] = await Promise.all([
      supabase.from('customers').select('*'),
      supabase.from('inventory').select('*'),
      supabase.from('rentals').select('*, customers(name, phone, email)'),
      supabase.from('users').select('*').eq('id', user?.id || '').single(),
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

  const hasPermission = (action: 'view' | 'edit' | 'delete') => {
    if (!profile) return false;
    if (profile.role === 'admin') return true;
    if (profile.role === 'staff' && action !== 'delete') return true;
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

  const saveInventory = async () => {
    if (formData.id) {
      await supabase.from('inventory').update(formData).eq('id', formData.id);
    } else {
      await supabase.from('inventory').insert({ ...formData, status: 'available' });
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
      customer_id: formData.customer_id,
      customer_name: customers.find(c => c.id === formData.customer_id)?.name || '',
      customer_phone: customers.find(c => c.id === formData.customer_id)?.phone || '',
      event_date: formData.event_date,
      pickup_date: formData.pickup_date,
      return_date: formData.return_date,
      item_ids: selectedItems,
      total,
      deposit: parseFloat(formData.deposit) || 0,
      paid_amount: parseFloat(formData.deposit) || 0,
      status: 'reserved',
      reservation_date: today,
      created_by: user.id
    };

    await supabase.from('rentals').insert(rental);
    loadAllData();
    closeModal();
  };

  const recordPayment = async () => {
    const amount = parseFloat(formData.amount) || 0;
    const newPaid = (formData.paid_amount || 0) + amount;
    await supabase.from('rentals').update({ paid_amount: newPaid }).eq('id', formData.id);
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

  const deleteItem = async (table: string, id: string) => {
    if (confirm('Delete this item?')) {
      await supabase.from(table).delete().eq('id', id);
      loadAllData();
    }
  };

  if (loading) return <div className="flex items-center justify-center h-screen text-3xl font-bold">Loading...</div>;
  if (!user) return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-900 to-purple-900">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-96">
        <h1 className="text-5xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Tuxedo Admin</h1>
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-4 border-2 rounded-xl mb-4 text-lg" />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-4 border-2 rounded-xl mb-6 text-lg" />
        <button onClick={signIn} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-5 rounded-xl font-bold text-xl hover:scale-105 transition">LOGIN</button>
        {msg && <p className="text-red-600 text-center mt-4 font-bold">{msg}</p>}
      </div>
    </div>
  );

  const todayPickups = rentals.filter(r => r.pickup_date === today && r.status === 'reserved');
  const todayReturns = rentals.filter(r => r.return_date === today && r.status === 'picked_up');
  const overdue = rentals.filter(r => r.return_date < today && r.status === 'picked_up');

  const filteredCustomers = customers.filter(c => 
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.phone?.includes(searchTerm) ||
    c.email?.toLowerCase().includes(searchTerm)
  );

  const filteredInventory = inventory.filter(i => 
    i.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    i.rfid?.includes(searchTerm) ||
    i.category?.toLowerCase().includes(searchTerm)
  );

  const filteredRentals = rentals.filter(r => 
    r.customers?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.customer_phone?.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <h1 className="text-4xl font-bold">Tuxedo Rental Admin</h1>
          <div className="flex items-center gap-6">
            <span className="bg-purple-600 px-5 py-2 rounded-full font-bold text-lg">{profile?.role?.toUpperCase()}</span>
            <button onClick={signOut} className="flex items-center gap-3 bg-red-600 px-6 py-3 rounded-xl hover:bg-red-700 transition font-bold">
              <LogOut size={20} /> Logout
            </button>
          </div>
        </div>
      </header>

      {/* Nav */}
      <nav className="bg-white shadow-lg border-b">
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
                onClick={() => { setActiveTab(tab.id); setSearchTerm(''); }}
                className={`flex items-center gap-3 px-8 py-4 rounded-t-2xl font-bold text-lg transition-all whitespace-nowrap ${
                  activeTab === tab.id 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-2xl' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <tab.icon size={22} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-8">
        <div className="mb-8 flex justify-between items-center">
          <h2 className="text-4xl font-bold">
            {activeTab === 'dashboard' && "Today's Operations"}
            {activeTab === 'rentals' && 'All Rentals'}
            {activeTab === 'customers' && 'Customers'}
            {activeTab === 'inventory' && 'Inventory'}
            {activeTab === 'billing' && 'Billing'}
            {activeTab === 'analytics' && 'Analytics'}
            {activeTab === 'users' && 'User Management'}
          </h2>
          {hasPermission('edit') && (activeTab === 'customers' || activeTab === 'inventory' || activeTab === 'rentals') && (
            <button onClick={() => openModal(activeTab === 'rentals' ? 'rental' : activeTab.slice(0, -1))} className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold hover:scale-105 transition">
              <Plus size={24} /> Add {activeTab === 'rentals' ? 'Rental' : activeTab.slice(0, -1)}
            </button>
          )}
        </div>

        {/* Search */}
        {['customers', 'inventory', 'rentals'].includes(activeTab) && (
          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-4 text-gray-400" size={24} />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-14 pr-6 py-4 border-2 rounded-xl text-lg"
              />
            </div>
          </div>
        )}

        {/* Dashboard */}
        {activeTab === 'dashboard' && (
          // ... [your beautiful dashboard code from before]
          <div className="space-y-10">
            {overdue.length > 0 && (
              <div className="bg-red-100 border-4 border-red-600 rounded-3xl p-10">
                <h3 className="text-3xl font-bold text-red-800 flex items-center gap-4 mb-6">
                  <AlertCircle size={40} /> OVERDUE ({overdue.length})
                </h3>
                {overdue.map(r => (
                  <div key={r.id} className="bg-white p-6 rounded-2xl mb-4 flex justify-between items-center shadow-lg">
                    <div>
                      <p className="text-2xl font-bold">{r.customers.name}</p>
                      <p className="text-red-600 text-lg">Due: {r.return_date}</p>
                    </div>
                    <button onClick={() => handleCheckIn(r.id)} className="bg-red-600 text-white px-10 py-4 rounded-xl font-bold text-xl hover:bg-red-700">
                      CHECK IN
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="grid lg:grid-cols-2 gap-10">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white p-10 rounded-3xl shadow-2xl">
                <h3 className="text-4xl font-bold mb-8">Pickups Today ({todayPickups.length})</h3>
                {todayPickups.length === 0 ? <p className="text-2xl opacity-80">No pickups today</p> : todayPickups.map(r => (
                  <div key={r.id} className="bg-white/20 backdrop-blur p-8 rounded-2xl mb-6">
                    <p className="text-3xl font-bold">{r.customers.name}</p>
                    <p className="text-xl opacity-90">${r.total} • {r.item_ids.length} items</p>
                    <button onClick={() => handlePickup(r.id)} className="mt-6 w-full bg-white text-green-600 py-5 rounded-xl font-bold text-xl hover:scale-105 transition">
                      COMPLETE PICKUP
                    </button>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white p-10 rounded-3xl shadow-2xl">
                <h3 className="text-4xl font-bold mb-8">Returns Today ({todayReturns.length})</h3>
                {todayReturns.length === 0 ? <p className="text-2xl opacity-80">No returns today</p> : todayReturns.map(r => (
                  <div key={r.id} className="bg-white/20 backdrop-blur p-8 rounded-2xl mb-6">
                    <p className="text-3xl font-bold">{r.customers.name}</p>
                    <p className="text-xl opacity-90">Paid: ${r.paid_amount || 0} / ${r.total}</p>
                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <button onClick={() => handleCheckIn(r.id)} className="bg-white text-blue-600 py-5 rounded-xl font-bold text-xl">
                        CHECK IN
                      </button>
                      {r.paid_amount < r.total && (
                        <button onClick={() => openModal('payment', r)} className="bg-green-500 py-5 rounded-xl font-bold text-xl">
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

        {/* Customers Tab */}
        {activeTab === 'customers' && (
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <tr>
                  <th className="px-8 py-6 text-left text-lg font-bold">Name</th>
                  <th className="px-8 py-6 text-left text-lg font-bold">Phone</th>
                  <th className="px-8 py-6 text-left text-lg font-bold">Email</th>
                  <th className="px-8 py-6 text-left text-lg font-bold">Rentals</th>
                  <th className="px-8 py-6 text-left text-lg font-bold">ID</th>
                  <th className="px-8 py-6 text-left text-lg font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map(c => (
                  <tr key={c.id} className="border-b hover:bg-gray-50">
                    <td className="px-8 py-6 font-semibold">{c.name}</td>
                    <td className="px-8 py-6">{c.phone}</td>
                    <td className="px-8 py-6">{c.email}</td>
                    <td className="px-8 py-6 text-center">{c.total_rentals}</td>
                    <td className="px-8 py-6">
                      {c.id_photo_url ? (
                        <button onClick={() => window.open(c.id_photo_url, '_blank')} className="text-blue-600 hover:underline flex items-center gap-2">
                          <Eye size={20} /> View
                        </button>
                      ) : '—'}
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex gap-3">
                        <button onClick={() => openModal('customer', c)} className="text-blue-600 hover:bg-blue-100 p-3 rounded-xl"><Edit2 size={20} /></button>
                        {hasPermission('delete') && <button onClick={() => deleteItem('customers', c.id)} className="text-red-600 hover:bg-red-100 p-3 rounded-xl"><Trash2 size={20} /></button>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Inventory Tab */}
        {activeTab === 'inventory' && (
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <tr>
                  <th className="px-8 py-6 text-left">Name</th>
                  <th className="px-8 py-6 text-left">RFID</th>
                  <th className="px-8 py-6 text-left">Category</th>
                  <th className="px-8 py-6 text-left">Size</th>
                  <th className="px-8 py-6 text-left">Price</th>
                  <th className="px-8 py-6 text-left">Status</th>
                  <th className="px-8 py-6 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory.map(i => (
                  <tr key={i.id} className="border-b hover:bg-gray-50">
                    <td className="px-8 py-6 font-semibold">{i.name}</td>
                    <td className="px-8 py-6 font-mono">{i.rfid || '—'}</td>
                    <td className="px-8 py-6">{i.category}</td>
                    <td className="px-8 py-6">{i.size}</td>
                    <td className="px-8 py-6">${i.price}</td>
                    <td className="px-8 py-6">
                      <span className={`px-4 py-2 rounded-full text-white text-sm font-bold ${
                        i.status === 'available' ? 'bg-green-500' :
                        i.status === 'rented' ? 'bg-red-500' :
                        i.status === 'cleaning' ? 'bg-yellow-500' : 'bg-gray-500'
                      }`}>
                        {i.status}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <button onClick={() => openModal('inventory', i)} className="text-blue-600 hover:bg-blue-100 p-3 rounded-xl"><Edit2 size={20} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Rentals Tab */}
        {activeTab === 'rentals' && (
          <div className="space-y-6">
            {filteredRentals.map(r => (
              <div key={r.id} className="bg-white rounded-3xl shadow-2xl p-8">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-3xl font-bold">{r.customers.name}</h3>
                    <p className="text-xl text-gray-600">{r.customer_phone} • Event: {r.event_date}</p>
                    <p className="text-lg">Pickup: {r.pickup_date} → Return: {r.return_date}</p>
                    <p className="text-2xl font-bold mt-4">${r.paid_amount} / ${r.total} • {r.item_ids.length} items</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-6 py-3 rounded-full text-white font-bold text-lg ${
                      r.status === 'reserved' ? 'bg-orange-500' :
                      r.status === 'picked_up' ? 'bg-blue-500' :
                      r.status === 'returned' ? 'bg-green-500' : 'bg-gray-500'
                    }`}>
                      {r.status.toUpperCase()}
                    </span>
                    <div className="mt-4 flex gap-3">
                      <button onClick={() => window.print()} className="bg-gray-600 text-white px-6 py-3 rounded-xl"><Printer /></button>
                      {r.status === 'reserved' && <button onClick={() => handlePickup(r.id)} className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold">Pickup</button>}
                      {r.status === 'picked_up' && <button onClick={() => handleCheckIn(r.id)} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold">Return</button>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* MODALS */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-8">
          <div className="bg-white rounded-3xl p-10 max-w-4xl w-full max-h-screen overflow-y-auto shadow-3xl">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-4xl font-bold">
                {modalType === 'customer' ? 'Customer' : modalType === 'inventory' ? 'Inventory Item' : modalType === 'rental' ? 'New Rental' : 'Record Payment'}
              </h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-red-600"><X size={40} /></button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); 
              modalType === 'customer' ? saveCustomer() : 
              modalType === 'inventory' ? saveInventory() :
              modalType === 'rental' ? saveRental() :
              recordPayment();
            }} className="space-y-8">

              {modalType === 'customer' && (
                <>
                  <input placeholder="Name" required defaultValue={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-5 border-2 rounded-xl text-xl" />
                  <input placeholder="Phone" defaultValue={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full p-5 border-2 rounded-xl text-xl" />
                  <input placeholder="Email" defaultValue={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full p-5 border-2 rounded-xl text-xl" />
                  <input type="file" accept="image/*" onChange={e => setFormData({...formData, idPhotoFile: e.target.files?.[0]})} className="w-full p-5 border-2 rounded-xl" />
                </>
              )}

              {modalType === 'inventory' && (
                <>
                  <input placeholder="Name" required defaultValue={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-5 border-2 rounded-xl text-xl" />
                  <input placeholder="RFID" defaultValue={formData.rfid} onChange={e => setFormData({...formData, rfid: e.target.value})} className="w-full p-5 border-2 rounded-xl text-xl font-mono" />
                  <select defaultValue={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full p-5 border-2 rounded-xl text-xl">
                    <option value="">Category</option>
                    {['Tuxedo', 'Suit', 'Shirt', 'Vest', 'Tie', 'Shoes', 'Accessory'].map(c => <option key={c}>{c}</option>)}
                  </select>
                  <input placeholder="Size" defaultValue={formData.size} onChange={e => setFormData({...formData, size: e.target.value})} className="w-full p-5 border-2 rounded-xl text-xl" />
                  <input placeholder="Price" type="number" defaultValue={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full p-5 border-2 rounded-xl text-xl" />
                </>
              )}

              {modalType === 'rental' && (
                <>
                  <select required onChange={e => setFormData({...formData, customer_id: e.target.value})} className="w-full p-5 border-2 rounded-xl text-xl">
                    <option value="">Select Customer</option>
                    {customers.map(c => <option key={c.id} value={c.id}>{c.name} - {c.phone}</option>)}
                  </select>
                  <input type="date" placeholder="Event Date" required onChange={e => setFormData({...formData, event_date: e.target.value})} className="w-full p-5 border-2 rounded-xl text-xl" />
                  <input type="date" placeholder="Pickup Date" required onChange={e => setFormData({...formData, pickup_date: e.target.value})} className="w-full p-5 border-2 rounded-xl text-xl" />
                  <input type="date" placeholder="Return Date" required onChange={e => setFormData({...formData, return_date: e.target.value})} className="w-full p-5 border-2 rounded-xl text-xl" />
                  <input placeholder="Deposit" type="number" onChange={e => setFormData({...formData, deposit: e.target.value})} className="w-full p-5 border-2 rounded-xl text-xl" />
                  <div>
                    <p className="text-xl font-bold mb-4">Select Items</p>
                    <div className="grid grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                      {inventory.filter(i => i.status === 'available').map(i => (
                        <label key={i.id} className="flex items-center gap-3 p-4 border-2 rounded-xl hover:bg-blue-50 cursor-pointer">
                          <input type="checkbox" checked={selectedItems.includes(i.id)} onChange={e => {
                            if (e.target.checked) setSelectedItems([...selectedItems, i.id]);
                            else setSelectedItems(selectedItems.filter(id => id !== i.id));
                          }} />
                          <div>
                            <p className="font-bold">{i.name}</p>
                            <p className="text-sm">${i.price} • {i.size}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {modalType === 'payment' && (
                <>
                  <p className="text-2xl">Customer: {formData.customers?.name}</p>
                  <p className="text-2xl">Balance: ${(formData.total - formData.paid_amount).toFixed(2)}</p>
                  <input type="number" placeholder="Amount" required onChange={e => setFormData({...formData, amount: e.target.value})} className="w-full p-5 border-2 rounded-xl text-xl" />
                </>
              )}

              <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-6 rounded-2xl font-bold text-2xl hover:scale-105 transition">
                Save
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}