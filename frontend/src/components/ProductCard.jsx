import { motion } from 'framer-motion'
import { FiShoppingCart, FiLock } from 'react-icons/fi'
import { Link } from 'react-router-dom'

const ProductCard = ({ product, isPreview = false }) => {
  // Verificar si product existe
  if (!product) {
    return (
      <div className="card overflow-hidden h-full flex flex-col glassmorphism p-4">
        <p className="text-white/70 text-center text-sm">Producto no disponible</p>
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
      className={`card overflow-hidden h-full flex flex-col glassmorphism rounded-xl ${isPreview ? 'opacity-90' : ''}`}
      whileHover={{ y: -5, boxShadow: '0 5px 15px rgba(0, 195, 255, 0.3)' }}
      transition={{ duration: 0.3 }}
      layout
    >
      {/* Product Image */}
      <div className="relative overflow-hidden h-36 sm:h-44 md:h-52 lg:h-60 bg-black/60 rounded-t-lg">
        <img 
          src={image || '/placeholder-product.jpg'} 
          alt={name} 
          className="w-full h-full object-cover object-center transform transition-transform duration-700 hover:scale-110"
          onError={(e) => {
            e.target.onerror = null
            e.target.src = '/placeholder-product.jpg'
          }}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
          <span className="text-xs sm:text-sm bg-neon-blue/80 text-white uppercase font-bold py-1 px-2 sm:px-3 m-2 rounded-full truncate max-w-[80%]">
            {category_name}
          </span>
        </div>
      </div>
      
      {/* Product Info */}
      <div className="flex-1 flex flex-col p-3 sm:p-4">
        <h3 className="text-base sm:text-lg md:text-xl font-orbitron font-bold mb-1 sm:mb-2 text-white truncate">{name}</h3>
        <p className="text-white/70 mb-2 sm:mb-4 text-xs sm:text-sm flex-1 line-clamp-2 sm:line-clamp-3">{truncateDescription(description)}</p>
        
        <div className="flex flex-wrap sm:flex-nowrap items-center justify-between mt-auto gap-2">
          <span className="text-lg sm:text-xl md:text-2xl font-bold text-neon-blue">${formatPrice(price)}</span>
          
          {isPreview ? (
            <Link to="/login" className="flex items-center space-x-1 sm:space-x-2 text-white/80 hover:text-neon-blue transition-colors duration-300">
              <FiLock className="text-sm sm:text-base" />
              <span className="text-xs sm:text-sm">Iniciar sesión</span>
            </Link>
          ) : (
            <div className="flex items-center space-x-2">
              <span className={`text-xs sm:text-sm ${stock > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {stock > 0 ? `${stock} disp.` : 'Agotado'}
              </span>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-neon-blue/80 
                          hover:bg-neon-blue text-white shadow-lg hover:shadow-neon-blue transition-all duration-300"
                disabled={stock <= 0}
                aria-label="Añadir al carrito"
              >
                <FiShoppingCart className="text-xs sm:text-sm md:text-base" />
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default ProductCard