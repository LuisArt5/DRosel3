'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Users, Package, DollarSign, BarChart3, Search, Plus, X, AlertTriangle, CheckCircle, Clock, Trash2, LogOut } from 'lucide-react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function TuxedoAdmin() {
  const [user, setUser] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({});
  const [tab, setTab] = useState('dashboard');

  // Data
  const [rentals, setRentals] = useState(() => {
    const saved = localStorage.getItem('rentals');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'John Smith', pickup: '2025-11-08', return: '2025-11-08', status: 'out', total: 165, paid: 165 },
      { id: 2, name: 'Sarah Johnson', pickup: '2025-11-10', return: '2025-11-12', status: 'reserved', total: 120, paid: 50 }
    ];
  });

  useEffect(() => {
    localStorage.setItem('rentals', JSON.stringify(rentals));
  }, [rentals]);

  const today = new Date().toISOString().split('T')[0];
  const overdue = rentals.filter(r => r.return < today && r.status !== 'returned');
  const pickupsToday = rentals.filter(r => r.pickup === today);
  const returnsToday = rentals.filter(r => r.return === today);

  const login = (e) => {
    e.preventDefault();
    if (form.username === 'admin' && form.password === 'admin123') {
      setUser({ name: 'Admin', role: 'admin' });
      setIsLogin(false);
    } else {
      alert('Use: admin / admin123');
    }
  };

  if (isLogin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 to-blue-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-12 w-full max-w-md">
          <h1 className="text-5xl font-bold text-center mb-8 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Tuxedo Admin</h1>
          <form onSubmit={login} className="space-y-6">
            <input
              type="text"
              placeholder="Username"
              className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-2xl focus:border-purple-500 focus:outline-none"
              onChange={e => setForm({...form, username: e.target.value})}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-2xl focus:border-purple-500 focus:outline-none"
              onChange={e => setForm({...form, password: e.target.value})}
              required
            />
            <button type="submit" className="w-full py-5 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xl font-bold rounded-2xl hover:from-purple-700 hover:to-blue-700 transition shadow-xl">
              Login Securely
            </button>
            <div className="bg-purple-50 p-4 rounded-xl text-center">
              <p className="font-bold text-purple-800">Demo: admin / admin123</p>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-800 to-blue-800 text-white shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          <h1 className="text-4xl font-bold">Tuxedo Rental Admin</h1>
          <button onClick={() => setIsLogin(true)} className="flex items-center gap-3 px-6 py-3 bg-white/20 rounded-xl hover:bg-white/30 transition">
            <LogOut size={24} /> Logout
          </button>
        </div>
      </header>

      {/* Nav */}
      <nav className="bg-white shadow-lg sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex overflow-x-auto">
          {['dashboard', 'rentals', 'analytics'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-10 py-6 font-bold text-lg capitalize transition ${tab === t ? 'bg-purple-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              {t === 'dashboard' && <Clock className="inline mr-2" />}
              {t === 'rentals' && <Calendar className="inline mr-2" />}
              {t === 'analytics' && <BarChart3 className="inline mr-2" />}
              {t}
            </button>
          ))}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-8">
        {tab === 'dashboard' && (
          <div>
            <h2 className="text-5xl font-bold mb-10 text-gray-800">
              Today: {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </h2>

            {/* OVERDUE */}
            {overdue.length > 0 && (
              <div className="bg-gradient-to-r from-red-600 to-pink-600 text-white p-10 rounded-3xl mb-10 shadow-2xl">
                <h3 className="text-4xl font-bold mb-6 flex items-center gap-4">
                  <AlertTriangle size={48} /> OVERDUE ({overdue.length})
                </h3>
                {overdue.map(r => (
                  <div key={r.id} className="bg-white/20 p-6 rounded-2xl mb-4">
                    <p className="text-2xl font-bold">{r.name}</p>
                    <p className="text-lg">Due: {r.return} → {Math.floor((new Date(today) - new Date(r.return)) / 86400000)} days late</p>
                  </div>
                ))}
              </div>
            )}

            <div className="grid lg:grid-cols-2 gap-10">
              <div className="bg-white p-10 rounded-3xl shadow-2xl">
                <h3 className="text-3xl font-bold mb-6 flex items-center gap-4 text-green-600">
                  <CheckCircle size={40} /> Pickups Today ({pickupsToday.length})
                </h3>
                {pickupsToday.length === 0 ? <p className="text-gray-500 text-xl">No pickups scheduled</p> : pickupsToday.map(r => (
                  <div key={r.id} className="bg-green-50 p-6 rounded-2xl mb-4">
                    <p className="text-xl font-bold">{r.name}</p>
                  </div>
                ))}
              </div>

              <div className="bg-white p-10 rounded-3xl shadow-2xl">
                <h3 className="text-3xl font-bold mb-6 flex items-center gap-4 text-blue-600">
                  <Package size={40} /> Returns Today ({returnsToday.length})
                </h3>
                {returnsToday.length === 0 ? <p className="text-gray-500 text-xl">No returns scheduled</p> : returnsToday.map(r => (
                  <div key={r.id} className="bg-blue-50 p-6 rounded-2xl mb-4">
                    <p className="text-xl font-bold">{r.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'analytics' && (
          <div className="bg-white p-10 rounded-3xl shadow-2xl">
            <h2 className="text-4xl font-bold mb-10">Revenue Analytics</h2>
            <ResponsiveContainer width="100%" height={500}>
              <LineChart data={[
                { month: 'Jan', revenue: 4200 },
                { month: 'Feb', revenue: 3800 },
                { month: 'Mar', revenue: 5100 },
                { month: 'Apr', revenue: 4900 },
                { month: 'May', revenue: 7200 },
                { month: 'Jun', revenue: 8800 },
              ]}>
                <CartesianGrid strokeDasharray="5 5" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(v) => `$${v}`} />
                <Line type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={6} dot={{ fill: '#8b5cf6' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </main>
    </div>
  );
}