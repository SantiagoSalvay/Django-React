import { motion } from 'framer-motion'
import { FiPackage } from 'react-icons/fi'
import { getAllProducts } from '../api/productApi'
import ProductCard from '../components/ProductCard'
import { useAuth } from '../context/AuthContext'
import useRefresh from '../hooks/useRefresh'

const CombosPage = () => {
  const { isAuthenticated } = useAuth()
  
  // Usar hook personalizado para obtener datos actualizados
  const { 
    data: productsData = [], 
    loading, 
    error 
  } = useRefresh(getAllProducts, 20000) // Actualizar cada 20 segundos
  
  // Filtrar productos que son combos
  const products = productsData.filter(product => product.is_combo)
  
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
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-emerald-400"></div>
      </div>
    )
  }
  
  if (error && !products.length) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-orbitron text-red-400 mb-4">Error</h2>
        <p className="text-white/70">{error}</p>
      </div>
    )
  }
  
  return (
    <div className="mt-20">
      {/* Header */}
      <section className="mb-12">
        <div className="glassmorphism p-8 border-emerald-500/30 bg-black/40">
          <div className="flex items-center space-x-3 mb-4">
            <FiPackage size={24} className="text-emerald-400" />
            <h1 className="text-3xl font-orbitron font-bold text-white">
              <span className="text-emerald-400">🎁</span> Combos Especiales <span className="text-emerald-400">✨</span>
            </h1>
          </div>
          <p className="text-white/80 max-w-3xl">
            Descubre nuestros combos especiales con productos seleccionados a precios increíbles. Ahorra comprando en conjunto.
          </p>
        </div>
      </section>
      
      {/* Products Grid */}
      <section>
        {products.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {products.map(product => (
              <motion.div key={product.id} variants={itemVariants}>
                <ProductCard product={product} isPreview={!isAuthenticated} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="glassmorphism p-8 text-center">
            <p className="text-white/60">
              No hay combos disponibles en este momento
            </p>
          </div>
        )}
      </section>
    </div>
  )
}

export default CombosPage
