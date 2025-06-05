import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { FiArrowRight, FiTrendingUp, FiTag, FiPackage, FiChevronDown } from 'react-icons/fi'
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
        console.log('Categorías cargadas:', categoriesData)
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
    .filter(product => {
      const hasDiscount = product.has_discount === true || product.discount_percentage > 0
      const hasOriginalPrice = product.original_price && parseFloat(product.original_price) > parseFloat(product.price)
      return hasDiscount && hasOriginalPrice
    })
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
  
  // Scroll animations
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.3]);
  const heroY = useTransform(scrollY, [0, 300], [0, -50]);
  const scrollIndicatorOpacity = useTransform(scrollY, [0, 100], [1, 0]);
  
  return (
    <div className="mt-8">
      {/* Hero Section with Parallax Effect */}
      <motion.section 
        className="mb-10 sm:mb-16 relative"
        style={{ opacity: heroOpacity, y: heroY }}
      >
        <div className="glassmorphism p-6 sm:p-10 border-neon-blue/30 bg-black/50 overflow-hidden">
          <motion.div 
            className="flex flex-col lg:flex-row items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="lg:w-1/2 mb-6 lg:mb-0">
              <motion.h1 
                className="text-3xl sm:text-4xl md:text-5xl font-orbitron font-bold text-white mb-4 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                Tecnología de <motion.span 
                  className="text-neon-blue"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    textShadow: ["0 0 5px #00f5ff", "0 0 15px #00f5ff", "0 0 5px #00f5ff"] 
                  }}
                  transition={{ 
                    duration: 0.5, 
                    delay: 0.8,
                    textShadow: {
                      repeat: Infinity,
                      duration: 2,
                      repeatType: "reverse"
                    }
                  }}
                >Vanguardia</motion.span> a tu Alcance
              </motion.h1>
              <motion.p 
                className="text-white/80 text-base sm:text-lg mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
              >
                Descubre los mejores productos tecnológicos con ofertas exclusivas y envíos a todo el país. Encuentra smartphones, laptops, accesorios y mucho más.
              </motion.p>
              <motion.div 
                className="flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.6 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link to="/products" className="btn-primary">
                    Ver Productos
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link to="/about" className="btn-secondary">
                    Conoce más
                  </Link>
                </motion.div>
              </motion.div>
            </div>
            <div className="lg:w-1/2 lg:pl-10">
              <motion.div 
                className="relative"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <motion.div 
                  className="glassmorphism rounded-2xl overflow-hidden border-neon-blue/30 shadow-lg shadow-neon-blue/20"
                  whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(0, 245, 255, 0.3)" }}
                  transition={{ duration: 0.3 }}
                >
                  <img 
                    src="/hero-image.jpg" 
                    alt="Latest Technology Products" 
                    className="w-full h-auto object-cover"
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = 'https://via.placeholder.com/800x400?text=Tecnología+Avanzada'
                    }}
                  />
                </motion.div>
                <motion.div 
                  className="absolute -bottom-4 -right-4 bg-neon-blue/90 text-white p-3 rounded-lg shadow-lg"
                  initial={{ rotate: 0, scale: 0 }}
                  animate={{ rotate: 3, scale: 1 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 300, 
                    damping: 15,
                    delay: 1 
                  }}
                >
                  <p className="text-lg sm:text-xl font-orbitron font-bold">¡Ofertas Exclusivas!</p>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
        
        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
          style={{ opacity: scrollIndicatorOpacity }}
          animate={{ y: [0, 10, 0] }}
          transition={{ 
            y: {
              repeat: Infinity,
              duration: 1.5,
              ease: "easeInOut" 
            }
          }}
        >
          <p className="text-white/70 text-sm mb-2">Descubre más</p>
          <FiChevronDown className="text-neon-blue text-2xl" />
        </motion.div>
      </motion.section>
      
      {/* Categories Section */}
      <motion.section 
        className="mb-10 sm:mb-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <motion.div 
          className="flex items-center justify-between mb-4 sm:mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center space-x-2">
            <motion.div
              animate={{ 
                rotate: [0, 5, 0, -5, 0],
                scale: [1, 1.1, 1] 
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                repeatDelay: 2
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </motion.div>
            <motion.h2 
              className="text-xl sm:text-2xl font-orbitron font-bold text-white"
              initial={{ backgroundPosition: "0% 50%" }}
              animate={{ backgroundPosition: "100% 50%" }}
              transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
              style={{
                backgroundImage: "linear-gradient(90deg, #fff, #a855f7, #fff)",
                backgroundSize: "200%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}
            >
              Categorías
            </motion.h2>
          </div>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {categories.length > 0 ? (
            categories.map((category, index) => (
              <motion.div 
                key={category.id} 
                variants={itemVariants}
                whileHover={{ 
                  y: -5,
                  scale: 1.05,
                  boxShadow: "0 10px 25px -5px rgba(168, 85, 247, 0.4)",
                  transition: { duration: 0.3 }
                }}
                custom={index}
              >
                <Link 
                  to={`/category/${category.slug}`}
                  className="block glassmorphism p-4 border-purple-500/30 bg-black/40 rounded-lg text-center h-full flex flex-col justify-center items-center transition-all"
                >
                  <motion.div 
                    className="w-12 h-12 mb-3 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center"
                    whileHover={{ rotate: 10 }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </motion.div>
                  <h3 className="font-bold text-white">{category.name}</h3>
                </Link>
              </motion.div>
            ))
          ) : (
            <motion.p 
              className="text-white/60 col-span-full text-center py-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              No hay categorías disponibles en este momento
            </motion.p>
          )}
        </motion.div>
      </motion.section>
      
      {/* Featured Products */}
      <motion.section 
        className="mb-10 sm:mb-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <motion.div 
          className="flex items-center justify-between mb-4 sm:mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center space-x-2">
            <motion.div
              animate={{ 
                rotate: [0, 10, 0],
                scale: [1, 1.2, 1] 
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                repeatDelay: 5
              }}
            >
              <FiTrendingUp size={20} className="text-neon-blue" />
            </motion.div>
            <motion.h2 
              className="text-xl sm:text-2xl font-orbitron font-bold text-white"
              initial={{ backgroundPosition: "0% 50%" }}
              animate={{ backgroundPosition: "100% 50%" }}
              transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
              style={{
                backgroundImage: "linear-gradient(90deg, #fff, #00f5ff, #fff)",
                backgroundSize: "200%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}
            >
              Productos Destacados
            </motion.h2>
          </div>
          {isAuthenticated ? (
            <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.95 }}>
              <Link to="/products" className="text-neon-blue hover:text-neon-purple transition-colors flex items-center space-x-1 text-sm sm:text-base">
                <span>Ver más</span>
                <FiArrowRight size={16} />
              </Link>
            </motion.div>
          ) : (
            <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.95 }}>
              <Link to="/login" className="text-neon-blue hover:text-neon-purple transition-colors flex items-center space-x-1 text-sm sm:text-base">
                <span>Iniciar Sesión</span>
                <FiArrowRight size={16} />
              </Link>
            </motion.div>
          )}
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {featuredProducts.length > 0 ? (
            featuredProducts.map((product, index) => (
              <motion.div 
                key={product.id} 
                variants={itemVariants}
                whileHover={{ 
                  y: -10,
                  transition: { duration: 0.3 }
                }}
                custom={index}
              >
                <ProductCard product={product} isPreview={!isAuthenticated} />
              </motion.div>
            ))
          ) : (
            <motion.p 
              className="text-white/60 col-span-full text-center py-8 sm:py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              No hay productos disponibles en este momento
            </motion.p>
          )}
        </motion.div>
      </motion.section>
      
      {/* Discounted Products */}
      <motion.section 
        className="mb-10 sm:mb-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <motion.div 
          className="flex items-center justify-between mb-4 sm:mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center space-x-2">
            <motion.div
              animate={{ 
                rotate: [0, -10, 0],
                scale: [1, 1.2, 1] 
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                repeatDelay: 4
              }}
            >
              <FiTag size={20} className="text-rose-500" />
            </motion.div>
            <h2 className="text-xl sm:text-2xl font-orbitron font-bold text-white">
              <motion.span 
                className="text-rose-500"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [1, 0.8, 1],
                  textShadow: ["0 0 5px #ff4d6d", "0 0 15px #ff4d6d", "0 0 5px #ff4d6d"]
                }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity,
                  repeatType: "reverse" 
                }}
              >🔥</motion.span> 
              <motion.span
                initial={{ backgroundPosition: "0% 50%" }}
                animate={{ backgroundPosition: "100% 50%" }}
                transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
                style={{
                  backgroundImage: "linear-gradient(90deg, #fff, #ff4d6d, #fff)",
                  backgroundSize: "200%",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  display: "inline-block"
                }}
              >
                Ofertas y Descuentos
              </motion.span> 
              <motion.span 
                className="text-rose-500"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [1, 0.8, 1],
                  textShadow: ["0 0 5px #ff4d6d", "0 0 15px #ff4d6d", "0 0 5px #ff4d6d"]
                }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: 0.5
                }}
              >🔥</motion.span>
            </h2>
          </div>
          {isAuthenticated ? (
            <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.95 }}>
              <Link to="/discounted" className="text-rose-500 hover:text-rose-400 transition-colors flex items-center space-x-1 text-sm sm:text-base">
                <span>Ver más</span>
                <FiArrowRight size={16} />
              </Link>
            </motion.div>
          ) : (
            <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.95 }}>
              <Link to="/login" className="text-rose-500 hover:text-rose-400 transition-colors flex items-center space-x-1 text-sm sm:text-base">
                <span>Iniciar Sesión</span>
                <FiArrowRight size={16} />
              </Link>
            </motion.div>
          )}
        </motion.div>
        
        <motion.div 
          className="glassmorphism p-4 sm:p-6 border-rose-500/30 bg-black/40"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          whileHover={{ boxShadow: "0 0 20px rgba(255, 77, 109, 0.3)" }}
        >
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
                <motion.div 
                  key={product.id} 
                  className="px-2"
                  whileHover={{ 
                    y: -10,
                    transition: { duration: 0.3 }
                  }}
                >
                  <ProductCard product={product} isPreview={!isAuthenticated} />
                </motion.div>
              ))}
            </Slider>
          ) : (
            <motion.p 
              className="text-white/60 text-center py-8 sm:py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              No hay productos con descuento disponibles en este momento
            </motion.p>
          )}
        </motion.div>
      </motion.section>
      
      {/* Combo Products */}
      <motion.section 
        className="mb-10 sm:mb-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <motion.div 
          className="flex items-center justify-between mb-4 sm:mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center space-x-2">
            <motion.div
              animate={{ 
                rotate: [0, 10, 0],
                scale: [1, 1.2, 1] 
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                repeatDelay: 3
              }}
            >
              <FiPackage size={20} className="text-emerald-400" />
            </motion.div>
            <h2 className="text-xl sm:text-2xl font-orbitron font-bold text-white">
              <motion.span 
                className="text-emerald-400"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [1, 0.8, 1],
                  textShadow: ["0 0 5px #10b981", "0 0 15px #10b981", "0 0 5px #10b981"]
                }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity,
                  repeatType: "reverse" 
                }}
              >🎁</motion.span> 
              <motion.span
                initial={{ backgroundPosition: "0% 50%" }}
                animate={{ backgroundPosition: "100% 50%" }}
                transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
                style={{
                  backgroundImage: "linear-gradient(90deg, #fff, #10b981, #fff)",
                  backgroundSize: "200%",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  display: "inline-block"
                }}
              >
                Combos Especiales
              </motion.span> 
              <motion.span 
                className="text-emerald-400"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [1, 0.8, 1],
                  rotate: [0, 10, 0],
                  textShadow: ["0 0 5px #10b981", "0 0 15px #10b981", "0 0 5px #10b981"]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: 0.5
                }}
              >✨</motion.span>
            </h2>
          </div>
          {isAuthenticated ? (
            <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.95 }}>
              <Link to="/combos" className="text-emerald-400 hover:text-emerald-300 transition-colors flex items-center space-x-1 text-sm sm:text-base">
                <span>Ver más</span>
                <FiArrowRight size={16} />
              </Link>
            </motion.div>
          ) : (
            <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.95 }}>
              <Link to="/login" className="text-emerald-400 hover:text-emerald-300 transition-colors flex items-center space-x-1 text-sm sm:text-base">
                <span>Iniciar Sesión</span>
                <FiArrowRight size={16} />
              </Link>
            </motion.div>
          )}
        </motion.div>
        
        <motion.div 
          className="glassmorphism p-4 sm:p-6 border-emerald-500/30 bg-black/40"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          whileHover={{ boxShadow: "0 0 20px rgba(16, 185, 129, 0.3)" }}
        >
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {comboProducts.length > 0 ? (
              comboProducts.map((product, index) => (
                <motion.div 
                  key={product.id} 
                  variants={itemVariants}
                  whileHover={{ 
                    y: -10,
                    scale: 1.03,
                    transition: { duration: 0.3 }
                  }}
                  custom={index}
                >
                  <ProductCard product={product} isPreview={!isAuthenticated} />
                </motion.div>
              ))
            ) : (
              <motion.p 
                className="text-white/60 col-span-full text-center py-8 sm:py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                No hay combos disponibles en este momento
              </motion.p>
            )}
          </motion.div>
        </motion.div>
      </motion.section>
    </div>
  )
}

export default HomePage