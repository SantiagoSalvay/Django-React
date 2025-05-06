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
  
  const handleLogout = () => {
    logout()
    navigate('/login')
  }
  
  const handleLoginClick = (e) => {
    e.preventDefault()
    const currentPath = location.pathname
    navigate(`/login?returnTo=${encodeURIComponent(currentPath)}`)
  }
  
  // Mobile menu animation variants
  const menuVariants = {
    closed: {
      opacity: 0,
      x: '-100%',
      transition: {
        duration: 0.5,
      },
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
      },
    },
  }
  
  // Dropdown animation variants
  const dropdownVariants = {
    hidden: {
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.2,
      },
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.2,
      },
    },
  }
  
  return (
    <nav className="navbar fixed top-0 left-0 w-full z-50 bg-black/50 backdrop-blur-md border-b-2 border-cyan-400/60 shadow-lg px-8 py-6">
      <div className="flex justify-between items-center w-full max-w-7xl mx-auto">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-orbitron font-bold bg-gradient-to-r from-electric-blue to-neon-purple text-transparent bg-clip-text">
            Todo Electro
          </span>
        </Link>
        {/* Menú principal + Botones de sesión juntos */}
        <div className="flex items-center gap-4">
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
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
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
                {isAuthenticated && (
                  <AnimatePresence>
                    {showUserDropdown && (
                      <motion.div
                        className="absolute right-0 mt-2 w-48 glassmorphism z-20 border border-cyan-400/40"
                        variants={dropdownVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
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
                )}
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
        <div className="md:hidden">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="text-white p-2"
          >
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>
      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="md:hidden fixed inset-0 bg-black/90 z-50 pt-20 px-6"
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            <div className="flex flex-col space-y-6">
              <Link to="/" className="flex items-center space-x-4 font-rajdhani text-xl" onClick={() => setIsOpen(false)}>
                <FiHome className="text-electric-blue text-2xl" />
                <span>Inicio</span>
              </Link>
              <div className="space-y-3">
                <div className="flex items-center space-x-4 font-rajdhani text-xl">
                  <FiShoppingBag className="text-electric-blue text-2xl" />
                  <span>Productos</span>
                </div>
                <div className="ml-10 space-y-3">
                  {categories.map(category => (
                    <Link 
                      key={category.id} 
                      to={`/category/${category.slug}`}
                      className="block text-white/80 hover:text-neon-blue"
                      onClick={() => setIsOpen(false)}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
              <Link to="/payment-methods" className="flex items-center space-x-4 font-rajdhani text-xl" onClick={() => setIsOpen(false)}>
                <FiCreditCard className="text-electric-blue text-2xl" />
                <span>Formas de Pago</span>
              </Link>
              {isAuthenticated ? (
                <button 
                  onClick={() => {
                    handleLogout()
                    setIsOpen(false)
                  }} 
                  className="btn-primary flex items-center justify-center space-x-2 mt-6"
                >
                  <div className="relative group">
                    <button 
                      onClick={() => setShowUserDropdown(!showUserDropdown)}
                      onMouseEnter={() => setShowUserDropdown(true)}
                      onMouseLeave={() => setShowUserDropdown(false)}
                      className="btn-primary p-2 flex items-center gap-1"
                    >
                      <FiUser className="text-lg" />
                      <FiChevronDown className="text-sm" />
                    </button>
                    {isAuthenticated && (
                      <AnimatePresence>
                        {showUserDropdown && (
                          <motion.div
                            className="absolute right-0 mt-2 w-48 glassmorphism z-20 border border-cyan-400/40"
                            variants={dropdownVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
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
                    )}
                  </div>
                </button>
              ) : (
                <div className="flex flex-col space-y-4 mt-6">
                  <button onClick={(e) => {
                    handleLoginClick(e)
                    setIsOpen(false)
                  }} className="btn-secondary text-center">
                    Iniciar Sesión
                  </button>
                  <Link to="/register" className="btn-primary text-center bg-gradient-to-r from-blue-800 to-cyan-400 text-white font-orbitron font-bold rounded-full shadow-md border-none transition-transform duration-150 hover:scale-105 hover:from-blue-700 hover:to-cyan-300" onClick={() => setIsOpen(false)}>
                    Registrarse
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navbar