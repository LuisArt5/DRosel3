'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Users, Package, DollarSign, BarChart3, Search, Plus, X, AlertTriangle, CheckCircle, Clock, Trash2, LogOut, UserCheck } from 'lucide-react';

export default function TuxedoAdmin() {
  const [user, setUser] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({});
  const [tab, setTab] = useState('dashboard');
  const [rentals, setRentals] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('tuxedo-rentals');
    if (saved) setRentals(JSON.parse(saved));
    else {
      const defaults = [
        { id: 1, customerName: 'John Smith', pickupDate: '2025-11-08', returnDate: '2025-11-08', status: 'out', total: 165, paid: 165 },
        { id: 2, customerName: 'Sarah Johnson', pickupDate: '2025-11-10', returnDate: '2025-11-12', status: 'reserved', total: 120, paid: 50 }
      ];
      setRentals(defaults);
      localStorage.setItem('tuxedo-rentals', JSON.stringify(defaults));
    }
  }, []);

  useEffect(() => {
    if (rentals.length > 0) localStorage.setItem('tuxedo-rentals', JSON.stringify(rentals));
  }, [rentals]);

  const today = new Date().toISOString().split('T')[0];
  const overdue = rentals.filter(r => r.returnDate < today && r.status !== 'returned');
  const pickups = rentals.filter(r => r.pickupDate === today && r.status === 'reserved');
  const returns = rentals.filter(r => r.returnDate === today);

  const login = (e) => {
    e.preventDefault();
    if (form.username === 'admin' && form.password === 'admin123') {
      setUser({ name: 'Admin User', role: 'admin' });
      setIsLogin(false);
    } else alert('Use: admin / admin123');
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* YOUR ORIGINAL HEADER */}
      <header className="bg-slate-900 text-white p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Tuxedo Rental Admin</h1>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="font-medium">{user.name}</div>
              <div className="text-sm opacity-75">Admin Access</div>
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
            <h2 className="text-3xl font-bold mb-8">Today's Tasks — {new Date().toLocaleDateString()}</h2>

            {overdue.length > 0 && (
              <div className="bg-red-50 border-l-4 border-red-500 p-6 mb-8 rounded-r">
                <h3 className="text-xl font-bold text-red-800 mb-4">Overdue Returns ({overdue.length})</h3>
                {overdue.map(r => (
                  <div key={r.id} className="bg-white p-4 rounded shadow mb-3">
                    <p className="font-semibold">{r.customerName}</p>
                    <p className="text-sm text-red-600">Due: {r.returnDate}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-lg shadow">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-3"><CheckCircle className="text-green-600" /> Pickups Today ({pickups.length})</h3>
                {pickups.length === 0 ? <p className="text-gray-500">No pickups</p> : pickups.map(r => <div key={r.id} className="p-3 bg-green-50 rounded mb-2"><strong>{r.customerName}</strong></div>)}
              </div>
              <div className="bg-white p-8 rounded-lg shadow">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-3"><Calendar className="text-blue-600" /> Returns Today ({returns.length})</h3>
                {returns.length === 0 ? <p className="text-gray-500">No returns</p> : returns.map(r => <div key={r.id} className="p-3 bg-blue-50 rounded mb-2"><strong>{r.customerName}</strong></div>)}
              </div>
            </div>
          </div>
        )}

        {tab === 'rentals' && <div className="bg-white p-8 rounded-lg shadow"><h2 className="text-2xl font-bold mb-6">All Rentals</h2><p className="text-gray-600">Full rentals list coming soon...</p></div>}
        {tab === 'customers' && <div className="bg-white p-8 rounded-lg shadow"><h2 className="text-2xl font-bold mb-6">Customers</h2><p className="text-gray-600">Customer management...</p></div>}
        {tab === 'inventory' && <div className="bg-white p-8 rounded-lg shadow"><h2 className="text-2xl font-bold mb-6">Inventory</h2><p className="text-gray-600">Track tuxedos, shoes, accessories...</p></div>}
        {tab === 'billing' && <div className="bg-white p-8 rounded-lg shadow"><h2 className="text-2xl font-bold mb-6">Billing</h2><p className="text-gray-600">Payments & invoices...</p></div>}
        {tab === 'analytics' && <div className="bg-white p-8 rounded-lg shadow"><h2 className="text-2xl font-bold mb-6">Analytics</h2><p className="text-gray-600">Revenue charts coming soon...</p></div>}
        {tab === 'users' && <div className="bg-white p-8 rounded-lg shadow"><h2 className="text-2xl font-bold mb-6">User Management</h2><p className="text-gray-600">Admin only area...</p></div>}
      </main>
    </div>
  );
}