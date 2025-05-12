import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getAllCategories } from '../api/productApi'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FiHome, 
  FiShoppingBag, 
  FiCreditCard, 
  FiMenu, 
  FiX, 
  FiLogOut, 
  FiUser, 
  FiChevronDown, 
  FiHeart, 
  FiTag, 
  FiPackage,
  FiShoppingCart
} from 'react-icons/fi'

const EnhancedNavbar = () => {
  const { user, isAuthenticated, logout, checkIsAdmin } = useAuth()
  const [categories, setCategories] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  
  // Efecto para cargar las categorías
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories()
        setCategories(data)
      } catch (error) {
        console.error('Error fetching categories:', error)
        // Si hay un error de conexión, establecer un array vacío para evitar errores en la UI
        setCategories([])
        
        // No mostrar el dropdown de categorías si hay un error
        setShowCategoryDropdown(false)
      }
    }
    
    fetchCategories()
  }, [])
  
  // Cerrar el menú móvil cuando cambia la ruta
  useEffect(() => {
    setIsOpen(false)
    setShowCategoryDropdown(false)
    setShowUserDropdown(false)
  }, [location.pathname])
  
  // Evitar scroll cuando el menú móvil está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isOpen])
  
  const handleLogout = () => {
    logout()
    navigate('/login')
  }
  
  const handleLoginClick = (e) => {
    e.preventDefault()
    const currentPath = location.pathname
    navigate(`/login?returnTo=${encodeURIComponent(currentPath)}`)
  }
  
  // Animación para el dropdown
  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        duration: 0.2,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      y: -10, 
      scale: 0.95,
      transition: { 
        duration: 0.1,
        ease: "easeIn"
      }
    }
  };
  
  return (
    <header className="fixed top-0 left-0 w-full z-50">
      <nav className="w-full bg-black/70 backdrop-blur-md border-b border-cyan-500/30 shadow-lg shadow-cyan-500/10">
        <div className="flex justify-between items-center w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center h-full relative z-20">
            <span className="text-xl sm:text-2xl font-orbitron font-bold bg-gradient-to-r from-electric-blue to-neon-purple text-transparent bg-clip-text">
              Todo Electro
            </span>
          </Link>
          
          {/* Menú principal - Visible en pantallas medianas y grandes */}
          <div className="hidden md:flex items-center gap-4">
            {/* Opciones principales */}
            <div className="flex items-center gap-3">
              <Link 
                to="/" 
                className={`flex items-center gap-2 font-rajdhani text-white/90 hover:text-neon-blue text-base px-3 py-1.5 rounded transition-colors duration-300 font-bold ${
                  location.pathname === '/' ? 'text-neon-blue' : ''
                }`}
              >
                <FiHome className="text-electric-blue text-lg" />
                <span>Inicio</span>
              </Link>
              
              <div className="relative">
                <button
                  className={`flex items-center gap-2 font-rajdhani text-white/90 hover:text-neon-blue text-base px-3 py-1.5 rounded transition-colors duration-300 font-bold focus:outline-none ${
                    location.pathname.includes('/products') || location.pathname.includes('/category') ? 'text-neon-blue' : ''
                  }`}
                  onMouseEnter={() => setShowCategoryDropdown(true)}
                  onMouseLeave={() => setShowCategoryDropdown(false)}
                  onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                >
                  <FiShoppingBag className="text-electric-blue text-lg" />
                  <span>Productos</span>
                  <FiChevronDown className={`ml-1 transition-transform duration-300 ${showCategoryDropdown ? 'rotate-180' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {showCategoryDropdown && (
                    <motion.div
                      className="absolute top-full left-0 mt-2 w-56 glassmorphism z-20 border border-cyan-400/40 rounded-md overflow-hidden"
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={dropdownVariants}
                      onMouseEnter={() => setShowCategoryDropdown(true)}
                      onMouseLeave={() => setShowCategoryDropdown(false)}
                    >
                      <div className="p-2">
                        <Link 
                          to="/products" 
                          className="flex items-center gap-2 px-4 py-2 text-white hover:bg-white/10 rounded transition-colors duration-200"
                        >
                          <FiShoppingBag className="text-electric-blue" />
                          <span>Todos los productos</span>
                        </Link>
                        
                        <Link 
                          to="/discounted" 
                          className="flex items-center gap-2 px-4 py-2 text-white hover:bg-white/10 rounded transition-colors duration-200"
                        >
                          <FiTag className="text-electric-blue" />
                          <span>Ofertas</span>
                        </Link>
                        
                        <Link 
                          to="/combos" 
                          className="flex items-center gap-2 px-4 py-2 text-white hover:bg-white/10 rounded transition-colors duration-200"
                        >
                          <FiPackage className="text-electric-blue" />
                          <span>Combos</span>
                        </Link>
                        
                        {categories.length > 0 && (
                          <>
                            <div className="my-2 border-t border-cyan-500/30"></div>
                            <div className="px-4 py-1 text-xs text-white/50 uppercase font-bold">Categorías</div>
                            
                            <div className="max-h-60 overflow-y-auto custom-scrollbar">
                              {categories.map(category => (
                                <Link
                                  key={category.id}
                                  to={`/category/${category.slug}`}
                                  className="flex items-center gap-2 px-4 py-2 text-white hover:bg-white/10 rounded transition-colors duration-200"
                                >
                                  <span>{category.name}</span>
                                </Link>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <Link 
                to="/payment-methods" 
                className={`flex items-center gap-2 font-rajdhani text-white/90 hover:text-neon-blue text-base px-3 py-1.5 rounded transition-colors duration-300 font-bold ${
                  location.pathname === '/payment-methods' ? 'text-neon-blue' : ''
                }`}
              >
                <FiCreditCard className="text-electric-blue text-lg" />
                <span>Formas de Pago</span>
              </Link>
            </div>
            
            {/* Autenticación */}
            <div className="ml-4 pl-4 border-l border-white/20">
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    className="flex items-center gap-2 font-rajdhani text-white/90 hover:text-neon-blue text-base px-3 py-1.5 rounded-full bg-black/30 hover:bg-black/50 transition-colors duration-300 font-bold"
                    onMouseEnter={() => setShowUserDropdown(true)}
                    onMouseLeave={() => setShowUserDropdown(false)}
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-electric-blue to-neon-purple flex items-center justify-center text-white">
                      {user?.first_name ? user.first_name.charAt(0).toUpperCase() : <FiUser />}
                    </div>
                    <span className="hidden sm:inline">{user?.first_name || 'Usuario'}</span>
                    <FiChevronDown className={`transition-transform duration-300 ${showUserDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  
                  <AnimatePresence>
                    {showUserDropdown && (
                      <motion.div
                        className="absolute top-full right-0 mt-2 w-56 glassmorphism z-20 border border-cyan-400/40 rounded-md overflow-hidden"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={dropdownVariants}
                        onMouseEnter={() => setShowUserDropdown(true)}
                        onMouseLeave={() => setShowUserDropdown(false)}
                      >
                        <div className="p-2">
                          <div className="px-4 py-3 border-b border-cyan-500/30">
                            <p className="text-sm text-white/70">Conectado como</p>
                            <p className="font-medium text-neon-blue truncate">{user?.email}</p>
                          </div>
                          
                          <Link 
                            to="/profile" 
                            className="flex items-center gap-2 px-4 py-2 text-white hover:bg-white/10 rounded transition-colors duration-200"
                          >
                            <FiUser className="text-electric-blue" />
                            <span>Mi Perfil</span>
                          </Link>
                          
                          {user?.is_staff && (
                            <Link 
                              to="/admin" 
                              className="flex items-center gap-2 px-4 py-2 text-white hover:bg-white/10 rounded transition-colors duration-200"
                            >
                              <FiShoppingBag className="text-electric-blue" />
                              <span>Panel de Admin</span>
                            </Link>
                          )}
                          
                          <button 
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2 px-4 py-2 text-white hover:bg-red-500/20 rounded transition-colors duration-200"
                          >
                            <FiLogOut className="text-red-400" />
                            <span>Cerrar Sesión</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button 
                    onClick={handleLoginClick}
                    className="font-rajdhani text-white/90 hover:text-neon-blue text-base px-4 py-1.5 rounded border border-cyan-500/30 hover:border-cyan-500/60 transition-colors duration-300 font-bold"
                  >
                    Iniciar Sesión
                  </button>
                  <Link 
                    to="/register"
                    className="font-rajdhani text-white text-base px-4 py-1.5 rounded bg-gradient-to-r from-electric-blue to-neon-purple hover:opacity-90 transition-opacity duration-300 font-bold"
                  >
                    Registrarse
                  </Link>
                </div>
              )}
            </div>
          </div>
          
          {/* Botón de menú móvil */}
          <button 
            className="md:hidden text-white p-2 focus:outline-none z-20"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            {isOpen ? (
              <FiX size={24} className="text-neon-blue" />
            ) : (
              <FiMenu size={24} className="text-neon-blue" />
            )}
          </button>
        </div>
      </nav>
      
      {/* Menú móvil */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-md md:hidden pt-20"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3 }}
          >
            <div className="h-full overflow-y-auto px-6 py-8 flex flex-col">
              <div className="space-y-6 flex-1">
                <Link 
                  to="/"
                  className="flex items-center text-2xl text-white font-bold border-b border-cyan-500/30 pb-4"
                  onClick={() => setIsOpen(false)}
                >
                  <FiHome className="text-electric-blue mr-4 text-2xl" />
                  Inicio
                </Link>
                
                <div className="border-b border-cyan-500/30 pb-4">
                  <div className="flex items-center text-2xl text-white font-bold mb-4">
                    <FiShoppingBag className="text-electric-blue mr-4 text-2xl" />
                    Productos
                  </div>
                  
                  <div className="ml-8 space-y-4">
                    <Link 
                      to="/products"
                      className="block text-xl text-white/80 hover:text-white"
                      onClick={() => setIsOpen(false)}
                    >
                      Todos los productos
                    </Link>
                    
                    <Link 
                      to="/discounted"
                      className="block text-xl text-white/80 hover:text-white"
                      onClick={() => setIsOpen(false)}
                    >
                      Ofertas
                    </Link>
                    
                    <Link 
                      to="/combos"
                      className="block text-xl text-white/80 hover:text-white"
                      onClick={() => setIsOpen(false)}
                    >
                      Combos
                    </Link>
                    
                    {categories.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-white/10">
                        <h3 className="text-lg text-white/50 uppercase font-bold mb-3">Categorías</h3>
                        <div className="space-y-3 max-h-40 overflow-y-auto">
                          {categories.map(category => (
                            <Link
                              key={category.id}
                              to={`/category/${category.slug}`}
                              className="block text-lg text-white/80 hover:text-white"
                              onClick={() => setIsOpen(false)}
                            >
                              {category.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <Link 
                  to="/payment-methods"
                  className="flex items-center text-2xl text-white font-bold border-b border-cyan-500/30 pb-4"
                  onClick={() => setIsOpen(false)}
                >
                  <FiCreditCard className="text-electric-blue mr-4 text-2xl" />
                  Formas de Pago
                </Link>
              </div>
              
              <div className="mt-8 pt-8 border-t border-cyan-500/30">
                {isAuthenticated ? (
                  <div className="space-y-4">
                    <Link
                      to="/profile/"
                      className="block w-full text-center bg-neon-blue/20 hover:bg-neon-blue/30 text-white py-4 rounded-xl font-bold text-xl border border-neon-blue/30"
                      onClick={() => setIsOpen(false)}
                    >
                      Mi Perfil
                    </Link>
                    
                    {user?.is_staff && (
                      <Link
                        to="/admin/"
                        className="block w-full text-center bg-neon-blue/20 hover:bg-neon-blue/30 text-white py-4 rounded-xl font-bold text-xl border border-neon-blue/30"
                        onClick={() => setIsOpen(false)}
                      >
                        Panel de Control
                      </Link>
                    )}
                    
                    <button 
                      onClick={() => {
                        handleLogout()
                        setIsOpen(false)
                      }}
                      className="block w-full text-center bg-red-500/20 hover:bg-red-500/30 text-white py-4 rounded-xl font-bold text-xl border border-red-500/30"
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <button 
                      onClick={(e) => {
                        handleLoginClick(e)
                        setIsOpen(false)
                      }} 
                      className="block w-full text-center bg-neon-blue/20 hover:bg-neon-blue/30 text-white py-4 rounded-xl font-bold text-xl border border-neon-blue/30"
                    >
                      Iniciar Sesión
                    </button>
                    <Link 
                      to="/register" 
                      className="block w-full text-center bg-gradient-to-r from-blue-800 to-cyan-400 text-white py-4 rounded-xl font-bold text-xl"
                      onClick={() => setIsOpen(false)}
                    >
                      Registrarse
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default EnhancedNavbar
