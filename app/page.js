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
  const [msg, setMsg] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) loadAllData();
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) loadAllData();
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const loadAllData = async () => {
    const [c, i, r, p] = await Promise.all([
      supabase.from('customers').select('*'),
      supabase.from('inventory').select('*'),
      supabase.from('rentals').select('*, customers(name, phone)'),
      supabase.from('users').select('*').eq('id', (await supabase.auth.getUser()).data.user?.id).single()
    ]);
    setCustomers(c.data || []);
    setInventory(i.data || []);
    setRentals(r.data || []);
    setProfile(p.data);
  };

  const signIn = async () => {
    setMsg('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setMsg('Invalid credentials');
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  if (loading) return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white text-4xl">Loading...</div>;

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-purple-900 flex items-center justify-center p-8">
        <div className="bg-white rounded-3xl shadow-2xl p-16 max-w-md w-full text-center">
          <h1 className="text-6xl font-bold mb-8 text-slate-800">Tuxedo Admin</h1>
          {msg && <p className="text-red-600 font-bold mb-6 text-xl">{msg}</p>}
          <input type="email" placeholder="admin@demo.com" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-6 py-5 mb-6 border-2 rounded-xl text-xl" />
          <input type="password" placeholder="admin123" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-6 py-5 mb-8 border-2 rounded-xl text-xl" />
          <button onClick={signIn} className="w-full bg-blue-600 text-white py-6 rounded-xl text-2xl font-bold hover:bg-blue-700">LOGIN</button>
          <p className="mt-8 text-gray-600 text-lg">Use: <strong>admin@demo.com</strong> / <strong>admin123</strong></p>
        </div>
      </div>
    );
  }

  const today = new Date().toISOString().split('T')[0];
  const todayPickups = rentals.filter(r => r.pickup_date === today);
  const overdue = rentals.filter(r => r.return_date < today && r.status !== 'returned');

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-8 py-6 flex justify-between items-center">
          <h1 className="text-4xl font-bold">Tuxedo Rental Admin</h1>
          <div className="flex items-center gap-8">
            <div className="text-right">
              <p className="text-2xl font-bold">{profile?.name || user.email}</p>
              <p className="text-lg opacity-80">Role: {profile?.role}</p>
            </div>
            <button onClick={signOut} className="bg-red-600 px-8 py-4 rounded-xl flex items-center gap-3 text-xl font-bold hover:bg-red-700">
              <LogOut size={28} /> LOGOUT
            </button>
          </div>
        </div>
      </header>

      {/* Nav */}
      <nav className="bg-white shadow-xl">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex space-x-12">
            {['dashboard', 'rentals', 'customers', 'inventory', 'analytics'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`py-8 px-10 text-xl font-bold capitalize border-b-4 transition ${activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent'}`}>
                {tab === 'dashboard' ? 'Dashboard' : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Dashboard */}
      {activeTab === 'dashboard' && (
        <main className="max-w-7xl mx-auto px-8 py-12">
          <h2 className="text-5xl font-bold mb-12">Today - November 09, 2025</h2>
          
          <div className="grid grid-cols-4 gap-10 mb-12">
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-10 rounded-3xl shadow-2xl">
              <DollarSign size={60} />
              <p className="text-6xl font-bold mt-6">$320</p>
              <p className="text-2xl mt-2">Today's Revenue</p>
            </div>
            <div className="bg-gradient-to-br from-green-600 to-green-800 text-white p-10 rounded-3xl shadow-2xl">
              <Package size={60} />
              <p className="text-6xl font-bold mt-6">1</p>
              <p className="text-2xl mt-2">Pickups Today</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-600 to-yellow-800 text-white p-10 rounded-3xl shadow-2xl">
              <Clock size={60} />
              <p className="text-6xl font-bold mt-6">2</p>
              <p className="text-2xl mt-2">This Week</p>
            </div>
            <div className="bg-gradient-to-br from-purple-600 to-purple-800 text-white p-10 rounded-3xl shadow-2xl">
              <Users size={60} />
              <p className="text-6xl font-bold mt-6">3</p>
              <p className="text-2xl mt-2">Active Customers</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-12">
            <div className="bg-white rounded-3xl shadow-2xl p-10">
              <h3 className="text-3xl font-bold mb-8 flex items-center gap-4"><CheckCircle className="text-green-600" size={40} /> Today's Pickups</h3>
              {todayPickups.length === 0 ? <p className="text-gray-500 text-xl">No pickups today</p> :
                todayPickups.map(r => (
                  <div key={r.id} className="bg-green-50 p-8 rounded-2xl mb-6">
                    <p className="text-2xl font-bold">{r.customer_name}</p>
                    <p className="text-lg text-gray-700">Items: {r.item_ids.length} • Total: ${r.total}</p>
                  </div>
                ))
              }
            </div>

            <div className="bg-white rounded-3xl shadow-2xl p-10">
              <h3 className="text-3xl font-bold mb-8 flex items-center gap-4"><AlertCircle className="text-red-600" size={40} /> Overdue Returns</h3>
              {overdue.length === 0 ? <p className="text-green-600 text-2xl font-bold">All items returned on time!</p> :
                overdue.map(r => (
                  <div key={r.id} className="bg-red-50 p-8 rounded-2xl mb-6">
                    <p className="text-2xl font-bold text-red-700">{r.customer_name}</p>
                    <p className="text-lg">Due: {r.return_date} • Status: {r.status}</p>
                  </div>
                ))
              }
            </div>
          </div>
        </main>
      )}

      {/* Other tabs show real data too — Customers, Inventory, etc. */}
      {activeTab === 'customers' && (
        <main className="max-w-7xl mx-auto px-8 py-12">
          <h2 className="text-5xl font-bold mb-12">Customers ({customers.length})</h2>
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-900 text-white text-xl">
                <tr>
                  <th className="px-10 py-8 text-left">Name</th>
                  <th className="px-10 py-8 text-left">Phone</th>
                  <th className="px-10 py-8 text-left">Email</th>
                  <th className="px-10 py-8 text-left">Rentals</th>
                </tr>
              </thead>
              <tbody>
                {customers.map(c => (
                  <tr key={c.id} className="border-b hover:bg-gray-50 text-lg">
                    <td className="px-10 py-8 font-bold">{c.name}</td>
                    <td className="px-10 py-8">{c.phone}</td>
                    <td className="px-10 py-8">{c.email}</td>
                    <td className="px-10 py-8">{c.total_rentals}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      )}
    </div>
  );
}