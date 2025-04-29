import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getAllCategories } from '../api/productApi'
import { motion, AnimatePresence } from 'framer-motion'
import { FiHome, FiShoppingBag, FiGrid, FiCreditCard, FiMenu, FiX, FiLogOut, FiSettings } from 'react-icons/fi'

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth()
  const [categories, setCategories] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
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
    <nav className="navbar">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-orbitron font-bold bg-gradient-to-r from-electric-blue to-neon-purple text-transparent bg-clip-text">
            Todo Electro
          </span>
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 items-center">
          <Link to="/" className="flex items-center space-x-2 font-rajdhani text-white/80 hover:text-neon-blue transition-colors duration-300">
            <FiHome className="text-electric-blue" />
            <span>Inicio</span>
          </Link>
          
          {isAuthenticated && (
            <>
              <Link to="/products" className="flex items-center space-x-2 font-rajdhani text-white/80 hover:text-neon-blue transition-colors duration-300">
                <FiShoppingBag className="text-electric-blue" />
                <span>Productos</span>
              </Link>
              
              {/* Categories Dropdown */}
              <div className="relative group">
                <button 
                  className="flex items-center space-x-2 font-rajdhani text-white/80 hover:text-neon-blue transition-colors duration-300"
                  onMouseEnter={() => setShowCategoryDropdown(true)}
                  onMouseLeave={() => setShowCategoryDropdown(false)}
                >
                  <FiGrid className="text-electric-blue" />
                  <span>Categorías</span>
                </button>
                
                <AnimatePresence>
                  {showCategoryDropdown && (
                    <motion.div 
                      className="absolute top-full left-0 mt-2 w-48 glassmorphism z-20"
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      onMouseEnter={() => setShowCategoryDropdown(true)}
                      onMouseLeave={() => setShowCategoryDropdown(false)}
                    >
                      <div className="py-2">
                        {categories.map(category => (
                          <Link 
                            key={category.id} 
                            to={`/category/${category.slug}`}
                            className="block px-4 py-2 text-sm text-white/80 hover:bg-neon-blue/20 hover:text-white"
                          >
                            {category.name}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <Link to="/payment-methods" className="flex items-center space-x-2 font-rajdhani text-white/80 hover:text-neon-blue transition-colors duration-300">
                <FiCreditCard className="text-electric-blue" />
                <span>Métodos de Pago</span>
              </Link>
              
              {user?.is_staff && (
                <Link to="/admin" className="flex items-center space-x-2 font-rajdhani text-white/80 hover:text-neon-blue transition-colors duration-300">
                  <FiSettings className="text-neon-purple" />
                  <span className="text-neon-purple">Panel de Control</span>
                </Link>
              )}
            </>
          )}
          
          {isAuthenticated ? (
            <button 
              onClick={handleLogout} 
              className="btn-secondary flex items-center space-x-2"
            >
              <FiLogOut />
              <span>Salir</span>
            </button>
          ) : (
            <div className="flex space-x-4">
              <button onClick={handleLoginClick} className="btn-secondary">Iniciar Sesión</button>
              <Link to="/register" className="btn-primary">Registrarse</Link>
            </div>
          )}
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
              
              {isAuthenticated && (
                <>
                  <Link to="/products" className="flex items-center space-x-4 font-rajdhani text-xl" onClick={() => setIsOpen(false)}>
                    <FiShoppingBag className="text-electric-blue text-2xl" />
                    <span>Productos</span>
                  </Link>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-4 font-rajdhani text-xl">
                      <FiGrid className="text-electric-blue text-2xl" />
                      <span>Categorías</span>
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
                    <span>Métodos de Pago</span>
                  </Link>
                  
                  {user?.is_staff && (
                    <Link to="/admin" className="flex items-center space-x-4 font-rajdhani text-xl" onClick={() => setIsOpen(false)}>
                      <FiSettings className="text-neon-purple text-2xl" />
                      <span className="text-neon-purple">Panel de Control</span>
                    </Link>
                  )}
                </>
              )}
              
              {isAuthenticated ? (
                <button 
                  onClick={() => {
                    handleLogout()
                    setIsOpen(false)
                  }} 
                  className="btn-primary flex items-center justify-center space-x-2 mt-6"
                >
                  <FiLogOut />
                  <span>Cerrar Sesión</span>
                </button>
              ) : (
                <div className="flex flex-col space-y-4 mt-6">
                  <button onClick={(e) => {
                    handleLoginClick(e)
                    setIsOpen(false)
                  }} className="btn-secondary text-center">
                    Iniciar Sesión
                  </button>
                  <Link to="/register" className="btn-primary text-center" onClick={() => setIsOpen(false)}>
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