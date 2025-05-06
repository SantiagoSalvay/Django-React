import { motion } from 'framer-motion'
import { FiShoppingCart, FiLock } from 'react-icons/fi'
import { Link } from 'react-router-dom'

const ProductCard = ({ product, isPreview = false }) => {
  // Verificar si product existe
  if (!product) {
    return (
      <div className="card overflow-hidden h-full flex flex-col bg-black/30 backdrop-blur-xl border border-white/10 rounded-xl shadow-lg p-4">
        <p className="text-white/70 text-center">Producto no disponible</p>
      </div>
    )
  }

  // Valores por defecto para evitar errores
  const {
    image = '',
    name = 'Producto sin nombre',
    category_name = 'Sin categoría',
    description = 'Sin descripción disponible',
    price = 0,
    stock = 0
  } = product

  // Función segura para formatear el precio
  const formatPrice = (price) => {
    try {
      return typeof price === 'number' ? price.toFixed(2) : '0.00'
    } catch (error) {
      return '0.00'
    }
  }

  // Función segura para recortar la descripción
  const truncateDescription = (desc) => {
    if (typeof desc !== 'string') return 'Sin descripción disponible'
    return desc.length > 100 ? `${desc.substring(0, 100)}...` : desc
  }

  return (
    <motion.div 
      className={`card overflow-hidden h-full flex flex-col ${isPreview ? 'opacity-90' : ''}`}
      whileHover={{ y: -5, boxShadow: '0 5px 15px rgba(0, 195, 255, 0.3)' }}
      transition={{ duration: 0.3 }}
    >
      {/* Product Image */}
      <div className="relative overflow-hidden h-60 bg-black/60 rounded-t-lg">
        <img 
          src={image || '/placeholder-product.jpg'} 
          alt={name} 
          className="w-full h-full object-cover object-center transform transition-transform duration-700 hover:scale-110"
          onError={(e) => {
            e.target.onerror = null
            e.target.src = '/placeholder-product.jpg'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
          <span className="text-sm bg-neon-blue/80 text-white uppercase font-bold py-1 px-3 m-2 rounded-full">
            {category_name}
          </span>
        </div>
      </div>
      
      {/* Product Info */}
      <div className="flex-1 flex flex-col p-4">
        <h3 className="text-xl font-orbitron font-bold mb-2 text-white">{name}</h3>
        <p className="text-white/70 mb-4 text-sm flex-1">{truncateDescription(description)}</p>
        
        <div className="flex items-center justify-between mt-auto">
          <span className="text-2xl font-bold text-neon-blue">${formatPrice(price)}</span>
          
          {isPreview ? (
            <Link to="/login" className="flex items-center space-x-2 text-white/80 hover:text-neon-blue">
              <FiLock />
              <span className="text-sm">Iniciar sesión</span>
            </Link>
          ) : (
            <div className="flex items-center space-x-2">
              <span className={`text-sm ${stock > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {stock > 0 ? `${stock} disponibles` : 'Agotado'}
              </span>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-neon-blue/80 
                          hover:bg-neon-blue text-white shadow-lg hover:shadow-neon-blue transition-all duration-300"
                disabled={stock <= 0}
              >
                <FiShoppingCart />
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default ProductCard