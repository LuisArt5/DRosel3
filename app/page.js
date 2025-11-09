'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Calendar, Users, Package, DollarSign, BarChart3, Search, Plus, X, AlertTriangle, CheckCircle, Clock, Trash2, LogOut, UserCheck } from 'lucide-react';

// Supabase client
const supabaseUrl = process.env.SUPABASE_URL || 'YOUR_URL_HERE';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'YOUR_KEY_HERE';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function TuxedoAdmin() {
  const [user, setUser] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({});
  const [tab, setTab] = useState('dashboard');
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch rentals from Supabase
  useEffect(() => {
    const fetchRentals = async () => {
      const { data, error } = await supabase.from('rentals').select('*').order('id', { ascending: false });
      if (error) {
        console.error('Error fetching rentals:', error);
        alert('Database error — check Supabase');
      } else {
        setRentals(data || []);
      }
      setLoading(false);
    };
    if (!isLogin) fetchRentals();

    // Real-time subscription
    const channel = supabase.channel('rentals-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'rentals' }, (payload) => {
        fetchRentals();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [isLogin]);

  const today = new Date().toISOString().split('T')[0];
  const overdue = rentals.filter(r => r.return_date < today && r.status !== 'returned');
  const pickups = rentals.filter(r => r.pickup_date === today && r.status === 'reserved');
  const returns = rentals.filter(r => r.return_date === today);

  const login = (e) => {
    e.preventDefault();
    if (form.username === 'admin' && form.password === 'admin123') {
      setUser({ name: 'Admin User', role: 'admin' });
      setIsLogin(false);
    } else alert('Use: admin / admin123');
  };

  const addRental = async () => {
    const newRental = {
      customer_name: 'New Customer',
      pickup_date: today,
      return_date: today,
      status: 'reserved',
      total: 150,
      paid: 0
    };
    const { data, error } = await supabase.from('rentals').insert(newRental).select();
    if (error) alert('Error adding rental');
  };

  if (isLogin) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl p-10 w-full max-w-md">
          <h1 className="text-4xl font-bold text-center mb-8 text-slate-800">Tuxedo Rental Admin</h1>
          <form onSubmit={login} className="space-y-6">
            <input type="text" placeholder="Username" className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg" onChange={e => setForm({...form, username: e.target.value})} required />
            <input type="password" placeholder="Password" className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg" onChange={e => setForm({...form, password: e.target.value})} required />
            <button type="submit" className="w-full py-4 bg-slate-800 text-white rounded-lg font-bold hover:bg-slate-700">Login</button>
            <p className="text-center text-sm text-slate-600">admin / admin123</p>
          </form>
        </div>
      </div>
    );
  }

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><p className="text-2xl">Connecting to Supabase...</p></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* YOUR ORIGINAL HEADER */}
      <header className="bg-slate-900 text-white p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Tuxedo Rental Admin</h1>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="font-medium">{user.name}</div>
              <div className="text-sm opacity-75">Supabase Connected</div>
            </div>
            <button onClick={() => setIsLogin(true)} className="flex items-center gap-2 px-4 py-2 bg-slate-700 rounded hover:bg-slate-600">
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>
      </header>

      {/* YOUR ORIGINAL TABS */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-1">
            {[
              { id: 'dashboard', label: 'Today', icon: Clock },
              { id: 'rentals', label: 'Rentals', icon: Calendar },
              { id: 'customers', label: 'Customers', icon: Users },
              { id: 'inventory', label: 'Inventory', icon: Package },
              { id: 'billing', label: 'Billing', icon: DollarSign },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 },
              { id: 'users', label: 'Users', icon: UserCheck }
            ].map(t => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex items-center gap-2 px-6 py-4 border-b-4 font-medium transition ${
                    tab === t.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon size={20} /> {t.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6">
        {tab === 'dashboard' && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold">Today's Tasks — {new Date().toLocaleDateString()}</h2>
              <button onClick={addRental} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
                <Plus size={20} /> Test Add Rental
              </button>
            </div>

            {overdue.length > 0 && (
              <div className="bg-red-50 border-l-4 border-red-500 p-6 mb-8 rounded-r">
                <h3 className="text-xl font-bold text-red-800 mb-4">Overdue Returns ({overdue.length})</h3>
                {overdue.map(r => (
                  <div key={r.id} className="bg-white p-4 rounded shadow mb-3">
                    <p className="font-semibold">{r.customer_name}</p>
                    <p className="text-sm text-red-600">Due: {r.return_date}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-lg shadow">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-3"><CheckCircle className="text-green-600" /> Pickups Today ({pickups.length})</h3>
                {pickups.length === 0 ? <p className="text-gray-500">No pickups</p> : pickups.map(r => <div key={r.id} className="p-3 bg-green-50 rounded mb-2"><strong>{r.customer_name}</strong></div>)}
              </div>
              <div className="bg-white p-8 rounded-lg shadow">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-3"><Calendar className="text-blue-600" /> Returns Today ({returns.length})</h3>
                {returns.length === 0 ? <p className="text-gray-500">No returns</p> : returns.map(r => <div key={r.id} className="p-3 bg-blue-50 rounded mb-2"><strong>{r.customer_name}</strong></div>)}
              </div>
            </div>
          </div>
        )}

        {tab === 'rentals' && (
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left">Customer</th>
                  <th className="px-6 py-4 text-left">Pickup</th>
                  <th className="px-6 py-4 text-left">Return</th>
                  <th className="px-6 py-4 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {rentals.map(r => (
                  <tr key={r.id} className="border-b">
                    <td className="px-6 py-4">{r.customer_name}</td>
                    <td className="px-6 py-4">{r.pickup_date}</td>
                    <td className="px-6 py-4">{r.return_date}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs ${r.status === 'reserved' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}