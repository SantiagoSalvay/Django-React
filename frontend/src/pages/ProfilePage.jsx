import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  FiUser, 
  FiShoppingCart, 
  FiHeart, 
  FiPackage, 
  FiLock, 
  FiHome, 
  FiEdit, 
  FiTrash2, 
  FiArrowLeft,
  FiChevronRight
} from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

const ProfilePage = () => {
  const { user, logout, setUser } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('personal')
  
  // Empty initial data as requested
  const [cart, setCart] = useState([])
  const [favorites, setFavorites] = useState([])
  const [orders, setOrders] = useState([])
  
  // User personal information state
  const [personalInfo, setPersonalInfo] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    phone: user?.profile?.phone || '',
    address: user?.profile?.address || ''
  })
  
  // Update personal info when user data changes
  useEffect(() => {
    if (user) {
      setPersonalInfo({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: user.profile?.phone || '',
        address: user.profile?.address || ''
      })
    }
  }, [user])
  
  // Edit mode state
  const [editMode, setEditMode] = useState(false)
  
  // Password change state
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  
  const handlePasswordChange = (e) => {
    e.preventDefault()
    // Implement password change logic here
    alert('Contraseña cambiada exitosamente')
    setShowPasswordForm(false)
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
  }
  
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  // Handle personal info changes
  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target
    setPersonalInfo(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  // Save personal info changes
  const savePersonalInfo = async () => {
    try {
      // Make API call to update user data
      const response = await axios.put('/api/users/update-profile/', {
        first_name: personalInfo.first_name,
        last_name: personalInfo.last_name,
        email: personalInfo.email,
        profile: {
          phone: personalInfo.phone,
          address: personalInfo.address
        }
      })
      
      // Update user in context
      if (response.data) {
        // Update the user in context with the response data
        setUser(response.data)
      }
      
      setEditMode(false)
      alert('Información personal actualizada correctamente')
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Error al actualizar la información. Por favor intenta de nuevo.')
    }
  }
  
  // Remove from cart
  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id))
  }
  
  // Remove from favorites
  const removeFromFavorites = (id) => {
    setFavorites(prev => prev.filter(item => item.id !== id))
  }
  
  // Calculate cart total
  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 text-white">
      {/* Header */}
      <header className="glassmorphism p-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <FiUser size={24} className="text-neon-blue" />
          <h1 className="text-2xl font-orbitron">Mi Perfil</h1>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setShowPasswordForm(!showPasswordForm)}
            className="flex items-center space-x-2 px-4 py-2 bg-neon-blue/20 hover:bg-neon-blue/30 text-neon-blue hover:text-white rounded-full transition-all duration-300 border border-neon-blue/50 shadow-md shadow-neon-blue/20"
          >
            <FiLock size={18} />
            <span className="font-medium">Cambiar Contraseña</span>
          </button>
          <Link 
            to="/"
            className="flex items-center space-x-2 px-4 py-2 bg-neon-purple/20 hover:bg-neon-purple/30 text-neon-purple hover:text-white rounded-full transition-all duration-300 border border-neon-purple/50 shadow-md shadow-neon-purple/20"
          >
            <FiHome size={18} />
            <span className="font-medium">Inicio</span>
          </Link>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="container mx-auto p-6">
        {/* Password Change Form */}
        {showPasswordForm && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glassmorphism p-6 mb-8"
          >
            <h2 className="text-xl font-orbitron mb-4 flex items-center">
              <FiLock className="mr-2 text-neon-blue" />
              Cambiar Contraseña
            </h2>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block mb-1 text-white/80">Contraseña Actual</label>
                <input 
                  type="password" 
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-white/80">Nueva Contraseña</label>
                <input 
                  type="password" 
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-white/80">Confirmar Nueva Contraseña</label>
                <input 
                  type="password" 
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>
              <div className="flex space-x-4">
                <button type="submit" className="btn-primary">Guardar Cambios</button>
                <button 
                  type="button" 
                  onClick={() => setShowPasswordForm(false)}
                  className="btn-secondary"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </motion.div>
        )}
        
        {/* Tabs */}
        <div className="flex flex-wrap mb-8 glassmorphism p-2">
          <button 
            onClick={() => setActiveTab('personal')}
            className={`flex-1 py-3 px-4 flex items-center justify-center space-x-2 ${activeTab === 'personal' ? 'text-neon-blue border-b-2 border-neon-blue' : 'text-white/70 hover:text-white'}`}
          >
            <FiUser />
            <span>Información Personal</span>
          </button>
          <button 
            onClick={() => setActiveTab('cart')}
            className={`flex-1 py-3 px-4 flex items-center justify-center space-x-2 ${activeTab === 'cart' ? 'text-rose-500 border-b-2 border-rose-500' : 'text-white/70 hover:text-white'}`}
          >
            <FiShoppingCart />
            <span>Carrito</span>
            {cart.length > 0 && (
              <span className="bg-rose-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </button>
          <button 
            onClick={() => setActiveTab('favorites')}
            className={`flex-1 py-3 px-4 flex items-center justify-center space-x-2 ${activeTab === 'favorites' ? 'text-purple-500 border-b-2 border-purple-500' : 'text-white/70 hover:text-white'}`}
          >
            <FiHeart />
            <span>Favoritos</span>
            {favorites.length > 0 && (
              <span className="bg-purple-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {favorites.length}
              </span>
            )}
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={`flex-1 py-3 px-4 flex items-center justify-center space-x-2 ${activeTab === 'orders' ? 'text-emerald-500 border-b-2 border-emerald-500' : 'text-white/70 hover:text-white'}`}
          >
            <FiPackage />
            <span>Mis Compras</span>
          </button>
        </div>
        
        {/* Tab Content */}
        <div className="glassmorphism p-6">
          {/* Personal Information */}
          {activeTab === 'personal' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-orbitron flex items-center text-neon-blue">
                  <FiUser className="mr-2" />
                  Información Personal
                </h2>
                {!editMode ? (
                  <button 
                    onClick={() => setEditMode(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-neon-blue/20 hover:bg-neon-blue/30 text-neon-blue hover:text-white rounded-full transition-all duration-300 border border-neon-blue/50 shadow-md shadow-neon-blue/20"
                  >
                    <FiEdit size={16} />
                    <span>Editar Información</span>
                  </button>
                ) : (
                  <div className="flex space-x-3">
                    <button 
                      onClick={savePersonalInfo}
                      className="flex items-center space-x-2 px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 hover:text-white rounded-full transition-all duration-300 border border-emerald-400/50 shadow-md shadow-emerald-400/20"
                    >
                      <span>Guardar Cambios</span>
                    </button>
                    <button 
                      onClick={() => setEditMode(false)}
                      className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-white rounded-full transition-all duration-300 border border-red-400/50 shadow-md shadow-red-400/20"
                    >
                      <span>Cancelar</span>
                    </button>
                  </div>
                )}
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <div className="mb-6">
                    <h3 className="text-white/60 mb-2">Nombre</h3>
                    {!editMode ? (
                      <p className="text-lg">{personalInfo.first_name} {personalInfo.last_name}</p>
                    ) : (
                      <div className="space-y-2">
                        <input
                          type="text"
                          name="first_name"
                          placeholder="Nombre"
                          value={personalInfo.first_name}
                          onChange={handlePersonalInfoChange}
                          className="w-full bg-black/30 border border-neon-blue/30 rounded px-4 py-2 text-white focus:outline-none focus:border-neon-blue"
                        />
                        <input
                          type="text"
                          name="last_name"
                          placeholder="Apellido"
                          value={personalInfo.last_name}
                          onChange={handlePersonalInfoChange}
                          className="w-full bg-black/30 border border-neon-blue/30 rounded px-4 py-2 text-white focus:outline-none focus:border-neon-blue"
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-white/60 mb-2">Correo Electrónico</h3>
                    {!editMode ? (
                      <p className="text-lg">{personalInfo.email}</p>
                    ) : (
                      <input
                        type="email"
                        name="email"
                        value={personalInfo.email}
                        onChange={handlePersonalInfoChange}
                        className="w-full bg-black/30 border border-neon-blue/30 rounded px-4 py-2 text-white focus:outline-none focus:border-neon-blue"
                      />
                    )}
                  </div>
                </div>
                
                <div>
                  <div className="mb-6">
                    <h3 className="text-white/60 mb-2">Teléfono</h3>
                    {!editMode ? (
                      <p className="text-lg">{personalInfo.phone}</p>
                    ) : (
                      <input
                        type="tel"
                        name="phone"
                        value={personalInfo.phone}
                        onChange={handlePersonalInfoChange}
                        className="w-full bg-black/30 border border-neon-blue/30 rounded px-4 py-2 text-white focus:outline-none focus:border-neon-blue"
                      />
                    )}
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-white/60 mb-2">Dirección</h3>
                    {!editMode ? (
                      <p className="text-lg">{personalInfo.address}</p>
                    ) : (
                      <input
                        type="text"
                        name="address"
                        value={personalInfo.address}
                        onChange={handlePersonalInfoChange}
                        className="w-full bg-black/30 border border-neon-blue/30 rounded px-4 py-2 text-white focus:outline-none focus:border-neon-blue"
                      />
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Shopping Cart */}
          {activeTab === 'cart' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-orbitron mb-6 flex items-center text-rose-500">
                <FiShoppingCart className="mr-2" />
                Mi Carrito
              </h2>
              
              {cart.length > 0 ? (
                <>
                  <div className="space-y-4 mb-8">
                    {cart.map(item => (
                      <div key={item.id} className="flex items-center p-4 bg-black/30 rounded-lg">
                        <div className="w-16 h-16 bg-black/50 rounded overflow-hidden mr-4">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null
                              e.target.src = '/placeholder-product.jpg'
                            }}
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-white/70">${item.price.toFixed(2)}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-black/50 text-white">-</button>
                            <span>{item.quantity}</span>
                            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-black/50 text-white">+</button>
                          </div>
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center p-4 bg-black/30 rounded-lg">
                    <div>
                      <p className="text-white/70 mb-1">Total ({cart.length} productos):</p>
                      <p className="text-2xl font-bold text-rose-500">${cartTotal.toFixed(2)}</p>
                    </div>
                    <button className="mt-4 md:mt-0 btn-primary bg-rose-500 hover:bg-rose-600 shadow-rose-500/20">
                      Proceder al Pago
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-12 bg-black/20 rounded-lg">
                  <FiShoppingCart size={48} className="mx-auto mb-4 text-white/30" />
                  <h3 className="text-xl mb-2">Tu carrito está vacío</h3>
                  <p className="text-white/60 mb-6">Agrega productos a tu carrito para continuar</p>
                  <Link to="/products" className="btn-primary">
                    Ver Productos
                  </Link>
                </div>
              )}
            </motion.div>
          )}
          
          {/* Favorites */}
          {activeTab === 'favorites' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-orbitron mb-6 flex items-center text-purple-500">
                <FiHeart className="mr-2" />
                Mis Favoritos
              </h2>
              
              {favorites.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {favorites.map(item => (
                    <div key={item.id} className="glassmorphism p-4 relative">
                      <button 
                        onClick={() => removeFromFavorites(item.id)}
                        className="absolute top-2 right-2 text-red-400 hover:text-red-300 bg-black/50 rounded-full p-1"
                      >
                        <FiTrash2 size={16} />
                      </button>
                      <div className="w-full h-40 bg-black/50 rounded overflow-hidden mb-3">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null
                            e.target.src = '/placeholder-product.jpg'
                          }}
                        />
                      </div>
                      <h3 className="font-medium mb-1">{item.name}</h3>
                      <p className="text-purple-400 font-bold mb-3">${item.price.toFixed(2)}</p>
                      <button className="w-full py-2 bg-purple-500/80 hover:bg-purple-500 rounded-lg transition-colors text-white">
                        Agregar al Carrito
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-black/20 rounded-lg">
                  <FiHeart size={48} className="mx-auto mb-4 text-white/30" />
                  <h3 className="text-xl mb-2">No tienes favoritos</h3>
                  <p className="text-white/60 mb-6">Agrega productos a tus favoritos para verlos aquí</p>
                  <Link to="/products" className="btn-primary">
                    Ver Productos
                  </Link>
                </div>
              )}
            </motion.div>
          )}
          
          {/* Orders */}
          {activeTab === 'orders' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-orbitron mb-6 flex items-center text-emerald-500">
                <FiPackage className="mr-2" />
                Mis Compras
              </h2>
              
              {orders.length > 0 ? (
                <div className="space-y-6">
                  {orders.map(order => (
                    <div key={order.id} className="glassmorphism overflow-hidden">
                      <div className="p-4 bg-black/40 flex flex-col md:flex-row md:items-center justify-between">
                        <div>
                          <p className="text-sm text-white/60">Orden #{order.id}</p>
                          <p className="text-sm text-white/60">Fecha: {order.date}</p>
                        </div>
                        <div className="mt-2 md:mt-0 flex items-center">
                          <span className={`px-3 py-1 rounded-full text-xs ${
                            order.status === 'Entregado' ? 'bg-emerald-500/20 text-emerald-400' : 
                            order.status === 'En proceso' ? 'bg-blue-500/20 text-blue-400' : 
                            'bg-orange-500/20 text-orange-400'
                          }`}>
                            {order.status}
                          </span>
                          <span className="mx-3 text-white/30">|</span>
                          <span className="font-bold text-emerald-400">${order.total.toFixed(2)}</span>
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <h3 className="text-white/80 mb-3">Productos:</h3>
                        <div className="space-y-2">
                          {order.items.map(item => (
                            <div key={item.id} className="flex justify-between items-center p-2 bg-black/20 rounded">
                              <div>
                                <p>{item.name}</p>
                                <p className="text-sm text-white/60">Cantidad: {item.quantity}</p>
                              </div>
                              <p className="font-medium">${item.price.toFixed(2)}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="p-4 bg-black/20 flex justify-end">
                        <button className="flex items-center space-x-1 text-emerald-400 hover:text-emerald-300">
                          <span>Ver detalles</span>
                          <FiChevronRight />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-black/20 rounded-lg">
                  <FiPackage size={48} className="mx-auto mb-4 text-white/30" />
                  <h3 className="text-xl mb-2">No tienes compras realizadas</h3>
                  <p className="text-white/60 mb-6">Tus compras aparecerán aquí una vez realizadas</p>
                  <Link to="/products" className="btn-primary">
                    Ver Productos
                  </Link>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
      
      {/* Removed back to top button as requested */}
    </div>
  )
}

export default ProfilePage
