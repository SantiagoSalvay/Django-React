import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiHome } from 'react-icons/fi'

const NotFoundPage = () => {
  const navigate = useNavigate()
  
  // Redirect to home after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/')
    }, 10000)
    
    return () => clearTimeout(timer)
  }, [navigate])
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-9xl font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple">
          404
        </h1>
        
        <div className="relative h-40">
          {/* Animated circuit lines */}
          <motion.div
            className="absolute left-1/2 top-0 w-[1px] h-10 bg-neon-blue"
            initial={{ height: 0 }}
            animate={{ height: '100%' }}
            transition={{ duration: 1, delay: 0.5 }}
          />
          <motion.div
            className="absolute left-1/2 top-1/2 w-20 h-[1px] bg-neon-blue"
            initial={{ width: 0 }}
            animate={{ width: '50%' }}
            transition={{ duration: 0.8, delay: 1.5 }}
          />
          <motion.div
            className="absolute right-1/2 top-1/2 w-20 h-[1px] bg-neon-purple"
            initial={{ width: 0 }}
            animate={{ width: '50%' }}
            transition={{ duration: 0.8, delay: 1.5 }}
          />
        </div>
        
        <motion.h2 
          className="text-3xl font-orbitron mb-8 text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 2 }}
        >
          Página No Encontrada
        </motion.h2>
        
        <motion.p 
          className="text-white/70 mb-8 max-w-md mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 2.3 }}
        >
          La página que estás buscando no existe o ha sido desplazada a otra dimensión.
          Serás redirigido a la página principal en 10 segundos.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 2.6 }}
        >
          <Link to="/" className="btn-primary inline-flex items-center space-x-2">
            <FiHome />
            <span>Volver al Inicio</span>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default NotFoundPage 