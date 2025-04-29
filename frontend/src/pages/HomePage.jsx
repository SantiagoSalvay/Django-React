import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowRight, FiTrendingUp } from 'react-icons/fi'
import { getAllProducts, getAllCategories } from '../api/productApi'
import ProductCard from '../components/ProductCard'
import { useAuth } from '../context/AuthContext'

const HomePage = () => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { isAuthenticated } = useAuth()
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [productsData, categoriesData] = await Promise.all([
          getAllProducts(),
          getAllCategories()
        ])
        
        setProducts(productsData)
        setCategories(categoriesData)
      } catch (err) {
        setError('Error al cargar los datos')
        console.error('Error fetching data:', err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])
  
  // Get featured products (first 4)
  const featuredProducts = products.slice(0, 4)
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-neon-blue"></div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-orbitron text-red-400 mb-4">Error</h2>
        <p className="text-white/70">{error}</p>
      </div>
    )
  }
  
  return (
    <div className="mt-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden mb-16 rounded-2xl glassmorphism">
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-black/80 to-black/40"></div>
        
        <div className="relative z-10 px-6 py-16 md:py-24 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-orbitron font-bold mb-6 text-white">
              <span className="block">El Futuro de la Tecnología</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple">
                En Tu Hogar
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mb-8">
              Descubre la más amplia selección de electrodomésticos con tecnología de punta, 
              diseño elegante y precios increíbles.
            </p>
            
            {isAuthenticated ? (
              <Link to="/products" className="btn-primary inline-flex items-center space-x-2">
                <span>Ver Productos</span>
                <FiArrowRight />
              </Link>
            ) : (
              <Link to="/login" className="btn-primary inline-flex items-center space-x-2">
                <span>Iniciar Sesión</span>
                <FiArrowRight />
              </Link>
            )}
          </motion.div>
        </div>
      </section>
      
      {/* Categories Section */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-orbitron font-bold text-white">Categorías</h2>
          {isAuthenticated ? (
            <Link to="/products" className="text-neon-blue hover:text-neon-purple transition-colors flex items-center space-x-1">
              <span>Ver todas</span>
              <FiArrowRight size={16} />
            </Link>
          ) : (
            <Link to="/login" className="text-neon-blue hover:text-neon-purple transition-colors flex items-center space-x-1">
              <span>Iniciar Sesión</span>
              <FiArrowRight size={16} />
            </Link>
          )}
        </div>
        
        <motion.div 
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {categories.map(category => (
            <motion.div 
              key={category.id}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              {isAuthenticated ? (
                <Link 
                  to={`/category/${category.slug}`} 
                  className="glassmorphism block p-6 text-center hover:border-neon-blue/50 transition-all"
                >
                  <h3 className="font-orbitron text-white">{category.name}</h3>
                </Link>
              ) : (
                <div className="glassmorphism block p-6 text-center">
                  <h3 className="font-orbitron text-white">{category.name}</h3>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </section>
      
      {/* Featured Products */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-2">
            <FiTrendingUp size={20} className="text-neon-blue" />
            <h2 className="text-2xl font-orbitron font-bold text-white">Productos Destacados</h2>
          </div>
          {isAuthenticated ? (
            <Link to="/products" className="text-neon-blue hover:text-neon-purple transition-colors flex items-center space-x-1">
              <span>Ver más</span>
              <FiArrowRight size={16} />
            </Link>
          ) : (
            <Link to="/login" className="text-neon-blue hover:text-neon-purple transition-colors flex items-center space-x-1">
              <span>Iniciar Sesión</span>
              <FiArrowRight size={16} />
            </Link>
          )}
        </div>
        
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {featuredProducts.length > 0 ? (
            featuredProducts.map(product => (
              <motion.div key={product.id} variants={itemVariants}>
                <ProductCard product={product} isPreview={!isAuthenticated} />
              </motion.div>
            ))
          ) : (
            <p className="text-white/60 col-span-full text-center py-12">
              No hay productos disponibles en este momento
            </p>
          )}
        </motion.div>
        
        {!isAuthenticated && (
          <div className="mt-12 text-center">
            <p className="text-white/80 mb-4">Inicia sesión para ver más detalles y comprar productos</p>
            <Link to="/login" className="btn-primary inline-flex items-center space-x-2">
              <span>Iniciar Sesión</span>
              <FiArrowRight />
            </Link>
          </div>
        )}
      </section>
    </div>
  )
}

export default HomePage 