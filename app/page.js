'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  Calendar, Users, Package, DollarSign, BarChart3, Search, Plus, X,
  LogOut, Clock, AlertCircle, CheckCircle, Edit2, Upload, Eye,
  Printer, Trash2, CreditCard, Save, Ruler, Globe, UserCog,
  Building2, MapPin, Phone, FileText, TrendingUp, Award
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!supabaseUrl || !supabaseAnonKey) throw new Error('Missing Supabase environment variables!');
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ─── Translations ────────────────────────────────────────────────────────────
const translations = {
  en: {
    login: 'LOGIN', logout: 'LOGOUT',
    dashboard: 'Today', rentals: 'Rentals', customers: 'Customers',
    inventory: 'Inventory', billing: 'Billing', analytics: 'Analytics',
    users: 'Users', stores: 'Stores',
    addCustomer: 'ADD CUSTOMER', addItem: 'ADD ITEM', newRental: 'NEW RENTAL',
    addUser: 'ADD USER', addStore: 'ADD STORE',
    overdueReturns: 'OVERDUE RETURNS', todayPickups: "TODAY'S PICKUPS",
    todayReturns: "TODAY'S RETURNS", todayReservations: "TODAY'S RESERVATIONS",
    checkInNow: 'CHECK IN NOW', markPickedUp: 'MARK PICKED UP',
    name: 'Name', phone: 'Phone', email: 'Email', idPhoto: 'ID Photo',
    actions: 'Actions', viewId: 'View ID', save: 'SAVE', cancel: 'CANCEL',
    edit: 'Edit', delete: 'Delete', status: 'Status', customer: 'Customer',
    items: 'Items', total: 'Total', deposit: 'Deposit', balance: 'Balance',
    reservationDate: 'Reservation Date', pickupDate: 'Pickup Date',
    returnDate: 'Return Date', eventDate: 'Event Date',
    paymentMethod: 'Payment Method', alterations: 'Alterations',
    notes: 'Notes', addAlteration: 'Add Alteration',
    cash: 'Cash', card: 'Card', check: 'Check', other: 'Other',
    available: 'Available', rented: 'Rented', cleaning: 'Cleaning',
    maintenance: 'Maintenance',
    role: 'Role', admin: 'Admin', staff: 'Staff', viewer: 'Viewer',
    password: 'Password', userManagement: 'User Management',
    search: 'Search', size: 'Size', price: 'Price', rfid: 'RFID',
    category: 'Category', item: 'Item',
    // Store management
    storeManagement: 'Store Management', selectStore: 'Select Store',
    allStores: 'All Stores', storeName: 'Store Name', storeAddress: 'Address',
    storePhone: 'Phone', storeLogo: 'Logo', termsAndConditions: 'Terms & Conditions',
    // Customer extended
    address: 'Address', measurements: 'Measurements', chest: 'Chest',
    waist: 'Waist', inseam: 'Inseam', jacketSize: 'Jacket Size',
    neck: 'Neck', sleeve: 'Sleeve', customerNotes: 'Notes',
    rentalHistory: 'Rental History',
    // Contract
    printContract: 'Print Contract', rentalContract: 'RENTAL CONTRACT',
    signatureCustomer: 'Customer Signature', signatureStaff: 'Staff Initials',
    dateSigned: 'Date', contractItems: 'Rented Items',
    // Analytics
    revenueOverTime: 'Revenue Over Time', inventoryUtilization: 'Inventory Utilization',
    topCustomers: 'Top Customers', overdueBalances: 'Overdue & Outstanding',
    thisWeek: 'This Week', thisMonth: 'This Month', thisYear: 'This Year', allTime: 'All Time',
    printReport: 'Print Report',
    rentalsByStatus: 'Rentals by Status', rentalsByDay: 'Rentals by Day of Week',
    paymentMethodBreakdown: 'Revenue by Payment Method', weeklyRevenue: 'Weekly Revenue & Rentals',
    totalRentals: 'Total Rentals', totalRevenue: 'Total Revenue',
    avgRental: 'Avg. Rental Value', timesRented: 'Times Rented',
    outstanding: 'Outstanding', collected: 'Collected',
    allCategories: 'All Categories', uncategorized: 'Uncategorized',
    utilizationRate: 'Utilization Rate', collectionRate: 'Collection Rate',
    avgDuration: 'Avg. Rental Days', lateReturnRate: 'Late Return Rate',
    payBalance: 'Pay Balance', payNow: 'PAY NOW', balanceDue: 'Balance Due',
    // Billing
    paymentHistory: 'Payment History', outstandingBalance: 'Outstanding Balance',
    addPayment: 'Add Payment', amount: 'Amount', paymentDate: 'Date',
    totalCollected: 'Total Collected', totalOutstanding: 'Total Outstanding',
    recentPayments: 'Recent Payments', paidAmount: 'Paid',
    // Cleaning tracker
    cleanerTab: 'Dry Cleaner', cleaningTracker: 'Dry Cleaner',
    atCleaner: 'At Cleaner', sentDate: 'Sent Date', markReturned: 'MARK RETURNED',
    noItemsCleaning: 'No items currently at the dry cleaner.',
    fromRental: 'From Rental',
    // Misc
    noData: 'No data available', store: 'Store', inches: 'in.',
    pending: 'Pending', inProgress: 'In Progress', completed: 'Completed',
    reserved: 'Reserved', pickedUp: 'Picked Up', picked_up: 'Picked Up', returned: 'Returned',
    cancelled: 'Cancelled',
  },
  es: {
    login: 'INICIAR SESIÓN', logout: 'CERRAR SESIÓN',
    dashboard: 'Hoy', rentals: 'Rentas', customers: 'Clientes',
    inventory: 'Inventario', billing: 'Facturación', analytics: 'Análisis',
    users: 'Usuarios', stores: 'Tiendas',
    addCustomer: 'AGREGAR CLIENTE', addItem: 'AGREGAR ARTÍCULO',
    newRental: 'NUEVA RENTA', addUser: 'AGREGAR USUARIO',
    addStore: 'AGREGAR TIENDA',
    overdueReturns: 'DEVOLUCIONES VENCIDAS',
    todayPickups: 'RECOLECCIONES DE HOY', todayReturns: 'DEVOLUCIONES DE HOY',
    todayReservations: 'RESERVACIONES DE HOY',
    checkInNow: 'REGISTRAR AHORA', markPickedUp: 'MARCAR RECOGIDO',
    name: 'Nombre', phone: 'Teléfono', email: 'Correo', idPhoto: 'Foto de ID',
    actions: 'Acciones', viewId: 'Ver ID', save: 'GUARDAR', cancel: 'CANCELAR',
    edit: 'Editar', delete: 'Eliminar', status: 'Estado', customer: 'Cliente',
    items: 'Artículos', total: 'Total', deposit: 'Depósito', balance: 'Saldo',
    reservationDate: 'Fecha de Reserva', pickupDate: 'Fecha de Recolección',
    returnDate: 'Fecha de Devolución', eventDate: 'Fecha del Evento',
    paymentMethod: 'Método de Pago', alterations: 'Alteraciones',
    notes: 'Notas', addAlteration: 'Agregar Alteración',
    cash: 'Efectivo', card: 'Tarjeta', check: 'Cheque', other: 'Otro',
    available: 'Disponible', rented: 'Alquilado', cleaning: 'Limpieza',
    maintenance: 'Mantenimiento',
    role: 'Rol', admin: 'Administrador', staff: 'Personal', viewer: 'Visualizador',
    password: 'Contraseña', userManagement: 'Gestión de Usuarios',
    search: 'Buscar', size: 'Talla', price: 'Precio', rfid: 'RFID',
    category: 'Categoría', item: 'Artículo',
    storeManagement: 'Gestión de Tiendas', selectStore: 'Seleccionar Tienda',
    allStores: 'Todas las Tiendas', storeName: 'Nombre de Tienda',
    storeAddress: 'Dirección', storePhone: 'Teléfono', storeLogo: 'Logo',
    termsAndConditions: 'Términos y Condiciones',
    address: 'Dirección', measurements: 'Medidas', chest: 'Pecho',
    waist: 'Cintura', inseam: 'Entrepierna', jacketSize: 'Talla de Saco',
    neck: 'Cuello', sleeve: 'Manga', customerNotes: 'Notas',
    rentalHistory: 'Historial de Rentas',
    printContract: 'Imprimir Contrato', rentalContract: 'CONTRATO DE ALQUILER',
    signatureCustomer: 'Firma del Cliente', signatureStaff: 'Iniciales del Personal',
    dateSigned: 'Fecha', contractItems: 'Artículos Alquilados',
    revenueOverTime: 'Ingresos en el Tiempo', inventoryUtilization: 'Utilización del Inventario',
    topCustomers: 'Mejores Clientes', overdueBalances: 'Vencidos y Pendientes',
    thisWeek: 'Esta Semana', thisMonth: 'Este Mes', thisYear: 'Este Año', allTime: 'Todo el Tiempo',
    printReport: 'Imprimir Reporte',
    rentalsByStatus: 'Rentas por Estado', rentalsByDay: 'Rentas por Día de Semana',
    paymentMethodBreakdown: 'Ingresos por Método de Pago', weeklyRevenue: 'Ingresos y Rentas Semanales',
    totalRentals: 'Total Rentas', totalRevenue: 'Ingresos Totales',
    avgRental: 'Valor Promedio', timesRented: 'Veces Alquilado',
    outstanding: 'Pendiente', collected: 'Cobrado',
    allCategories: 'Todas las Categorías', uncategorized: 'Sin Categoría',
    utilizationRate: 'Tasa de Utilización', collectionRate: 'Tasa de Cobro',
    avgDuration: 'Días Promedio', lateReturnRate: 'Tasa de Atraso',
    paymentHistory: 'Historial de Pagos', outstandingBalance: 'Saldo Pendiente',
    addPayment: 'Agregar Pago', amount: 'Monto', paymentDate: 'Fecha',
    totalCollected: 'Total Cobrado', totalOutstanding: 'Total Pendiente',
    recentPayments: 'Pagos Recientes', paidAmount: 'Pagado',
    // Cleaning tracker
    cleanerTab: 'Tintorería', cleaningTracker: 'Tintorería',
    atCleaner: 'En Tintorería', sentDate: 'Fecha de Envío', markReturned: 'MARCAR DEVUELTO',
    noItemsCleaning: 'No hay artículos en tintorería actualmente.',
    fromRental: 'De Renta',
    payBalance: 'Pagar Saldo', payNow: 'PAGAR', balanceDue: 'Saldo Pendiente',
    noData: 'Sin datos disponibles', store: 'Tienda', inches: 'pulg.',
    pending: 'Pendiente', inProgress: 'En Progreso', completed: 'Completado',
    reserved: 'Reservado', pickedUp: 'Recogido', picked_up: 'Recogido', returned: 'Devuelto',
    cancelled: 'Cancelado',
  }
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function TuxedoAdmin() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [customers, setCustomers] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [stores, setStores] = useState([]);
  const [currentStoreId, setCurrentStoreId] = useState('all');
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [formData, setFormData] = useState({});
  const [selectedItems, setSelectedItems] = useState([]);
  const [language, setLanguage] = useState('en');
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [forgotSent, setForgotSent] = useState(false);
  const [error, setError] = useState('');
  const [alterations, setAlterations] = useState([]);
  const [payments, setPayments] = useState([]);
  const [contractRental, setContractRental] = useState(null);
  const [analyticsFilter, setAnalyticsFilter] = useState('thisYear');
  const [utilizationCategory, setUtilizationCategory] = useState('all');
  const [utilizationLimit, setUtilizationLimit] = useState(10);
  const [billingRentalId, setBillingRentalId] = useState('');
  const [billingAmount, setBillingAmount] = useState('');
  const [billingMethod, setBillingMethod] = useState('cash');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [quickPayRental, setQuickPayRental] = useState(null);
  const [quickPayMethod, setQuickPayMethod] = useState('cash');
  const [quickPayOnComplete, setQuickPayOnComplete] = useState(null);

  const t = translations[language];
  const today = (() => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; })();

  useEffect(() => { checkUser(); }, []);

  useEffect(() => {
    if (user) loadData(currentStoreId);
  }, [currentStoreId]); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Auth ──────────────────────────────────────────────────────────────────
  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        await loadUserProfile(session.user.id);
        await loadData('all');
      }
    } catch (e) {
      console.error('Auth check failed:', e);
    }
    setLoading(false);
  };

  const loadUserProfile = async (userId) => {
    try {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
      if (error) {
        const { data: np } = await supabase.from('profiles').insert({ id: userId, role: 'admin' }).select().single();
        setProfile(np || { role: 'admin' });
      } else {
        setProfile(data || { role: 'admin' });
      }
    } catch { setProfile({ role: 'admin' }); }
  };

  const loadData = async (storeId) => {
    const sid = storeId !== undefined ? storeId : currentStoreId;

    let inventoryQ = supabase.from('inventory').select('*').order('name');
    let rentalsQ = supabase.from('rentals').select('*, customers(name,phone,email,address,measurements)').order('created_at', { ascending: false });

    if (sid && sid !== 'all') {
      inventoryQ = inventoryQ.eq('store_id', sid);
      rentalsQ = rentalsQ.eq('store_id', sid);
    }

    const [c, i, r, a, p, u, s] = await Promise.all([
      supabase.from('customers').select('*').order('name'),
      inventoryQ,
      rentalsQ,
      supabase.from('alterations').select('*'),
      supabase.from('payments').select('*').order('payment_date', { ascending: false }),
      supabase.from('profiles').select('id,role,store_id,created_at').order('created_at', { ascending: false }),
      supabase.from('stores').select('*').order('name'),
    ]);

    setCustomers(c.data || []);
    setInventory(i.data || []);
    setRentals(r.data || []);
    setAlterations(a.data || []);
    setPayments(p.data || []);
    setStores(s.data || []);

    if (u.data) {
      const { data: authUsers } = await supabase.auth.admin.listUsers().catch(() => ({ data: null }));
      const enriched = u.data.map(p => ({
        ...p,
        email: authUsers?.users?.find(au => au.id === p.id)?.email || 'N/A'
      }));
      setUsers(enriched);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    const { data, error } = await supabase.auth.signInWithPassword(loginData);
    if (error) { setError(error.message); return; }
    setUser(data.user);
    await loadUserProfile(data.user.id);
    await loadData('all');
  };

  const handleForgotPassword = async () => {
    if (!loginData.email) {
      setError(language === 'es' ? 'Ingresa tu correo primero.' : 'Enter your email address first.');
      return;
    }
    setError('');
    const { error } = await supabase.auth.resetPasswordForEmail(loginData.email, {
      redirectTo: window.location.origin,
    });
    if (error) { setError(error.message); return; }
    setForgotSent(true);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null); setProfile(null);
  };

  const hasPermission = (action) => {
    if (!profile) return false;
    if (profile.role === 'admin') return true;
    if (profile.role === 'staff' && action !== 'delete') return true;
    if (profile.role === 'viewer' && action === 'view') return true;
    return false;
  };

  // ─── Modal ─────────────────────────────────────────────────────────────────
  const openModal = (type, data = {}) => {
    setModalType(type);
    if (type === 'rental' && data.customer_id) {
      const cust = customers.find(c => c.id === data.customer_id);
      setFormData({ ...data, measurements: data.measurements || cust?.measurements || {} });
    } else {
      setFormData(data);
    }
    setShowModal(true);
    if (type === 'rental' && data.id) setSelectedItems(data.item_ids || []);
  };

  const closeModal = () => { setShowModal(false); setFormData({}); setSelectedItems([]); };

  // ─── File Upload ───────────────────────────────────────────────────────────
  const handleFileUpload = async (file, bucket = 'id-photos') => {
    const ext = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36)}.${ext}`;
    const { error } = await supabase.storage.from(bucket).upload(fileName, file);
    if (error) throw error;
    return supabase.storage.from(bucket).getPublicUrl(fileName).data.publicUrl;
  };

  // ─── Date Conflict Check ───────────────────────────────────────────────────
  const checkDateConflicts = async (itemIds, pickupDate, returnDate, rentalId = null) => {
    const { data } = await supabase.from('rentals')
      .select('id,item_ids,pickup_date,return_date')
      .in('status', ['reserved', 'picked_up'])
      .neq('id', rentalId || '');

    const conflicts = [];
    data?.forEach(rental => {
      if (!rental.item_ids.some(id => itemIds.includes(id))) return;
      const rs = new Date(rental.pickup_date), re = new Date(rental.return_date);
      const ns = new Date(pickupDate), ne = new Date(returnDate);
      if (ns <= re && ne >= rs) conflicts.push(rental);
    });
    return conflicts;
  };

  // ─── Save: Customer ────────────────────────────────────────────────────────
  const saveCustomer = async () => {
    try {
      let id_photo_url = formData.id_photo_url;
      if (formData.idPhotoFile) id_photo_url = await handleFileUpload(formData.idPhotoFile);

      const measurements = {
        chest: formData.chest || '',
        waist: formData.waist || '',
        inseam: formData.inseam || '',
        jacketSize: formData.jacketSize || '',
        neck: formData.neck || '',
        sleeve: formData.sleeve || '',
      };

      const data = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email || null,
        id_photo_url,
        address: formData.address || null,
        measurements,
        notes: formData.notes || null,
      };

      if (formData.id) {
        await supabase.from('customers').update(data).eq('id', formData.id);
      } else {
        await supabase.from('customers').insert(data);
      }
      await loadData();
      closeModal();
    } catch (err) { alert('Error saving customer: ' + err.message); }
  };

  // ─── Save: Inventory ───────────────────────────────────────────────────────
  const saveInventory = async () => {
    try {
      const data = {
        name: formData.name,
        size: formData.size,
        rfid: formData.rfid || null,
        price: parseFloat(formData.price),
        category: formData.category || null,
        notes: formData.notes || null,
        store_id: formData.store_id || (currentStoreId !== 'all' ? currentStoreId : null),
      };

      if (formData.id) {
        data.status = formData.status || 'available';
        await supabase.from('inventory').update(data).eq('id', formData.id);
      } else {
        data.status = 'available';
        await supabase.from('inventory').insert(data);
      }
      await loadData();
      closeModal();
    } catch (err) { alert('Error saving inventory: ' + err.message); }
  };

  // ─── Save: Rental ──────────────────────────────────────────────────────────
  const saveRental = async () => {
    try {
      const conflicts = await checkDateConflicts(selectedItems, formData.pickup_date, formData.return_date, formData.id);
      if (conflicts.length > 0 && !confirm(`Warning: ${conflicts.length} item(s) have conflicting reservations. Continue anyway?`)) return;

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
        created_by: user.id,
        store_id: formData.store_id || (currentStoreId !== 'all' ? currentStoreId : null),
      };

      if (formData.id) {
        const oldRental = rentals.find(r => r.id === formData.id);
        const oldStatus = oldRental?.status;
        const newStatus = rentalData.status;

        if (newStatus === 'returned') {
          rentalData.actual_return_date = today;
        }

        await supabase.from('rentals').update(rentalData).eq('id', formData.id);

        if (oldStatus !== newStatus) {
          const itemIds = oldRental?.item_ids || [];
          if (newStatus === 'picked_up') {
            for (const id of itemIds) await supabase.from('inventory').update({ status: 'rented' }).eq('id', id);
          } else if (newStatus === 'returned') {
            for (const id of itemIds) await supabase.from('inventory').update({ status: 'cleaning' }).eq('id', id);
          } else if (newStatus === 'cancelled') {
            for (const id of itemIds) await supabase.from('inventory').update({ status: 'available' }).eq('id', id);
          }
        }
      } else {
        await supabase.from('rentals').insert(rentalData);
        for (const itemId of selectedItems) {
          await supabase.from('inventory').update({ status: 'rented' }).eq('id', itemId);
        }
      }
      // Sync measurements back to customer profile if any were entered
      if (formData.customer_id && formData.measurements && Object.values(formData.measurements).some(v => v)) {
        await supabase.from('customers').update({ measurements: formData.measurements }).eq('id', formData.customer_id);
      }

      await loadData();
      closeModal();
    } catch (err) { alert('Error saving rental: ' + err.message); }
  };

  // ─── Save: User ────────────────────────────────────────────────────────────
  const saveUser = async () => {
    try {
      if (formData.id) {
        await supabase.from('profiles').update({ role: formData.role }).eq('id', formData.id);
      } else {
        const { data: authData, error: authError } = await supabase.auth.signUp({ email: formData.email, password: formData.password });
        if (authError) throw authError;
        await supabase.from('profiles').insert({ id: authData.user.id, role: formData.role || 'viewer' });
      }
      await loadData();
      closeModal();
    } catch (err) { alert('Error saving user: ' + err.message); }
  };

  // ─── Save: Store ───────────────────────────────────────────────────────────
  const saveStore = async () => {
    try {
      let logo_url = formData.logo_url;
      if (formData.logoFile) logo_url = await handleFileUpload(formData.logoFile, 'store-logos');

      const data = {
        name: formData.name,
        address: formData.address || null,
        phone: formData.phone || null,
        logo_url: logo_url || null,
        terms_and_conditions: formData.terms_and_conditions || '',
      };

      if (formData.id) {
        await supabase.from('stores').update(data).eq('id', formData.id);
      } else {
        await supabase.from('stores').insert(data);
      }
      await loadData();
      closeModal();
    } catch (err) { alert('Error saving store: ' + err.message); }
  };

  // ─── Save: Alteration ─────────────────────────────────────────────────────
  const saveAlteration = async () => {
    try {
      await supabase.from('alterations').insert({
        rental_id: formData.rental_id,
        description: formData.alteration_description,
        cost: parseFloat(formData.alteration_cost) || 0,
        status: formData.alteration_status || 'pending',
      });
      await loadData();
      setFormData({ ...formData, alteration_description: '', alteration_cost: '' });
    } catch (err) { alert('Error saving alteration: ' + err.message); }
  };

  // ─── Payment ───────────────────────────────────────────────────────────────
  const addPayment = async (rentalId, amount, method) => {
    try {
      await supabase.from('payments').insert({ rental_id: rentalId, amount: parseFloat(amount), payment_method: method, payment_date: today });
      const rental = rentals.find(r => r.id === rentalId);
      await supabase.from('rentals').update({ paid_amount: (rental.paid_amount || 0) + parseFloat(amount) }).eq('id', rentalId);
      await loadData();
      setBillingAmount(''); setBillingRentalId('');
    } catch (err) { alert('Error adding payment: ' + err.message); }
  };

  // ─── Pickup / Check-in ────────────────────────────────────────────────────
  const completePickup = async (id) => {
    const rental = rentals.find(r => r.id === id);
    await supabase.from('rentals').update({ status: 'picked_up' }).eq('id', id);
    for (const itemId of rental.item_ids) await supabase.from('inventory').update({ status: 'rented' }).eq('id', itemId);
    await loadData();
  };

  const handlePickup = (id) => {
    const rental = rentals.find(r => r.id === id);
    const balance = getRentalBalance(rental);
    if (balance > 0) {
      setQuickPayRental(rental);
      setQuickPayMethod('cash');
      setQuickPayOnComplete(() => () => completePickup(id));
    } else {
      completePickup(id);
    }
  };

  const handleCheckIn = async (id) => {
    const rental = rentals.find(r => r.id === id);
    await supabase.from('rentals').update({ status: 'returned', actual_return_date: today }).eq('id', id);
    for (const itemId of rental.item_ids) await supabase.from('inventory').update({ status: 'cleaning' }).eq('id', itemId);
    await loadData();
  };

  const markCleaningReturned = async (itemId) => {
    await supabase.from('inventory').update({ status: 'available' }).eq('id', itemId);
    await loadData();
  };

  const deleteItem = async (table, id) => {
    if (window.confirm('Delete permanently?')) {
      if (table === 'rentals') {
        const rental = rentals.find(r => r.id === id);
        await supabase.from('payments').delete().eq('rental_id', id);
        await supabase.from('alterations').delete().eq('rental_id', id);
        if (rental) {
          for (const itemId of rental.item_ids || []) {
            await supabase.from('inventory').update({ status: 'available' }).eq('id', itemId);
          }
        }
      }
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) { alert('Delete failed: ' + error.message); return; }
      await loadData();
    }
  };

  // ─── Contract Printing ────────────────────────────────────────────────────
  const printContract = (rental) => {
    setContractRental(rental);
    setTimeout(() => {
      document.body.classList.add('print-contract');
      const cleanup = () => { document.body.classList.remove('print-contract'); window.removeEventListener('afterprint', cleanup); };
      window.addEventListener('afterprint', cleanup);
      window.print();
    }, 200);
  };

  // ─── Helpers ──────────────────────────────────────────────────────────────
  const getRentalBalance = (rental) => {
    const altCost = alterations.filter(a => a.rental_id === rental.id).reduce((s, a) => s + (a.cost || 0), 0);
    return rental.total + altCost - (rental.paid_amount || 0);
  };

  const getStoreName = (storeId) => stores.find(s => s.id === storeId)?.name || '—';

  const getCurrentStore = () => stores.find(s => s.id === currentStoreId);

  // ─── Analytics Data ───────────────────────────────────────────────────────
  const getFilteredRentals = () => {
    const now = new Date();
    if (analyticsFilter === 'thisWeek') {
      const dayOfWeek = now.getDay();
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - dayOfWeek);
      startOfWeek.setHours(0, 0, 0, 0);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      return rentals.filter(r => {
        if (!r.reservation_date) return false;
        const d = new Date(r.reservation_date + 'T12:00:00');
        return d >= startOfWeek && d <= endOfWeek;
      });
    }
    if (analyticsFilter === 'thisMonth') {
      return rentals.filter(r => {
        const d = new Date(r.reservation_date);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      });
    }
    if (analyticsFilter === 'thisYear') {
      return rentals.filter(r => new Date(r.reservation_date).getFullYear() === now.getFullYear());
    }
    return rentals;
  };

  const getRevenueData = () => {
    const byMonth = {};
    getFilteredRentals().forEach(r => {
      if (!r.reservation_date) return;
      const month = r.reservation_date.substring(0, 7);
      byMonth[month] = (byMonth[month] || 0) + (r.total || 0);
    });
    return Object.entries(byMonth).sort().map(([month, revenue]) => ({
      month: month.replace('-', '/'),
      revenue: Math.round(revenue * 100) / 100,
    }));
  };

  const getInventoryUtilization = (catFilter, limit) => {
    const counts = {};
    rentals.forEach(r => (r.item_ids || []).forEach(id => { counts[id] = (counts[id] || 0) + 1; }));
    const filtered = catFilter && catFilter !== 'all'
      ? inventory.filter(item => (item.category || '') === catFilter)
      : inventory;
    const all = filtered
      .map(item => ({ name: item.name.length > 20 ? item.name.slice(0, 20) + '…' : item.name, times: counts[item.id] || 0, category: item.category || '' }))
      .sort((a, b) => b.times - a.times);
    return limit ? all.slice(0, limit) : all;
  };

  const getTopCustomers = () => {
    const map = {};
    rentals.forEach(r => {
      if (!map[r.customer_id]) map[r.customer_id] = { name: r.customers?.name || '?', total: 0, count: 0 };
      map[r.customer_id].total += r.total || 0;
      map[r.customer_id].count += 1;
    });
    return Object.values(map).sort((a, b) => b.total - a.total).slice(0, 10);
  };

  const getOverdueRentals = () =>
    rentals.filter(r => r.return_date < today && r.status === 'picked_up').map(r => ({
      ...r, balance: getRentalBalance(r),
    }));

  const getUtilizationRate = () => {
    if (!inventory.length) return '0%';
    const out = inventory.filter(i => i.status === 'rented' || i.status === 'cleaning').length;
    return `${Math.round((out / inventory.length) * 100)}%`;
  };

  const getCollectionRate = () => {
    if (!totalRevenue) return '0%';
    return `${Math.round((totalCollected / totalRevenue) * 100)}%`;
  };

  const getAvgRentalDuration = () => {
    const completed = getFilteredRentals().filter(r => r.pickup_date && r.return_date);
    if (!completed.length) return '0';
    const avg = completed.reduce((sum, r) => {
      const days = (new Date(r.return_date) - new Date(r.pickup_date)) / (1000 * 60 * 60 * 24);
      return sum + days;
    }, 0) / completed.length;
    return avg.toFixed(1);
  };

  const getLateReturnRate = () => {
    const returned = rentals.filter(r => r.status === 'returned' && r.actual_return_date && r.return_date);
    if (!returned.length) return '0%';
    const late = returned.filter(r => r.actual_return_date > r.return_date).length;
    return `${Math.round((late / returned.length) * 100)}%`;
  };

  const getWeeklyData = () => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - dayOfWeek);
    const dayLabels = language === 'es'
      ? ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
      : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return dayLabels.map((day, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      const dateStr = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
      const dayRentals = rentals.filter(r => r.reservation_date === dateStr);
      return {
        day,
        revenue: Math.round(dayRentals.reduce((s, r) => s + (r.total || 0), 0) * 100) / 100,
        count: dayRentals.length,
      };
    });
  };

  const getRentalsByStatus = () => {
    const filtered = getFilteredRentals();
    const counts = {};
    filtered.forEach(r => { counts[r.status] = (counts[r.status] || 0) + 1; });
    return Object.entries(counts).map(([status, count]) => ({ status: t[status] || status, count }));
  };

  const getPaymentMethodBreakdown = () => {
    const filtered = getFilteredRentals();
    const map = {};
    filtered.forEach(r => {
      const method = r.payment_method || 'other';
      if (!map[method]) map[method] = { method: t[method] || method, revenue: 0, count: 0 };
      map[method].revenue = Math.round((map[method].revenue + (r.total || 0)) * 100) / 100;
      map[method].count += 1;
    });
    return Object.values(map).sort((a, b) => b.revenue - a.revenue);
  };

  const getRentalsByDayOfWeek = () => {
    const filtered = getFilteredRentals();
    const dayLabels = language === 'es'
      ? ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
      : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const counts = [0, 0, 0, 0, 0, 0, 0];
    filtered.forEach(r => {
      if (!r.reservation_date) return;
      const d = new Date(r.reservation_date + 'T12:00:00');
      counts[d.getDay()] += 1;
    });
    return dayLabels.map((day, i) => ({ day, count: counts[i] }));
  };

  const handlePrintAnalytics = () => {
    document.body.classList.add('print-analytics');
    const cleanup = () => { document.body.classList.remove('print-analytics'); window.removeEventListener('afterprint', cleanup); };
    window.addEventListener('afterprint', cleanup);
    window.print();
  };

  // ─── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-6xl font-bold bg-gradient-to-br from-blue-900 to-blue-700 text-white">
        Loading…
      </div>
    );
  }

  // ─── Login ────────────────────────────────────────────────────────────────
  if (!user) {
    return (
      <div className="flex min-h-screen">
        {/* Left panel — branding */}
        <div className="hidden lg:flex flex-col justify-between w-1/2 bg-gradient-to-br from-slate-950 via-blue-950 to-blue-900 p-14 text-white relative overflow-hidden">
          {/* Decorative circles */}
          <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(139,92,246,0.15)' }} />
          <div style={{ position: 'absolute', bottom: '-100px', left: '-60px', width: '350px', height: '350px', borderRadius: '50%', background: 'rgba(99,102,241,0.12)' }} />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                <span style={{ fontSize: 20 }}>🎩</span>
              </div>
              <span className="text-lg font-semibold tracking-wide opacity-80">D'Rosel</span>
            </div>
            <h1 className="text-5xl font-bold leading-tight mb-4">
              Tuxedo<br />Rentals
            </h1>
            <p className="text-lg font-semibold opacity-70 leading-relaxed max-w-xs tracking-wide">
              {language === 'es' ? 'Sistema de gestión D\'Rosel' : 'D\'Rosel Management System'}
            </p>
          </div>
          <div className="relative z-10 space-y-4">
            {[
              language === 'es' ? '✦ Gestión multi-tienda' : '✦ Multi-store management',
              language === 'es' ? '✦ Ciclo completo de renta' : '✦ Full rental lifecycle',
              language === 'es' ? '✦ Seguimiento de inventario' : '✦ Inventory tracking',
              language === 'es' ? '✦ Análisis e informes' : '✦ Analytics & reports',
            ].map(f => (
              <div key={f} className="text-sm opacity-50 tracking-wide">{f}</div>
            ))}
          </div>
        </div>

        {/* Right panel — form */}
        <div className="flex flex-1 flex-col items-center justify-center bg-gray-50 px-8 py-12">
          <div className="w-full max-w-md">
            {/* Mobile logo */}
            <div className="lg:hidden flex items-center gap-3 mb-10">
              <span style={{ fontSize: 28 }}>🎩</span>
              <span className="text-2xl font-bold text-slate-800">D'Rosel Tuxedo Rentals</span>
            </div>

            <div className="flex justify-between items-start mb-10">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-1">
                  {language === 'es' ? 'Bienvenido' : 'Welcome back'}
                </h2>
                <p className="text-gray-400 text-sm">
                  {language === 'es' ? 'Inicia sesión en tu cuenta' : 'Sign in to your account'}
                </p>
              </div>
              <button onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
                className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-blue-700 transition px-3 py-2 rounded-xl hover:bg-blue-50 min-h-[44px]">
                <Globe size={16} />
                {language === 'en' ? 'ES' : 'EN'}
              </button>
            </div>

            {error && (
              <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-sm flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" /> {error}
              </div>
            )}

            {forgotSent ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={32} className="text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">
                  {language === 'es' ? '¡Correo enviado!' : 'Email sent!'}
                </h3>
                <p className="text-gray-500 text-sm mb-6">
                  {language === 'es'
                    ? 'Revisa tu bandeja de entrada y sigue el enlace para restablecer tu contraseña.'
                    : 'Check your inbox and follow the link to reset your password.'}
                </p>
                <button onClick={() => { setForgotSent(false); setError(''); }}
                  className="text-blue-700 font-semibold text-sm hover:underline">
                  ← {language === 'es' ? 'Volver al inicio de sesión' : 'Back to sign in'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                  <input type="email" placeholder="you@example.com" value={loginData.email}
                    onChange={e => setLoginData({ ...loginData, email: e.target.value })}
                    className="w-full px-5 py-4 bg-white border-2 border-gray-200 rounded-2xl text-base focus:outline-none focus:border-blue-600 transition min-h-[56px]"
                    required />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-semibold text-gray-700">{t.password}</label>
                    <button type="button" onClick={handleForgotPassword}
                      className="text-xs text-blue-700 font-semibold hover:underline">
                      {language === 'es' ? '¿Olvidaste tu contraseña?' : 'Forgot password?'}
                    </button>
                  </div>
                  <input type="password" placeholder="••••••••" value={loginData.password}
                    onChange={e => setLoginData({ ...loginData, password: e.target.value })}
                    className="w-full px-5 py-4 bg-white border-2 border-gray-200 rounded-2xl text-base focus:outline-none focus:border-blue-600 transition min-h-[56px]"
                    required />
                </div>
                <button type="submit"
                  className="w-full bg-gradient-to-r from-blue-900 to-blue-700 hover:from-blue-950 hover:to-blue-800 text-white py-4 rounded-2xl font-bold text-lg tracking-wide shadow-lg hover:shadow-blue-900 hover:scale-[1.02] transition-all min-h-[60px] mt-2">
                  {t.login} →
                </button>
              </form>
            )}

            <p className="mt-10 text-center text-xs text-gray-400">
              © {new Date().getFullYear()} D'Rosel Tuxedo Rentals. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ─── Computed Filters ─────────────────────────────────────────────────────
  const todayPickups = rentals.filter(r => r.pickup_date === today && r.status === 'reserved');
  const todayReturns = rentals.filter(r => r.return_date === today && r.status === 'picked_up');
  const todayReservations = rentals.filter(r => r.reservation_date === today && r.status === 'reserved');
  const overdue = rentals.filter(r => r.return_date < today && r.status === 'picked_up');
  const filteredCustomers = customers.filter(c =>
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone?.includes(searchTerm) || c.email?.toLowerCase().includes(searchTerm));
  const inventoryCategories = ['all', ...Array.from(new Set(inventory.map(i => i.category || '').filter(Boolean))).sort()];
  const filteredInventory = inventory.filter(i => {
    const matchesSearch = i.name?.toLowerCase().includes(searchTerm.toLowerCase()) || i.rfid?.toLowerCase().includes(searchTerm);
    const matchesCategory = selectedCategory === 'all' || (selectedCategory === '__none__' ? !i.category : i.category === selectedCategory);
    return matchesSearch && matchesCategory;
  });
  const filteredRentals = rentals.filter(r =>
    r.customers?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || searchTerm === '');
  const filteredUsers = users.filter(u => u.email?.toLowerCase().includes(searchTerm.toLowerCase()));

  const totalRevenue = rentals.reduce((s, r) => s + (r.total || 0), 0);
  const totalCollected = rentals.reduce((s, r) => s + (r.paid_amount || 0), 0);
  const totalOutstanding = rentals.reduce((s, r) => s + Math.max(0, getRentalBalance(r)), 0);

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Print CSS ─────────────────────────────────────────────────────── */}
      <style>{`
        #contract-print-wrapper { display: none; }
        #analytics-print-wrapper { display: none; }
        @media print {
          body > div > * { display: none !important; }
          body.print-contract > div > #contract-print-wrapper { display: block !important; position: static; width: 100%; background: white; }
          body.print-analytics > div > #analytics-print-wrapper { display: block !important; position: static; width: 100%; background: white; }
        }
        @page { margin: 0.4in; }
      `}</style>

      {/* ── Contract Print Div ────────────────────────────────────────────── */}
      <div id="contract-print-wrapper">
        {contractRental && (() => {
          const store = stores.find(s => s.id === contractRental.store_id);
          const customer = customers.find(c => c.id === contractRental.customer_id) || contractRental.customers || {};
          const rentalItems = (contractRental.item_ids || []).map(id => inventory.find(i => i.id === id)).filter(Boolean);
          const rentalAlts = alterations.filter(a => a.rental_id === contractRental.id);
          const altTotal = rentalAlts.reduce((s, a) => s + (a.cost || 0), 0);
          const balance = contractRental.total + altTotal - (contractRental.paid_amount || 0);
          return (
            <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '11px', color: '#111' }}>
              {/* Header */}
              <div style={{ borderBottom: '2px solid #1e3a5f', paddingBottom: '8px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  {store?.logo_url && <img src={store.logo_url} alt="logo" style={{ height: '40px', marginBottom: '4px' }} />}
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1e3a5f' }}>{store?.name || 'Tuxedo Rental'}</div>
                  {store?.address && <div style={{ color: '#555' }}>{store.address}</div>}
                  {store?.phone && <div style={{ color: '#555' }}>{store.phone}</div>}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#1e3a5f' }}>{t.rentalContract}</div>
                  <div style={{ color: '#555', marginTop: '2px' }}>
                    {language === 'es' ? 'Fecha' : 'Date'}: {new Date().toLocaleDateString()}<br />
                    #{contractRental.id?.slice(-8).toUpperCase()}
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
                <div style={{ border: '1px solid #ddd', borderRadius: '6px', padding: '8px' }}>
                  <div style={{ fontWeight: 'bold', color: '#1e3a5f', marginBottom: '4px', textTransform: 'uppercase' }}>{language === 'es' ? 'Información del Cliente' : 'Customer Information'}</div>
                  <div style={{ fontSize: '13px', fontWeight: 'bold' }}>{customer.name}</div>
                  <div style={{ color: '#555' }}>{customer.phone}</div>
                  {customer.email && <div style={{ color: '#555' }}>{customer.email}</div>}
                  {customer.address && <div style={{ color: '#555' }}>{customer.address}</div>}
                </div>
                <div style={{ border: '1px solid #ddd', borderRadius: '6px', padding: '8px' }}>
                  <div style={{ fontWeight: 'bold', color: '#1e3a5f', marginBottom: '4px', textTransform: 'uppercase' }}>{language === 'es' ? 'Detalles del Alquiler' : 'Rental Details'}</div>
                  <div><b>{t.eventDate}:</b> {contractRental.event_date || '—'}</div>
                  <div><b>{t.pickupDate}:</b> {contractRental.pickup_date}</div>
                  <div><b>{t.returnDate}:</b> {contractRental.return_date}</div>
                  <div><b>{t.paymentMethod}:</b> {contractRental.payment_method}</div>
                </div>
              </div>

              {/* Items Table */}
              <div style={{ marginBottom: '10px' }}>
                <div style={{ fontWeight: 'bold', color: '#1e3a5f', marginBottom: '4px', textTransform: 'uppercase' }}>{t.contractItems}</div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#1e3a5f', color: 'white' }}>
                      <th style={{ padding: '5px 8px', textAlign: 'left' }}>{t.item}</th>
                      <th style={{ padding: '5px 8px', textAlign: 'left' }}>{t.size}</th>
                      <th style={{ padding: '5px 8px', textAlign: 'left' }}>RFID</th>
                      <th style={{ padding: '5px 8px', textAlign: 'right' }}>{t.price}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rentalItems.map((item, i) => (
                      <tr key={item.id} style={{ backgroundColor: i % 2 === 0 ? '#f9f9f9' : 'white' }}>
                        <td style={{ padding: '5px 8px' }}>{item.name}</td>
                        <td style={{ padding: '5px 8px' }}>{item.size}</td>
                        <td style={{ padding: '5px 8px', color: '#888' }}>{item.rfid || '—'}</td>
                        <td style={{ padding: '5px 8px', textAlign: 'right' }}>${item.price?.toFixed(2)}</td>
                      </tr>
                    ))}
                    {rentalAlts.length > 0 && rentalAlts.map((alt, i) => (
                      <tr key={alt.id} style={{ backgroundColor: i % 2 === 0 ? '#fff8f0' : '#fff3e0' }}>
                        <td colSpan={3} style={{ padding: '5px 8px', fontStyle: 'italic' }}>{t.alterations}: {alt.description}</td>
                        <td style={{ padding: '5px 8px', textAlign: 'right' }}>${alt.cost?.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
                <table style={{ fontSize: '11px', minWidth: '200px' }}>
                  <tbody>
                    <tr><td style={{ padding: '2px 12px', color: '#555' }}>{t.total}:</td><td style={{ textAlign: 'right', fontWeight: 'bold' }}>${contractRental.total?.toFixed(2)}</td></tr>
                    {altTotal > 0 && <tr><td style={{ padding: '2px 12px', color: '#555' }}>{t.alterations}:</td><td style={{ textAlign: 'right' }}>${altTotal.toFixed(2)}</td></tr>}
                    <tr><td style={{ padding: '2px 12px', color: '#555' }}>{t.deposit}:</td><td style={{ textAlign: 'right' }}>${contractRental.deposit?.toFixed(2)}</td></tr>
                    <tr><td style={{ padding: '2px 12px', color: '#555' }}>{t.paidAmount}:</td><td style={{ textAlign: 'right' }}>${contractRental.paid_amount?.toFixed(2)}</td></tr>
                    <tr style={{ borderTop: '2px solid #1e3a5f' }}>
                      <td style={{ padding: '4px 12px', fontWeight: 'bold', fontSize: '13px' }}>{t.balance}:</td>
                      <td style={{ textAlign: 'right', fontWeight: 'bold', fontSize: '13px', color: balance > 0 ? '#c00' : '#080' }}>${balance.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Signatures */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '10px' }}>
                <div>
                  <div style={{ borderBottom: '1px solid #333', height: '32px', marginBottom: '4px' }}></div>
                  <div style={{ color: '#555' }}>{t.signatureCustomer}</div>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ borderBottom: '1px solid #333', height: '32px', marginBottom: '4px' }}></div>
                    <div style={{ color: '#555' }}>{t.signatureStaff}</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ borderBottom: '1px solid #333', height: '32px', marginBottom: '4px' }}></div>
                    <div style={{ color: '#555' }}>{t.dateSigned}</div>
                  </div>
                </div>
              </div>

              {/* Terms */}
              <div style={{ borderTop: '1px solid #ddd', paddingTop: '6px', pageBreakInside: 'avoid', pageBreakBefore: 'avoid' }}>
                <div style={{ fontWeight: 'bold', color: '#555', marginBottom: '3px', textTransform: 'uppercase' }}>{t.termsAndConditions}</div>
                <div style={{ fontSize: '9px', color: '#777', lineHeight: '1.4' }}>
                  {store?.terms_and_conditions || 'Standard rental terms and conditions apply. All items must be returned in original condition by the agreed return date. Late returns will incur a daily fee. Customer is responsible for any damage or loss of rented items.'}
                </div>
              </div>

              {/* ── MEASUREMENTS PAGE (page break) ────────────────────────── */}
              <div style={{ pageBreakBefore: 'always', paddingTop: '12px', fontFamily: 'Arial, sans-serif', fontSize: '11px', color: '#111' }}>
                {/* Header */}
                <div style={{ borderBottom: '2px solid #1e3a5f', paddingBottom: '8px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#1e3a5f' }}>{store?.name || 'Tuxedo Rental'}</div>
                    <div style={{ fontSize: '13px', fontWeight: 'bold', marginTop: '2px' }}>
                      {language === 'es' ? 'HOJA DE MEDIDAS Y ALTERACIONES' : 'MEASUREMENTS & ALTERATIONS WORK SHEET'}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', color: '#555' }}>
                    #{contractRental.id?.slice(-8).toUpperCase()} &nbsp;|&nbsp;
                    {language === 'es' ? 'Evento' : 'Event'}: {contractRental.event_date || '—'} &nbsp;|&nbsp;
                    {language === 'es' ? 'Recolección' : 'Pickup'}: {contractRental.pickup_date}
                  </div>
                </div>

                {/* Customer + Items summary */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
                  <div style={{ border: '1px solid #ddd', borderRadius: '6px', padding: '8px' }}>
                    <div style={{ fontWeight: 'bold', color: '#1e3a5f', marginBottom: '3px', textTransform: 'uppercase' }}>{language === 'es' ? 'Cliente' : 'Customer'}</div>
                    <div style={{ fontSize: '13px', fontWeight: 'bold' }}>{customer.name}</div>
                    <div style={{ color: '#555' }}>{customer.phone}</div>
                  </div>
                  <div style={{ border: '1px solid #ddd', borderRadius: '6px', padding: '8px' }}>
                    <div style={{ fontWeight: 'bold', color: '#1e3a5f', marginBottom: '3px', textTransform: 'uppercase' }}>{language === 'es' ? 'Artículos' : 'Items'}</div>
                    {rentalItems.map(item => (
                      <div key={item.id}>{item.name} — {item.size}</div>
                    ))}
                  </div>
                </div>

                {/* Measurements grid */}
                <div style={{ border: '2px solid #1e3a5f', borderRadius: '6px', padding: '10px', marginBottom: '10px' }}>
                  <div style={{ fontWeight: 'bold', color: '#1e3a5f', marginBottom: '8px', textTransform: 'uppercase' }}>
                    {language === 'es' ? 'Medidas del Cliente' : 'Customer Measurements'}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '6px' }}>
                    {[
                      { label: language === 'es' ? 'Pecho' : 'Chest', key: 'chest' },
                      { label: language === 'es' ? 'Cintura' : 'Waist', key: 'waist' },
                      { label: language === 'es' ? 'Entrepierna' : 'Inseam', key: 'inseam' },
                      { label: language === 'es' ? 'Talla Saco' : 'Jacket', key: 'jacketSize' },
                      { label: language === 'es' ? 'Cuello' : 'Neck', key: 'neck' },
                      { label: language === 'es' ? 'Manga' : 'Sleeve', key: 'sleeve' },
                    ].map(({ label, key }) => (
                      <div key={key} style={{ border: '1px solid #ccc', borderRadius: '4px', padding: '6px', background: '#f9f9f9', textAlign: 'center' }}>
                        <div style={{ fontSize: '9px', color: '#888', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '3px' }}>{label}</div>
                        <div style={{ fontSize: '18px', fontWeight: 'bold', color: customer.measurements?.[key] ? '#1e3a5f' : '#ccc' }}>
                          {customer.measurements?.[key] || '—'}
                        </div>
                        {customer.measurements?.[key] && <div style={{ fontSize: '9px', color: '#888' }}>{t.inches}</div>}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Alterations work area */}
                <div>
                  <div style={{ fontWeight: 'bold', color: '#1e3a5f', marginBottom: '6px', textTransform: 'uppercase' }}>
                    {language === 'es' ? 'Alteraciones' : 'Alterations'}
                  </div>
                  {rentalAlts.length > 0 ? (
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', marginBottom: '10px' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#1e3a5f', color: 'white' }}>
                          <th style={{ padding: '5px 8px', textAlign: 'left' }}>{language === 'es' ? 'Descripción' : 'Description'}</th>
                          <th style={{ padding: '5px 8px', textAlign: 'left' }}>{language === 'es' ? 'Estado' : 'Status'}</th>
                          <th style={{ padding: '5px 8px', textAlign: 'left' }}>{language === 'es' ? '✓ Listo' : '✓ Done'}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rentalAlts.map((alt, i) => (
                          <tr key={alt.id} style={{ backgroundColor: i % 2 === 0 ? '#f9f9f9' : 'white' }}>
                            <td style={{ padding: '6px 8px' }}>{alt.description}</td>
                            <td style={{ padding: '6px 8px', color: '#888' }}>{t[alt.status] || alt.status}</td>
                            <td style={{ padding: '6px 8px' }}>
                              <div style={{ width: '20px', height: '20px', border: '2px solid #333', borderRadius: '3px' }}></div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div style={{ border: '1px solid #ddd', borderRadius: '6px', padding: '8px', color: '#aaa' }}>
                      {language === 'es' ? 'Sin alteraciones registradas.' : 'No alterations on file.'}
                    </div>
                  )}
                  {/* Notes lines */}
                  <div style={{ marginTop: '10px' }}>
                    <div style={{ color: '#888', marginBottom: '6px' }}>{language === 'es' ? 'Notas adicionales:' : 'Additional notes:'}</div>
                    {[1, 2, 3].map(n => (
                      <div key={n} style={{ borderBottom: '1px solid #ccc', height: '22px', marginBottom: '6px' }}></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* ── Analytics Print Wrapper ───────────────────────────────────────── */}
      <div id="analytics-print-wrapper">
        <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '12px', color: '#111', padding: '0.25in' }}>
          <div style={{ borderBottom: '3px solid #1e40af', paddingBottom: 12, marginBottom: 20 }}>
            <h1 style={{ fontSize: 26, fontWeight: 'bold', color: '#1e3a5f', margin: 0 }}>D'ROSEL TUXEDO RENTALS — {t.analytics.toUpperCase()}</h1>
            <p style={{ margin: '4px 0 0', color: '#555', fontSize: 12 }}>
              {t[analyticsFilter]} &nbsp;|&nbsp; {new Date().toLocaleDateString(language === 'es' ? 'es-MX' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
            {[
              { label: t.totalRentals, value: getFilteredRentals().length },
              { label: t.totalRevenue, value: `$${getFilteredRentals().reduce((s, r) => s + (r.total || 0), 0).toFixed(2)}` },
              { label: t.avgRental, value: getFilteredRentals().length ? `$${(getFilteredRentals().reduce((s, r) => s + (r.total || 0), 0) / getFilteredRentals().length).toFixed(2)}` : '$0.00' },
              { label: t.outstanding, value: `$${totalOutstanding.toFixed(2)}` },
              { label: t.utilizationRate, value: getUtilizationRate() },
              { label: t.collectionRate, value: getCollectionRate() },
              { label: t.avgDuration, value: `${getAvgRentalDuration()} ${language === 'es' ? 'días' : 'days'}` },
              { label: t.lateReturnRate, value: getLateReturnRate() },
            ].map(card => (
              <div key={card.label} style={{ border: '1px solid #e5e7eb', borderRadius: 6, padding: '10px 12px' }}>
                <div style={{ fontSize: 10, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{card.label}</div>
                <div style={{ fontSize: 20, fontWeight: 'bold', color: '#1e3a5f', marginTop: 2 }}>{card.value}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
            <div>
              <h3 style={{ fontSize: 13, fontWeight: 'bold', marginBottom: 8, color: '#374151', borderBottom: '1px solid #e5e7eb', paddingBottom: 5 }}>{t.rentalsByStatus}</h3>
              {getRentalsByStatus().map(s => (
                <div key={s.status} style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', fontSize: 12 }}>
                  <span>{s.status}</span><span style={{ fontWeight: 'bold' }}>{s.count}</span>
                </div>
              ))}
            </div>
            <div>
              <h3 style={{ fontSize: 13, fontWeight: 'bold', marginBottom: 8, color: '#374151', borderBottom: '1px solid #e5e7eb', paddingBottom: 5 }}>{t.paymentMethodBreakdown}</h3>
              {getPaymentMethodBreakdown().map(m => (
                <div key={m.method} style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', fontSize: 12 }}>
                  <span>{m.method} ({m.count})</span><span style={{ fontWeight: 'bold' }}>${m.revenue.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 style={{ fontSize: 13, fontWeight: 'bold', marginBottom: 8, color: '#374151', borderBottom: '1px solid #e5e7eb', paddingBottom: 5 }}>{t.topCustomers}</h3>
            <table style={{ width: '100%', fontSize: 11, borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f3f4f6' }}>
                  <th style={{ padding: '5px 8px', textAlign: 'left' }}>#</th>
                  <th style={{ padding: '5px 8px', textAlign: 'left' }}>{t.name}</th>
                  <th style={{ padding: '5px 8px', textAlign: 'right' }}>{t.totalRentals}</th>
                  <th style={{ padding: '5px 8px', textAlign: 'right' }}>{t.totalRevenue}</th>
                </tr>
              </thead>
              <tbody>
                {getTopCustomers().slice(0, 10).map((c, i) => (
                  <tr key={c.name} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '4px 8px', color: '#6b7280' }}>#{i+1}</td>
                    <td style={{ padding: '4px 8px', fontWeight: 'bold' }}>{c.name}</td>
                    <td style={{ padding: '4px 8px', textAlign: 'right' }}>{c.count}</td>
                    <td style={{ padding: '4px 8px', textAlign: 'right', fontWeight: 'bold' }}>${c.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <header className="bg-slate-900 text-white shadow-2xl sticky top-0 z-40">
        <div className="max-w-full px-6 py-4 flex justify-between items-center gap-4">
          <h1 className="text-3xl font-bold whitespace-nowrap">D'Rosel Tuxedo Rentals</h1>
          <div className="flex items-center gap-3 flex-wrap justify-end">
            {/* Store Selector */}
            <select
              value={currentStoreId}
              onChange={e => { setCurrentStoreId(e.target.value); setSearchTerm(''); }}
              className="bg-white text-slate-900 px-4 py-3 rounded-full font-bold text-base min-h-[48px] cursor-pointer"
            >
              {profile?.role === 'admin' && <option value="all">{t.allStores}</option>}
              {stores.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              {stores.length === 0 && <option value="all">{t.selectStore}</option>}
            </select>
            {/* Language */}
            <button onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
              className="flex items-center gap-2 bg-white text-slate-900 px-5 py-3 rounded-full font-bold hover:bg-gray-100 transition min-h-[48px]">
              <Globe size={20} /> {language === 'en' ? 'ES' : 'EN'}
            </button>
            <span className="bg-gradient-to-r from-blue-900 to-blue-700 px-6 py-3 rounded-full font-bold text-base">
              {profile?.role?.toUpperCase() || 'USER'}
            </span>
            <button onClick={signOut}
              className="flex items-center gap-2 bg-red-600 px-6 py-3 rounded-2xl hover:bg-red-700 transition font-bold text-base min-h-[48px]">
              <LogOut size={20} /> {t.logout}
            </button>
          </div>
        </div>
      </header>

      {/* ── Navigation ────────────────────────────────────────────────────── */}
      <nav className="bg-white shadow-xl sticky top-[73px] z-30">
        <div className="max-w-full px-4 py-3">
          <div className="flex gap-2 overflow-x-auto">
            {[
              { id: 'dashboard', label: t.dashboard, icon: Clock },
              { id: 'rentals', label: t.rentals, icon: Calendar },
              { id: 'customers', label: t.customers, icon: Users },
              { id: 'inventory', label: t.inventory, icon: Package },
              { id: 'billing', label: t.billing, icon: DollarSign },
              ...(profile?.role !== 'staff' ? [{ id: 'analytics', label: t.analytics, icon: BarChart3 }] : []),
              { id: 'cleaner', label: t.cleanerTab, icon: Ruler },
              ...(profile?.role === 'admin' ? [
                { id: 'stores', label: t.stores, icon: Building2 },
                { id: 'users', label: t.users, icon: UserCog },
              ] : []),
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setSearchTerm(''); }}
                  className={`flex items-center gap-2 px-6 py-4 rounded-2xl font-bold text-base transition-all whitespace-nowrap min-h-[56px] ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-900 to-blue-700 text-white shadow-lg'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}>
                  <Icon size={20} /> {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* ── Main Content ──────────────────────────────────────────────────── */}
      <main className="max-w-full p-6">

        {/* ════ DASHBOARD ══════════════════════════════════════════════════ */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Summary cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: t.todayPickups, value: todayPickups.length, color: 'from-blue-700 to-blue-900' },
                { label: t.todayReturns, value: todayReturns.length, color: 'from-blue-600 to-blue-800' },
                { label: t.overdueReturns, value: overdue.length, color: 'from-rose-500 to-rose-700' },
                { label: t.outstanding, value: `$${totalOutstanding.toFixed(0)}`, color: 'from-sky-600 to-blue-700' },
              ].map(card => (
                <div key={card.label} className={`bg-gradient-to-r ${card.color} text-white rounded-3xl p-6 shadow-xl`}>
                  <div className="text-5xl font-bold">{card.value}</div>
                  <div className="text-lg mt-2 opacity-90">{card.label}</div>
                </div>
              ))}
            </div>

            {/* Overdue */}
            {overdue.length > 0 && (
              <div className="bg-rose-50 border-4 border-rose-400 rounded-3xl p-8">
                <h2 className="text-3xl font-bold text-rose-800 flex items-center gap-4 mb-6">
                  <AlertCircle size={40} /> {t.overdueReturns} ({overdue.length})
                </h2>
                {overdue.map(r => (
                  <div key={r.id} className="bg-white p-6 rounded-2xl mb-4 shadow-lg flex justify-between items-center">
                    <div>
                      <p className="text-2xl font-bold">{r.customers?.name}</p>
                      <p className="text-lg text-rose-600">{language === 'es' ? 'Vence' : 'Due'}: {r.return_date}</p>
                      <p className="text-base text-gray-500">{r.item_ids?.length} {t.items} · ${getRentalBalance(r).toFixed(2)} {t.balance}</p>
                    </div>
                    <div className="flex gap-3">
                      {hasPermission('edit') && (
                        <button onClick={() => handleCheckIn(r.id)}
                          className="bg-rose-600 text-white px-8 py-5 rounded-2xl font-bold text-xl hover:bg-rose-700 min-h-[56px]">
                          {t.checkInNow}
                        </button>
                      )}
                      <button onClick={() => printContract(r)}
                        className="bg-gray-200 text-gray-700 px-6 py-5 rounded-2xl font-bold text-xl hover:bg-gray-300 min-h-[56px] flex items-center gap-2">
                        <Printer size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Today's Reservations */}
            {todayReservations.length > 0 && (
              <div className="bg-sky-50 border-4 border-sky-400 rounded-3xl p-8">
                <h2 className="text-3xl font-bold text-blue-800 flex items-center gap-4 mb-6">
                  <FileText size={40} /> {t.todayReservations} ({todayReservations.length})
                </h2>
                {todayReservations.map(r => (
                  <div key={r.id} className="bg-white p-6 rounded-2xl mb-4 shadow-lg flex justify-between items-center">
                    <div>
                      <p className="text-2xl font-bold">{r.customers?.name}</p>
                      <p className="text-lg text-blue-600">{t.pickupDate}: {r.pickup_date} · {t.eventDate}: {r.event_date || '—'}</p>
                      <p className="text-base text-gray-500">{r.item_ids?.length} {t.items} · ${r.total?.toFixed(2)} · {t.deposit}: ${r.deposit?.toFixed(2)}</p>
                      {currentStoreId === 'all' && <p className="text-sm text-blue-700">{getStoreName(r.store_id)}</p>}
                    </div>
                    <button onClick={() => printContract(r)}
                      className="bg-gray-200 text-gray-700 px-6 py-5 rounded-2xl hover:bg-gray-300 min-h-[56px] flex items-center gap-2 font-bold">
                      <Printer size={20} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Today's Pickups */}
            {todayPickups.length > 0 && (
              <div className="bg-blue-50 border-4 border-blue-500 rounded-3xl p-8">
                <h2 className="text-3xl font-bold text-blue-800 flex items-center gap-4 mb-6">
                  <Calendar size={40} /> {t.todayPickups} ({todayPickups.length})
                </h2>
                {todayPickups.map(r => (
                  <div key={r.id} className="bg-white p-6 rounded-2xl mb-4 shadow-lg flex justify-between items-center">
                    <div>
                      <p className="text-2xl font-bold">{r.customers?.name}</p>
                      <p className="text-lg text-blue-600">{t.eventDate}: {r.event_date || '—'}</p>
                      <p className="text-base text-gray-500">{r.item_ids?.length} {t.items} · ${r.total?.toFixed(2)}</p>
                      {currentStoreId === 'all' && <p className="text-sm text-blue-700">{getStoreName(r.store_id)}</p>}
                    </div>
                    <div className="flex gap-3">
                      {hasPermission('edit') && (
                        <button onClick={() => handlePickup(r.id)}
                          className="bg-blue-800 text-white px-8 py-5 rounded-2xl font-bold text-xl hover:bg-blue-900 min-h-[56px]">
                          {t.markPickedUp}
                        </button>
                      )}
                      <button onClick={() => printContract(r)}
                        className="bg-gray-200 text-gray-700 px-6 py-5 rounded-2xl hover:bg-gray-300 min-h-[56px] flex items-center gap-2 font-bold">
                        <Printer size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Today's Returns */}
            {todayReturns.length > 0 && (
              <div className="bg-blue-50 border-4 border-blue-400 rounded-3xl p-8">
                <h2 className="text-3xl font-bold text-blue-800 flex items-center gap-4 mb-6">
                  <CheckCircle size={40} /> {t.todayReturns} ({todayReturns.length})
                </h2>
                {todayReturns.map(r => (
                  <div key={r.id} className="bg-white p-6 rounded-2xl mb-4 shadow-lg flex justify-between items-center">
                    <div>
                      <p className="text-2xl font-bold">{r.customers?.name}</p>
                      <p className="text-lg text-blue-600">{t.returnDate}: {r.return_date}</p>
                      <p className="text-base text-gray-500">${getRentalBalance(r).toFixed(2)} {t.balance}</p>
                    </div>
                    {hasPermission('edit') && (
                      <button onClick={() => handleCheckIn(r.id)}
                        className="bg-blue-800 text-white px-8 py-5 rounded-2xl font-bold text-xl hover:bg-blue-900 min-h-[56px]">
                        {t.checkInNow}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {todayReservations.length === 0 && todayPickups.length === 0 && todayReturns.length === 0 && overdue.length === 0 && (
              <div className="text-center py-20 text-gray-400 text-3xl">
                <CheckCircle size={80} className="mx-auto mb-6 text-blue-300" />
                {language === 'es' ? 'Todo está al día hoy.' : "You're all caught up for today!"}
              </div>
            )}
          </div>
        )}

        {/* ════ RENTALS ═════════════════════════════════════════════════════ */}
        {activeTab === 'rentals' && (
          <div>
            <div className="flex justify-between items-center mb-8 gap-4 flex-wrap">
              <h2 className="text-4xl font-bold">{t.rentals}</h2>
              <div className="flex gap-3 items-center flex-wrap">
                <input type="text" placeholder={`${t.search}…`} value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="px-6 py-4 border-2 rounded-2xl text-lg min-h-[56px] w-60" />
                {hasPermission('edit') && (
                  <button onClick={() => openModal('rental')}
                    className="flex items-center gap-3 bg-gradient-to-r from-blue-900 to-blue-700 text-white px-8 py-4 rounded-2xl font-bold text-xl hover:scale-105 transition min-h-[56px]">
                    <Plus size={28} /> {t.newRental}
                  </button>
                )}
              </div>
            </div>
            <div className="bg-white rounded-3xl shadow-xl overflow-x-auto">
              <table className="w-full text-base">
                <thead className="bg-gradient-to-r from-blue-900 to-blue-700 text-white">
                  <tr>
                    <th className="px-6 py-5 text-left font-bold">{t.customer}</th>
                    <th className="px-6 py-5 text-left font-bold">{t.eventDate}</th>
                    <th className="px-6 py-5 text-left font-bold">{t.pickupDate}</th>
                    <th className="px-6 py-5 text-left font-bold">{t.returnDate}</th>
                    <th className="px-6 py-5 text-left font-bold">{t.status}</th>
                    <th className="px-6 py-5 text-left font-bold">{t.total}</th>
                    <th className="px-6 py-5 text-left font-bold">{t.balance}</th>
                    {currentStoreId === 'all' && <th className="px-6 py-5 text-left font-bold">{t.store}</th>}
                    <th className="px-6 py-5 text-left font-bold">{t.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRentals.map(r => {
                    const balance = getRentalBalance(r);
                    return (
                      <tr key={r.id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-5 font-bold">{r.customers?.name}</td>
                        <td className="px-6 py-5">{r.event_date || '—'}</td>
                        <td className="px-6 py-5">{r.pickup_date}</td>
                        <td className="px-6 py-5">{r.return_date}</td>
                        <td className="px-6 py-5">
                          <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                            r.status === 'reserved' ? 'bg-blue-100 text-blue-800' :
                            r.status === 'picked_up' ? 'bg-sky-100 text-sky-700' :
                            r.status === 'returned' ? 'bg-slate-100 text-slate-600' :
                            'bg-gray-100 text-gray-800'}`}>
                            {t[r.status] || r.status}
                          </span>
                        </td>
                        <td className="px-6 py-5">${r.total?.toFixed(2)}</td>
                        <td className="px-6 py-5">
                          <span className={balance > 0 ? 'text-red-600 font-bold' : 'text-green-600 font-bold'}>
                            ${balance.toFixed(2)}
                          </span>
                        </td>
                        {currentStoreId === 'all' && <td className="px-6 py-5 text-sm text-blue-700">{getStoreName(r.store_id)}</td>}
                        <td className="px-6 py-5">
                          <div className="flex gap-2 flex-wrap">
                            {hasPermission('edit') && balance > 0 && (
                              <button onClick={() => { setQuickPayRental(r); setQuickPayMethod('cash'); }}
                                className="flex items-center gap-2 bg-green-600 text-white px-4 py-3 rounded-xl font-bold hover:bg-green-700 min-h-[48px] text-sm">
                                <CreditCard size={16} /> {t.payBalance}
                              </button>
                            )}
                            <button onClick={() => printContract(r)}
                              className="text-gray-600 p-3 rounded-xl hover:bg-gray-100 min-h-[48px] min-w-[48px] flex items-center justify-center">
                              <Printer size={22} />
                            </button>
                            {hasPermission('edit') && (
                              <button onClick={() => openModal('rental', r)}
                                className="text-blue-700 p-3 rounded-xl hover:bg-blue-50 min-h-[48px] min-w-[48px] flex items-center justify-center">
                                <Edit2 size={22} />
                              </button>
                            )}
                            {hasPermission('delete') && (
                              <button onClick={() => deleteItem('rentals', r.id)}
                                className="text-rose-600 p-3 rounded-xl hover:bg-rose-50 min-h-[48px] min-w-[48px] flex items-center justify-center">
                                <Trash2 size={22} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {filteredRentals.length === 0 && (
                <div className="text-center py-16 text-gray-400 text-xl">{t.noData}</div>
              )}
            </div>
          </div>
        )}

        {/* ════ CUSTOMERS ═══════════════════════════════════════════════════ */}
        {activeTab === 'customers' && (
          <div>
            <div className="flex justify-between items-center mb-8 gap-4 flex-wrap">
              <h2 className="text-4xl font-bold">{t.customers}</h2>
              <div className="flex gap-3 items-center flex-wrap">
                <input type="text" placeholder={`${t.search}…`} value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="px-6 py-4 border-2 rounded-2xl text-lg min-h-[56px] w-60" />
                {hasPermission('edit') && (
                  <button onClick={() => openModal('customer')}
                    className="flex items-center gap-3 bg-gradient-to-r from-blue-900 to-blue-700 text-white px-8 py-4 rounded-2xl font-bold text-xl hover:scale-105 transition min-h-[56px]">
                    <Plus size={28} /> {t.addCustomer}
                  </button>
                )}
              </div>
            </div>
            <div className="bg-white rounded-3xl shadow-xl overflow-x-auto">
              <table className="w-full text-base">
                <thead className="bg-gradient-to-r from-blue-900 to-blue-700 text-white">
                  <tr>
                    <th className="px-6 py-5 text-left font-bold">{t.name}</th>
                    <th className="px-6 py-5 text-left font-bold">{t.phone}</th>
                    <th className="px-6 py-5 text-left font-bold">{t.email}</th>
                    <th className="px-6 py-5 text-left font-bold">{t.address}</th>
                    <th className="px-6 py-5 text-left font-bold">{t.measurements}</th>
                    <th className="px-6 py-5 text-left font-bold">{t.idPhoto}</th>
                    <th className="px-6 py-5 text-left font-bold">{t.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map(c => {
                    const m = c.measurements || {};
                    const hasMeasurements = Object.values(m).some(v => v);
                    return (
                      <tr key={c.id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-5 font-bold">{c.name}</td>
                        <td className="px-6 py-5">{c.phone}</td>
                        <td className="px-6 py-5 text-sm">{c.email || '—'}</td>
                        <td className="px-6 py-5 text-sm max-w-[160px] truncate">{c.address || '—'}</td>
                        <td className="px-6 py-5 text-sm">
                          {hasMeasurements ? (
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-bold">
                              {[m.jacketSize && `J:${m.jacketSize}`, m.waist && `W:${m.waist}`, m.inseam && `I:${m.inseam}`].filter(Boolean).join(' · ')}
                            </span>
                          ) : '—'}
                        </td>
                        <td className="px-6 py-5">
                          {c.id_photo_url ? (
                            <button onClick={() => window.open(c.id_photo_url)}
                              className="text-blue-700 hover:underline flex items-center gap-2 min-h-[48px]">
                              <Eye size={20} /> {t.viewId}
                            </button>
                          ) : '—'}
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex gap-2">
                            {hasPermission('edit') && (
                              <button onClick={() => openModal('customer', { ...c, ...(c.measurements || {}) })}
                                className="text-blue-700 p-3 rounded-xl hover:bg-blue-50 min-h-[48px] min-w-[48px] flex items-center justify-center">
                                <Edit2 size={22} />
                              </button>
                            )}
                            {hasPermission('delete') && (
                              <button onClick={() => deleteItem('customers', c.id)}
                                className="text-rose-600 p-3 rounded-xl hover:bg-rose-50 min-h-[48px] min-w-[48px] flex items-center justify-center">
                                <Trash2 size={22} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {filteredCustomers.length === 0 && (
                <div className="text-center py-16 text-gray-400 text-xl">{t.noData}</div>
              )}
            </div>
          </div>
        )}

        {/* ════ INVENTORY ═══════════════════════════════════════════════════ */}
        {activeTab === 'inventory' && (
          <div>
            <div className="flex justify-between items-center mb-4 gap-4 flex-wrap">
              <h2 className="text-4xl font-bold">{t.inventory}</h2>
              <div className="flex gap-3 items-center flex-wrap">
                <input type="text" placeholder={`${t.search}…`} value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="px-6 py-4 border-2 rounded-2xl text-lg min-h-[56px] w-60" />
                {hasPermission('edit') && (
                  <button onClick={() => openModal('inventory')}
                    className="flex items-center gap-3 bg-gradient-to-r from-blue-900 to-blue-700 text-white px-8 py-4 rounded-2xl font-bold text-xl hover:scale-105 transition min-h-[56px]">
                    <Plus size={28} /> {t.addItem}
                  </button>
                )}
              </div>
            </div>

            {/* Category filter pills */}
            <div className="flex gap-2 flex-wrap mb-6">
              {inventoryCategories.map(cat => (
                <button key={cat} onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2 rounded-full font-bold text-sm transition min-h-[40px] ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-400'
                  }`}>
                  {cat === 'all' ? t.allCategories : cat}
                  <span className="ml-2 opacity-70 font-normal">
                    ({inventory.filter(i => cat === 'all' ? true : (i.category || '') === cat).length})
                  </span>
                </button>
              ))}
              {inventory.some(i => !i.category) && (
                <button onClick={() => setSelectedCategory('__none__')}
                  className={`px-5 py-2 rounded-full font-bold text-sm transition min-h-[40px] ${
                    selectedCategory === '__none__'
                      ? 'bg-gray-600 text-white shadow-lg'
                      : 'bg-white text-gray-500 border-2 border-gray-200 hover:border-gray-400'
                  }`}>
                  {t.uncategorized} ({inventory.filter(i => !i.category).length})
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredInventory.map(item => (
                <div key={item.id} className="bg-white rounded-3xl shadow-xl p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-2xl font-bold leading-tight">{item.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ml-2 flex-shrink-0 ${
                      item.status === 'available' ? 'bg-slate-100 text-slate-600' :
                      item.status === 'rented' ? 'bg-sky-100 text-sky-700' :
                      item.status === 'cleaning' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'}`}>
                      {t[item.status] || item.status}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-1">{t.size}: <b>{item.size}</b></p>
                  {item.category && <p className="text-gray-600 mb-1">{t.category}: <b>{item.category}</b></p>}
                  <p className="text-gray-500 text-sm mb-1">RFID: {item.rfid || '—'}</p>
                  <p className="text-3xl font-bold text-blue-700 my-3">${item.price}</p>
                  {currentStoreId === 'all' && (
                    <p className="text-xs text-blue-600 mb-3">{getStoreName(item.store_id)}</p>
                  )}
                  {hasPermission('edit') && (
                    <div className="flex gap-2 mt-4">
                      <button onClick={() => openModal('inventory', item)}
                        className="flex-1 bg-blue-800 text-white px-4 py-4 rounded-2xl font-bold hover:bg-blue-900 min-h-[56px]">
                        {t.edit}
                      </button>
                      {hasPermission('delete') && (
                        <button onClick={() => deleteItem('inventory', item.id)}
                          className="bg-rose-600 text-white px-4 py-4 rounded-2xl font-bold hover:bg-rose-700 min-h-[56px]">
                          <Trash2 size={22} />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
            {filteredInventory.length === 0 && (
              <div className="text-center py-16 text-gray-400 text-xl bg-white rounded-3xl shadow-xl">{t.noData}</div>
            )}
          </div>
        )}

        {/* ════ BILLING ═════════════════════════════════════════════════════ */}
        {activeTab === 'billing' && (
          <div className="space-y-8">
            <h2 className="text-4xl font-bold">{t.billing}</h2>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { label: t.totalRevenue, value: `$${totalRevenue.toFixed(2)}`, color: 'from-blue-700 to-blue-900' },
                { label: t.totalCollected, value: `$${totalCollected.toFixed(2)}`, color: 'from-blue-600 to-blue-800' },
                { label: t.totalOutstanding, value: `$${totalOutstanding.toFixed(2)}`, color: 'from-rose-500 to-rose-700' },
              ].map(c => (
                <div key={c.label} className={`bg-gradient-to-r ${c.color} text-white rounded-3xl p-8 shadow-xl`}>
                  <div className="text-4xl font-bold">{c.value}</div>
                  <div className="text-lg mt-2 opacity-90">{c.label}</div>
                </div>
              ))}
            </div>

            {/* Add Payment */}
            {hasPermission('edit') && (
              <div className="bg-white rounded-3xl shadow-xl p-8">
                <h3 className="text-2xl font-bold mb-6">{t.addPayment}</h3>
                <div className="flex gap-4 flex-wrap items-end">
                  <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm font-bold mb-2">{t.customer}</label>
                    <select value={billingRentalId} onChange={e => setBillingRentalId(e.target.value)}
                      className="w-full px-4 py-4 border-2 rounded-2xl text-lg min-h-[56px]">
                      <option value="">{t.selectStore}…</option>
                      {rentals.filter(r => getRentalBalance(r) > 0).map(r => (
                        <option key={r.id} value={r.id}>
                          {r.customers?.name} — ${getRentalBalance(r).toFixed(2)} {t.balance}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="min-w-[140px]">
                    <label className="block text-sm font-bold mb-2">{t.amount}</label>
                    <input type="number" step="0.01" placeholder="0.00" value={billingAmount}
                      onChange={e => setBillingAmount(e.target.value)}
                      className="w-full px-4 py-4 border-2 rounded-2xl text-lg min-h-[56px]" />
                  </div>
                  <div className="min-w-[140px]">
                    <label className="block text-sm font-bold mb-2">{t.paymentMethod}</label>
                    <select value={billingMethod} onChange={e => setBillingMethod(e.target.value)}
                      className="w-full px-4 py-4 border-2 rounded-2xl text-lg min-h-[56px]">
                      <option value="cash">{t.cash}</option>
                      <option value="card">{t.card}</option>
                      <option value="check">{t.check}</option>
                      <option value="other">{t.other}</option>
                    </select>
                  </div>
                  <button
                    onClick={() => billingRentalId && billingAmount && addPayment(billingRentalId, billingAmount, billingMethod)}
                    className="bg-green-600 text-white px-8 py-4 rounded-2xl font-bold text-xl hover:bg-green-700 min-h-[56px]">
                    <CreditCard size={22} className="inline mr-2" /> {t.addPayment}
                  </button>
                </div>
              </div>
            )}

            {/* Outstanding Rentals */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
              <div className="px-8 py-6 bg-gradient-to-r from-rose-600 to-rose-700 text-white">
                <h3 className="text-2xl font-bold">{t.overdueBalances}</h3>
              </div>
              <table className="w-full text-base">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left font-bold">{t.customer}</th>
                    <th className="px-6 py-4 text-left font-bold">{t.eventDate}</th>
                    <th className="px-6 py-4 text-left font-bold">{t.returnDate}</th>
                    <th className="px-6 py-4 text-left font-bold">{t.total}</th>
                    <th className="px-6 py-4 text-left font-bold">{t.paidAmount}</th>
                    <th className="px-6 py-4 text-left font-bold">{t.balance}</th>
                    <th className="px-6 py-4 text-left font-bold">{t.status}</th>
                  </tr>
                </thead>
                <tbody>
                  {rentals.filter(r => getRentalBalance(r) > 0.01).map(r => {
                    const bal = getRentalBalance(r);
                    return (
                      <tr key={r.id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-5 font-bold">{r.customers?.name}</td>
                        <td className="px-6 py-5">{r.event_date || '—'}</td>
                        <td className="px-6 py-5">{r.return_date}</td>
                        <td className="px-6 py-5">${r.total?.toFixed(2)}</td>
                        <td className="px-6 py-5">${r.paid_amount?.toFixed(2)}</td>
                        <td className="px-6 py-5 font-bold text-rose-600">${bal.toFixed(2)}</td>
                        <td className="px-6 py-5">
                          <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                            r.status === 'reserved' ? 'bg-blue-100 text-blue-800' :
                            r.status === 'picked_up' ? 'bg-sky-100 text-sky-700' :
                            r.status === 'returned' ? 'bg-slate-100 text-slate-600' :
                            'bg-gray-100 text-gray-800'}`}>
                            {t[r.status] || r.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {rentals.filter(r => getRentalBalance(r) > 0.01).length === 0 && (
                <div className="text-center py-12 text-gray-400 text-xl">{language === 'es' ? '¡Todos los saldos están al día!' : 'All balances are settled!'}</div>
              )}
            </div>

            {/* Recent Payments */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
              <div className="px-8 py-6 bg-gradient-to-r from-blue-900 to-blue-700 text-white">
                <h3 className="text-2xl font-bold">{t.recentPayments}</h3>
              </div>
              <table className="w-full text-base">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left font-bold">{t.customer}</th>
                    <th className="px-6 py-4 text-left font-bold">{t.amount}</th>
                    <th className="px-6 py-4 text-left font-bold">{t.paymentMethod}</th>
                    <th className="px-6 py-4 text-left font-bold">{t.paymentDate}</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.slice(0, 30).map(p => {
                    const rental = rentals.find(r => r.id === p.rental_id);
                    return (
                      <tr key={p.id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-5 font-bold">{rental?.customers?.name || '—'}</td>
                        <td className="px-6 py-5 text-emerald-600 font-bold">${p.amount?.toFixed(2)}</td>
                        <td className="px-6 py-5">{t[p.payment_method] || p.payment_method}</td>
                        <td className="px-6 py-5">{p.payment_date}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {payments.length === 0 && (
                <div className="text-center py-12 text-gray-400 text-xl">{t.noData}</div>
              )}
            </div>
          </div>
        )}

        {/* ════ ANALYTICS ═══════════════════════════════════════════════════ */}
        {activeTab === 'analytics' && profile?.role !== 'staff' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <h2 className="text-4xl font-bold">{t.analytics}</h2>
              <div className="flex gap-2 flex-wrap">
                {[['thisWeek', t.thisWeek], ['thisMonth', t.thisMonth], ['thisYear', t.thisYear], ['allTime', t.allTime]].map(([val, label]) => (
                  <button key={val} onClick={() => setAnalyticsFilter(val)}
                    className={`px-6 py-3 rounded-2xl font-bold text-base min-h-[48px] transition ${
                      analyticsFilter === val ? 'bg-blue-900 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>
                    {label}
                  </button>
                ))}
                <button onClick={handlePrintAnalytics}
                  className="px-6 py-3 rounded-2xl font-bold text-base min-h-[48px] bg-gradient-to-r from-blue-900 to-blue-700 text-white hover:opacity-90 transition flex items-center gap-2">
                  <Printer size={20} /> {t.printReport}
                </button>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: t.totalRentals, value: getFilteredRentals().length, icon: Calendar, color: 'blue' },
                { label: t.totalRevenue, value: `$${getFilteredRentals().reduce((s, r) => s + (r.total || 0), 0).toFixed(0)}`, icon: DollarSign, color: 'green' },
                { label: t.avgRental, value: getFilteredRentals().length ? `$${(getFilteredRentals().reduce((s, r) => s + (r.total || 0), 0) / getFilteredRentals().length).toFixed(0)}` : '$0', icon: TrendingUp, color: 'purple' },
                { label: t.outstanding, value: `$${totalOutstanding.toFixed(0)}`, icon: AlertCircle, color: 'orange' },
              ].map(card => {
                const Icon = card.icon;
                const colorMap = { blue: 'from-blue-800 to-blue-900', green: 'from-blue-700 to-blue-500', purple: 'from-sky-700 to-blue-800', orange: 'from-rose-600 to-rose-700' };
                return (
                  <div key={card.label} className={`bg-gradient-to-r ${colorMap[card.color]} text-white rounded-3xl p-6 shadow-xl`}>
                    <Icon size={36} className="mb-3 opacity-80" />
                    <div className="text-4xl font-bold">{card.value}</div>
                    <div className="text-base mt-1 opacity-90">{card.label}</div>
                  </div>
                );
              })}
            </div>

            {/* Operational KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: t.utilizationRate, value: getUtilizationRate(), icon: Package, color: 'from-blue-700 to-blue-900', tip: language === 'es' ? '% del inventario actualmente fuera' : '% of inventory currently out' },
                { label: t.collectionRate, value: getCollectionRate(), icon: CreditCard, color: 'from-blue-600 to-blue-800', tip: language === 'es' ? '% del total facturado cobrado' : '% of billed revenue collected' },
                { label: t.avgDuration, value: `${getAvgRentalDuration()} ${language === 'es' ? 'días' : 'days'}`, icon: Clock, color: 'from-sky-600 to-blue-700', tip: language === 'es' ? 'Días promedio por renta' : 'Avg days per rental' },
                { label: t.lateReturnRate, value: getLateReturnRate(), icon: AlertCircle, color: 'from-rose-500 to-rose-700', tip: language === 'es' ? '% de rentas devueltas tarde' : '% of rentals returned late' },
              ].map(card => {
                const Icon = card.icon;
                return (
                  <div key={card.label} className={`bg-gradient-to-r ${card.color} text-white rounded-3xl p-6 shadow-xl`} title={card.tip}>
                    <Icon size={36} className="mb-3 opacity-80" />
                    <div className="text-4xl font-bold">{card.value}</div>
                    <div className="text-base mt-1 opacity-90">{card.label}</div>
                  </div>
                );
              })}
            </div>

            {/* Revenue Chart */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h3 className="text-2xl font-bold mb-6">
                {analyticsFilter === 'thisWeek' ? t.weeklyRevenue : t.revenueOverTime}
              </h3>
              {analyticsFilter === 'thisWeek' ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={getWeeklyData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis yAxisId="left" tickFormatter={v => `$${v}`} />
                    <YAxis yAxisId="right" orientation="right" allowDecimals={false} />
                    <Tooltip formatter={(v, name) => name === t.totalRevenue ? `$${v.toFixed(2)}` : v} />
                    <Legend />
                    <Bar yAxisId="left" dataKey="revenue" fill="#6366f1" name={t.totalRevenue} radius={[6,6,0,0]} />
                    <Bar yAxisId="right" dataKey="count" fill="#10b981" name={t.totalRentals} radius={[6,6,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : getRevenueData().length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={getRevenueData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={v => `$${v}`} />
                    <Tooltip formatter={v => `$${v.toFixed(2)}`} />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} dot={{ r: 5 }} name={t.totalRevenue} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-16 text-gray-400">{t.noData}</div>
              )}
            </div>

            {/* Inventory Utilization */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                <h3 className="text-2xl font-bold">{t.inventoryUtilization}</h3>
                <div className="flex flex-wrap gap-2 items-center">
                  <select
                    value={utilizationCategory}
                    onChange={e => { setUtilizationCategory(e.target.value); setUtilizationLimit(10); }}
                    className="px-4 py-2 border-2 rounded-xl text-sm font-medium min-h-[40px]"
                  >
                    <option value="all">{t.allCategories}</option>
                    {Array.from(new Set(inventory.map(i => i.category || '').filter(Boolean))).sort().map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <select
                    value={utilizationLimit}
                    onChange={e => setUtilizationLimit(Number(e.target.value))}
                    className="px-4 py-2 border-2 rounded-xl text-sm font-medium min-h-[40px]"
                  >
                    <option value={10}>Top 10</option>
                    <option value={25}>Top 25</option>
                    <option value={50}>Top 50</option>
                    <option value={0}>{language === 'es' ? 'Todos' : 'All'}</option>
                  </select>
                </div>
              </div>
              {getInventoryUtilization(utilizationCategory, utilizationLimit).some(i => i.times > 0) ? (
                <ResponsiveContainer width="100%" height={Math.max(300, getInventoryUtilization(utilizationCategory, utilizationLimit).length * 28)}>
                  <BarChart data={getInventoryUtilization(utilizationCategory, utilizationLimit)} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" allowDecimals={false} />
                    <YAxis type="category" dataKey="name" width={140} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="times" fill="#6366f1" name={t.timesRented} radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-16 text-gray-400">{t.noData}</div>
              )}
              <div className="mt-3 text-sm text-gray-400 text-right">
                {(() => {
                  const total = getInventoryUtilization(utilizationCategory, 0).length;
                  const shown = getInventoryUtilization(utilizationCategory, utilizationLimit).length;
                  return `${language === 'es' ? 'Mostrando' : 'Showing'} ${shown} ${language === 'es' ? 'de' : 'of'} ${total} ${language === 'es' ? 'artículos' : 'items'}`;
                })()}
              </div>
            </div>

            {/* Status Breakdown + Payment Method */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-3xl shadow-xl p-8">
                <h3 className="text-2xl font-bold mb-6">{t.rentalsByStatus}</h3>
                {getRentalsByStatus().length > 0 ? (
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={getRentalsByStatus()} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                      <XAxis type="number" allowDecimals={false} />
                      <YAxis type="category" dataKey="status" width={90} tick={{ fontSize: 13 }} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#6366f1" name={t.totalRentals} radius={[0,6,6,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center py-16 text-gray-400">{t.noData}</div>
                )}
              </div>

              <div className="bg-white rounded-3xl shadow-xl p-8">
                <h3 className="text-2xl font-bold mb-6">{t.paymentMethodBreakdown}</h3>
                {getPaymentMethodBreakdown().length > 0 ? (
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={getPaymentMethodBreakdown()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="method" />
                      <YAxis tickFormatter={v => `$${v}`} />
                      <Tooltip formatter={v => `$${v.toFixed(2)}`} />
                      <Bar dataKey="revenue" fill="#10b981" name={t.totalRevenue} radius={[6,6,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center py-16 text-gray-400">{t.noData}</div>
                )}
              </div>
            </div>

            {/* Rentals by Day of Week */}
            {analyticsFilter !== 'thisWeek' && (
              <div className="bg-white rounded-3xl shadow-xl p-8">
                <h3 className="text-2xl font-bold mb-6">{t.rentalsByDay}</h3>
                {getRentalsByDayOfWeek().some(d => d.count > 0) ? (
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={getRentalsByDayOfWeek()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#f59e0b" name={t.totalRentals} radius={[6,6,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center py-16 text-gray-400">{t.noData}</div>
                )}
              </div>
            )}

            {/* Top Customers + Overdue */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                <div className="px-8 py-6 bg-gradient-to-r from-blue-900 to-blue-700 text-white">
                  <h3 className="text-2xl font-bold flex items-center gap-3"><Award size={28} /> {t.topCustomers}</h3>
                </div>
                <table className="w-full text-base">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left font-bold">#</th>
                      <th className="px-6 py-4 text-left font-bold">{t.name}</th>
                      <th className="px-6 py-4 text-left font-bold">{t.totalRentals}</th>
                      <th className="px-6 py-4 text-left font-bold">{t.totalRevenue}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getTopCustomers().map((c, i) => (
                      <tr key={c.name} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4 font-bold text-gray-500">#{i + 1}</td>
                        <td className="px-6 py-4 font-bold">{c.name}</td>
                        <td className="px-6 py-4">{c.count}</td>
                        <td className="px-6 py-4 font-bold text-green-700">${c.total.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {getTopCustomers().length === 0 && <div className="text-center py-12 text-gray-400">{t.noData}</div>}
              </div>

              <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                <div className="px-8 py-6 bg-gradient-to-r from-rose-600 to-rose-700 text-white">
                  <h3 className="text-2xl font-bold flex items-center gap-3"><AlertCircle size={28} /> {t.overdueBalances}</h3>
                </div>
                <table className="w-full text-base">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left font-bold">{t.customer}</th>
                      <th className="px-6 py-4 text-left font-bold">{t.returnDate}</th>
                      <th className="px-6 py-4 text-left font-bold">{t.balance}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getOverdueRentals().map(r => (
                      <tr key={r.id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4 font-bold">{r.customers?.name}</td>
                        <td className="px-6 py-4 text-rose-600">{r.return_date}</td>
                        <td className="px-6 py-4 font-bold text-rose-600">${r.balance.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {getOverdueRentals().length === 0 && <div className="text-center py-12 text-gray-400">{language === 'es' ? 'Sin atrasos' : 'No overdue rentals'}</div>}
              </div>
            </div>
          </div>
        )}

        {/* ════ DRY CLEANER ═════════════════════════════════════════════════ */}
        {activeTab === 'cleaner' && (
          <div>
            <div className="flex justify-between items-center mb-8 gap-4 flex-wrap">
              <h2 className="text-4xl font-bold">{t.cleaningTracker}</h2>
              <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white rounded-2xl px-8 py-4 text-xl font-bold">
                {inventory.filter(i => i.status === 'cleaning').length} {t.atCleaner}
              </div>
            </div>

            {inventory.filter(i => i.status === 'cleaning').length === 0 ? (
              <div className="text-center py-20 text-gray-400 text-xl bg-white rounded-3xl shadow-xl">
                <Package size={64} className="mx-auto mb-4 opacity-40" />
                {t.noItemsCleaning}
              </div>
            ) : (
              <div className="bg-white rounded-3xl shadow-xl overflow-x-auto">
                <table className="w-full text-base">
                  <thead className="bg-gradient-to-r from-blue-900 to-blue-700 text-white">
                    <tr>
                      <th className="px-6 py-5 text-left font-bold">{t.item}</th>
                      <th className="px-6 py-5 text-left font-bold">{t.size}</th>
                      <th className="px-6 py-5 text-left font-bold">{t.category}</th>
                      <th className="px-6 py-5 text-left font-bold">{t.fromRental}</th>
                      <th className="px-6 py-5 text-left font-bold">{t.sentDate}</th>
                      {currentStoreId === 'all' && <th className="px-6 py-5 text-left font-bold">{t.store}</th>}
                      <th className="px-6 py-5 text-left font-bold">{t.actions}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventory.filter(i => i.status === 'cleaning').map(item => {
                      const lastRental = rentals.find(r =>
                        r.item_ids?.includes(item.id) && r.status === 'returned'
                      );
                      return (
                        <tr key={item.id} className="border-b hover:bg-blue-50">
                          <td className="px-6 py-5 font-bold">{item.name}</td>
                          <td className="px-6 py-5">{item.size}</td>
                          <td className="px-6 py-5">{item.category || '—'}</td>
                          <td className="px-6 py-5">
                            {lastRental ? (
                              <span>
                                <span className="font-bold">{lastRental.customers?.name}</span>
                                <span className="text-gray-400 text-sm ml-2">({lastRental.return_date})</span>
                              </span>
                            ) : '—'}
                          </td>
                          <td className="px-6 py-5 text-gray-500">
                            {item.updated_at ? new Date(item.updated_at).toLocaleDateString() : '—'}
                          </td>
                          {currentStoreId === 'all' && <td className="px-6 py-5">{getStoreName(item.store_id)}</td>}
                          <td className="px-6 py-5">
                            {hasPermission('edit') && (
                              <button onClick={() => markCleaningReturned(item.id)}
                                className="bg-blue-800 text-white px-5 py-3 rounded-2xl font-bold hover:bg-blue-900 min-h-[48px]">
                                {t.markReturned}
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ════ STORES ══════════════════════════════════════════════════════ */}
        {activeTab === 'stores' && profile?.role === 'admin' && (
          <div>
            <div className="flex justify-between items-center mb-8 gap-4">
              <h2 className="text-4xl font-bold">{t.storeManagement}</h2>
              <button onClick={() => openModal('store')}
                className="flex items-center gap-3 bg-gradient-to-r from-blue-900 to-blue-700 text-white px-8 py-4 rounded-2xl font-bold text-xl hover:scale-105 transition min-h-[56px]">
                <Plus size={28} /> {t.addStore}
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {stores.map(store => (
                <div key={store.id} className="bg-white rounded-3xl shadow-xl p-8">
                  {store.logo_url && (
                    <img src={store.logo_url} alt="logo" className="h-16 object-contain mb-4 rounded-xl" />
                  )}
                  <h3 className="text-2xl font-bold mb-2">{store.name}</h3>
                  {store.address && (
                    <p className="text-gray-600 flex items-center gap-2 mb-1 text-sm">
                      <MapPin size={16} /> {store.address}
                    </p>
                  )}
                  {store.phone && (
                    <p className="text-gray-600 flex items-center gap-2 mb-3 text-sm">
                      <Phone size={16} /> {store.phone}
                    </p>
                  )}
                  <div className="flex gap-2">
                    <button onClick={() => openModal('store', store)}
                      className="flex-1 bg-blue-800 text-white px-4 py-4 rounded-2xl font-bold hover:bg-blue-900 min-h-[56px]">
                      {t.edit}
                    </button>
                    <button onClick={() => deleteItem('stores', store.id)}
                      className="bg-rose-600 text-white px-4 py-4 rounded-2xl font-bold hover:bg-rose-700 min-h-[56px]">
                      <Trash2 size={22} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {stores.length === 0 && (
              <div className="text-center py-20 text-gray-400 text-xl bg-white rounded-3xl shadow-xl">
                <Building2 size={64} className="mx-auto mb-4 opacity-40" />
                {language === 'es' ? 'No hay tiendas configuradas. ¡Agrega la primera!' : 'No stores configured yet. Add your first store!'}
              </div>
            )}
          </div>
        )}

        {/* ════ USERS ═══════════════════════════════════════════════════════ */}
        {activeTab === 'users' && profile?.role === 'admin' && (
          <div>
            <div className="flex justify-between items-center mb-8 gap-4 flex-wrap">
              <h2 className="text-4xl font-bold">{t.userManagement}</h2>
              <div className="flex gap-3 items-center flex-wrap">
                <input type="text" placeholder={`${t.search}…`} value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="px-6 py-4 border-2 rounded-2xl text-lg min-h-[56px] w-60" />
                <button onClick={() => openModal('user')}
                  className="flex items-center gap-3 bg-gradient-to-r from-blue-900 to-blue-700 text-white px-8 py-4 rounded-2xl font-bold text-xl hover:scale-105 transition min-h-[56px]">
                  <Plus size={28} /> {t.addUser}
                </button>
              </div>
            </div>
            <div className="bg-white rounded-3xl shadow-xl overflow-x-auto">
              <table className="w-full text-base">
                <thead className="bg-gradient-to-r from-blue-900 to-blue-700 text-white">
                  <tr>
                    <th className="px-6 py-5 text-left font-bold">{t.email}</th>
                    <th className="px-6 py-5 text-left font-bold">{t.role}</th>
                    <th className="px-6 py-5 text-left font-bold">{language === 'es' ? 'Creado' : 'Created'}</th>
                    <th className="px-6 py-5 text-left font-bold">{t.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(u => (
                    <tr key={u.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-5 font-bold">{u.email}</td>
                      <td className="px-6 py-5">
                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                          u.role === 'admin' ? 'bg-blue-100 text-blue-800' :
                          u.role === 'staff' ? 'bg-sky-100 text-sky-700' :
                          'bg-gray-100 text-gray-800'}`}>
                          {t[u.role] || u.role}
                        </span>
                      </td>
                      <td className="px-6 py-5">{new Date(u.created_at).toLocaleDateString()}</td>
                      <td className="px-6 py-5">
                        <div className="flex gap-2">
                          <button onClick={() => openModal('user', u)}
                            className="text-blue-700 p-3 rounded-xl hover:bg-blue-50 min-h-[48px] min-w-[48px] flex items-center justify-center">
                            <Edit2 size={22} />
                          </button>
                          {u.id !== user.id && (
                            <button onClick={() => deleteItem('profiles', u.id)}
                              className="text-rose-600 p-3 rounded-xl hover:bg-rose-50 min-h-[48px] min-w-[48px] flex items-center justify-center">
                              <Trash2 size={22} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* ── Quick Pay Modal ───────────────────────────────────────────────── */}
      {quickPayRental && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold">{t.payBalance}</h2>
              <button onClick={() => { setQuickPayRental(null); setQuickPayOnComplete(null); }} className="text-gray-400 hover:text-red-600 p-2">
                <X size={36} />
              </button>
            </div>
            <p className="text-lg text-gray-600 mb-2">{quickPayRental.customers?.name}</p>
            <p className="text-4xl font-bold text-rose-600 mb-6">
              {t.balanceDue}: ${getRentalBalance(quickPayRental).toFixed(2)}
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-base font-bold mb-2">{t.paymentMethod}</label>
                <div className="grid grid-cols-2 gap-3">
                  {['cash', 'card', 'check', 'other'].map(m => (
                    <button key={m} onClick={() => setQuickPayMethod(m)}
                      className={`py-4 rounded-2xl font-bold text-lg border-2 transition ${quickPayMethod === m ? 'bg-green-600 text-white border-green-600' : 'border-gray-300 hover:border-green-400'}`}>
                      {t[m]}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={async () => {
                const balance = getRentalBalance(quickPayRental);
                if (balance <= 0) { setQuickPayRental(null); setQuickPayOnComplete(null); return; }
                await addPayment(quickPayRental.id, balance, quickPayMethod);
                if (quickPayOnComplete) { await quickPayOnComplete(); setQuickPayOnComplete(null); }
                setQuickPayRental(null);
              }}
                className="w-full bg-green-600 text-white py-5 rounded-2xl font-bold text-2xl hover:bg-green-700 transition">
                {t.payNow} ${getRentalBalance(quickPayRental).toFixed(2)}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal ─────────────────────────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-8 lg:p-12 max-w-3xl w-full my-4 shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-4xl font-bold">
                {modalType === 'customer' ? (formData.id ? `${t.edit} ${t.customer}` : t.addCustomer) :
                 modalType === 'inventory' ? (formData.id ? `${t.edit} ${t.inventory}` : t.addItem) :
                 modalType === 'user' ? (formData.id ? `${t.edit} ${t.users}` : t.addUser) :
                 modalType === 'store' ? (formData.id ? `${t.edit} ${t.stores}` : t.addStore) :
                 formData.id ? `${t.edit} ${t.rentals}` : t.newRental}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-red-600 p-2 min-h-[48px] min-w-[48px] flex items-center justify-center">
                <X size={48} />
              </button>
            </div>

            <form onSubmit={e => {
              e.preventDefault();
              if (modalType === 'customer') saveCustomer();
              else if (modalType === 'inventory') saveInventory();
              else if (modalType === 'user') saveUser();
              else if (modalType === 'store') saveStore();
              else saveRental();
            }} className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">

              {/* ── Customer Form ── */}
              {modalType === 'customer' && (
                <>
                  <input type="text" placeholder={t.name} value={formData.name || ''}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-6 py-5 border-2 rounded-2xl text-xl min-h-[60px]" required />
                  <input type="tel" placeholder={t.phone} value={formData.phone || ''}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-6 py-5 border-2 rounded-2xl text-xl min-h-[60px]" required />
                  <input type="email" placeholder={t.email} value={formData.email || ''}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-6 py-5 border-2 rounded-2xl text-xl min-h-[60px]" />
                  <input type="text" placeholder={t.address} value={formData.address || ''}
                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-6 py-5 border-2 rounded-2xl text-xl min-h-[60px]" />
                  {/* Measurements */}
                  <div className="border-2 rounded-2xl p-6 bg-gray-50">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-3"><Ruler size={24} /> {t.measurements}</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {[
                        ['jacketSize', t.jacketSize], ['chest', t.chest], ['waist', t.waist],
                        ['inseam', t.inseam], ['neck', t.neck], ['sleeve', t.sleeve],
                      ].map(([key, label]) => (
                        <div key={key}>
                          <label className="block text-sm font-bold mb-1">{label}</label>
                          <input type="text" placeholder={`e.g. 42`} value={formData[key] || ''}
                            onChange={e => setFormData({ ...formData, [key]: e.target.value })}
                            className="w-full px-4 py-3 border-2 rounded-xl text-lg min-h-[52px]" />
                        </div>
                      ))}
                    </div>
                  </div>
                  <textarea placeholder={t.customerNotes} value={formData.notes || ''}
                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-6 py-5 border-2 rounded-2xl text-xl" rows="3" />
                  <div>
                    <label className="block text-lg font-bold mb-2">{t.idPhoto}</label>
                    {(formData.idPhotoFile || formData.id_photo_url) && (
                      <img
                        src={formData.idPhotoFile ? URL.createObjectURL(formData.idPhotoFile) : formData.id_photo_url}
                        alt="ID Preview"
                        className="w-full max-h-48 object-cover rounded-2xl mb-3 border-2" />
                    )}
                    <div className="grid grid-cols-2 gap-3">
                      <label className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-4 rounded-2xl font-bold text-lg cursor-pointer hover:bg-blue-700 min-h-[56px]">
                        📷 {language === 'es' ? 'Tomar Foto' : 'Take Photo'}
                        <input type="file" accept="image/*" capture="environment" className="hidden"
                          onChange={e => setFormData({ ...formData, idPhotoFile: e.target.files[0] })} />
                      </label>
                      <label className="flex items-center justify-center gap-2 bg-gray-200 text-gray-800 px-4 py-4 rounded-2xl font-bold text-lg cursor-pointer hover:bg-gray-300 min-h-[56px]">
                        📁 {language === 'es' ? 'Subir Archivo' : 'Upload File'}
                        <input type="file" accept="image/*" className="hidden"
                          onChange={e => setFormData({ ...formData, idPhotoFile: e.target.files[0] })} />
                      </label>
                    </div>
                  </div>
                </>
              )}

              {/* ── Inventory Form ── */}
              {modalType === 'inventory' && (
                <>
                  <input type="text" placeholder={t.name} value={formData.name || ''}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-6 py-5 border-2 rounded-2xl text-xl min-h-[60px]" required />
                  <input type="text" placeholder={t.size} value={formData.size || ''}
                    onChange={e => setFormData({ ...formData, size: e.target.value })}
                    className="w-full px-6 py-5 border-2 rounded-2xl text-xl min-h-[60px]" required />
                  <div>
                    <label className="block text-base font-bold mb-2">{t.category}</label>
                    <input type="text" list="category-options" placeholder={t.category} value={formData.category || ''}
                      onChange={e => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-6 py-5 border-2 rounded-2xl text-xl min-h-[60px]" />
                    <datalist id="category-options">
                      {inventoryCategories.filter(c => c !== 'all').map(c => <option key={c} value={c} />)}
                    </datalist>
                  </div>
                  <input type="text" placeholder="RFID" value={formData.rfid || ''}
                    onChange={e => setFormData({ ...formData, rfid: e.target.value })}
                    className="w-full px-6 py-5 border-2 rounded-2xl text-xl min-h-[60px]" />
                  <input type="number" step="0.01" placeholder={t.price} value={formData.price || ''}
                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-6 py-5 border-2 rounded-2xl text-xl min-h-[60px]" required />
                  {/* Store assignment */}
                  <div>
                    <label className="block text-lg font-bold mb-2">{t.store}</label>
                    <select value={formData.store_id || (currentStoreId !== 'all' ? currentStoreId : '')}
                      onChange={e => setFormData({ ...formData, store_id: e.target.value })}
                      className="w-full px-6 py-5 border-2 rounded-2xl text-xl min-h-[60px]">
                      <option value="">{t.selectStore}</option>
                      {stores.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>
                  {formData.id && (
                    <select value={formData.status || 'available'}
                      onChange={e => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-6 py-5 border-2 rounded-2xl text-xl min-h-[60px]">
                      <option value="available">{t.available}</option>
                      <option value="rented">{t.rented}</option>
                      <option value="cleaning">{t.cleaning}</option>
                      <option value="maintenance">{t.maintenance}</option>
                    </select>
                  )}
                  <textarea placeholder={t.notes} value={formData.notes || ''}
                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-6 py-5 border-2 rounded-2xl text-xl" rows="2" />
                </>
              )}

              {/* ── Store Form ── */}
              {modalType === 'store' && (
                <>
                  <input type="text" placeholder={t.storeName} value={formData.name || ''}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-6 py-5 border-2 rounded-2xl text-xl min-h-[60px]" required />
                  <input type="text" placeholder={t.storeAddress} value={formData.address || ''}
                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-6 py-5 border-2 rounded-2xl text-xl min-h-[60px]" />
                  <input type="tel" placeholder={t.storePhone} value={formData.phone || ''}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-6 py-5 border-2 rounded-2xl text-xl min-h-[60px]" />
                  <div>
                    <label className="block text-lg font-bold mb-2">{t.storeLogo}</label>
                    {formData.logo_url && <img src={formData.logo_url} alt="logo" className="h-16 mb-3 rounded-xl object-contain border" />}
                    <input type="file" accept="image/*"
                      onChange={e => setFormData({ ...formData, logoFile: e.target.files[0] })}
                      className="w-full px-6 py-4 border-2 rounded-2xl text-lg min-h-[56px]" />
                  </div>
                  <div>
                    <label className="block text-lg font-bold mb-2">{t.termsAndConditions}</label>
                    <textarea
                      placeholder={t.termsAndConditions}
                      value={formData.terms_and_conditions || ''}
                      onChange={e => setFormData({ ...formData, terms_and_conditions: e.target.value })}
                      className="w-full px-6 py-4 border-2 rounded-2xl text-base" rows="5" />
                  </div>
                </>
              )}

              {/* ── User Form ── */}
              {modalType === 'user' && (
                <>
                  {!formData.id && (
                    <>
                      <input type="email" placeholder={t.email} value={formData.email || ''}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-6 py-5 border-2 rounded-2xl text-xl min-h-[60px]" required />
                      <input type="password" placeholder={t.password} value={formData.password || ''}
                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                        className="w-full px-6 py-5 border-2 rounded-2xl text-xl min-h-[60px]" required minLength={6} />
                    </>
                  )}
                  <select value={formData.role || 'viewer'}
                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-6 py-5 border-2 rounded-2xl text-xl min-h-[60px]" required>
                    <option value="admin">{t.admin}</option>
                    <option value="staff">{t.staff}</option>
                    <option value="viewer">{t.viewer}</option>
                  </select>
                </>
              )}

              {/* ── Rental Form ── */}
              {modalType === 'rental' && (
                <>
                  <div>
                    <label className="block text-lg font-bold mb-2">{t.customer}</label>
                    <select value={formData.customer_id || ''}
                      onChange={e => {
                        const cust = customers.find(c => c.id === e.target.value);
                        setFormData({ ...formData, customer_id: e.target.value, measurements: cust?.measurements || {} });
                      }}
                      className="w-full px-6 py-5 border-2 rounded-2xl text-xl min-h-[60px]" required>
                      <option value="">— {t.customer} —</option>
                      {customers.map(c => <option key={c.id} value={c.id}>{c.name} · {c.phone}</option>)}
                    </select>
                  </div>

                  {formData.customer_id && (
                    <div className="border-2 border-blue-200 rounded-2xl p-5 bg-blue-50">
                      <h3 className="text-base font-bold text-blue-800 mb-3 flex items-center gap-2">
                        <Ruler size={18} /> {t.measurements}
                        <span className="text-xs font-normal text-blue-500 ml-1">({language === 'es' ? 'cambios actualizan el perfil del cliente' : 'changes update the customer profile'})</span>
                      </h3>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { key: 'chest', label: t.chest },
                          { key: 'waist', label: t.waist },
                          { key: 'inseam', label: t.inseam },
                          { key: 'jacketSize', label: t.jacketSize },
                          { key: 'neck', label: t.neck },
                          { key: 'sleeve', label: t.sleeve },
                        ].map(({ key, label }) => (
                          <div key={key}>
                            <label className="block text-xs font-bold text-blue-700 mb-1">{label}</label>
                            <div className="relative">
                              <input type="number" step="0.25" min="0" placeholder="—"
                                value={formData.measurements?.[key] || ''}
                                onChange={e => setFormData({ ...formData, measurements: { ...(formData.measurements || {}), [key]: e.target.value } })}
                                className="w-full px-3 py-3 border-2 rounded-xl text-base pr-10 min-h-[48px]" />
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">{t.inches}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Store assignment in rental */}
                  <div>
                    <label className="block text-base font-bold mb-2">{t.store}</label>
                    <select value={formData.store_id || (currentStoreId !== 'all' ? currentStoreId : '')}
                      onChange={e => setFormData({ ...formData, store_id: e.target.value })}
                      className="w-full px-4 py-4 border-2 rounded-2xl text-lg min-h-[56px]">
                      <option value="">{t.selectStore}</option>
                      {stores.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-lg font-bold mb-2">{t.items}</label>
                    <div className="max-h-64 overflow-y-auto border-2 rounded-2xl p-4 space-y-2 bg-gray-50">
                      {inventory.filter(i => {
                        const rentalStoreId = formData.store_id || (currentStoreId !== 'all' ? currentStoreId : null);
                        const storeMatch = rentalStoreId ? i.store_id === rentalStoreId : true;
                        return storeMatch && (i.status === 'available' || selectedItems.includes(i.id));
                      }).map(item => (
                        <label key={item.id} className="flex items-center gap-4 cursor-pointer hover:bg-white p-3 rounded-xl transition min-h-[52px]">
                          <input type="checkbox" checked={selectedItems.includes(item.id)}
                            onChange={e => setSelectedItems(e.target.checked ? [...selectedItems, item.id] : selectedItems.filter(id => id !== item.id))}
                            className="w-6 h-6" />
                          <span className="text-base">{item.name} — {t.size} {item.size} — ${item.price}</span>
                        </label>
                      ))}
                    </div>
                    {selectedItems.length > 0 && (
                      <p className="mt-2 text-lg font-bold text-blue-600">
                        {selectedItems.length} {t.items} · {t.total}: ${selectedItems.reduce((s, id) => { const i = inventory.find(x => x.id === id); return s + (i?.price || 0); }, 0).toFixed(2)}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-base font-bold mb-2">{t.eventDate}</label>
                      <input type="date" value={formData.event_date || ''}
                        onChange={e => setFormData({ ...formData, event_date: e.target.value })}
                        className="w-full px-4 py-4 border-2 rounded-2xl text-lg min-h-[56px]" />
                    </div>
                    <div>
                      <label className="block text-base font-bold mb-2">{t.reservationDate}</label>
                      <input type="date" value={formData.reservation_date || today}
                        onChange={e => setFormData({ ...formData, reservation_date: e.target.value })}
                        className="w-full px-4 py-4 border-2 rounded-2xl text-lg min-h-[56px]" />
                    </div>
                    <div>
                      <label className="block text-base font-bold mb-2">{t.pickupDate}</label>
                      <input type="date" value={formData.pickup_date || ''}
                        onChange={e => setFormData({ ...formData, pickup_date: e.target.value })}
                        className="w-full px-4 py-4 border-2 rounded-2xl text-lg min-h-[56px]" required />
                    </div>
                    <div>
                      <label className="block text-base font-bold mb-2">{t.returnDate}</label>
                      <input type="date" value={formData.return_date || ''}
                        onChange={e => setFormData({ ...formData, return_date: e.target.value })}
                        className="w-full px-4 py-4 border-2 rounded-2xl text-lg min-h-[56px]" required />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-base font-bold mb-2">{t.paymentMethod}</label>
                      <select value={formData.payment_method || 'cash'}
                        onChange={e => setFormData({ ...formData, payment_method: e.target.value })}
                        className="w-full px-4 py-4 border-2 rounded-2xl text-lg min-h-[56px]">
                        <option value="cash">{t.cash}</option>
                        <option value="card">{t.card}</option>
                        <option value="check">{t.check}</option>
                        <option value="other">{t.other}</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-base font-bold mb-2">{t.deposit}</label>
                      <input type="number" step="0.01" placeholder="0.00" value={formData.deposit || ''}
                        onChange={e => setFormData({ ...formData, deposit: e.target.value })}
                        className="w-full px-4 py-4 border-2 rounded-2xl text-lg min-h-[56px]" />
                    </div>
                  </div>

                  {formData.id && (
                    <div>
                      <label className="block text-base font-bold mb-2">{t.status}</label>
                      <select value={formData.status || 'reserved'}
                        onChange={e => setFormData({ ...formData, status: e.target.value })}
                        className="w-full px-4 py-4 border-2 rounded-2xl text-lg min-h-[56px]">
                        <option value="reserved">{t.reserved}</option>
                        <option value="picked_up">{t.pickedUp}</option>
                        <option value="returned">{t.returned}</option>
                        <option value="cancelled">{t.cancelled}</option>
                      </select>
                    </div>
                  )}

                  <textarea placeholder={t.notes} value={formData.notes || ''}
                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-6 py-4 border-2 rounded-2xl text-xl" rows="3" />

                  {/* Alterations (edit mode only) */}
                  {formData.id && (
                    <div className="border-2 rounded-2xl p-6 bg-gray-50">
                      <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                        <Ruler size={24} /> {t.alterations}
                      </h3>
                      <div className="space-y-2 mb-4">
                        {alterations.filter(a => a.rental_id === formData.id).map(alt => (
                          <div key={alt.id} className="bg-white p-4 rounded-xl flex justify-between items-center">
                            <div>
                              <p className="font-bold">{alt.description}</p>
                              <p className="text-sm text-gray-600">${alt.cost} · {alt.status}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <input type="text" placeholder={language === 'es' ? 'Descripción' : 'Description'}
                          value={formData.alteration_description || ''}
                          onChange={e => setFormData({ ...formData, alteration_description: e.target.value })}
                          className="px-4 py-3 border-2 rounded-xl text-base min-h-[52px]" />
                        <input type="number" step="0.01" placeholder={t.price}
                          value={formData.alteration_cost || ''}
                          onChange={e => setFormData({ ...formData, alteration_cost: e.target.value })}
                          className="px-4 py-3 border-2 rounded-xl text-base min-h-[52px]" />
                      </div>
                      <button type="button" onClick={saveAlteration}
                        className="mt-3 w-full bg-blue-800 text-white px-6 py-4 rounded-2xl font-bold text-lg hover:bg-blue-900 min-h-[56px]">
                        {t.addAlteration}
                      </button>
                    </div>
                  )}
                </>
              )}

              <button type="submit"
                className="w-full bg-gradient-to-r from-blue-900 to-blue-700 text-white py-6 rounded-2xl font-bold text-2xl hover:scale-105 transition min-h-[64px] sticky bottom-0">
                <Save size={28} className="inline mr-3" /> {t.save}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
