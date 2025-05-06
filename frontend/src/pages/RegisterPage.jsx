import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiUser, FiMail, FiLock, FiUserPlus, FiPhone, FiHome } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    phone: '',
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
    const newErrors = {};
    if (!formData.username) newErrors.username = 'El nombre de usuario es obligatorio';
    if (!formData.email) newErrors.email = 'El correo electrónico es obligatorio';
    if (!formData.password) newErrors.password = 'La contraseña es obligatoria';
    if (!formData.password2) newErrors.password2 = 'Debes repetir la contraseña';
    if (formData.password !== formData.password2) newErrors.password2 = 'Las contraseñas no coinciden';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    const registerData = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      password2: formData.password2
    };
    const success = await register(registerData);
    if (success) {
      navigate('/check-email');
      return;
    }
  }
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-gray-900 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-xl glassmorphism p-8"
      >
        <div className="flex justify-between items-center mb-6">
          <Link 
            to="/" 
            className="flex items-center space-x-2 px-4 py-2 bg-neon-blue/20 hover:bg-neon-blue/40 text-white rounded-lg transition-colors duration-300"
          >
            <FiHome />
            <span>Volver al Inicio</span>
          </Link>
        </div>
        
        <h2 className="text-3xl font-orbitron font-bold text-center mb-8 text-white">
          Crear Cuenta
        </h2>
        
        {successMessage && (
          <div className="bg-green-500/20 border border-green-500 text-white p-4 rounded-lg mb-6">
            {successMessage}
          </div>
        )}
        
        {errors && typeof errors === 'object' && Object.keys(errors).length > 0 && (
          <div className="text-red-500 text-sm mb-3">
            {Object.entries(errors).map(([field, msg]) => (
              <div key={field}>
                {Array.isArray(msg) ? msg.join(', ') : msg}
                {field === 'email' && msg === 'Ya existe un usuario con este correo electrónico.' && (
                  <span> ¿Ya tienes cuenta? <a href="/login" className="underline text-blue-400">Inicia sesión</a> o recupera tu contraseña.</span>
                )}
                {field === 'username' && (Array.isArray(msg) ? msg.includes('Ya existe un usuario con este nombre.') : msg === 'Ya existe un usuario con este nombre.') && (
                  <span> Por favor, elige otro nombre de usuario.</span>
                )}
              </div>
            ))}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white mb-2 font-rajdhani">Nombre de Usuario</label>
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white mb-2 font-rajdhani">Nombre</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="text-neon-blue" />
                </div>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`input-field pl-10 ${errors.firstName ? 'border-red-500' : ''}`}
                  placeholder="Tu nombre"
                />
              </div>
              {errors.firstName && (
                <p className="text-red-400 text-sm mt-1">{errors.firstName}</p>
              )}
            </div>

            <div>
              <label className="block text-white mb-2 font-rajdhani">Apellido</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="text-neon-blue" />
                </div>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`input-field pl-10 ${errors.lastName ? 'border-red-500' : ''}`}
                  placeholder="Tu apellido"
                />
              </div>
              {errors.lastName && (
                <p className="text-red-400 text-sm mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-white mb-2 font-rajdhani">Teléfono</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiPhone className="text-neon-blue" />
              </div>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`input-field pl-10 ${errors.phone ? 'border-red-500' : ''}`}
                placeholder="Número de teléfono"
              />
            </div>
            {errors.phone && (
              <p className="text-red-400 text-sm mt-1">{errors.phone}</p>
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
          
          <div className="grid grid-cols-2 gap-4">
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
              <label className="block text-white mb-2 font-rajdhani">Confirmar</label>
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
        
        <div className="mt-6 text-white/60 text-sm text-center">
          <p>Al registrarte, aceptas nuestros <a href="#" className="text-neon-blue hover:underline">Términos y Condiciones</a> y <a href="#" className="text-neon-blue hover:underline">Política de Privacidad</a>.</p>
        </div>
      </motion.div>
    </div>
  )
}

export default RegisterPage