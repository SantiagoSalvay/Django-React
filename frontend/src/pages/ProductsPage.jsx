import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiSearch, FiFilter, FiX, FiTag, FiPackage } from 'react-icons/fi'
import { getAllProducts, getAllCategories } from '../api/productApi'
import ProductCard from '../components/ProductCard'
import useRefresh from '../hooks/useRefresh'

const ProductsPage = () => {
  const [categories, setCategories] = useState([])
  const [error, setError] = useState(null)
  
  // Filtering state
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 })
  const [showFilters, setShowFilters] = useState(false)
  const [showDiscounted, setShowDiscounted] = useState(false)
  const [showCombos, setShowCombos] = useState(false)
  
  // Usar hook personalizado para obtener datos actualizados
  const { 
    data: products = [], 
    loading, 
    error: productsError 
  } = useRefresh(getAllProducts, 20000) // Actualizar cada 20 segundos
  
  // Obtener categorías (solo una vez al iniciar)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getAllCategories()
        setCategories(categoriesData)
        
        // Set max price based on most expensive product if we have products
        if (products.length > 0) {
          const maxProductPrice = Math.max(...products.map(product => parseFloat(product.price)))
          setPriceRange(prev => ({ ...prev, max: Math.ceil(maxProductPrice) }))
        }
      } catch (err) {
        setError('Error al cargar las categorías')
        console.error('Error fetching categories:', err)
      }
    }
    
    fetchCategories()
  }, []) // Solo ejecutar al montar el componente
  
  // Actualizar el rango de precios cuando cambien los productos
  useEffect(() => {
    if (products.length > 0) {
      const maxProductPrice = Math.max(...products.map(product => parseFloat(product.price)))
      setPriceRange(prev => ({ ...prev, max: Math.ceil(maxProductPrice) }))
    }
  }, [products])
  
  // Filter products based on search, category, price, discounts and combos
  const filteredProducts = products
    .filter(product => {
      // Filter by search term
      const matchesSearch = 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      
      // Filter by category
      const matchesCategory = 
        selectedCategory === 'all' || 
        product.category === parseInt(selectedCategory)
      
      // Filter by price
      const price = parseFloat(product.price)
      const matchesPrice = 
        price >= priceRange.min && 
        price <= priceRange.max
      
      // Filter by discount if selected
      const matchesDiscount = 
        !showDiscounted || 
        (product.has_discount || product.discount_percentage > 0)
      
      // Filter by combo if selected
      const matchesCombo = 
        !showCombos || 
        product.is_combo
      
      return matchesSearch && matchesCategory && matchesPrice && matchesDiscount && matchesCombo
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
  
  if (loading && !products.length) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-neon-blue"></div>
      </div>
    )
  }
  
  if ((productsError || error) && !products.length) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-orbitron text-red-400 mb-4">Error</h2>
        <p className="text-white/70">{productsError || error}</p>
      </div>
    )
  }
  
  return (
    <div className="mt-20">
      <h1 className="text-3xl font-orbitron font-bold text-white mb-6">Productos</h1>
      
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-6">
        <button
          className="w-full btn-secondary flex justify-center items-center space-x-2"
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? (
            <>
              <FiX className="text-lg" />
              <span>Cerrar Filtros</span>
            </>
          ) : (
            <>
              <FiFilter className="text-lg" />
              <span>Mostrar Filtros</span>
            </>
          )}
        </button>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters */}
        <div className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <div className="glassmorphism p-4 sm:p-6 sticky top-24">
            <div className="flex justify-between items-center lg:hidden mb-4">
              <h2 className="text-xl font-orbitron font-bold text-white">Filtros</h2>
              <button onClick={() => setShowFilters(false)} className="text-white/70 hover:text-white">
                <FiX size={20} />
              </button>
            </div>
            
            <h2 className="text-xl font-orbitron font-bold mb-6 text-white hidden lg:block">Filtros</h2>
            
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
              <label className="block text-white mb-2">Rango de Precio</label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    type="number"
                    min="0"
                    className="input-field"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={e => setPriceRange({ ...priceRange, min: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <input
                    type="number"
                    className="input-field"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={e => setPriceRange({ ...priceRange, max: parseInt(e.target.value) || 10000 })}
                  />
                </div>
              </div>
            </div>
            
            {/* Discount filter */}
            <div className="mb-6">
              <label className="flex items-center space-x-2 text-white">
                <input
                  type="checkbox"
                  checked={showDiscounted}
                  onChange={() => setShowDiscounted(!showDiscounted)}
                  className="rounded text-neon-blue focus:ring-neon-blue"
                />
                <span className="flex items-center">
                  <FiTag className="mr-1 text-rose-500" />
                  Solo con descuento
                </span>
              </label>
            </div>
            
            {/* Combo filter */}
            <div className="mb-6">
              <label className="flex items-center space-x-2 text-white">
                <input
                  type="checkbox"
                  checked={showCombos}
                  onChange={() => setShowCombos(!showCombos)}
                  className="rounded text-neon-blue focus:ring-neon-blue"
                />
                <span className="flex items-center">
                  <FiPackage className="mr-1 text-emerald-400" />
                  Solo combos
                </span>
              </label>
            </div>
            
            {/* Reset filters */}
            <button
              className="btn-secondary w-full"
              onClick={() => {
                setSearchTerm('')
                setSelectedCategory('all')
                setPriceRange({ min: 0, max: Math.ceil(Math.max(...products.map(product => parseFloat(product.price)))) })
                setShowDiscounted(false)
                setShowCombos(false)
              }}
            >
              Limpiar Filtros
            </button>
          </div>
        </div>
        
        {/* Products grid */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <p className="text-white">
              Mostrando <span className="text-neon-blue font-bold">{filteredProducts.length}</span> productos
            </p>
            {loading && products.length > 0 && (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-neon-blue"></div>
                <span className="text-white/70 text-sm">Actualizando...</span>
              </div>
            )}
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