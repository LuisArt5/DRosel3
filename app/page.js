'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Users, Package, DollarSign, BarChart3, Search, Plus, X, AlertTriangle, CheckCircle, Clock, Trash2, LogOut } from 'lucide-react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function TuxedoAdmin() {
  const [user, setUser] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({});
  const [tab, setTab] = useState('dashboard');
  const [rentals, setRentals] = useState([]);

  // ONLY RUN IN BROWSER — FIXES localStorage ERROR
  useEffect(() => {
    const saved = localStorage.getItem('tuxedo-rentals');
    if (saved) {
      setRentals(JSON.parse(saved));
    } else {
      // Default data
      const defaultRentals = [
        { id: 1, name: 'John Smith', pickup: '2025-11-08', return: '2025-11-08', status: 'out', total: 165, paid: 165 },
        { id: 2, name: 'Sarah Johnson', pickup: '2025-11-10', return: '2025-11-12', status: 'reserved', total: 120, paid: 50 }
      ];
      setRentals(defaultRentals);
      localStorage.setItem('tuxedo-rentals', JSON.stringify(defaultRentals));
    }
  }, []);

  // Save to localStorage whenever rentals change
  useEffect(() => {
    if (rentals.length > 0) {
      localStorage.setItem('tuxedo-rentals', JSON.stringify(rentals));
    }
  }, [rentals]);

  const today = new Date().toISOString().split('T')[0];
  const overdue = rentals.filter(r => r.return < today && r.status !== 'returned');
  const pickupsToday = rentals.filter(r => r.pickup === today);
  const returnsToday = rentals.filter(r => r.return === today);

  const login = (e) => {
    e.preventDefault();
    if (form.username === 'admin' && form.password === 'admin123') {
      setUser({ name: 'Admin' });
      setIsLogin(false);
    } else {
      alert('Login: admin / admin123');
    }
  };

  if (isLogin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-6">
        <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-12 w-full max-w-lg border border-white/20">
          <h1 className="text-6xl font-extrabold text-center mb-10 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Tuxedo Admin
          </h1>
          <form onSubmit={login} className="space-y-8">
            <input
              type="text"
              placeholder="Username"
              className="w-full px-8 py-5 text-xl border-4 border-purple-200 rounded-2xl focus:border-purple-500 focus:outline-none transition"
              onChange={e => setForm({ ...form, username: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-8 py-5 text-xl border-4 border-purple-200 rounded-2xl focus:border-purple-500 focus:outline-none transition"
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
            />
            <button type="submit" className="w-full py-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-2xl font-bold rounded-2xl hover:from-purple-700 hover:to-pink-700 transition shadow-2xl">
              ENTER SYSTEM
            </button>
            <div className="text-center bg-purple-100 p-4 rounded-xl">
              <p className="font-bold text-purple-800">admin / admin123</p>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      <header className="bg-gradient-to-r from-purple-800 via-pink-700 to-indigo-800 text-white shadow-2xl">
        <div className="max-w-7xl mx-auto px-8 py-8 flex justify-between items-center">
          <h1 className="text-5xl font-extrabold tracking-tight">Tuxedo Rental Admin</h1>
          <button onClick={() => setIsLogin(true)} className="flex items-center gap-4 px-8 py-4 bg-white/20 rounded-2xl hover:bg-white/30 transition backdrop-blur">
            <LogOut size={28} /> <span className="text-xl font-bold">Logout</span>
          </button>
        </div>
      </header>

      <nav className="bg-white/90 backdrop-blur sticky top-0 z-50 shadow-xl">
        <div className="max-w-7xl mx-auto flex">
          {['dashboard', 'rentals', 'analytics'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-12 py-6 text-xl font-bold capitalize transition ${tab === t ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              {t === 'dashboard' && <Clock className="inline mr-3" size={28} />}
              {t === 'rentals' && <Calendar className="inline mr-3" size={28} />}
              {t === 'analytics' && <BarChart3 className="inline mr-3" size={28} />}
              {t}
            </button>
          ))}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-10">
        {tab === 'dashboard' && (
          <div>
            <h2 className="text-6xl font-extrabold mb-12 text-gray-800">
              Today: {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </h2>

            {overdue.length > 0 && (
              <div className="bg-gradient-to-r from-red-600 to-rose-600 text-white p-12 rounded-3xl mb-12 shadow-2xl border-4 border-red-700">
                <h3 className="text-5xl font-extrabold mb-8 flex items-center gap-6">
                  <AlertTriangle size={64} /> OVERDUE ALERT ({overdue.length})
                </h3>
                {overdue.map(r => (
                  <div key={r.id} className="bg-white/20 p-8 rounded-2xl mb-6 backdrop-blur">
                    <p className="text-3xl font-bold">{r.name}</p>
                    <p className="text-2xl">Due: {r.return} → {(new Date(today) - new Date(r.return)) / 86400000} days late</p>
                  </div>
                ))}
              </div>
            )}

            <div className="grid lg:grid-cols-2 gap-12">
              <div className="bg-white p-12 rounded-3xl shadow-2xl border-4 border-green-400">
                <h3 className="text-4xl font-bold mb-8 flex items-center gap-5 text-green-600">
                  <CheckCircle size={56} /> Pickups Today ({pickupsToday.length})
                </h3>
                {pickupsToday.length === 0 ? (
                  <p className="text-2xl text-gray-500">No pickups scheduled</p>
                ) : (
                  pickupsToday.map(r => (
                    <div key={r.id} className="bg-green-50 p-8 rounded-2xl mb-6">
                      <p className="text-2xl font-bold">{r.name}</p>
                    </div>
                  ))
                )}
              </div>

              <div className="bg-white p-12 rounded-3xl shadow-2xl border-4 border-blue-400">
                <h3 className="text-4xl font-bold mb-8 flex items-center gap-5 text-blue-600">
                  <Package size={56} /> Returns Today ({returnsToday.length})
                </h3>
                {returnsToday.length === 0 ? (
                  <p className="text-2xl text-gray-500">No returns scheduled</p>
                ) : (
                  returnsToday.map(r => (
                    <div key={r.id} className="bg-blue-50 p-8 rounded-2xl mb-6">
                      <p className="text-2xl font-bold">{r.name}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {tab === 'analytics' && (
          <div className="bg-white p-16 rounded-3xl shadow-2xl">
            <h2 className="text-5xl font-extrabold mb-12 text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Revenue Dashboard
            </h2>
            <ResponsiveContainer width="100%" height={600}>
              <LineChart data={[
                { month: 'Jan', revenue: 5200 },
                { month: 'Feb', revenue: 4800 },
                { month: 'Mar', revenue: 6100 },
                { month: 'Apr', revenue: 5900 },
                { month: 'May', revenue: 8200 },
                { month: 'Jun', revenue: 9800 },
              ]}>
                <CartesianGrid strokeDasharray="5 5" stroke="#ddd" />
                <XAxis dataKey="month" tick={{ fontSize: 20 }} />
                <YAxis tick={{ fontSize: 20 }} />
                <Tooltip formatter={(v) => `$${v.toLocaleString()}`} contentStyle={{ background: '#333', border: 'none', borderRadius: '12px' }} />
                <Line type="monotone" dataKey="revenue" stroke="#c084fc" strokeWidth={8} dot={{ fill: '#c084fc', r: 12 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </main>
    </div>
  );
}