'use client';

import React, { useState } from 'react';
import { Calendar, Users, Package, DollarSign, BarChart3, Search, Plus, X, Upload, AlertCircle, CheckCircle, Clock } from 'lucide-react';

const TuxedoAdminSystem = () => {
  const [currentUser, setCurrentUser] = useState({ id: 1, name: 'Admin User', role: 'admin' });
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const [users, setUsers] = useState([
    { id: 1, username: 'admin', password: 'admin123', name: 'Admin User', role: 'admin' },
    { id: 2, username: 'staff', password: 'staff123', name: 'Staff Member', role: 'staff' },
    { id: 3, username: 'viewer', password: 'viewer123', name: 'View Only', role: 'viewer' },
  ]);
  
  const [customers, setCustomers] = useState([
    { id: 1, name: 'John Smith', phone: '555-0101', email: 'john@email.com', totalRentals: 3, idType: 'Driver License', idNumber: 'DL123456', idPhoto: null },
    { id: 2, name: 'Sarah Johnson', phone: '555-0102', email: 'sarah@email.com', totalRentals: 1, idType: 'Passport', idNumber: 'P987654', idPhoto: null },
  ]);
  
  const [inventory, setInventory] = useState([
    { id: 1, name: 'Classic Black Tuxedo', size: '42R', category: 'Tuxedo', status: 'available', rfid: 'TUX001', price: 150 },
    { id: 2, name: 'Navy Slim Fit Suit', size: '40R', category: 'Suit', status: 'rented', rfid: 'SUIT001', price: 120 },
    { id: 3, name: 'Bow Tie - Black', size: 'OS', category: 'Accessory', status: 'available', rfid: 'ACC001', price: 15 },
    { id: 4, name: 'Dress Shoes', size: '10', category: 'Accessory', status: 'available', rfid: 'SHOE001', price: 30 },
  ]);
  
  const [rentals, setRentals] = useState([
    { 
      id: 1, 
      customerId: 2, 
      customerName: 'Sarah Johnson', 
      items: [2], 
      reservationDate: '2025-11-08',
      pickupDate: '2025-11-10', 
      returnDate: '2025-11-12', 
      status: 'reserved',
      total: 120, 
      deposit: 50,
      paid: 50 
    },
    { 
      id: 2, 
      customerId: 1, 
      customerName: 'John Smith', 
      items: [1, 3], 
      reservationDate: '2025-11-05',
      pickupDate: '2025-11-08', 
      returnDate: '2025-11-08', 
      status: 'out',
      total: 165, 
      deposit: 80,
      paid: 165 
    },
  ]);
  
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({});

  const today = '2025-11-08';

  const hasPermission = (action) => {
    if (currentUser.role === 'admin') return true;
    if (currentUser.role === 'staff' && action !== 'delete') return true;
    if (currentUser.role === 'viewer' && action === 'view') return true;
    return false;
  };

  const todayPickups = rentals.filter(r => r.pickupDate === today && r.status === 'reserved');
  const todayReturns = rentals.filter(r => r.returnDate === today && r.status === 'out');
  const overdueReturns = rentals.filter(r => r.returnDate < today && r.status === 'out');

  const openModal = (type, data = {}) => {
    setModalType(type);
    setFormData(data);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({});
  };

  const handleFileUpload = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({...formData, [fieldName]: reader.result});
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (modalType === 'customer') {
      if (formData.id) {
        setCustomers(customers.map(c => c.id === formData.id ? formData : c));
      } else {
        setCustomers([...customers, { ...formData, id: Date.now(), totalRentals: 0 }]);
      }
    } else if (modalType === 'inventory') {
      if (formData.id) {
        setInventory(inventory.map(i => i.id === formData.id ? formData : i));
      } else {
        setInventory([...inventory, { ...formData, id: Date.now(), status: 'available' }]);
      }
    } else if (modalType === 'rental') {
      const customer = customers.find(c => c.id === parseInt(formData.customerId));
      const selectedItems = formData.itemIds ? formData.itemIds.split(',').map(id => parseInt(id)) : [];
      const total = selectedItems.reduce((sum, itemId) => {
        const item = inventory.find(i => i.id === itemId);
        return sum + (item?.price || 0);
      }, 0);
      
      const newRental = {
        ...formData,
        id: Date.now(),
        customerName: customer?.name,
        items: selectedItems,
        status: 'reserved',
        total,
        deposit: parseFloat(formData.deposit) || 0,
        paid: parseFloat(formData.deposit) || 0
      };
      
      setRentals([...rentals, newRental]);
    } else if (modalType === 'payment') {
      const payment = parseFloat(formData.payment) || 0;
      setRentals(rentals.map(r => 
        r.id === formData.rentalId 
          ? { ...r, paid: r.paid + payment }
          : r
      ));
    } else if (modalType === 'user') {
      if (formData.id) {
        setUsers(users.map(u => u.id === formData.id ? formData : u));
      } else {
        setUsers([...users, { ...formData, id: Date.now() }]);
      }
    }
    
    closeModal();
  };

  const handlePickup = (rentalId) => {
    setRentals(rentals.map(r => {
      if (r.id === rentalId) {
        r.items.forEach(itemId => {
          setInventory(inventory.map(i => i.id === itemId ? { ...i, status: 'rented' } : i));
        });
        return { ...r, status: 'out' };
      }
      return r;
    }));
  };

  const handleCheckIn = (rentalId) => {
    const rental = rentals.find(r => r.id === rentalId);
    setRentals(rentals.map(r => r.id === rentalId ? { ...r, status: 'returned' } : r));
    rental.items.forEach(itemId => {
      setInventory(inventory.map(i => i.id === itemId ? { ...i, status: 'cleaning' } : i));
    });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const user = users.find(u => u.username === formData.username && u.password === formData.password);
    if (user) {
      setCurrentUser(user);
      setShowLoginModal(false);
      setFormData({});
    } else {
      alert('Invalid credentials');
    }
  };

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm)
  );

  const filteredInventory = inventory.filter(i =>
    i.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.rfid.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-slate-900 text-white p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Tuxedo Rental Admin</h1>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm font-medium">{currentUser.name}</div>
              <div className="text-xs text-gray-300 capitalize">{currentUser.role}</div>
            </div>
            <button 
              onClick={() => setShowLoginModal(true)}
              className="text-sm px-3 py-1 bg-slate-700 rounded hover:bg-slate-600"
            >
              Switch User
            </button>
          </div>
        </div>
      </header>

      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-1 overflow-x-auto">
            {[
              { id: 'dashboard', label: 'Today', icon: Clock },
              { id: 'rentals', label: 'Rentals', icon: Calendar },
              { id: 'customers', label: 'Customers', icon: Users },
              { id: 'inventory', label: 'Inventory', icon: Package },
              { id: 'billing', label: 'Billing', icon: DollarSign },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 },
              ...(currentUser.role === 'admin' ? [{ id: 'users', label: 'Users', icon: Users }] : []),
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600 font-medium'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6">
        {activeTab === 'dashboard' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Today's Tasks - {today}</h2>
            
            {overdueReturns.length > 0 && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="text-red-600" size={20} />
                  <h3 className="font-semibold text-red-800">Overdue Returns ({overdueReturns.length})</h3>
                </div>
                <div className="space-y-2">
                  {overdueReturns.map(rental => (
                    <div key={rental.id} className="bg-white p-3 rounded flex justify-between items-center">
                      <div>
                        <p className="font-medium">{rental.customerName}</p>
                        <p className="text-sm text-red-600">Due: {rental.returnDate}</p>
                      </div>
                      {hasPermission('edit') && (
                        <button
                          onClick={() => handleCheckIn(rental.id)}
                          className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                        >
                          Check In
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="text-green-600" size={24} />
                  <h3 className="text-lg font-semibold">Pickups Today ({todayPickups.length})</h3>
                </div>
                {todayPickups.length === 0 ? (
                  <p className="text-gray-500">No pickups scheduled</p>
                ) : (
                  <div className="space-y-3">
                    {todayPickups.map(rental => (
                      <div key={rental.id} className="p-3 bg-green-50 rounded border border-green-200">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium">{rental.customerName}</p>
                            <p className="text-sm text-gray-600">Items: {rental.items.length}</p>
                            <p className="text-sm text-gray-600">Return: {rental.returnDate}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">Total: ${rental.total}</p>
                            <p className="text-sm text-gray-600">Deposit: ${rental.deposit}</p>
                          </div>
                        </div>
                        {hasPermission('edit') && (
                          <button
                            onClick={() => handlePickup(rental.id)}
                            className="w-full px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                          >
                            Complete Pickup
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="text-blue-600" size={24} />
                  <h3 className="text-lg font-semibold">Returns Today ({todayReturns.length})</h3>
                </div>
                {todayReturns.length === 0 ? (
                  <p className="text-gray-500">No returns scheduled</p>
                ) : (
                  <div className="space-y-3">
                    {todayReturns.map(rental => (
                      <div key={rental.id} className="p-3 bg-blue-50 rounded border border-blue-200">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium">{rental.customerName}</p>
                            <p className="text-sm text-gray-600">Items: {rental.items.length}</p>
                            <p className="text-sm text-gray-600">Picked up: {rental.pickupDate}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">Total: ${rental.total}</p>
                            {rental.paid < rental.total && (
                              <p className="text-sm text-orange-600">Due: ${rental.total - rental.paid}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {hasPermission('edit') && (
                            <button
                              onClick={() => handleCheckIn(rental.id)}
                              className="flex-1 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                            >
                              Check In
                            </button>
                          )}
                          {rental.paid < rental.total && hasPermission('edit') && (
                            <button
                              onClick={() => openModal('payment', { rentalId: rental.id, balance: rental.total - rental.paid })}
                              className="flex-1 px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                            >
                              Pay
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'rentals' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Rentals</h2>
              {hasPermission('edit') && (
                <button
                  onClick={() => openModal('rental')}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  <Plus size={20} />
                  New Rental
                </button>
              )}
            </div>
            <div className="bg-white rounded-lg shadow overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reserved</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pickup</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Return</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Deposit</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paid</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {rentals.map(rental => (
                    <tr key={rental.id}>
                      <td className="px-4 py-3">{rental.customerName}</td>
                      <td className="px-4 py-3">{rental.reservationDate}</td>
                      <td className="px-4 py-3">{rental.pickupDate}</td>
                      <td className="px-4 py-3">{rental.returnDate}</td>
                      <td className="px-4 py-3">${rental.total}</td>
                      <td className="px-4 py-3">${rental.deposit}</td>
                      <td className="px-4 py-3">${rental.paid}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          rental.status === 'reserved' ? 'bg-yellow-100 text-yellow-800' :
                          rental.status === 'out' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {rental.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2 flex-wrap">
                          {rental.status === 'reserved' && hasPermission('edit') && (
                            <button
                              onClick={() => handlePickup(rental.id)}
                              className="text-green-600 hover:text-green-800 text-xs"
                            >
                              Pickup
                            </button>
                          )}
                          {rental.status === 'out' && hasPermission('edit') && (
                            <button
                              onClick={() => handleCheckIn(rental.id)}
                              className="text-blue-600 hover:text-blue-800 text-xs"
                            >
                              Return
                            </button>
                          )}
                          {rental.paid < rental.total && hasPermission('edit') && (
                            <button
                              onClick={() => openModal('payment', { rentalId: rental.id, balance: rental.total - rental.paid })}
                              className="text-green-600 hover:text-green-800 text-xs"
                            >
                              Pay
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

        {activeTab === 'customers' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Customers</h2>
              <div className="flex gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border rounded-lg"
                  />
                </div>
                {hasPermission('edit') && (
                  <button
                    onClick={() => openModal('customer')}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    <Plus size={20} />
                    Add
                  </button>
                )}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID Number</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID Photo</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredCustomers.map(customer => (
                    <tr key={customer.id}>
                      <td className="px-4 py-3 font-medium">{customer.name}</td>
                      <td className="px-4 py-3">{customer.phone}</td>
                      <td className="px-4 py-3">{customer.email}</td>
                      <td className="px-4 py-3">{customer.idType || '-'}</td>
                      <td className="px-4 py-3">{customer.idNumber || '-'}</td>
                      <td className="px-4 py-3">
                        {customer.idPhoto ? (
                          <button
                            onClick={() => openModal('viewImage', { image: customer.idPhoto, title: `${customer.name} ID` })}
                            className="text-blue-600 hover:text-blue-800 text-xs"
                          >
                            View
                          </button>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {hasPermission('edit') && (
                          <button
                            onClick={() => openModal('customer', customer)}
                            className="text-blue-600 hover:text-blue-800 text-xs"
                          >
                            Edit
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

        {activeTab === 'inventory' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Inventory</h2>
              <div className="flex gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border rounded-lg"
                  />
                </div>
                {hasPermission('edit') && (
                  <button
                    onClick={() => openModal('inventory')}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    <Plus size={20} />
                    Add
                  </button>
                )}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">RFID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Size</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredInventory.map(item => (
                    <tr key={item.id}>
                      <td className="px-4 py-3 font-mono text-xs">{item.rfid}</td>
                      <td className="px-4 py-3">{item.name}</td>
                      <td className="px-4 py-3">{item.size}</td>
                      <td className="px-4 py-3">{item.category}</td>
                      <td className="px-4 py-3">${item.price}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.status === 'available' ? 'bg-green-100 text-green-800' :
                          item.status === 'rented' ? 'bg-blue-100 text-blue-800' :
                          item.status === 'cleaning' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {hasPermission('edit') && (
                          <button
                            onClick={() => openModal('inventory', item)}
                            className="text-blue-600 hover:text-blue-800 text-xs"
                          >
                            Edit
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

        {activeTab === 'billing' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Billing</h2>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="space-y-3">
                {rentals.map(rental => (
                  <div key={rental.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{rental.customerName}</p>
                      <p className="text-sm text-gray-500">{rental.pickupDate}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${rental.paid} / ${rental.total}</p>
                      {rental.paid < rental.total ? (
                        <p className="text-sm text-orange-600">Balance: ${rental.total - rental.paid}</p>
                      ) : (
                        <p className="text-sm text-green-600">Paid</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Business Analytics</h2>
            
            {/* Revenue Metrics */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Revenue Metrics</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-lg shadow">
                  <p className="text-gray-500 text-sm mb-1">Total Revenue</p>
                  <p className="text-3xl font-bold text-green-600">
                    ${rentals.reduce((sum, r) => sum + r.paid, 0)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">All time</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <p className="text-gray-500 text-sm mb-1">Average Rental Value</p>
                  <p className="text-3xl font-bold text-blue-600">
                    ${rentals.length > 0 ? Math.round(rentals.reduce((sum, r) => sum + r.total, 0) / rentals.length) : 0}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Per transaction</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <p className="text-gray-500 text-sm mb-1">Outstanding Balance</p>
                  <p className="text-3xl font-bold text-orange-600">
                    ${rentals.reduce((sum, r) => sum + (r.total - r.paid), 0)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Needs collection</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <p className="text-gray-500 text-sm mb-1">Deposits Collected</p>
                  <p className="text-3xl font-bold text-purple-600">
                    ${rentals.reduce((sum, r) => sum + (r.deposit || 0), 0)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Security deposits</p>
                </div>
              </div>
            </div>

            {/* Inventory Performance */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Inventory Performance</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-lg shadow">
                  <p className="text-gray-500 text-sm mb-1">Utilization Rate</p>
                  <p className="text-3xl font-bold text-teal-600">
                    {inventory.length > 0 ? Math.round((inventory.filter(i => i.status === 'rented').length / inventory.length) * 100) : 0}%
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Items currently rented</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <p className="text-gray-500 text-sm mb-1">Total Items</p>
                  <p className="text-3xl font-bold text-indigo-600">{inventory.length}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Available: {inventory.filter(i => i.status === 'available').length} | 
                    Rented: {inventory.filter(i => i.status === 'rented').length}
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <p className="text-gray-500 text-sm mb-1">Items in Cleaning</p>
                  <p className="text-3xl font-bold text-yellow-600">
                    {inventory.filter(i => i.status === 'cleaning').length}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Awaiting turnaround</p>
                </div>
              </div>
            </div>

            {/* Top Performing Items */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Top Performing Items</h3>
              <div className="bg-white rounded-lg shadow p-6">
                <table className="w-full text-sm">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left py-2">Item</th>
                      <th className="text-left py-2">Category</th>
                      <th className="text-left py-2">Times Rented</th>
                      <th className="text-left py-2">Revenue</th>
                      <th className="text-left py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {inventory.map(item => {
                      const timesRented = rentals.filter(r => r.items.includes(item.id)).length;
                      const revenue = timesRented * item.price;
                      return (
                        <tr key={item.id}>
                          <td className="py-3">{item.name}</td>
                          <td className="py-3">{item.category}</td>
                          <td className="py-3 font-semibold">{timesRented}</td>
                          <td className="py-3 text-green-600 font-semibold">${revenue}</td>
                          <td className="py-3">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              item.status === 'available' ? 'bg-green-100 text-green-800' :
                              item.status === 'rented' ? 'bg-blue-100 text-blue-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Customer Insights */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Customer Insights</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-lg shadow">
                  <p className="text-gray-500 text-sm mb-1">Total Customers</p>
                  <p className="text-3xl font-bold text-blue-600">{customers.length}</p>
                  <p className="text-xs text-gray-500 mt-1">In database</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <p className="text-gray-500 text-sm mb-1">Repeat Customers</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {customers.filter(c => c.totalRentals > 1).length}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {customers.length > 0 ? Math.round((customers.filter(c => c.totalRentals > 1).length / customers.length) * 100) : 0}% retention rate
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <p className="text-gray-500 text-sm mb-1">Avg Customer Value</p>
                  <p className="text-3xl font-bold text-green-600">
                    ${customers.length > 0 ? Math.round(rentals.reduce((sum, r) => sum + r.total, 0) / customers.length) : 0}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Lifetime value</p>
                </div>
              </div>
            </div>

            {/* Top Customers */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Top Customers</h3>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="space-y-3">
                  {customers
                    .sort((a, b) => b.totalRentals - a.totalRentals)
                    .slice(0, 5)
                    .map(customer => {
                      const customerRevenue = rentals
                        .filter(r => r.customerId === customer.id)
                        .reduce((sum, r) => sum + r.paid, 0);
                      return (
                        <div key={customer.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                          <div>
                            <p className="font-medium">{customer.name}</p>
                            <p className="text-sm text-gray-500">{customer.phone}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-green-600">${customerRevenue}</p>
                            <p className="text-sm text-gray-500">{customer.totalRentals} rentals</p>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>

            {/* Operational Metrics */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Operational Metrics</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-lg shadow">
                  <p className="text-gray-500 text-sm mb-1">Total Rentals</p>
                  <p className="text-3xl font-bold text-blue-600">{rentals.length}</p>
                  <p className="text-xs text-gray-500 mt-1">All time</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <p className="text-gray-500 text-sm mb-1">Active Rentals</p>
                  <p className="text-3xl font-bold text-orange-600">
                    {rentals.filter(r => r.status === 'out').length}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Currently out</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <p className="text-gray-500 text-sm mb-1">Pending Pickups</p>
                  <p className="text-3xl font-bold text-yellow-600">
                    {rentals.filter(r => r.status === 'reserved').length}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Awaiting pickup</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <p className="text-gray-500 text-sm mb-1">Completion Rate</p>
                  <p className="text-3xl font-bold text-green-600">
                    {rentals.length > 0 ? Math.round((rentals.filter(r => r.status === 'returned').length / rentals.length) * 100) : 0}%
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Returned on time</p>
                </div>
              </div>
            </div>

            {/* Category Performance */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Category Performance</h3>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {['Tuxedo', 'Suit', 'Accessory'].map(category => {
                    const categoryItems = inventory.filter(i => i.category === category);
                    const categoryRentals = rentals.filter(r => 
                      r.items.some(itemId => inventory.find(i => i.id === itemId)?.category === category)
                    ).length;
                    const categoryRevenue = rentals
                      .flatMap(r => r.items)
                      .map(itemId => inventory.find(i => i.id === itemId))
                      .filter(item => item?.category === category)
                      .reduce((sum, item) => sum + (item?.price || 0), 0);
                    
                    return (
                      <div key={category} className="p-4 border rounded-lg">
                        <h4 className="font-semibold mb-2">{category}</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Items:</span>
                            <span className="font-medium">{categoryItems.length}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Rentals:</span>
                            <span className="font-medium">{categoryRentals}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Revenue:</span>
                            <span className="font-medium text-green-600">${categoryRevenue}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Avg/Item:</span>
                            <span className="font-medium">
                              ${categoryItems.length > 0 ? Math.round(categoryRevenue / categoryItems.length) : 0}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Financial Summary */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Financial Summary</h3>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Revenue Breakdown</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Rental Income</span>
                        <span className="font-semibold text-green-600">
                          ${rentals.reduce((sum, r) => sum + r.paid, 0)}
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Deposits Held</span>
                        <span className="font-semibold text-blue-600">
                          ${rentals.filter(r => r.status !== 'returned').reduce((sum, r) => sum + (r.deposit || 0), 0)}
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Outstanding Payments</span>
                        <span className="font-semibold text-orange-600">
                          ${rentals.reduce((sum, r) => sum + Math.max(0, r.total - r.paid), 0)}
                        </span>
                      </div>
                      <div className="flex justify-between py-2 pt-3 font-bold text-lg">
                        <span>Total Expected</span>
                        <span className="text-green-600">
                          ${rentals.reduce((sum, r) => sum + r.total, 0)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Key Ratios</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Payment Collection Rate</span>
                        <span className="font-semibold">
                          {rentals.length > 0 ? 
                            Math.round((rentals.reduce((sum, r) => sum + r.paid, 0) / rentals.reduce((sum, r) => sum + r.total, 0)) * 100) 
                            : 0}%
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Inventory Turnover</span>
                        <span className="font-semibold">
                          {inventory.length > 0 ? (rentals.length / inventory.length).toFixed(1) : 0}x
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Customer Retention</span>
                        <span className="font-semibold">
                          {customers.length > 0 ? 
                            Math.round((customers.filter(c => c.totalRentals > 1).length / customers.length) * 100) 
                            : 0}%
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Avg Items per Rental</span>
                        <span className="font-semibold">
                          {rentals.length > 0 ? 
                            (rentals.reduce((sum, r) => sum + r.items.length, 0) / rentals.length).toFixed(1) 
                            : 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && currentUser.role === 'admin' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">User Management</h2>
              <button
                onClick={() => openModal('user')}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                <Plus size={20} />
                Add User
              </button>
            </div>
            <div className="bg-white rounded-lg shadow overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map(user => (
                    <tr key={user.id}>
                      <td className="px-4 py-3 font-medium">{user.name}</td>
                      <td className="px-4 py-3">{user.username}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                          user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                          user.role === 'staff' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => openModal('user', user)}
                          className="text-blue-600 hover:text-blue-800 text-xs"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Switch User</h3>
              <button onClick={() => setShowLoginModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="text"
                placeholder="Username"
                value={formData.username || ''}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={formData.password || ''}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full p-2 border rounded"
                required
              />
              <div className="text-xs text-gray-500 space-y-1">
                <p>Try: admin/admin123 (full access)</p>
                <p>Or: staff/staff123 (no delete)</p>
                <p>Or: viewer/viewer123 (read-only)</p>
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      )}

      {showModal && modalType !== 'viewImage' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg p-6 w-full max-w-md my-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">
                {modalType === 'customer' ? (formData.id ? 'Edit Customer' : 'Add Customer') :
                 modalType === 'inventory' ? (formData.id ? 'Edit Item' : 'Add Item') :
                 modalType === 'rental' ? 'New Rental' :
                 modalType === 'user' ? (formData.id ? 'Edit User' : 'Add User') :
                 'Record Payment'}
              </h3>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {modalType === 'customer' && (
                <>
                  <input
                    type="text"
                    placeholder="Name"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full p-2 border rounded"
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Phone"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full p-2 border rounded"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full p-2 border rounded"
                  />
                  <select
                    value={formData.idType || ''}
                    onChange={(e) => setFormData({...formData, idType: e.target.value})}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Select ID Type</option>
                    <option value="Driver License">Driver License</option>
                    <option value="Passport">Passport</option>
                    <option value="State ID">State ID</option>
                    <option value="Military ID">Military ID</option>
                  </select>
                  <input
                    type="text"
                    placeholder="ID Number"
                    value={formData.idNumber || ''}
                    onChange={(e) => setFormData({...formData, idNumber: e.target.value})}
                    className="w-full p-2 border rounded"
                  />
                  <div>
                    <label className="block text-sm font-medium mb-2">ID Photo</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'idPhoto')}
                      className="w-full p-2 border rounded"
                    />
                    {formData.idPhoto && (
                      <img src={formData.idPhoto} alt="ID" className="mt-2 max-h-32 rounded" />
                    )}
                  </div>
                </>
              )}

              {modalType === 'inventory' && (
                <>
                  <input
                    type="text"
                    placeholder="RFID Code"
                    value={formData.rfid || ''}
                    onChange={(e) => setFormData({...formData, rfid: e.target.value})}
                    className="w-full p-2 border rounded"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Item Name"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full p-2 border rounded"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Size"
                    value={formData.size || ''}
                    onChange={(e) => setFormData({...formData, size: e.target.value})}
                    className="w-full p-2 border rounded"
                  />
                  <select
                    value={formData.category || ''}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Tuxedo">Tuxedo</option>
                    <option value="Suit">Suit</option>
                    <option value="Accessory">Accessory</option>
                  </select>
                  <input
                    type="number"
                    placeholder="Price"
                    value={formData.price || ''}
                    onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                    className="w-full p-2 border rounded"
                    required
                  />
                </>
              )}

              {modalType === 'rental' && (
                <>
                  <select
                    value={formData.customerId || ''}
                    onChange={(e) => setFormData({...formData, customerId: e.target.value})}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">Select Customer</option>
                    {customers.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                  <input
                    type="date"
                    placeholder="Reservation Date"
                    value={formData.reservationDate || today}
                    onChange={(e) => setFormData({...formData, reservationDate: e.target.value})}
                    className="w-full p-2 border rounded"
                    required
                  />
                  <input
                    type="date"
                    placeholder="Pickup Date"
                    value={formData.pickupDate || ''}
                    onChange={(e) => setFormData({...formData, pickupDate: e.target.value})}
                    className="w-full p-2 border rounded"
                    required
                  />
                  <input
                    type="date"
                    placeholder="Return Date"
                    value={formData.returnDate || ''}
                    onChange={(e) => setFormData({...formData, returnDate: e.target.value})}
                    className="w-full p-2 border rounded"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Item IDs (comma separated, e.g. 1,3)"
                    value={formData.itemIds || ''}
                    onChange={(e) => setFormData({...formData, itemIds: e.target.value})}
                    className="w-full p-2 border rounded"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Deposit Amount"
                    value={formData.deposit || ''}
                    onChange={(e) => setFormData({...formData, deposit: e.target.value})}
                    className="w-full p-2 border rounded"
                    required
                  />
                </>
              )}

              {modalType === 'payment' && (
                <>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-sm text-gray-600">Balance Due</p>
                    <p className="text-2xl font-bold">${formData.balance}</p>
                  </div>
                  <input
                    type="number"
                    placeholder="Payment Amount"
                    value={formData.payment || ''}
                    onChange={(e) => setFormData({...formData, payment: e.target.value})}
                    className="w-full p-2 border rounded"
                    required
                  />
                </>
              )}

              {modalType === 'user' && (
                <>
                  <input
                    type="text"
                    placeholder="Name"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full p-2 border rounded"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Username"
                    value={formData.username || ''}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    className="w-full p-2 border rounded"
                    required
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={formData.password || ''}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full p-2 border rounded"
                    required={!formData.id}
                  />
                  <select
                    value={formData.role || ''}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">Select Role</option>
                    <option value="admin">Admin (Full Access)</option>
                    <option value="staff">Staff (No Delete)</option>
                    <option value="viewer">Viewer (Read Only)</option>
                  </select>
                </>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showModal && modalType === 'viewImage' && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50" onClick={closeModal}>
          <div className="max-w-4xl max-h-screen" onClick={(e) => e.stopPropagation()}>
            <div className="bg-white rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">{formData.title}</h3>
                <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                  <X size={24} />
                </button>
              </div>
              <img src={formData.image} alt="ID" className="max-w-full max-h-[80vh] rounded" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TuxedoAdminSystem;