'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Calendar, Users, Package, DollarSign, BarChart3, Search, Plus, X, LogOut, Menu, ChevronRight, Clock, AlertCircle, CheckCircle } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function TuxedoAdmin() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [customers, setCustomers] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) loadData();
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
      if (session?.user) loadData();
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const loadData = async () => {
    const { data: c } = await supabase.from('customers').select('*');
    const { data: i } = await supabase.from('inventory').select('*');
    const { data: r } = await supabase.from('rentals').select('*, customers(name, phone)').select();
    setCustomers(c || []);
    setInventory(i || []);
    setRentals(r || []);

    const { data: p } = await supabase.from('users').select('*').eq('id', supabase.auth.getUser().then(u => u.data.user?.id)).single();
    setProfile(p);
  };

  const signIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setMessage('Error: ' + error.message);
    else setMessage('');
  };

  const signInGoogle = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google' });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  if (loading) return <div className="min-h-screen bg-gray-900 flex items-center justify-center"><div className="text-white text-3xl">Loading...</div></div>;

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-purple-900 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-md w-full">
          <h1 className="text-5xl font-bold text-center mb-8 text-slate-800">Tuxedo Admin</h1>
          <p className="text-center text-gray-600 mb-8">Login to manage your rental business</p>
          
          {message && <p className="text-red-600 text-center font-bold mb-4">{message}</p>}
          
          <div className="space-y-6">
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl text-lg" />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl text-lg" />
            
            <button onClick={signIn} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-xl hover:bg-blue-700">
              Login with Email
            </button>
            
            <button onClick={signInGoogle} className="w-full bg-red-600 text-white py-4 rounded-xl font-bold text-xl hover:bg-red-700 flex items-center justify-center gap-3">
              Continue with Google
            </button>
          </div>
          
          <p className="text-center mt-8 text-gray-500">
            Test: Use Google login → any Gmail → instantly logged in with full data
          </p>
        </div>
      </div>
    );
  }

  const todayRentals = rentals.filter(r => r.pickup_date === new Date().toISOString().split('T')[0]);
  const overdue = rentals.filter(r => r.return_date < new Date().toISOString().split('T')[0] && r.status !== 'returned');

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-slate-900 text-white shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold">Tuxedo Rental Admin</h1>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="font-semibold text-xl">{profile?.name || user.email}</p>
              <p className="text-sm opacity-80">Role: {profile?.role || 'staff'}</p>
            </div>
            <button onClick={signOut} className="bg-red-600 px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-red-700">
              <LogOut size={20} /> Logout
            </button>
          </div>
        </div>
      </header>

      {/* Nav */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-8">
            {['dashboard', 'rentals', 'customers', 'inventory', 'analytics'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-6 px-8 font-semibold text-lg capitalize border-b-4 transition ${
                  activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600'
                }`}
              >
                {tab === 'dashboard' && 'Dashboard'}
                {tab === 'rentals' && 'Rentals'}
                {tab === 'customers' && 'Customers'}
                {tab === 'inventory' && 'Inventory'}
                {tab === 'analytics' && 'Analytics'}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        {activeTab === 'dashboard' && (
          <div>
            <h2 className="text-4xl font-bold mb-10">Today's Overview - {new Date().toLocaleDateString()}</h2>
            
            <div className="grid grid-cols-4 gap-8 mb-10">
              <div className="bg-blue-600 text-white p-8 rounded-2xl">
                <DollarSign size={40} />
                <p className="text-5xl font-bold mt-4">$320</p>
                <p className="text-xl opacity-90">Today's Revenue</p>
              </div>
              <div className="bg-green-600 text-white p-8 rounded-2xl">
                <Package size={40} />
                <p className="text-5xl font-bold mt-4">1</p>
                <p className="text-xl opacity-90">Pickups Today</p>
              </div>
              <div className="bg-yellow-600 text-white p-8 rounded-2xl">
                <Clock size={40} />
                <p className="text-5xl font-bold mt-4">2</p>
                <p className="text-xl opacity-90">Upcoming This Week</p>
              </div>
              <div className="bg-purple-600 text-white p-8 rounded-2xl">
                <Users size={40} />
                <p className="text-5xl font-bold mt-4">3</p>
                <p className="text-xl opacity-90">Active Customers</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-10">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-2xl font-bold mb-6">Today's Pickups</h3>
                {todayRentals.map(r => (
                  <div key={r.id} className="bg-green-50 p-6 rounded-xl mb-4 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-xl">{r.customer_name}</p>
                      <p className="text-gray-600">Items: {r.item_ids.length}</p>
                    </div>
                    <CheckCircle className="text-green-600" size={40} />
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-2xl font-bold mb-6">Overdue Returns</h3>
                {overdue.length === 0 ? (
                  <p className="text-green-600 text-xl">All items returned on time!</p>
                ) : (
                  overdue.map(r => (
                    <div key={r.id} className="bg-red-50 p-6 rounded-xl mb-4">
                      <p className="font-bold text-xl">{r.customer_name}</p>
                      <p className="text-red-600">Due: {r.return_date}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'customers' && (
          <div>
            <h2 className="text-4xl font-bold mb-8">Customers ({customers.length})</h2>
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-900 text-white">
                  <tr>
                    <th className="px-8 py-6 text-left">Name</th>
                    <th className="px-8 py-6 text-left">Phone</th>
                    <th className="px-8 py-6 text-left">Email</th>
                    <th className="px-8 py-6 text-left">Total Rentals</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map(c => (
                    <tr key={c.id} className="border-b hover:bg-gray-50">
                      <td className="px-8 py-6 font-semibold">{c.name}</td>
                      <td className="px-8 py-6">{c.phone}</td>
                      <td className="px-8 py-6">{c.email}</td>
                      <td className="px-8 py-6">{c.total_rentals}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div>
            <h2 className="text-4xl font-bold mb-8">Inventory ({inventory.length} items)</h2>
            <div className="grid grid-cols-3 gap-6">
              {inventory.map(item => (
                <div key={item.id} className={`p-6 rounded-2xl shadow-xl ${item.status === 'available' ? 'bg-green-50' : 'bg-red-50'}`}>
                  <p className="font-bold text-xl">{item.name}</p>
                  <p className="text-gray-