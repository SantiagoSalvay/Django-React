import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiUser, FiLock, FiArrowRight } from 'react-icons/fi'
import { FcGoogle } from 'react-icons/fc'
import { useAuth } from '../context/AuthContext'

const LoginPage = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [isVerifying, setIsVerifying] = useState(false)
  const { login, error, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  
  const searchParams = new URLSearchParams(location.search);
  const returnUrl = searchParams.get('returnTo') || '/';
  const verified = searchParams.get('verified');

  useEffect(() => {
    if (verified) {
      setIsVerifying(true)
      setTimeout(() => {
        if (verified === '1') {
          setSuccessMessage('¡Tu cuenta ha sido verificada exitosamente! Ahora puedes iniciar sesión para acceder a todos nuestros productos.')
        } else if (verified === '0') {
          setErrorMessage('Hubo un problema al verificar tu cuenta. El enlace puede haber expirado o ser inválido. Por favor, contacta a soporte si el problema persiste.')
        }
        setIsVerifying(false)
      }, 1000)
    }
  }, [verified])

  useEffect(() => {
    if (error) {
      setErrorMessage(typeof error === 'string' ? error : 'Error al iniciar sesión. Por favor, intenta de nuevo.')
    }
  }, [error])

  useEffect(() => {
    if (isAuthenticated) {
      navigate(returnUrl)
    }
  }, [isAuthenticated, navigate, returnUrl])

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

  const handleGoogleLogin = () => {
    // Implementar login con Google
    console.log('Login con Google')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-gray-900 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md glassmorphism p-8"
      >
        <h2 className="text-3xl font-orbitron font-bold text-center mb-8 text-white">
          {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
        </h2>
        
        {isVerifying && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neon-blue mx-auto mb-4"></div>
            <p className="text-white">Verificando tu cuenta...</p>
          </div>
        )}
        
        {!isVerifying && (
          <>
            {errorMessage && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/20 border border-red-500 text-white p-4 rounded-lg mb-6 flex items-start"
              >
                <div className="flex-shrink-0 mr-3">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-red-300 mb-1">
                    {errorMessage.includes('no está registrado') ? 'Usuario no registrado' :
                     errorMessage.includes('incorrectos') ? 'Credenciales incorrectas' :
                     errorMessage.includes('conexión') ? 'Error de conexión' : 'Error de autenticación'}
                  </h3>
                  <p className="text-sm">{errorMessage}</p>
                </div>
              </motion.div>
            )}
            
            {successMessage && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-500/20 border border-green-500 text-white p-4 rounded-lg mb-6 flex items-start"
              >
                <div className="flex-shrink-0 mr-3">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-green-300 mb-1">
                    {successMessage.includes('verificada') ? 'Verificación exitosa' : 'Operación exitosa'}
                  </h3>
                  <p className="text-sm">{successMessage}</p>
                </div>
              </motion.div>
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
              
              <div className="flex justify-between items-center text-sm">
                <Link to="/forgot-password" className="text-neon-blue hover:text-neon-purple transition-colors">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              <motion.button
                type="submit"
                className="btn-primary w-full flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>{isLogin ? 'Acceder' : 'Registrarse'}</span>
                <FiArrowRight />
              </motion.button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-black text-white/60">O continúa con</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full py-2 px-4 border border-white/10 rounded-full hover:bg-white/5 
                         flex items-center justify-center space-x-2 text-white transition-all"
              >
                <FcGoogle className="text-xl" />
                <span>Google</span>
              </button>
            </form>
          </>
        )}
        
        <div className="mt-6 text-center text-white/70">
          <p>
            {isLogin ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?'}{' '}
            <Link to="/register" className="text-neon-blue hover:underline transition-all">
              {isLogin ? 'Regístrate' : 'Inicia Sesión'}
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default LoginPage