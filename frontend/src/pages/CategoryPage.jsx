import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowLeft } from 'react-icons/fi'
import { getProductsByCategory, getCategoryBySlug } from '../api/productApi'
import ProductCard from '../components/ProductCard'

const CategoryPage = () => {
  const { slug } = useParams()
  const [products, setProducts] = useState([])
  const [category, setCategory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        const [productsData, categoryData] = await Promise.all([
          getProductsByCategory(slug),
          getCategoryBySlug(slug)
        ])
        
        setProducts(productsData)
        setCategory(categoryData)
      } catch (err) {
        setError(`Error al cargar productos de la categoría ${slug}`)
        console.error('Error fetching category data:', err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [slug])
  
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
        <Link to="/products" className="btn-primary mt-6 inline-flex items-center space-x-2">
          <FiArrowLeft />
          <span>Volver a Productos</span>
        </Link>
      </div>
    )
  }
  
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-orbitron font-bold text-white">
            {category?.name || slug}
          </h1>
          <p className="text-white/70 mt-2">
            {products.length} productos encontrados
          </p>
        </div>
        <Link to="/products" className="btn-secondary flex items-center space-x-2">
          <FiArrowLeft />
          <span>Volver</span>
        </Link>
      </div>
      
      {products.length > 0 ? (
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {products.map(product => (
            <motion.div key={product.id} variants={itemVariants}>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="glassmorphism p-12 text-center">
          <h3 className="text-xl font-orbitron font-bold mb-4 text-white">
            No hay productos en esta categoría
          </h3>
          <p className="text-white/70 mb-6">
            Actualmente no hay productos disponibles en la categoría {category?.name || slug}.
          </p>
          <Link to="/products" className="btn-primary inline-flex items-center space-x-2">
            <FiArrowLeft />
            <span>Explorar todos los productos</span>
          </Link>
        </div>
      )}
    </div>
  )
}

export default CategoryPage 