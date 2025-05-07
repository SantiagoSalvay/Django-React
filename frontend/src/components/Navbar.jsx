import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getAllCategories } from '../api/productApi'
import { motion, AnimatePresence } from 'framer-motion'
import { FiHome, FiShoppingBag, FiCreditCard, FiMenu, FiX, FiLogOut, FiUser, FiChevronDown } from 'react-icons/fi'

const Navbar = () => {
  const { user, isAuthenticated, logout, checkIsAdmin } = useAuth()
  const [categories, setCategories] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories()
        setCategories(data)
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }
    
    fetchCategories()
  }, [])
  
  // Cerrar el menú móvil cuando cambia la ruta
  useEffect(() => {
    setIsOpen(false)
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
  
  return (
    <header className="fixed top-0 left-0 w-full z-50">
      <nav className="w-full bg-black/50 backdrop-blur-md border-b-2 border-cyan-400/60 shadow-lg">
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
              <Link to="/" className="flex items-center gap-2 font-rajdhani text-white/90 hover:text-neon-blue text-base px-3 py-1.5 rounded transition-colors duration-300 font-bold">
                <FiHome className="text-electric-blue text-lg" />
                <span>Inicio</span>
              </Link>
              <div className="relative group">
                <button
                  className="flex items-center gap-2 font-rajdhani text-white/90 hover:text-neon-blue text-base px-3 py-1.5 rounded transition-colors duration-300 font-bold focus:outline-none"
                  onMouseEnter={() => setShowCategoryDropdown(true)}
                  onMouseLeave={() => setShowCategoryDropdown(false)}
                  onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                  style={{ minWidth: '110px' }}
                >
                  <FiShoppingBag className="text-electric-blue text-lg" />
                  <span>Productos</span>
                </button>
                <AnimatePresence>
                  {showCategoryDropdown && (
                    <motion.div
                      className="absolute top-full left-0 mt-2 w-48 glassmorphism z-20 border border-cyan-400/40"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      onMouseEnter={() => setShowCategoryDropdown(true)}
                      onMouseLeave={() => setShowCategoryDropdown(false)}
                    >
                      <div className="py-2">
                        {categories.length > 0 ? (
                          categories.map(category => (
                            <Link
                              key={category.id}
                              to={`/category/${category.slug}`}
                              className="block px-5 py-1.5 text-sm text-white/80 hover:bg-neon-blue/20 hover:text-white font-rajdhani"
                            >
                              {category.name}
                            </Link>
                          ))
                        ) : (
                          <span className="block px-4 py-2 text-xs text-white/60">No hay categorías</span>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <Link to="/payment-methods" className="flex items-center gap-2 font-rajdhani text-white/90 hover:text-neon-blue text-base px-3 py-1.5 rounded transition-colors duration-300 font-bold">
                <FiCreditCard className="text-electric-blue text-lg" />
                <span>Formas de Pago</span>
              </Link>
            </div>
            
            {/* Botones de sesión */}
            <div className="flex items-center gap-2 ml-2">
              {isAuthenticated ? (
                <div className="relative group">
                  <button 
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    onMouseEnter={() => setShowUserDropdown(true)}
                    onMouseLeave={() => setShowUserDropdown(false)}
                    className="btn-secondary p-2 flex items-center gap-1"
                  >
                    <FiUser className="text-lg" />
                    <FiChevronDown className="text-sm" />
                  </button>
                  <AnimatePresence>
                    {showUserDropdown && (
                      <motion.div
                        className="absolute right-0 mt-2 w-48 glassmorphism z-20 border border-cyan-400/40"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        onMouseEnter={() => setShowUserDropdown(true)}
                        onMouseLeave={() => setShowUserDropdown(false)}
                      >
                        <div className="py-2">
                          {user?.is_staff ? (
                            <>
                              <Link
                                to="/admin/"
                                className="block px-5 py-1.5 text-sm text-white/80 hover:bg-neon-blue/20 hover:text-white font-rajdhani"
                              >
                                Panel de Control
                              </Link>
                              <button
                                onClick={handleLogout}
                                className="block w-full text-left px-5 py-1.5 text-sm text-white/80 hover:bg-red-500/20 hover:text-white font-rajdhani"
                              >
                                Cerrar Sesión
                              </button>
                            </>
                          ) : (
                            <>
                              <Link
                                to="/profile/"
                                className="block px-5 py-1.5 text-sm text-white/80 hover:bg-neon-blue/20 hover:text-white font-rajdhani"
                              >
                                Mi Perfil
                              </Link>
                              <button
                                onClick={handleLogout}
                                className="block w-full text-left px-5 py-1.5 text-sm text-white/80 hover:bg-red-500/20 hover:text-white font-rajdhani"
                              >
                                Cerrar Sesión
                              </button>
                            </>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <>
                  <button onClick={handleLoginClick} className="btn-secondary text-xs px-3 py-1 h-8">Iniciar Sesión</button>
                  <Link to="/register" className="btn-primary text-xs px-3 py-1 h-8 bg-gradient-to-r from-blue-800 to-cyan-400 text-white font-orbitron font-bold rounded-full shadow-md border-none flex items-center justify-center transition-transform duration-150 hover:scale-105 hover:from-blue-700 hover:to-cyan-300" style={{minWidth: '110px'}}>
                    Registrarse
                  </Link>
                </>
              )}
            </div>
          </div>
          
          {/* Mobile Menu Icon */}
          <div className="md:hidden flex items-center h-full">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="text-white p-2 relative z-50"
              aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </nav>
      
      {/* Mobile Menu - Full Screen Slide */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black z-40 md:hidden overflow-auto"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="flex flex-col min-h-screen py-20 px-6">
              <div className="space-y-8">
                <Link 
                  to="/" 
                  className="flex items-center text-2xl text-white font-bold border-b border-cyan-500/30 pb-4"
                  onClick={() => setIsOpen(false)}
                >
                  <FiHome className="text-electric-blue mr-4 text-2xl" />
                  Inicio
                </Link>
                
                <div className="space-y-4 border-b border-cyan-500/30 pb-4">
                  <div className="flex items-center text-2xl text-white font-bold">
                    <FiShoppingBag className="text-electric-blue mr-4 text-2xl" />
                    Productos
                  </div>
                  
                  <div className="ml-10 space-y-4 mt-4">
                    {categories.length > 0 ? (
                      categories.map(category => (
                        <Link 
                          key={category.id} 
                          to={`/category/${category.slug}`}
                          className="block text-xl text-white/80 hover:text-neon-blue"
                          onClick={() => setIsOpen(false)}
                        >
                          {category.name}
                        </Link>
                      ))
                    ) : (
                      <p className="text-white/60 text-lg">No hay categorías disponibles</p>
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
                
                <div className="mt-8 pt-8 border-t border-cyan-500/30">
                  {isAuthenticated ? (
                    <div className="space-y-4">
                      {user?.is_staff ? (
                        <>
                          <Link
                            to="/admin/"
                            className="block w-full text-center bg-neon-blue/20 hover:bg-neon-blue/30 text-white py-4 rounded-xl font-bold text-xl border border-neon-blue/30"
                            onClick={() => setIsOpen(false)}
                          >
                            Panel de Control
                          </Link>
                          <button 
                            onClick={() => {
                              handleLogout()
                              setIsOpen(false)
                            }}
                            className="block w-full text-center bg-red-500/20 hover:bg-red-500/30 text-white py-4 rounded-xl font-bold text-xl border border-red-500/30"
                          >
                            Cerrar Sesión
                          </button>
                        </>
                      ) : (
                        <>
                          <Link
                            to="/profile/"
                            className="block w-full text-center bg-neon-blue/20 hover:bg-neon-blue/30 text-white py-4 rounded-xl font-bold text-xl border border-neon-blue/30"
                            onClick={() => setIsOpen(false)}
                          >
                            Mi Perfil
                          </Link>
                          <button 
                            onClick={() => {
                              handleLogout()
                              setIsOpen(false)
                            }}
                            className="block w-full text-center bg-red-500/20 hover:bg-red-500/30 text-white py-4 rounded-xl font-bold text-xl border border-red-500/30"
                          >
                            Cerrar Sesión
                          </button>
                        </>
                      )}
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
              
              <div className="absolute top-6 right-6">
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-white p-2 bg-black/50 rounded-full"
                  aria-label="Cerrar menú"
                >
                  <FiX size={24} className="text-neon-blue" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Navbar