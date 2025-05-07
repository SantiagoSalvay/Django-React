import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowRight, FiTrendingUp, FiTag, FiPackage } from 'react-icons/fi'
import { getAllProducts, getAllCategories } from '../api/productApi'
import ProductCard from '../components/ProductCard'
import { useAuth } from '../context/AuthContext'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

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
  
  // Get products with discounts (next 6 products for demo)
  const discountedProducts = products.slice(4, 10)
  
  // Get combo products (next 4 products for demo)
  const comboProducts = products.slice(10, 14)
  
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
        <div className="animate-spin rounded-full h-12 w-12 md:h-16 md:w-16 border-t-2 border-b-2 border-neon-blue"></div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="text-center py-12 md:py-20">
        <h2 className="text-xl md:text-2xl font-orbitron text-red-400 mb-4">Error</h2>
        <p className="text-white/70">{error}</p>
      </div>
    )
  }
  
  return (
    <div className="mt-16 sm:mt-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden mb-8 sm:mb-16 rounded-2xl glassmorphism">
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-black/80 to-black/40"></div>
        
        <div className="relative z-10 px-4 sm:px-6 py-10 sm:py-16 md:py-24 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-orbitron font-bold mb-4 sm:mb-6 text-white">
              <span className="block">El Futuro de la Tecnología</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple">
                En Tu Hogar
              </span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl text-white/80 max-w-2xl mb-6 sm:mb-8">
              Descubre la más amplia selección de electrodomésticos con tecnología de punta, 
              diseño elegante y precios increíbles.
            </p>
            
            {isAuthenticated ? (
              <Link to="/products" className="btn-primary inline-flex items-center space-x-2 text-sm sm:text-base py-2 px-4 sm:py-2 sm:px-6">
                <span>Ver Productos</span>
                <FiArrowRight />
              </Link>
            ) : (
              <Link to="/login" className="btn-primary inline-flex items-center space-x-2 text-sm sm:text-base py-2 px-4 sm:py-2 sm:px-6">
                <span>Iniciar Sesión</span>
                <FiArrowRight />
              </Link>
            )}
          </motion.div>
        </div>
      </section>
      
      {/* Categories Section */}
      <section className="mb-10 sm:mb-16">
        <div className="flex items-center justify-between mb-4 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-orbitron font-bold text-white">Categorías</h2>
          {isAuthenticated ? (
            <Link to="/products" className="text-neon-blue hover:text-neon-purple transition-colors flex items-center space-x-1 text-sm sm:text-base">
              <span>Ver todas</span>
              <FiArrowRight size={16} />
            </Link>
          ) : (
            <Link to="/login" className="text-neon-blue hover:text-neon-purple transition-colors flex items-center space-x-1 text-sm sm:text-base">
              <span>Iniciar Sesión</span>
              <FiArrowRight size={16} />
            </Link>
          )}
        </div>
        
        <motion.div 
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4"
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
                  className="glassmorphism block p-3 sm:p-6 text-center hover:border-neon-blue/50 transition-all"
                >
                  <h3 className="font-orbitron text-sm sm:text-base text-white truncate">{category.name}</h3>
                </Link>
              ) : (
                <div className="glassmorphism block p-3 sm:p-6 text-center">
                  <h3 className="font-orbitron text-sm sm:text-base text-white truncate">{category.name}</h3>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </section>
      
      {/* Featured Products */}
      <section className="mb-10 sm:mb-16">
        <div className="flex items-center justify-between mb-4 sm:mb-8">
          <div className="flex items-center space-x-2">
            <FiTrendingUp size={20} className="text-neon-blue" />
            <h2 className="text-xl sm:text-2xl font-orbitron font-bold text-white">Productos Destacados</h2>
          </div>
          {isAuthenticated ? (
            <Link to="/products" className="text-neon-blue hover:text-neon-purple transition-colors flex items-center space-x-1 text-sm sm:text-base">
              <span>Ver más</span>
              <FiArrowRight size={16} />
            </Link>
          ) : (
            <Link to="/login" className="text-neon-blue hover:text-neon-purple transition-colors flex items-center space-x-1 text-sm sm:text-base">
              <span>Iniciar Sesión</span>
              <FiArrowRight size={16} />
            </Link>
          )}
        </div>
        
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
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
            <p className="text-white/60 col-span-full text-center py-8 sm:py-12">
              No hay productos disponibles en este momento
            </p>
          )}
        </motion.div>
        
        {!isAuthenticated && (
          <div className="mt-8 sm:mt-12 text-center">
            <p className="text-white/80 mb-4 text-sm sm:text-base">Inicia sesión para ver más detalles y comprar productos</p>
            <Link to="/login" className="btn-primary inline-flex items-center space-x-2 text-sm sm:text-base py-2 px-4 sm:py-2 sm:px-6">
              <span>Iniciar Sesión</span>
              <FiArrowRight />
            </Link>
          </div>
        )}
      </section>
      
      {/* Discounted Products Carousel */}
      <section className="mb-10 sm:mb-16">
        <div className="flex items-center justify-between mb-4 sm:mb-8">
          <div className="flex items-center space-x-2">
            <FiTag size={20} className="text-rose-500" />
            <h2 className="text-xl sm:text-2xl font-orbitron font-bold text-white">
              <span className="text-rose-500">🔥</span> Productos con Descuento <span className="text-rose-500">🔥</span>
            </h2>
          </div>
          {isAuthenticated ? (
            <Link to="/discounted-products" className="text-rose-500 hover:text-rose-400 transition-colors flex items-center space-x-1 text-sm sm:text-base">
              <span>Ver más</span>
              <FiArrowRight size={16} />
            </Link>
          ) : (
            <Link to="/login" className="text-rose-500 hover:text-rose-400 transition-colors flex items-center space-x-1 text-sm sm:text-base">
              <span>Iniciar Sesión</span>
              <FiArrowRight size={16} />
            </Link>
          )}
        </div>
        
        <div className="glassmorphism p-4 sm:p-6 border-rose-500/30 bg-black/40">
          {discountedProducts.length > 0 ? (
            <Slider
              dots={true}
              infinite={true}
              speed={500}
              slidesToShow={3}
              slidesToScroll={1}
              autoplay={true}
              autoplaySpeed={3000}
              pauseOnHover={true}
              responsive={[
                {
                  breakpoint: 1280,
                  settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1
                  }
                },
                {
                  breakpoint: 1024,
                  settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                  }
                },
                {
                  breakpoint: 640,
                  settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                  }
                }
              ]}
              className="discount-carousel"
            >
              {discountedProducts.map(product => (
                <div key={product.id} className="px-2">
                  <ProductCard product={product} isPreview={!isAuthenticated} />
                </div>
              ))}
            </Slider>
          ) : (
            <p className="text-white/60 text-center py-8 sm:py-12">
              No hay productos con descuento disponibles en este momento
            </p>
          )}
        </div>
      </section>
      
      {/* Combo Products */}
      <section className="mb-10 sm:mb-16">
        <div className="flex items-center justify-between mb-4 sm:mb-8">
          <div className="flex items-center space-x-2">
            <FiPackage size={20} className="text-emerald-400" />
            <h2 className="text-xl sm:text-2xl font-orbitron font-bold text-white">
              <span className="text-emerald-400">🎁</span> Combos Especiales <span className="text-emerald-400">✨</span>
            </h2>
          </div>
          {isAuthenticated ? (
            <Link to="/combos" className="text-emerald-400 hover:text-emerald-300 transition-colors flex items-center space-x-1 text-sm sm:text-base">
              <span>Ver más</span>
              <FiArrowRight size={16} />
            </Link>
          ) : (
            <Link to="/login" className="text-emerald-400 hover:text-emerald-300 transition-colors flex items-center space-x-1 text-sm sm:text-base">
              <span>Iniciar Sesión</span>
              <FiArrowRight size={16} />
            </Link>
          )}
        </div>
        
        <div className="glassmorphism p-4 sm:p-6 border-emerald-500/30 bg-black/40">
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {comboProducts.length > 0 ? (
              comboProducts.map(product => (
                <motion.div key={product.id} variants={itemVariants}>
                  <ProductCard product={product} isPreview={!isAuthenticated} />
                </motion.div>
              ))
            ) : (
              <p className="text-white/60 col-span-full text-center py-8 sm:py-12">
                No hay combos disponibles en este momento
              </p>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default HomePage 