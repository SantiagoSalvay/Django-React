import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiUser, FiLock, FiArrowRight } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'

const LoginPage = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const { login, error, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  
  useEffect(() => {
    // Check for the verified parameter in the URL
    const params = new URLSearchParams(location.search)
    const verified = params.get('verified')
    
    if (verified === '1') {
      setSuccessMessage('¡Cuenta verificada! Ahora puedes iniciar sesión.')
    } else if (verified === '0') {
      setErrorMessage('Error al verificar la cuenta. Por favor, intenta de nuevo o contacta con soporte.')
    }
  }, [location])
  
  useEffect(() => {
    if (error) {
      setErrorMessage(typeof error === 'string' ? error : 'Error al iniciar sesión. Por favor, intenta de nuevo.')
    }
  }, [error])
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')
    
    if (!username || !password) {
      setErrorMessage('Por favor, completa todos los campos.')
      return
    }
    
    await login(username, password)
  }
  
  return (
    <div className="flex flex-col justify-center items-center min-h-[calc(100vh-200px)]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md glassmorphism p-8"
      >
        <h2 className="text-3xl font-orbitron font-bold text-center mb-8 text-white">
          Iniciar Sesión
        </h2>
        
        {errorMessage && (
          <div className="bg-red-500/20 border border-red-500 text-white p-3 rounded-lg mb-6">
            {errorMessage}
          </div>
        )}
        
        {successMessage && (
          <div className="bg-green-500/20 border border-green-500 text-white p-3 rounded-lg mb-6">
            {successMessage}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-white mb-2 font-rajdhani">Usuario</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiUser className="text-neon-blue" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-field pl-10"
                placeholder="Nombre de usuario"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-white mb-2 font-rajdhani">Contraseña</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="text-neon-blue" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pl-10"
                placeholder="Contraseña"
              />
            </div>
          </div>
          
          <motion.button
            type="submit"
            className="btn-primary w-full flex items-center justify-center space-x-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>Acceder</span>
            <FiArrowRight />
          </motion.button>
        </form>
        
        <div className="mt-6 text-center text-white/70">
          <p>¿No tienes una cuenta?{' '}
            <Link to="/register" className="text-neon-blue hover:underline transition-all">
              Regístrate
            </Link>
          </p>
        </div>
      </motion.div>
      
      {/* Admin credentials hint */}
      <div className="mt-8 text-white/50 text-center text-sm max-w-md">
        <p>Para probar como administrador:</p>
        <p>Email: admin@admin</p>
        <p>Contraseña: admin</p>
      </div>
    </div>
  )
}

export default LoginPage 