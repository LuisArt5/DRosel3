'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Calendar, Users, Package, DollarSign, BarChart3, Search, Plus, X, LogOut, Menu, ChevronRight, Clock, AlertCircle, CheckCircle, Edit2, Save, Globe, Scissors, CreditCard, Calendar as CalendarIcon } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Translations
const translations = {
  en: {
    title: 'Tuxedo Rental Admin',
    login: 'LOGIN',
    logout: 'LOGOUT',
    role: 'Role',
    dashboard: 'Dashboard',
    rentals: 'Rentals',
    customers: 'Customers',
    inventory: 'Inventory',
    analytics: 'Analytics',
    todayRevenue: "Today's Revenue",
    pickupsToday: 'Pickups Today',
    thisWeek: 'This Week',
    activeCustomers: 'Active Customers',
    todayPickups: "Today's Pickups",
    overdueReturns: 'Overdue Returns',
    noPickups: 'No pickups today',
    allReturned: 'All items returned on time!',
    items: 'Items',
    total: 'Total',
    due: 'Due',
    status: 'Status',
    name: 'Name',
    phone: 'Phone',
    email: 'Email',
    totalRentals: 'Rentals',
    addRental: 'Add Rental',
    editRental: 'Edit Rental',
    customer: 'Customer',
    eventDate: 'Event Date',
    pickupDate: 'Pickup Date',
    returnDate: 'Return Date',
    paymentMethod: 'Payment Method',
    alterations: 'Alterations',
    save: 'Save',
    cancel: 'Cancel',
    cash: 'Cash',
    card: 'Card',
    transfer: 'Transfer',
    noAlterations: 'No alterations needed',
    jacketSleeve: 'Jacket Sleeve',
    jacketLength: 'Jacket Length',
    pantWaist: 'Pant Waist',
    pantLength: 'Pant Length',
    notes: 'Notes',
    dateConflict: 'Date conflict detected!',
    itemUnavailable: 'Item unavailable for selected dates',
    invalidCredentials: 'Invalid credentials',
    size: 'Size',
    color: 'Color',
    available: 'Available',
    rented: 'Rented',
    price: 'Price',
    deposit: 'Deposit',
    paid: 'Paid',
    pending: 'Pending',
    returned: 'Returned'
  },
  es: {
    title: 'Admin Renta de Esmoquin',
    login: 'INICIAR SESIÓN',
    logout: 'CERRAR SESIÓN',
    role: 'Rol',
    dashboard: 'Panel',
    rentals: 'Rentas',
    customers: 'Clientes',
    inventory: 'Inventario',
    analytics: 'Análisis',
    todayRevenue: 'Ingresos Hoy',
    pickupsToday: 'Entregas Hoy',
    thisWeek: 'Esta Semana',
    activeCustomers: 'Clientes Activos',
    todayPickups: 'Entregas de Hoy',
    overdueReturns: 'Devoluciones Atrasadas',
    noPickups: 'No hay entregas hoy',
    allReturned: '¡Todos los artículos devueltos a tiempo!',
    items: 'Artículos',
    total: 'Total',
    due: 'Vence',
    status: 'Estado',
    name: 'Nombre',
    phone: 'Teléfono',
    email: 'Correo',
    totalRentals: 'Rentas',
    addRental: 'Agregar Renta',
    editRental: 'Editar Renta',
    customer: 'Cliente',
    eventDate: 'Fecha del Evento',
    pickupDate: 'Fecha de Entrega',
    returnDate: 'Fecha de Devolución',
    paymentMethod: 'Método de Pago',
    alterations: 'Alteraciones',
    save: 'Guardar',
    cancel: 'Cancelar',
    cash: 'Efectivo',
    card: 'Tarjeta',
    transfer: 'Transferencia',
    noAlterations: 'Sin alteraciones',
    jacketSleeve: 'Manga de Saco',
    jacketLength: 'Largo de Saco',
    pantWaist: 'Cintura de Pantalón',
    pantLength: 'Largo de Pantalón',
    notes: 'Notas',
    dateConflict: '¡Conflicto de fechas detectado!',
    itemUnavailable: 'Artículo no disponible para las fechas seleccionadas',
    invalidCredentials: 'Credenciales inválidas',
    size: 'Talla',
    color: 'Color',
    available: 'Disponible',
    rented: 'Rentado',
    price: 'Precio',
    deposit: 'Depósito',
    paid: 'Pagado',
    pending: 'Pendiente',
    returned: 'Devuelto'
  }
};

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
  const [language, setLanguage] = useState('en');
  const [showRentalModal, setShowRentalModal] = useState(false);
  const [editingRental, setEditingRental] = useState(null);
  const [dateConflicts, setDateConflicts] = useState([]);

  const t = translations[language];

  // Rental form state
  const [rentalForm, setRentalForm] = useState({
    customer_id: '',
    customer_name: '',
    event_date: '',
    pickup_date: '',
    return_date: '',
    item_ids: [],
    total: 0,
    deposit: 0,
    payment_method: 'cash',
    payment_status: 'pending',
    status: 'pending',
    alterations: {
      jacket_sleeve: '',
      jacket_length: '',
      pant_waist: '',
      pant_length: '',
      notes: ''
    }
  });

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
    if (error) setMsg(t.invalidCredentials);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'es' : 'en');
  };

  const checkDateConflicts = async (itemIds, pickupDate, returnDate, excludeRentalId = null) => {
    const conflicts = [];
    
    for (const itemId of itemIds) {
      const { data } = await supabase
        .from('rentals')
        .select('*')
        .contains('item_ids', [itemId])
        .neq('status', 'returned')
        .neq('status', 'cancelled');
      
      if (data) {
        const conflicting = data.filter(rental => {
          if (excludeRentalId && rental.id === excludeRentalId) return false;
          
          const rentalPickup = new Date(rental.pickup_date);
          const rentalReturn = new Date(rental.return_date);
          const newPickup = new Date(pickupDate);
          const newReturn = new Date(returnDate);
          
          return (newPickup <= rentalReturn && newReturn >= rentalPickup);
        });
        
        if (conflicting.length > 0) {
          const item = inventory.find(i => i.id === itemId);
          conflicts.push({
            itemId,
            itemName: item?.name || 'Unknown',
            conflictingRentals: conflicting
          });
        }
      }
    }
    
    setDateConflicts(conflicts);
    return conflicts.length === 0;
  };

  const openRentalModal = (rental = null) => {
    if (rental) {
      setEditingRental(rental);
      setRentalForm({
        customer_id: rental.customer_id,
        customer_name: rental.customer_name,
        event_date: rental.event_date || '',
        pickup_date: rental.pickup_date,
        return_date: rental.return_date,
        item_ids: rental.item_ids || [],
        total: rental.total,
        deposit: rental.deposit || 0,
        payment_method: rental.payment_method || 'cash',
        payment_status: rental.payment_status || 'pending',
        status: rental.status,
        alterations: rental.alterations || {
          jacket_sleeve: '',
          jacket_length: '',
          pant_waist: '',
          pant_length: '',
          notes: ''
        }
      });
    } else {
      setEditingRental(null);
      setRentalForm({
        customer_id: '',
        customer_name: '',
        event_date: '',
        pickup_date: '',
        return_date: '',
        item_ids: [],
        total: 0,
        deposit: 0,
        payment_method: 'cash',
        payment_status: 'pending',
        status: 'pending',
        alterations: {
          jacket_sleeve: '',
          jacket_length: '',
          pant_waist: '',
          pant_length: '',
          notes: ''
        }
      });
    }
    setDateConflicts([]);
    setShowRentalModal(true);
  };

  const saveRental = async () => {
    // Check date conflicts
    const noConflicts = await checkDateConflicts(
      rentalForm.item_ids,
      rentalForm.pickup_date,
      rentalForm.return_date,
      editingRental?.id
    );

    if (!noConflicts) {
      alert(t.dateConflict);
      return;
    }

    const rentalData = {
      ...rentalForm,
      updated_at: new Date().toISOString()
    };

    if (editingRental) {
      // Update existing rental
      const { error } = await supabase
        .from('rentals')
        .update(rentalData)
        .eq('id', editingRental.id);

      if (!error) {
        await loadAllData();
        setShowRentalModal(false);
      }
    } else {
      // Create new rental
      rentalData.created_at = new Date().toISOString();
      
      const { error } = await supabase
        .from('rentals')
        .insert([rentalData]);

      if (!error) {
        await loadAllData();
        setShowRentalModal(false);
      }
    }
  };

  const updateRentalField = (field, value) => {
    setRentalForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateAlterationField = (field, value) => {
    setRentalForm(prev => ({
      ...prev,
      alterations: {
        ...prev.alterations,
        [field]: value
      }
    }));
  };

  const toggleItemInRental = (itemId) => {
    setRentalForm(prev => {
      const itemIds = prev.item_ids.includes(itemId)
        ? prev.item_ids.filter(id => id !== itemId)
        : [...prev.item_ids, itemId];
      
      // Calculate total based on selected items
      const total = itemIds.reduce((sum, id) => {
        const item = inventory.find(i => i.id === id);
        return sum + (item?.price || 0);
      }, 0);

      return {
        ...prev,
        item_ids: itemIds,
        total
      };
    });
  };

  if (loading) return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white text-4xl">Loading...</div>;

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-purple-900 flex items-center justify-center p-8">
        <div className="bg-white rounded-3xl shadow-2xl p-16 max-w-md w-full text-center">
          <div className="flex justify-center mb-8">
            <button onClick={toggleLanguage} className="flex items-center gap-2 text-gray-600 hover:text-gray-800 text-lg">
              <Globe size={24} /> {language === 'en' ? 'ES' : 'EN'}
            </button>
          </div>
          <h1 className="text-6xl font-bold mb-8 text-slate-800">{t.title}</h1>
          {msg && <p className="text-red-600 font-bold mb-6 text-xl">{msg}</p>}
          <input type="email" placeholder="admin@demo.com" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-6 py-5 mb-6 border-2 rounded-xl text-xl" />
          <input type="password" placeholder="admin123" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-6 py-5 mb-8 border-2 rounded-xl text-xl" />
          <button onClick={signIn} className="w-full bg-blue-600 text-white py-6 rounded-xl text-2xl font-bold hover:bg-blue-700">{t.login}</button>
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
          <h1 className="text-4xl font-bold">{t.title}</h1>
          <div className="flex items-center gap-8">
            <button onClick={toggleLanguage} className="flex items-center gap-2 bg-slate-800 px-6 py-3 rounded-xl text-xl hover:bg-slate-700">
              <Globe size={24} /> {language === 'en' ? 'ES' : 'EN'}
            </button>
            <div className="text-right">
              <p className="text-2xl font-bold">{profile?.name || user.email}</p>
              <p className="text-lg opacity-80">{t.role}: {profile?.role}</p>
            </div>
            <button onClick={signOut} className="bg-red-600 px-8 py-4 rounded-xl flex items-center gap-3 text-xl font-bold hover:bg-red-700">
              <LogOut size={28} /> {t.logout}
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
                {t[tab]}
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
              <p className="text-6xl font-bold mt-6">${rentals.filter(r => r.pickup_date === today).reduce((sum, r) => sum + r.total, 0)}</p>
              <p className="text-2xl mt-2">{t.todayRevenue}</p>
            </div>
            <div className="bg-gradient-to-br from-green-600 to-green-800 text-white p-10 rounded-3xl shadow-2xl">
              <Package size={60} />
              <p className="text-6xl font-bold mt-6">{todayPickups.length}</p>
              <p className="text-2xl mt-2">{t.pickupsToday}</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-600 to-yellow-800 text-white p-10 rounded-3xl shadow-2xl">
              <Clock size={60} />
              <p className="text-6xl font-bold mt-6">{rentals.filter(r => r.status === 'active').length}</p>
              <p className="text-2xl mt-2">{t.thisWeek}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-600 to-purple-800 text-white p-10 rounded-3xl shadow-2xl">
              <Users size={60} />
              <p className="text-6xl font-bold mt-6">{customers.length}</p>
              <p className="text-2xl mt-2">{t.activeCustomers}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-12">
            <div className="bg-white rounded-3xl shadow-2xl p-10">
              <h3 className="text-3xl font-bold mb-8 flex items-center gap-4"><CheckCircle className="text-green-600" size={40} /> {t.todayPickups}</h3>
              {todayPickups.length === 0 ? <p className="text-gray-500 text-xl">{t.noPickups}</p> :
                todayPickups.map(r => (
                  <div key={r.id} className="bg-green-50 p-8 rounded-2xl mb-6">
                    <p className="text-2xl font-bold">{r.customer_name}</p>
                    <p className="text-lg text-gray-700">{t.items}: {r.item_ids?.length || 0} • {t.total}: ${r.total}</p>
                    {r.event_date && <p className="text-sm text-gray-600 mt-2">{t.eventDate}: {r.event_date}</p>}
                  </div>
                ))
              }
            </div>

            <div className="bg-white rounded-3xl shadow-2xl p-10">
              <h3 className="text-3xl font-bold mb-8 flex items-center gap-4"><AlertCircle className="text-red-600" size={40} /> {t.overdueReturns}</h3>
              {overdue.length === 0 ? <p className="text-green-600 text-2xl font-bold">{t.allReturned}</p> :
                overdue.map(r => (
                  <div key={r.id} className="bg-red-50 p-8 rounded-2xl mb-6">
                    <p className="text-2xl font-bold text-red-700">{r.customer_name}</p>
                    <p className="text-lg">{t.due}: {r.return_date} • {t.status}: {r.status}</p>
                  </div>
                ))
              }
            </div>
          </div>
        </main>
      )}

      {/* Rentals Tab */}
      {activeTab === 'rentals' && (
        <main className="max-w-7xl mx-auto px-8 py-12">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-5xl font-bold">{t.rentals} ({rentals.length})</h2>
            <button onClick={() => openRentalModal()} className="bg-blue-600 text-white px-8 py-4 rounded-xl flex items-center gap-3 text-xl font-bold hover:bg-blue-700">
              <Plus size={28} /> {t.addRental}
            </button>
          </div>
          
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-900 text-white text-xl">
                <tr>
                  <th className="px-10 py-8 text-left">{t.customer}</th>
                  <th className="px-10 py-8 text-left">{t.eventDate}</th>
                  <th className="px-10 py-8 text-left">{t.pickupDate}</th>
                  <th className="px-10 py-8 text-left">{t.returnDate}</th>
                  <th className="px-10 py-8 text-left">{t.total}</th>
                  <th className="px-10 py-8 text-left">{t.paymentMethod}</th>
                  <th className="px-10 py-8 text-left">{t.status}</th>
                  <th className="px-10 py-8 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rentals.map(r => (
                  <tr key={r.id} className="border-b hover:bg-gray-50 text-lg">
                    <td className="px-10 py-8 font-bold">{r.customer_name}</td>
                    <td className="px-10 py-8">{r.event_date || '-'}</td>
                    <td className="px-10 py-8">{r.pickup_date}</td>
                    <td className="px-10 py-8">{r.return_date}</td>
                    <td className="px-10 py-8">${r.total}</td>
                    <td className="px-10 py-8">
                      <span className="inline-flex items-center gap-2">
                        <CreditCard size={18} />
                        {t[r.payment_method] || r.payment_method}
                      </span>
                    </td>
                    <td className="px-10 py-8">
                      <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                        r.status === 'returned' ? 'bg-green-100 text-green-800' :
                        r.status === 'active' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {t[r.status] || r.status}
                      </span>
                    </td>
                    <td className="px-10 py-8">
                      <button onClick={() => openRentalModal(r)} className="text-blue-600 hover:text-blue-800">
                        <Edit2 size={24} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      )}

      {/* Customers Tab */}
      {activeTab === 'customers' && (
        <main className="max-w-7xl mx-auto px-8 py-12">
          <h2 className="text-5xl font-bold mb-12">{t.customers} ({customers.length})</h2>
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-900 text-white text-xl">
                <tr>
                  <th className="px-10 py-8 text-left">{t.name}</th>
                  <th className="px-10 py-8 text-left">{t.phone}</th>
                  <th className="px-10 py-8 text-left">{t.email}</th>
                  <th className="px-10 py-8 text-left">{t.totalRentals}</th>
                </tr>
              </thead>
              <tbody>
                {customers.map(c => (
                  <tr key={c.id} className="border-b hover:bg-gray-50 text-lg">
                    <td className="px-10 py-8 font-bold">{c.name}</td>
                    <td className="px-10 py-8">{c.phone}</td>
                    <td className="px-10 py-8">{c.email}</td>
                    <td className="px-10 py-8">{c.total_rentals || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      )}

      {/* Inventory Tab */}
      {activeTab === 'inventory' && (
        <main className="max-w-7xl mx-auto px-8 py-12">
          <h2 className="text-5xl font-bold mb-12">{t.inventory} ({inventory.length})</h2>
          <div className="grid grid-cols-3 gap-8">
            {inventory.map(item => (
              <div key={item.id} className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-2xl font-bold mb-4">{item.name}</h3>
                <div className="space-y-2 text-lg">
                  <p><strong>{t.size}:</strong> {item.size}</p>
                  <p><strong>{t.color}:</strong> {item.color}</p>
                  <p><strong>{t.price}:</strong> ${item.price}</p>
                  <p className="flex items-center gap-2">
                    <strong>{t.status}:</strong>
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                      item.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {t[item.status] || item.status}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* Rental Modal */}
      {showRentalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-8 z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-12">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-4xl font-bold">{editingRental ? t.editRental : t.addRental}</h2>
              <button onClick={() => setShowRentalModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={32} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Customer Selection */}
              <div>
                <label className="block text-xl font-bold mb-3">{t.customer}</label>
                <select 
                  value={rentalForm.customer_id}
                  onChange={(e) => {
                    const customer = customers.find(c => c.id === e.target.value);
                    updateRentalField('customer_id', e.target.value);
                    updateRentalField('customer_name', customer?.name || '');
                  }}
                  className="w-full px-6 py-4 border-2 rounded-xl text-lg"
                >
                  <option value="">Select customer...</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.name} - {c.phone}</option>
                  ))}
                </select>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <label className="block text-xl font-bold mb-3">{t.eventDate}</label>
                  <input 
                    type="date"
                    value={rentalForm.event_date}
                    onChange={(e) => updateRentalField('event_date', e.target.value)}
                    className="w-full px-6 py-4 border-2 rounded-xl text-lg"
                  />
                </div>
                <div>
                  <label className="block text-xl font-bold mb-3">{t.pickupDate}</label>
                  <input 
                    type="date"
                    value={rentalForm.pickup_date}
                    onChange={(e) => updateRentalField('pickup_date', e.target.value)}
                    className="w-full px-6 py-4 border-2 rounded-xl text-lg"
                  />
                </div>
                <div>
                  <label className="block text-xl font-bold mb-3">{t.returnDate}</label>
                  <input 
                    type="date"
                    value={rentalForm.return_date}
                    onChange={(e) => updateRentalField('return_date', e.target.value)}
                    className="w-full px-6 py-4 border-2 rounded-xl text-lg"
                  />
                </div>
              </div>

              {/* Date Conflicts Warning */}
              {dateConflicts.length > 0 && (
                <div className="bg-red-50 border-2 border-red-300 rounded-xl p-6">
                  <p className="text-red-800 font-bold text-xl mb-3">{t.dateConflict}</p>
                  {dateConflicts.map((conflict, idx) => (
                    <p key={idx} className="text-red-700 text-lg">
                      • {conflict.itemName} {t.itemUnavailable}
                    </p>
                  ))}
                </div>
              )}

              {/* Item Selection */}
              <div>
                <label className="block text-xl font-bold mb-3">{t.items}</label>
                <div className="grid grid-cols-2 gap-4 max-h-64 overflow-y-auto border-2 rounded-xl p-4">
                  {inventory.filter(item => item.status === 'available').map(item => (
                    <label key={item.id} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100">
                      <input
                        type="checkbox"
                        checked={rentalForm.item_ids.includes(item.id)}
                        onChange={() => toggleItemInRental(item.id)}
                        className="w-6 h-6"
                      />
                      <div>
                        <p className="font-bold">{item.name}</p>
                        <p className="text-sm text-gray-600">{item.size} - ${item.price}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Payment Info */}
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <label className="block text-xl font-bold mb-3">{t.paymentMethod}</label>
                  <select 
                    value={rentalForm.payment_method}
                    onChange={(e) => updateRentalField('payment_method', e.target.value)}
                    className="w-full px-6 py-4 border-2 rounded-xl text-lg"
                  >
                    <option value="cash">{t.cash}</option>
                    <option value="card">{t.card}</option>
                    <option value="transfer">{t.transfer}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xl font-bold mb-3">{t.deposit}</label>
                  <input 
                    type="number"
                    value={rentalForm.deposit}
                    onChange={(e) => updateRentalField('deposit', parseFloat(e.target.value) || 0)}
                    className="w-full px-6 py-4 border-2 rounded-xl text-lg"
                  />
                </div>
                <div>
                  <label className="block text-xl font-bold mb-3">{t.total}</label>
                  <input 
                    type="number"
                    value={rentalForm.total}
                    readOnly
                    className="w-full px-6 py-4 border-2 rounded-xl text-lg bg-gray-100"
                  />
                </div>
              </div>

              {/* Alterations */}
              <div className="border-2 rounded-xl p-6">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <Scissors size={28} /> {t.alterations}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-lg font-bold mb-2">{t.jacketSleeve}</label>
                    <input 
                      type="text"
                      value={rentalForm.alterations.jacket_sleeve}
                      onChange={(e) => updateAlterationField('jacket_sleeve', e.target.value)}
                      placeholder="e.g., -1 inch"
                      className="w-full px-4 py-3 border-2 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-lg font-bold mb-2">{t.jacketLength}</label>
                    <input 
                      type="text"
                      value={rentalForm.alterations.jacket_length}
                      onChange={(e) => updateAlterationField('jacket_length', e.target.value)}
                      placeholder="e.g., +0.5 inch"
                      className="w-full px-4 py-3 border-2 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-lg font-bold mb-2">{t.pantWaist}</label>
                    <input 
                      type="text"
                      value={rentalForm.alterations.pant_waist}
                      onChange={(e) => updateAlterationField('pant_waist', e.target.value)}
                      placeholder="e.g., take in 2 inches"
                      className="w-full px-4 py-3 border-2 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-lg font-bold mb-2">{t.pantLength}</label>
                    <input 
                      type="text"
                      value={rentalForm.alterations.pant_length}
                      onChange={(e) => updateAlterationField('pant_length', e.target.value)}
                      placeholder="e.g., hem to 30 inches"
                      className="w-full px-4 py-3 border-2 rounded-xl"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-lg font-bold mb-2">{t.notes}</label>
                  <textarea 
                    value={rentalForm.alterations.notes}
                    onChange={(e) => updateAlterationField('notes', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border-2 rounded-xl"
                    placeholder="Additional alteration notes..."
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-6 pt-6">
                <button 
                  onClick={saveRental}
                  className="flex-1 bg-blue-600 text-white py-4 rounded-xl text-xl font-bold hover:bg-blue-700 flex items-center justify-center gap-3"
                >
                  <Save size={24} /> {t.save}
                </button>
                <button 
                  onClick={() => setShowRentalModal(false)}
                  className="flex-1 bg-gray-300 text-gray-800 py-4 rounded-xl text-xl font-bold hover:bg-gray-400"
                >
                  {t.cancel}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}