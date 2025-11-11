'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Calendar, Users, Package, DollarSign, BarChart3, Search, Plus, X, 
  LogOut, Clock, AlertCircle, CheckCircle, Edit2, Upload, Eye, 
  Printer, Trash2, CreditCard, Save, Ruler, Globe, UserCog
} from 'lucide-react';

// Supabase setup
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables!');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Language translations
const translations = {
  en: {
    login: 'LOGIN',
    logout: 'LOGOUT',
    dashboard: 'Today',
    rentals: 'Rentals',
    customers: 'Customers',
    inventory: 'Inventory',
    billing: 'Billing',
    analytics: 'Analytics',
    users: 'Users',
    addCustomer: 'ADD CUSTOMER',
    addItem: 'ADD ITEM',
    newRental: 'NEW RENTAL',
    addUser: 'ADD USER',
    overdueReturns: 'OVERDUE RETURNS',
    todayPickups: 'TODAY\'S PICKUPS',
    todayReturns: 'TODAY\'S RETURNS',
    checkInNow: 'CHECK IN NOW',
    markPickedUp: 'MARK PICKED UP',
    name: 'Name',
    phone: 'Phone',
    email: 'Email',
    idPhoto: 'ID Photo',
    actions: 'Actions',
    viewId: 'View ID',
    save: 'SAVE',
    cancel: 'CANCEL',
    edit: 'Edit',
    delete: 'Delete',
    status: 'Status',
    customer: 'Customer',
    items: 'Items',
    total: 'Total',
    deposit: 'Deposit',
    balance: 'Balance',
    reservationDate: 'Reservation Date',
    pickupDate: 'Pickup Date',
    returnDate: 'Return Date',
    eventDate: 'Event Date',
    paymentMethod: 'Payment Method',
    alterations: 'Alterations',
    notes: 'Notes',
    addAlteration: 'Add Alteration',
    cash: 'Cash',
    card: 'Card',
    check: 'Check',
    other: 'Other',
    available: 'Available',
    rented: 'Rented',
    cleaning: 'Cleaning',
    maintenance: 'Maintenance',
    role: 'Role',
    admin: 'Admin',
    staff: 'Staff',
    viewer: 'Viewer',
    password: 'Password',
    userManagement: 'User Management',
  },
  es: {
    login: 'INICIAR SESIÓN',
    logout: 'CERRAR SESIÓN',
    dashboard: 'Hoy',
    rentals: 'Alquileres',
    customers: 'Clientes',
    inventory: 'Inventario',
    billing: 'Facturación',
    analytics: 'Análisis',
    users: 'Usuarios',
    addCustomer: 'AGREGAR CLIENTE',
    addItem: 'AGREGAR ARTÍCULO',
    newRental: 'NUEVO ALQUILER',
    addUser: 'AGREGAR USUARIO',
    overdueReturns: 'DEVOLUCIONES VENCIDAS',
    todayPickups: 'RECOLECCIONES DE HOY',
    todayReturns: 'DEVOLUCIONES DE HOY',
    checkInNow: 'REGISTRAR AHORA',
    markPickedUp: 'MARCAR RECOGIDO',
    name: 'Nombre',
    phone: 'Teléfono',
    email: 'Correo',
    idPhoto: 'Foto de ID',
    actions: 'Acciones',
    viewId: 'Ver ID',
    save: 'GUARDAR',
    cancel: 'CANCELAR',
    edit: 'Editar',
    delete: 'Eliminar',
    status: 'Estado',
    customer: 'Cliente',
    items: 'Artículos',
    total: 'Total',
    deposit: 'Depósito',
    balance: 'Saldo',
    reservationDate: 'Fecha de Reserva',
    pickupDate: 'Fecha de Recolección',
    returnDate: 'Fecha de Devolución',
    eventDate: 'Fecha del Evento',
    paymentMethod: 'Método de Pago',
    alterations: 'Alteraciones',
    notes: 'Notas',
    addAlteration: 'Agregar Alteración',
    cash: 'Efectivo',
    card: 'Tarjeta',
    check: 'Cheque',
    other: 'Otro',
    available: 'Disponible',
    rented: 'Alquilado',
    cleaning: 'Limpieza',
    maintenance: 'Mantenimiento',
    role: 'Rol',
    admin: 'Administrador',
    staff: 'Personal',
    viewer: 'Visualizador',
    password: 'Contraseña',
    userManagement: 'Gestión de Usuarios',
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
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [formData, setFormData] = useState({});
  const [selectedItems, setSelectedItems] = useState([]);
  const [language, setLanguage] = useState('en');
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [alterations, setAlterations] = useState([]);
  const [payments, setPayments] = useState([]);

  const t = translations[language];
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      setUser(session.user);
      await loadUserProfile(session.user.id);
      await loadData();
    }
    setLoading(false);
  };

  const loadUserProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Profile load error:', error);
        // If no profile exists, create a default viewer profile
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert({ id: userId, role: 'viewer' })
          .select()
          .single();
        
        if (insertError) {
          console.error('Profile creation error:', insertError);
          setProfile({ role: 'viewer' });
        } else {
          setProfile(newProfile);
        }
      } else {
        setProfile(data || { role: 'viewer' });
      }
    } catch (err) {
      console.error('Unexpected error loading profile:', err);
      setProfile({ role: 'viewer' });
    }
  };
  
  const loadData = async () => {
    const [c, i, r, a, p, u] = await Promise.all([
      supabase.from('customers').select('*').order('name'),
      supabase.from('inventory').select('*').order('name'),
      supabase.from('rentals').select(`
        *,
        customers(name, phone, email)
      `).order('created_at', { ascending: false }),
      supabase.from('alterations').select('*'),
      supabase.from('payments').select('*'),
      supabase.from('profiles').select(`
        id,
        role,
        created_at
      `).order('created_at', { ascending: false })
    ]);

    setCustomers(c.data || []);
    setInventory(i.data || []);
    setRentals(r.data || []);
    setAlterations(a.data || []);
    setPayments(p.data || []);
    
    // Load user emails from auth.users
    if (u.data) {
      const userIds = u.data.map(p => p.id);
      const { data: authUsers } = await supabase.auth.admin.listUsers();
      const enrichedUsers = u.data.map(profile => {
        const authUser = authUsers?.users?.find(au => au.id === profile.id);
        return {
          ...profile,
          email: authUser?.email || 'N/A'
        };
      });
      setUsers(enrichedUsers);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    const { data, error } = await supabase.auth.signInWithPassword(loginData);
    if (error) {
      setError(error.message);
    } else {
      setUser(data.user);
      await loadUserProfile(data.user.id);
      await loadData();
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  const hasPermission = (action) => {
    if (!profile) return false;
    if (profile.role === 'admin') return true;
    if (profile.role === 'staff' && action !== 'delete') return true;
    if (profile.role === 'viewer' && action === 'view') return true;
    return false;
  };

  const openModal = (type, data = {}) => {
    setModalType(type);
    setFormData(data);
    setShowModal(true);
    if (type === 'rental' && data.id) {
      setSelectedItems(data.item_ids || []);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({});
    setSelectedItems([]);
  };

  const handleFileUpload = async (file) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36)}.${fileExt}`;
    const { error } = await supabase.storage.from('id-photos').upload(fileName, file);
    if (error) throw error;
    const { data } = supabase.storage.from('id-photos').getPublicUrl(fileName);
    return data.publicUrl;
  };

  const checkDateConflicts = async (itemIds, pickupDate, returnDate, rentalId = null) => {
    const { data } = await supabase
      .from('rentals')
      .select('id, item_ids, pickup_date, return_date')
      .in('status', ['reserved', 'picked_up'])
      .neq('id', rentalId || '');

    const conflicts = [];
    data?.forEach(rental => {
      const hasItemConflict = rental.item_ids.some(id => itemIds.includes(id));
      if (!hasItemConflict) return;

      const rentalStart = new Date(rental.pickup_date);
      const rentalEnd = new Date(rental.return_date);
      const newStart = new Date(pickupDate);
      const newEnd = new Date(returnDate);

      if (newStart <= rentalEnd && newEnd >= rentalStart) {
        conflicts.push(rental);
      }
    });

    return conflicts;
  };

  const saveCustomer = async () => {
    try {
      let id_photo_url = formData.id_photo_url;
      if (formData.idPhotoFile) {
        id_photo_url = await handleFileUpload(formData.idPhotoFile);
      }
      const data = { ...formData, id_photo_url };
      delete data.idPhotoFile;
      delete data.id;

      if (formData.id) {
        await supabase.from('customers').update(data).eq('id', formData.id);
      } else {
        await supabase.from('customers').insert(data);
      }
      await loadData();
      closeModal();
    } catch (error) {
      alert('Error saving customer: ' + error.message);
    }
  };

  const saveInventory = async () => {
    try {
      const data = { ...formData };
      if (!data.id) data.status = 'available';
      delete data.id;

      if (formData.id) {
        await supabase.from('inventory').update(data).eq('id', formData.id);
      } else {
        await supabase.from('inventory').insert(data);
      }
      await loadData();
      closeModal();
    } catch (error) {
      alert('Error saving inventory: ' + error.message);
    }
  };

  const saveRental = async () => {
    try {
      const conflicts = await checkDateConflicts(
        selectedItems,
        formData.pickup_date,
        formData.return_date,
        formData.id
      );

      if (conflicts.length > 0) {
        if (!confirm(`Warning: ${conflicts.length} item(s) have conflicting reservations. Continue anyway?`)) {
          return;
        }
      }

      const total = selectedItems.reduce((sum, id) => {
        const item = inventory.find(i => i.id === id);
        return sum + (item?.price || 0);
      }, 0);

      const rentalData = {
        customer_id: formData.customer_id,
        item_ids: selectedItems,
        total,
        deposit: parseFloat(formData.deposit) || 0,
        paid_amount: parseFloat(formData.paid_amount) || parseFloat(formData.deposit) || 0,
        status: formData.status || 'reserved',
        reservation_date: formData.reservation_date || today,
        pickup_date: formData.pickup_date,
        return_date: formData.return_date,
        event_date: formData.event_date || null,
        payment_method: formData.payment_method || 'cash',
        notes: formData.notes || '',
        created_by: user.id
      };

      if (formData.id) {
        await supabase.from('rentals').update(rentalData).eq('id', formData.id);
      } else {
        await supabase.from('rentals').insert(rentalData);
      }

      await loadData();
      closeModal();
    } catch (error) {
      alert('Error saving rental: ' + error.message);
    }
  };

  const saveUser = async () => {
    try {
      if (formData.id) {
        // Update existing user role
        await supabase
          .from('profiles')
          .update({ role: formData.role })
          .eq('id', formData.id);
      } else {
        // Create new user
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
        });

        if (authError) throw authError;

        // Create profile with role
        await supabase.from('profiles').insert({
          id: authData.user.id,
          role: formData.role || 'viewer'
        });
      }

      await loadData();
      closeModal();
    } catch (error) {
      alert('Error saving user: ' + error.message);
    }
  };

  const saveAlteration = async () => {
    try {
      const data = {
        rental_id: formData.rental_id,
        description: formData.alteration_description,
        cost: parseFloat(formData.alteration_cost) || 0,
        status: formData.alteration_status || 'pending'
      };

      await supabase.from('alterations').insert(data);
      await loadData();
      setFormData({ ...formData, alteration_description: '', alteration_cost: '' });
    } catch (error) {
      alert('Error saving alteration: ' + error.message);
    }
  };

  const addPayment = async (rentalId, amount, method) => {
    try {
      await supabase.from('payments').insert({
        rental_id: rentalId,
        amount: parseFloat(amount),
        payment_method: method,
        payment_date: today
      });

      const rental = rentals.find(r => r.id === rentalId);
      const newPaidAmount = (rental.paid_amount || 0) + parseFloat(amount);
      await supabase.from('rentals').update({ paid_amount: newPaidAmount }).eq('id', rentalId);

      await loadData();
    } catch (error) {
      alert('Error adding payment: ' + error.message);
    }
  };

  const handlePickup = async (id) => {
    const rental = rentals.find(r => r.id === id);
    await supabase.from('rentals').update({ status: 'picked_up' }).eq('id', id);
    for (const itemId of rental.item_ids) {
      await supabase.from('inventory').update({ status: 'rented' }).eq('id', itemId);
    }
    await loadData();
  };

  const handleCheckIn = async (id) => {
    const rental = rentals.find(r => r.id === id);
    await supabase.from('rentals').update({ 
      status: 'returned', 
      actual_return_date: today 
    }).eq('id', id);
    for (const itemId of rental.item_ids) {
      await supabase.from('inventory').update({ status: 'cleaning' }).eq('id', itemId);
    }
    await loadData();
  };

  const deleteItem = async (table, id) => {
    if (window.confirm('Delete permanently?')) {
      await supabase.from(table).delete().eq('id', id);
      await loadData();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-6xl font-bold bg-gradient-to-br from-blue-600 to-purple-600 text-white">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-900 to-purple-900">
        <div className="bg-white p-12 rounded-3xl shadow-2xl w-96">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              TUXEDO ADMIN
            </h1>
            <button
              onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <Globe size={28} />
            </button>
          </div>
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-6">
            <input
              type="email"
              placeholder="Email"
              value={loginData.email}
              onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
              className="w-full px-6 py-4 border-2 rounded-xl text-xl"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={loginData.password}
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              className="w-full px-6 py-4 border-2 rounded-xl text-xl"
              required
            />
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-6 rounded-2xl font-bold text-2xl hover:scale-105 transition"
            >
              {t.login}
            </button>
          </form>
        </div>
      </div>
    );
  }

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
    i.rfid?.toLowerCase().includes(searchTerm)
  );

  const filteredUsers = users.filter(u =>
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRentalBalance = (rental) => {
    const rentalAlterations = alterations.filter(a => a.rental_id === rental.id);
    const alterationsCost = rentalAlterations.reduce((sum, a) => sum + (a.cost || 0), 0);
    return rental.total + alterationsCost - (rental.paid_amount || 0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-slate-900 text-white shadow-2xl">
        <div className="max-w-7xl mx-auto px-8 py-6 flex justify-between items-center">
          <h1 className="text-5xl font-bold">Tuxedo Rental Admin</h1>
          <div className="flex items-center gap-8">
            <button
              onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
              className="flex items-center gap-2 bg-white text-slate-900 px-6 py-3 rounded-full font-bold hover:bg-gray-100 transition"
            >
              <Globe size={24} />
              {language === 'en' ? 'ES' : 'EN'}
            </button>
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-3 rounded-full font-bold text-xl">
              {profile?.role?.toUpperCase() || 'USER'}
            </span>
            <button
              onClick={signOut}
              className="flex items-center gap-4 bg-red-600 px-8 py-4 rounded-2xl hover:bg-red-700 transition font-bold text-xl"
            >
              <LogOut size={28} /> {t.logout}
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-xl">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex gap-4 overflow-x-auto">
            {[
              { id: 'dashboard', label: t.dashboard, icon: Clock },
              { id: 'rentals', label: t.rentals, icon: Calendar },
              { id: 'customers', label: t.customers, icon: Users },
              { id: 'inventory', label: t.inventory, icon: Package },
              { id: 'billing', label: t.billing, icon: DollarSign },
              { id: 'analytics', label: t.analytics, icon: BarChart3 },
              ...(profile?.role === 'admin' ? [{ id: 'users', label: t.users, icon: UserCog }] : [])
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setSearchTerm(''); }}
                  className={`flex items-center gap-4 px-10 py-6 rounded-2xl font-bold text-xl transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-2xl'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <Icon size={28} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-10">
        {/* Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="space-y-12">
            {overdue.length > 0 && (
              <div className="bg-red-100 border-4 border-red-600 rounded-3xl p-12">
                <h2 className="text-5xl font-bold text-red-800 flex items-center gap-6 mb-8">
                  <AlertCircle size={60} /> {t.overdueReturns} ({overdue.length})
                </h2>
                {overdue.map(r => (
                  <div key={r.id} className="bg-white p-8 rounded-3xl mb-6 shadow-2xl flex justify-between items-center">
                    <div>
                      <p className="text-4xl font-bold">{r.customers.name}</p>
                      <p className="text-2xl text-red-600">Due: {r.return_date}</p>
                      <p className="text-xl text-gray-600">Event: {r.event_date || 'N/A'}</p>
                    </div>
                    {hasPermission('edit') && (
                      <button
                        onClick={() => handleCheckIn(r.id)}
                        className="bg-red-600 text-white px-16 py-8 rounded-3xl font-bold text-3xl hover:bg-red-700"
                      >
                        {t.checkInNow}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {todayPickups.length > 0 && (
              <div className="bg-blue-100 border-4 border-blue-600 rounded-3xl p-12">
                <h2 className="text-5xl font-bold text-blue-800 flex items-center gap-6 mb-8">
                  <Calendar size={60} /> {t.todayPickups} ({todayPickups.length})
                </h2>
                {todayPickups.map(r => (
                  <div key={r.id} className="bg-white p-8 rounded-3xl mb-6 shadow-2xl flex justify-between items-center">
                    <div>
                      <p className="text-4xl font-bold">{r.customers.name}</p>
                      <p className="text-2xl text-blue-600">Pickup: {r.pickup_date}</p>
                      <p className="text-xl text-gray-600">Event: {r.event_date || 'N/A'}</p>
                      <p className="text-lg text-gray-500">{r.item_ids.length} items</p>
                    </div>
                    {hasPermission('edit') && (
                      <button
                        onClick={() => handlePickup(r.id)}
                        className="bg-blue-600 text-white px-16 py-8 rounded-3xl font-bold text-3xl hover:bg-blue-700"
                      >
                        {t.markPickedUp}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {todayReturns.length > 0 && (
              <div className="bg-green-100 border-4 border-green-600 rounded-3xl p-12">
                <h2 className="text-5xl font-bold text-green-800 flex items-center gap-6 mb-8">
                  <CheckCircle size={60} /> {t.todayReturns} ({todayReturns.length})
                </h2>
                {todayReturns.map(r => (
                  <div key={r.id} className="bg-white p-8 rounded-3xl mb-6 shadow-2xl flex justify-between items-center">
                    <div>
                      <p className="text-4xl font-bold">{r.customers.name}</p>
                      <p className="text-2xl text-green-600">Return: {r.return_date}</p>
                      <p className="text-xl text-gray-600">Event: {r.event_date || 'N/A'}</p>
                    </div>
                    {hasPermission('edit') && (
                      <button
                        onClick={() => handleCheckIn(r.id)}
                        className="bg-green-600 text-white px-16 py-8 rounded-3xl font-bold text-3xl hover:bg-green-700"
                      >
                        {t.checkInNow}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Rentals Tab */}
        {activeTab === 'rentals' && (
          <div>
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-5xl font-bold">{t.rentals}</h2>
              {hasPermission('edit') && (
                <button
                  onClick={() => openModal('rental')}
                  className="flex items-center gap-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-12 py-6 rounded-3xl font-bold text-3xl hover:scale-105 transition"
                >
                  <Plus size={40} /> {t.newRental}
                </button>
              )}
            </div>
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              <table className="w-full text-lg">
                <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <tr>
                    <th className="px-10 py-8 text-left font-bold">{t.customer}</th>
                    <th className="px-10 py-8 text-left font-bold">{t.eventDate}</th>
                    <th className="px-10 py-8 text-left font-bold">{t.pickupDate}</th>
                    <th className="px-10 py-8 text-left font-bold">{t.returnDate}</th>
                    <th className="px-10 py-8 text-left font-bold">{t.status}</th>
                    <th className="px-10 py-8 text-left font-bold">{t.total}</th>
                    <th className="px-10 py-8 text-left font-bold">{t.balance}</th>
                    {hasPermission('edit') && (
                      <th className="px-10 py-8 text-left font-bold">{t.actions}</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {rentals.map(r => {
                    const balance = getRentalBalance(r);
                    return (
                      <tr key={r.id} className="border-b hover:bg-gray-50">
                        <td className="px-10 py-8 font-bold">{r.customers.name}</td>
                        <td className="px-10 py-8">{r.event_date || 'N/A'}</td>
                        <td className="px-10 py-8">{r.pickup_date}</td>
                        <td className="px-10 py-8">{r.return_date}</td>
                        <td className="px-10 py-8">
                          <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                            r.status === 'reserved' ? 'bg-yellow-200 text-yellow-800' :
                            r.status === 'picked_up' ? 'bg-blue-200 text-blue-800' :
                            r.status === 'returned' ? 'bg-green-200 text-green-800' :
                            'bg-gray-200 text-gray-800'
                          }`}>
                            {r.status}
                          </span>
                        </td>
                        <td className="px-10 py-8">${r.total.toFixed(2)}</td>
                        <td className="px-10 py-8">
                          <span className={balance > 0 ? 'text-red-600 font-bold' : 'text-green-600'}>
                            ${balance.toFixed(2)}
                          </span>
                        </td>
                        {hasPermission('edit') && (
                          <td className="px-10 py-8 flex gap-2">
                            <button
                              onClick={() => openModal('rental', r)}
                              className="text-blue-600 p-4 rounded-xl hover:bg-blue-100"
                            >
                              <Edit2 size={28} />
                            </button>
                            {hasPermission('delete') && (
                              <button
                                onClick={() => deleteItem('rentals', r.id)}
                                className="text-red-600 p-4 rounded-xl hover:bg-red-100"
                              >
                                <Trash2 size={28} />
                              </button>
                            )}
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Customers Tab */}
        {activeTab === 'customers' && (
          <div>
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-5xl font-bold">{t.customers}</h2>
              {hasPermission('edit') && (
                <button
                  onClick={() => openModal('customer')}
                  className="flex items-center gap-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-12 py-6 rounded-3xl font-bold text-3xl hover:scale-105 transition"
                >
                  <Plus size={40} /> {t.addCustomer}
                </button>
              )}
            </div>
            <div className="mb-6">
              <input
                type="text"
                placeholder={`${t.search}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-8 py-6 border-4 rounded-3xl text-2xl"
              />
            </div>
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              <table className="w-full text-lg">
                <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <tr>
                    <th className="px-10 py-8 text-left font-bold">{t.name}</th>
                    <th className="px-10 py-8 text-left font-bold">{t.phone}</th>
                    <th className="px-10 py-8 text-left font-bold">{t.email}</th>
                    <th className="px-10 py-8 text-left font-bold">{t.idPhoto}</th>
                    {hasPermission('edit') && (
                      <th className="px-10 py-8 text-left font-bold">{t.actions}</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map(c => (
                    <tr key={c.id} className="border-b hover:bg-gray-50">
                      <td className="px-10 py-8 font-bold">{c.name}</td>
                      <td className="px-10 py-8">{c.phone}</td>
                      <td className="px-10 py-8">{c.email}</td>
                      <td className="px-10 py-8">
                        {c.id_photo_url ? (
                          <button
                            onClick={() => window.open(c.id_photo_url)}
                            className="text-blue-600 hover:underline flex items-center gap-3"
                          >
                            <Eye size={28} /> {t.viewId}
                          </button>
                        ) : '—'}
                      </td>
                      {hasPermission('edit') && (
                        <td className="px-10 py-8 flex gap-2">
                          <button
                            onClick={() => openModal('customer', c)}
                            className="text-blue-600 p-4 rounded-xl hover:bg-blue-100"
                          >
                            <Edit2 size={28} />
                          </button>
                          {hasPermission('delete') && (
                            <button
                              onClick={() => deleteItem('customers', c.id)}
                              className="text-red-600 p-4 rounded-xl hover:bg-red-100"
                            >
                              <Trash2 size={28} />
                            </button>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Inventory Tab */}
        {activeTab === 'inventory' && (
          <div>
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-5xl font-bold">{t.inventory}</h2>
              {hasPermission('edit') && (
                <button
                  onClick={() => openModal('inventory')}
                  className="flex items-center gap-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-12 py-6 rounded-3xl font-bold text-3xl hover:scale-105 transition"
                >
                  <Plus size={40} /> {t.addItem}
                </button>
              )}
            </div>
            <div className="mb-6">
              <input
                type="text"
                placeholder={`${t.search}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-8 py-6 border-4 rounded-3xl text-2xl"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredInventory.map(item => (
                <div key={item.id} className="bg-white rounded-3xl shadow-2xl p-8">
                  <h3 className="text-3xl font-bold mb-4">{item.name}</h3>
                  <p className="text-xl text-gray-600 mb-2">Size: {item.size}</p>
                  <p className="text-xl text-gray-600 mb-2">RFID: {item.rfid || 'N/A'}</p>
                  <p className="text-2xl font-bold mb-4">${item.price}</p>
                  <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                    item.status === 'available' ? 'bg-green-200 text-green-800' :
                    item.status === 'rented' ? 'bg-blue-200 text-blue-800' :
                    item.status === 'cleaning' ? 'bg-yellow-200 text-yellow-800' :
                    'bg-red-200 text-red-800'
                  }`}>
                    {t[item.status] || item.status}
                  </span>
                  {hasPermission('edit') && (
                    <div className="flex gap-2 mt-6">
                      <button
                        onClick={() => openModal('inventory', item)}
                        className="flex-1 bg-blue-600 text-white px-6 py-4 rounded-2xl font-bold hover:bg-blue-700"
                      >
                        {t.edit}
                      </button>
                      {hasPermission('delete') && (
                        <button
                          onClick={() => deleteItem('inventory', item.id)}
                          className="bg-red-600 text-white px-6 py-4 rounded-2xl font-bold hover:bg-red-700"
                        >
                          <Trash2 size={24} />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Users Tab (Admin Only) */}
        {activeTab === 'users' && profile?.role === 'admin' && (
          <div>
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-5xl font-bold">{t.userManagement}</h2>
              <button
                onClick={() => openModal('user')}
                className="flex items-center gap-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-12 py-6 rounded-3xl font-bold text-3xl hover:scale-105 transition"
              >
                <Plus size={40} /> {t.addUser}
              </button>
            </div>
            <div className="mb-6">
              <input
                type="text"
                placeholder={`${t.search}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-8 py-6 border-4 rounded-3xl text-2xl"
              />
            </div>
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              <table className="w-full text-lg">
                <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <tr>
                    <th className="px-10 py-8 text-left font-bold">{t.email}</th>
                    <th className="px-10 py-8 text-left font-bold">{t.role}</th>
                    <th className="px-10 py-8 text-left font-bold">Created</th>
                    <th className="px-10 py-8 text-left font-bold">{t.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(u => (
                    <tr key={u.id} className="border-b hover:bg-gray-50">
                      <td className="px-10 py-8 font-bold">{u.email}</td>
                      <td className="px-10 py-8">
                        <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                          u.role === 'admin' ? 'bg-purple-200 text-purple-800' :
                          u.role === 'staff' ? 'bg-blue-200 text-blue-800' :
                          'bg-gray-200 text-gray-800'
                        }`}>
                          {t[u.role] || u.role}
                        </span>
                      </td>
                      <td className="px-10 py-8">{new Date(u.created_at).toLocaleDateString()}</td>
                      <td className="px-10 py-8 flex gap-2">
                        <button
                          onClick={() => openModal('user', u)}
                          className="text-blue-600 p-4 rounded-xl hover:bg-blue-100"
                        >
                          <Edit2 size={28} />
                        </button>
                        {u.id !== user.id && (
                          <button
                            onClick={() => deleteItem('profiles', u.id)}
                            className="text-red-600 p-4 rounded-xl hover:bg-red-100"
                          >
                            <Trash2 size={28} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-10 overflow-y-auto">
          <div className="bg-white rounded-3xl p-16 max-w-4xl w-full max-h-screen overflow-y-auto shadow-3xl">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-6xl font-bold">
                {modalType === 'customer' ? (formData.id ? `${t.edit} ${t.customer}` : t.addCustomer) :
                 modalType === 'inventory' ? (formData.id ? `${t.edit} ${t.inventory}` : t.addItem) :
                 modalType === 'user' ? (formData.id ? `${t.edit} ${t.users}` : t.addUser) :
                 formData.id ? `${t.edit} ${t.rentals}` : t.newRental}
              </h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-red-600">
                <X size={60} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (modalType === 'customer') saveCustomer();
                else if (modalType === 'inventory') saveInventory();
                else if (modalType === 'user') saveUser();
                else saveRental();
              }}
              className="space-y-10"
            >
              {modalType === 'customer' && (
                <>
                  <input
                    type="text"
                    placeholder={t.name}
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-8 py-6 border-4 rounded-3xl text-2xl"
                    required
                  />
                  <input
                    type="tel"
                    placeholder={t.phone}
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-8 py-6 border-4 rounded-3xl text-2xl"
                    required
                  />
                  <input
                    type="email"
                    placeholder={t.email}
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-8 py-6 border-4 rounded-3xl text-2xl"
                  />
                  <div>
                    <label className="block text-2xl font-bold mb-4">{t.idPhoto}</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setFormData({ ...formData, idPhotoFile: e.target.files[0] })}
                      className="w-full px-8 py-6 border-4 rounded-3xl text-2xl"
                    />
                  </div>
                </>
              )}

              {modalType === 'inventory' && (
                <>
                  <input
                    type="text"
                    placeholder={t.name}
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-8 py-6 border-4 rounded-3xl text-2xl"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Size"
                    value={formData.size || ''}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    className="w-full px-8 py-6 border-4 rounded-3xl text-2xl"
                    required
                  />
                  <input
                    type="text"
                    placeholder="RFID"
                    value={formData.rfid || ''}
                    onChange={(e) => setFormData({ ...formData, rfid: e.target.value })}
                    className="w-full px-8 py-6 border-4 rounded-3xl text-2xl"
                  />
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Price"
                    value={formData.price || ''}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-8 py-6 border-4 rounded-3xl text-2xl"
                    required
                  />
                  {formData.id && (
                    <select
                      value={formData.status || 'available'}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-8 py-6 border-4 rounded-3xl text-2xl"
                    >
                      <option value="available">{t.available}</option>
                      <option value="rented">{t.rented}</option>
                      <option value="cleaning">{t.cleaning}</option>
                      <option value="maintenance">{t.maintenance}</option>
                    </select>
                  )}
                </>
              )}

              {modalType === 'user' && (
                <>
                  {!formData.id && (
                    <>
                      <input
                        type="email"
                        placeholder={t.email}
                        value={formData.email || ''}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-8 py-6 border-4 rounded-3xl text-2xl"
                        required
                      />
                      <input
                        type="password"
                        placeholder={t.password}
                        value={formData.password || ''}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full px-8 py-6 border-4 rounded-3xl text-2xl"
                        required
                        minLength={6}
                      />
                    </>
                  )}
                  <select
                    value={formData.role || 'viewer'}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-8 py-6 border-4 rounded-3xl text-2xl"
                    required
                  >
                    <option value="admin">{t.admin}</option>
                    <option value="staff">{t.staff}</option>
                    <option value="viewer">{t.viewer}</option>
                  </select>
                </>
              )}

              {modalType === 'rental' && (
                <>
                  <select
                    value={formData.customer_id || ''}
                    onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
                    className="w-full px-8 py-6 border-4 rounded-3xl text-2xl"
                    required
                  >
                    <option value="">{t.customer}</option>
                    {customers.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>

                  <div>
                    <label className="block text-2xl font-bold mb-4">{t.items}</label>
                    <div className="max-h-96 overflow-y-auto border-4 rounded-3xl p-6 space-y-4">
                      {inventory.filter(i => i.status === 'available' || selectedItems.includes(i.id)).map(item => (
                        <label key={item.id} className="flex items-center gap-4 cursor-pointer hover:bg-gray-100 p-4 rounded-2xl">
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(item.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedItems([...selectedItems, item.id]);
                              } else {
                                setSelectedItems(selectedItems.filter(id => id !== item.id));
                              }
                            }}
                            className="w-8 h-8"
                          />
                          <span className="text-xl">{item.name} - Size {item.size} - ${item.price}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <input
                    type="date"
                    placeholder={t.eventDate}
                    value={formData.event_date || ''}
                    onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                    className="w-full px-8 py-6 border-4 rounded-3xl text-2xl"
                  />

                  <input
                    type="date"
                    placeholder={t.pickupDate}
                    value={formData.pickup_date || ''}
                    onChange={(e) => setFormData({ ...formData, pickup_date: e.target.value })}
                    className="w-full px-8 py-6 border-4 rounded-3xl text-2xl"
                    required
                  />

                  <input
                    type="date"
                    placeholder={t.returnDate}
                    value={formData.return_date || ''}
                    onChange={(e) => setFormData({ ...formData, return_date: e.target.value })}
                    className="w-full px-8 py-6 border-4 rounded-3xl text-2xl"
                    required
                  />

                  <select
                    value={formData.payment_method || 'cash'}
                    onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                    className="w-full px-8 py-6 border-4 rounded-3xl text-2xl"
                  >
                    <option value="cash">{t.cash}</option>
                    <option value="card">{t.card}</option>
                    <option value="check">{t.check}</option>
                    <option value="other">{t.other}</option>
                  </select>

                  <input
                    type="number"
                    step="0.01"
                    placeholder={t.deposit}
                    value={formData.deposit || ''}
                    onChange={(e) => setFormData({ ...formData, deposit: e.target.value })}
                    className="w-full px-8 py-6 border-4 rounded-3xl text-2xl"
                  />

                  {formData.id && (
                    <select
                      value={formData.status || 'reserved'}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-8 py-6 border-4 rounded-3xl text-2xl"
                    >
                      <option value="reserved">Reserved</option>
                      <option value="picked_up">Picked Up</option>
                      <option value="returned">Returned</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  )}

                  <textarea
                    placeholder={t.notes}
                    value={formData.notes || ''}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-8 py-6 border-4 rounded-3xl text-2xl"
                    rows="4"
                  />

                  {formData.id && (
                    <div className="border-4 rounded-3xl p-8 bg-gray-50">
                      <h3 className="text-3xl font-bold mb-6 flex items-center gap-4">
                        <Ruler size={36} /> {t.alterations}
                      </h3>
                      <div className="space-y-4 mb-6">
                        {alterations.filter(a => a.rental_id === formData.id).map(alt => (
                          <div key={alt.id} className="bg-white p-4 rounded-2xl flex justify-between items-center">
                            <div>
                              <p className="text-xl font-bold">{alt.description}</p>
                              <p className="text-lg text-gray-600">${alt.cost} - {alt.status}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="space-y-4">
                        <input
                          type="text"
                          placeholder="Alteration Description"
                          value={formData.alteration_description || ''}
                          onChange={(e) => setFormData({ ...formData, alteration_description: e.target.value })}
                          className="w-full px-6 py-4 border-2 rounded-2xl text-xl"
                        />
                        <input
                          type="number"
                          step="0.01"
                          placeholder="Cost"
                          value={formData.alteration_cost || ''}
                          onChange={(e) => setFormData({ ...formData, alteration_cost: e.target.value })}
                          className="w-full px-6 py-4 border-2 rounded-2xl text-xl"
                        />
                        <button
                          type="button"
                          onClick={saveAlteration}
                          className="w-full bg-purple-600 text-white px-8 py-4 rounded-2xl font-bold text-xl hover:bg-purple-700"
                        >
                          {t.addAlteration}
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8 rounded-3xl font-bold text-4xl hover:scale-105 transition"
              >
                <Save size={40} className="inline mr-4" />
                {t.save}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}