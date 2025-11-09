'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Users, Package, DollarSign, BarChart3, Search, Plus, X, AlertTriangle, CheckCircle, Clock, Trash2, LogOut } from 'lucide-react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function TuxedoAdmin() {
  const [user, setUser] = useState(null);
  const [login, setLogin] = useState(true);
  const [form, setForm] = useState({});
  const [tab, setTab] = useState('dashboard');
  const [search, setSearch] = useState('');

  // Load data
  const load = (key, def) => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : def;
  };

  const [users, setUsers] = useState(load('users', [
    { id: 1, username: 'admin', password: 'admin123', role: 'admin' }
  ]));

  const [rentals, setRentals] = useState(load('rentals', [
    { id: 1, customerName: 'John Smith', pickupDate: '2025-11-08', returnDate: '2025-11-08', status: 'out', total: 165, paid: 165 },
    { id: 2, customerName: 'Sarah Johnson', pickupDate: '2025-11-10', returnDate: '2025-11-12', status: 'reserved', total: 120, paid: 50 }
  ]));

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('rentals', JSON.stringify(rentals));
  }, [users, rentals]);

  const today = new Date().toISOString().split('T')[0];

  const overdue = rentals.filter(r => r.returnDate < today && r.status !== 'returned');
  const pickups = rentals.filter(r => r.pickupDate === today && r.status === 'reserved');
  const returns = rentals.filter(r => r.returnDate === today);

  const loginUser = (e) => {
    e.preventDefault();
    const u = users.find(u => u.username === form.username && u.password === form.password);
    if (u) { setUser(u); setLogin(false); }
    else alert('Wrong credentials');
  };

  const logout = () => { setUser(null); setLogin(true); setTab('dashboard'); };

  if (login) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md">
          <h1 className="text-4xl font-bold text-center mb-8">Tuxedo Admin</h1>
          <form onSubmit={loginUser} className="space-y-6">
            <input placeholder="Username" className="w-full px-4 py-3 border-2 rounded-xl" onChange={e => setForm({...form, username: e.target.value})} required />
            <input type="password" placeholder="Password" className="w-full px-4 py-3 border-2 rounded-xl" onChange={e => setForm({...form, password: e.target.value})} required />
            <button type="submit" className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-xl">Login</button>
            <div className="bg-gray-100 p-4 rounded-lg text-sm">
              <p>admin / admin123</p>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gradient-to-r from-blue-800 to-purple-800 text-white p-6 shadow-2xl">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-4xl font-bold">Tuxedo Rental Admin</h1>
          <button onClick={logout} className="flex items-center gap-3 px-6 py-3 bg-white/20 rounded-xl hover:bg-white/30">
            <LogOut size={24} /> Logout
          </button>
        </div>
      </header>

      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto flex overflow-x-auto">
          {['dashboard', 'rentals', 'analytics'].map(t => (
            <button key={t} onClick={() => setTab(t)} className={`px-8 py-5 font-bold capitalize ${tab === t ? 'border-b-4 border-purple-600 text-purple-600' : 'text-gray-600'}`}>
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
            <h2 className="text-4xl font-bold mb-10">Today: {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</h2>

            {overdue.length > 0 && (
              <div className="bg-red-600 text-white p-8 rounded-2xl mb-10 shadow-2xl">
                <h3 className="text-3xl font-bold mb-6 flex items-center gap-4">
                  <AlertTriangle size={40} /> OVERDUE RETURNS ({overdue.length})
                </h3>
                {overdue.map(r => (
                  <div key={r.id} className="bg-white/20 p-6 rounded-xl mb-4">
                    <p className="text-2xl font-bold">{r.customerName}</p>
                    <p>Due: {r.returnDate} • Overdue by {(new Date(today) - new Date(r.returnDate)) / 86400000} days</p>
                  </div>
                ))}
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-10">
              <div className="bg-white p-10 rounded-2xl shadow-2xl">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <CheckCircle className="text-green-600" size={36} /> Pickups Today ({pickups.length})
                </h3>
                {pickups.length === 0 ? <p className="text-gray-500">No pickups</p> : pickups.map(r => <div key={r.id} className="bg-green-50 p-4 rounded-lg mb-4"><p className="font-bold">{r.customerName}</p></div>)}
              </div>

              <div className="bg-white p-10 rounded-2xl shadow-2xl">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <Package className="text-blue-600" size={36} /> Returns Today ({returns.length})
                </h3>
                {returns.length === 0 ? <p className="text-gray-500">No returns</p> : returns.map(r => <div key={r.id} className="bg-blue-50 p-4 rounded-lg mb-4"><p className="font-bold">{r.customerName}</p></div>)}
              </div>
            </div>
          </div>
        )}

        {tab === 'analytics' && (
          <div className="bg-white p-10 rounded-2xl shadow-2xl">
            <h2 className="text-3xl font-bold mb-8">Revenue Chart</h2>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={[
                { month: 'Jan', revenue: 2400 },
                { month: 'Feb', revenue: 3100 },
                { month: 'Mar', revenue: 2800 },
                { month: 'Apr', revenue: 3900 },
                { month: 'May', revenue: 4500 },
                { month: 'Jun', revenue: 5200 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={4} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </main>
    </div>
  );
}