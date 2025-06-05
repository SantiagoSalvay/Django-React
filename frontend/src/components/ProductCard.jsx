import { motion } from 'framer-motion'
import { FiShoppingCart, FiLock, FiTag, FiPackage } from 'react-icons/fi'
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
    stock = 0,
    original_price,
    discount_percentage,
    has_discount,
    is_combo
  } = product

  // Función segura para formatear el precio
  const formatPrice = (price) => {
    try {
      return typeof price === 'number' ? price.toFixed(2) : parseFloat(price).toFixed(2)
    } catch (error) {
      return '0.00'
    }
  }

  // Función segura para recortar la descripción
  const truncateDescription = (desc) => {
    if (typeof desc !== 'string') return 'Sin descripción disponible'
    return desc.length > 100 ? `${desc.substring(0, 100)}...` : desc
  }

  // Determinar si el producto tiene un descuento válido
  const hasValidDiscount = has_discount === true || discount_percentage > 0
  const hasValidOriginalPrice = original_price && parseFloat(original_price) > parseFloat(price)

  return (
    <motion.div 
      className="card overflow-hidden h-full flex flex-col glassmorphism"
      whileHover={{ 
        y: -5,
        boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
      }}
      transition={{ duration: 0.3 }}
    >
      {/* Badge para descuento o combo */}
      {(has_discount || discount_percentage > 0) && (
        <div className="absolute top-2 right-2 z-10 bg-rose-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
          <FiTag className="mr-1" />
          {discount_percentage || ""}% OFF
        </div>
      )}
      
      {is_combo && (
        <div className="absolute top-2 left-2 z-10 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
          <FiPackage className="mr-1" />
          COMBO
        </div>
      )}
      
      <div className="relative pt-[75%] overflow-hidden bg-black/30">
        <img 
          src={image} 
          alt={name} 
          className="absolute top-0 left-0 w-full h-full object-cover object-center hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.onerror = null
            e.target.src = 'https://via.placeholder.com/300x300?text=No+Image'
          }}
        />
      </div>
      
      <div className="flex-1 flex flex-col p-3 sm:p-4">
        <h3 className="text-base sm:text-lg md:text-xl font-orbitron font-bold mb-1 sm:mb-2 text-white truncate">{name}</h3>
        <p className="text-white/70 mb-2 sm:mb-4 text-xs sm:text-sm flex-1 line-clamp-2 sm:line-clamp-3">{truncateDescription(description)}</p>
        
        <div className="flex flex-wrap sm:flex-nowrap items-center justify-between mt-auto gap-2">
          <div className="flex flex-col">
            {/* Mostrar precio original y con descuento */}
            {hasValidDiscount && hasValidOriginalPrice ? (
              <>
                <span className="text-sm line-through text-white/50">${formatPrice(original_price)}</span>
                <span className="text-lg sm:text-xl md:text-2xl font-bold text-rose-500">${formatPrice(price)}</span>
              </>
            ) : (
              <span className="text-lg sm:text-xl md:text-2xl font-bold text-neon-blue">${formatPrice(price)}</span>
            )}
          </div>
          
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