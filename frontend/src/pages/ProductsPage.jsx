import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiSearch, FiFilter, FiX } from 'react-icons/fi'
import { getAllProducts, getAllCategories } from '../api/productApi'
import ProductCard from '../components/ProductCard'

const ProductsPage = () => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Filtering state
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 })
  const [showFilters, setShowFilters] = useState(false)
  
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
        
        // Set max price based on most expensive product
        const maxProductPrice = Math.max(...productsData.map(product => parseFloat(product.price)))
        setPriceRange(prev => ({ ...prev, max: Math.ceil(maxProductPrice) }))
      } catch (err) {
        setError('Error al cargar los productos')
        console.error('Error fetching data:', err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])
  
  // Filter products based on search, category, and price
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = selectedCategory === 'all' || 
                           (product.category === parseInt(selectedCategory))
    
    const matchesPrice = parseFloat(product.price) >= priceRange.min && 
                         parseFloat(product.price) <= priceRange.max
    
    return matchesSearch && matchesCategory && matchesPrice
  })
  
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
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-orbitron font-bold text-white">
          Nuestros Productos
        </h1>
        
        {/* Mobile filter toggle */}
        <button 
          className="md:hidden btn-secondary flex items-center space-x-2"
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? (
            <>
              <FiX />
              <span>Ocultar Filtros</span>
            </>
          ) : (
            <>
              <FiFilter />
              <span>Mostrar Filtros</span>
            </>
          )}
        </button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters - Desktop (always visible) & Mobile (toggleable) */}
        <motion.aside 
          className={`glassmorphism p-6 w-full md:w-64 md:block ${showFilters ? 'block' : 'hidden'}`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-xl font-orbitron font-bold mb-6 text-white">Filtros</h2>
          
          {/* Search */}
          <div className="mb-6">
            <label className="block text-white mb-2">Buscar</label>
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neon-blue" />
              <input
                type="text"
                className="input-field pl-10"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          {/* Category filter */}
          <div className="mb-6">
            <label className="block text-white mb-2">Categoría</label>
            <select
              className="input-field"
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
            >
              <option value="all">Todas las categorías</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* Price range */}
          <div className="mb-6">
            <label className="block text-white mb-2">Precio</label>
            <div className="flex items-center justify-between gap-4 mb-2">
              <input
                type="number"
                min="0"
                className="input-field w-24"
                value={priceRange.min}
                onChange={e => setPriceRange({...priceRange, min: parseInt(e.target.value) || 0})}
              />
              <span className="text-white">a</span>
              <input
                type="number"
                min="0"
                className="input-field w-24"
                value={priceRange.max}
                onChange={e => setPriceRange({...priceRange, max: parseInt(e.target.value) || 0})}
              />
            </div>
            <input
              type="range"
              min="0"
              max={priceRange.max}
              value={priceRange.min}
              onChange={e => setPriceRange({...priceRange, min: parseInt(e.target.value)})}
              className="w-full accent-neon-blue"
            />
            <input
              type="range"
              min="0"
              max={Math.max(10000, ...products.map(p => parseFloat(p.price)))}
              value={priceRange.max}
              onChange={e => setPriceRange({...priceRange, max: parseInt(e.target.value)})}
              className="w-full accent-neon-blue"
            />
          </div>
          
          {/* Reset filters button */}
          <button 
            className="btn-secondary w-full"
            onClick={() => {
              setSearchTerm('')
              setSelectedCategory('all')
              setPriceRange({ 
                min: 0, 
                max: Math.max(10000, ...products.map(p => parseFloat(p.price))) 
              })
            }}
          >
            Restablecer Filtros
          </button>
        </motion.aside>
        
        {/* Products grid */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <p className="text-white">
              Mostrando <span className="text-neon-blue font-bold">{filteredProducts.length}</span> productos
            </p>
          </div>
          
          {filteredProducts.length > 0 ? (
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredProducts.map(product => (
                <motion.div key={product.id} variants={itemVariants}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="glassmorphism p-8 text-center">
              <h3 className="text-xl font-orbitron font-bold mb-4 text-white">
                No se encontraron productos
              </h3>
              <p className="text-white/70">
                Intenta con otros filtros o busca otro término
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductsPage 