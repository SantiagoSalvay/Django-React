import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiUser, FiMail, FiLock, FiUserPlus } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: ''
  })
  const [errors, setErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState('')
  const { register, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }
  
  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.username) {
      newErrors.username = 'El nombre de usuario es obligatorio'
    } else if (formData.username.length < 3) {
      newErrors.username = 'El nombre de usuario debe tener al menos 3 caracteres'
    }
    
    if (!formData.email) {
      newErrors.email = 'El correo electrónico es obligatorio'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El correo electrónico no es válido'
    }
    
    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria'
    } else if (formData.password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres'
    }
    
    if (!formData.password2) {
      newErrors.password2 = 'Debes confirmar la contraseña'
    } else if (formData.password !== formData.password2) {
      newErrors.password2 = 'Las contraseñas no coinciden'
    }
    
    return newErrors
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const formErrors = validateForm()
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors)
      return
    }
    
    setErrors({})
    const success = await register(formData)
    
    if (success) {
      setSuccessMessage('¡Registro exitoso! Por favor, verifica tu correo electrónico para activar tu cuenta.')
      setFormData({
        username: '',
        email: '',
        password: '',
        password2: ''
      })
    }
  }
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])
  
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md glassmorphism p-8"
      >
        <h2 className="text-3xl font-orbitron font-bold text-center mb-8 text-white">
          Crear Cuenta
        </h2>
        
        {successMessage && (
          <div className="bg-green-500/20 border border-green-500 text-white p-4 rounded-lg mb-6">
            {successMessage}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white mb-2 font-rajdhani">Usuario</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiUser className="text-neon-blue" />
              </div>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={`input-field pl-10 ${errors.username ? 'border-red-500' : ''}`}
                placeholder="Nombre de usuario"
              />
            </div>
            {errors.username && (
              <p className="text-red-400 text-sm mt-1">{errors.username}</p>
            )}
          </div>
          
          <div>
            <label className="block text-white mb-2 font-rajdhani">Correo Electrónico</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMail className="text-neon-blue" />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`input-field pl-10 ${errors.email ? 'border-red-500' : ''}`}
                placeholder="correo@ejemplo.com"
              />
            </div>
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">{errors.email}</p>
            )}
          </div>
          
          <div>
            <label className="block text-white mb-2 font-rajdhani">Contraseña</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="text-neon-blue" />
              </div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`input-field pl-10 ${errors.password ? 'border-red-500' : ''}`}
                placeholder="Mínimo 8 caracteres"
              />
            </div>
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">{errors.password}</p>
            )}
          </div>
          
          <div>
            <label className="block text-white mb-2 font-rajdhani">Confirmar Contraseña</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="text-neon-blue" />
              </div>
              <input
                type="password"
                name="password2"
                value={formData.password2}
                onChange={handleChange}
                className={`input-field pl-10 ${errors.password2 ? 'border-red-500' : ''}`}
                placeholder="Repite la contraseña"
              />
            </div>
            {errors.password2 && (
              <p className="text-red-400 text-sm mt-1">{errors.password2}</p>
            )}
          </div>
          
          <motion.button
            type="submit"
            className="btn-primary w-full flex items-center justify-center space-x-2 mt-6"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>Registrarse</span>
            <FiUserPlus />
          </motion.button>
        </form>
        
        <div className="mt-6 text-center text-white/70">
          <p>¿Ya tienes una cuenta?{' '}
            <Link to="/login" className="text-neon-blue hover:underline transition-all">
              Inicia Sesión
            </Link>
          </p>
        </div>
        
        <div className="mt-6 text-white/60 text-sm">
          <p>Al registrarte, aceptas nuestros <a href="#" className="text-neon-blue hover:underline">Términos y Condiciones</a> y <a href="#" className="text-neon-blue hover:underline">Política de Privacidad</a>.</p>
        </div>
      </motion.div>
    </div>
  )
}

export default RegisterPage 