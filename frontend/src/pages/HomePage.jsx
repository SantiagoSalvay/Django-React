import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowRight, FiTrendingUp, FiTag, FiPackage } from 'react-icons/fi'
import { getAllProducts, getAllCategories } from '../api/productApi'
import ProductCard from '../components/ProductCard'
import { useAuth } from '../context/AuthContext'
import useRefresh from '../hooks/useRefresh'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

const HomePage = () => {
  const [categories, setCategories] = useState([])
  const { isAuthenticated } = useAuth()
  
  // Usar el hook personalizado para obtener y actualizar productos automáticamente
  const { 
    data: productsData, 
    loading, 
    error 
  } = useRefresh(getAllProducts, { 
    interval: 15000, // Actualizar cada 15 segundos
    debug: true // Activar logs para depuración
  }) 
  
  // Asegurar que products siempre sea un array
  const products = productsData || []
  
  // Obtener categorías (solo una vez al cargar la página)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getAllCategories()
        setCategories(categoriesData)
      } catch (err) {
        console.error('Error fetching categories:', err)
      }
    }
    
    fetchCategories()
  }, [])
  
  // Get featured products (primeros productos que no sean combos ni tengan descuento)
  const featuredProducts = products
    .filter(product => !product.has_discount && !product.is_combo)
    .slice(0, 4)
  
  // Get products with discounts
  const discountedProducts = products
    .filter(product => product.has_discount || product.discount_percentage > 0)
    .slice(0, 8)
  
  // Get combo products
  const comboProducts = products
    .filter(product => product.is_combo)
    .slice(0, 4)
  
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
  
  if (loading && !products.length) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-neon-blue"></div>
        <p className="ml-4 text-white font-orbitron">Cargando productos...</p>
      </div>
    )
  }
  
  if (error && !products.length) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-orbitron text-red-400 mb-4">Error</h2>
        <p className="text-white/70">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-neon-blue text-white rounded-md hover:bg-neon-blue/80 transition"
        >
          Reintentar
        </button>
      </div>
    )
  }
  
  return (
    <div className="mt-20">
      {/* Hero Section */}
      <section className="mb-10 sm:mb-16">
        <div className="glassmorphism p-6 sm:p-10 border-neon-blue/30 bg-black/50">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 mb-6 lg:mb-0">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-orbitron font-bold text-white mb-4 leading-tight">
                Tecnología de <span className="text-neon-blue">Vanguardia</span> a tu Alcance
              </h1>
              <p className="text-white/80 text-base sm:text-lg mb-6">
                Descubre los mejores productos tecnológicos con ofertas exclusivas y envíos a todo el país. Encuentra smartphones, laptops, accesorios y mucho más.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/products" className="btn-primary">
                  Ver Productos
                </Link>
                <Link to="/about" className="btn-secondary">
                  Conoce más
                </Link>
              </div>
            </div>
            <div className="lg:w-1/2 lg:pl-10">
              <div className="relative">
                <div className="glassmorphism rounded-2xl overflow-hidden border-neon-blue/30 shadow-lg shadow-neon-blue/20">
                  <img 
                    src="/hero-image.jpg" 
                    alt="Latest Technology Products" 
                    className="w-full h-auto object-cover"
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = 'https://via.placeholder.com/800x400?text=Tecnología+Avanzada'
                    }}
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 bg-neon-blue/90 text-white p-3 rounded-lg shadow-lg transform rotate-3">
                  <p className="text-lg sm:text-xl font-orbitron font-bold">¡Ofertas Exclusivas!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
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
      </section>
      
      {/* Discounted Products */}
      <section className="mb-10 sm:mb-16">
        <div className="flex items-center justify-between mb-4 sm:mb-8">
          <div className="flex items-center space-x-2">
            <FiTag size={20} className="text-rose-500" />
            <h2 className="text-xl sm:text-2xl font-orbitron font-bold text-white">
              <span className="text-rose-500">🔥</span> Ofertas y Descuentos <span className="text-rose-500">🔥</span>
            </h2>
          </div>
          {isAuthenticated ? (
            <Link to="/discounted" className="text-rose-500 hover:text-rose-400 transition-colors flex items-center space-x-1 text-sm sm:text-base">
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