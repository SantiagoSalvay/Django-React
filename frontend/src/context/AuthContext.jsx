import { createContext, useState, useContext, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Check if user is authenticated on component mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          setLoading(false)
          return
        }

        // Set default authorization header
        axios.defaults.headers.common['Authorization'] = `Token ${token}`
        
        // Get user data
        const response = await axios.get('/api/users/user-data/')
        setUser(response.data)
      } catch (err) {
        console.error('Auth status check failed:', err)
        // Clear token if it's invalid
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          localStorage.removeItem('token')
          delete axios.defaults.headers.common['Authorization']
        }
      } finally {
        setLoading(false)
      }
    }

    checkAuthStatus()
  }, [])

  // Login function
  const login = async (username, password) => {
    setError(null)
    try {
      // Realizar la solicitud de autenticación para obtener el token
      const tokenResponse = await axios.post('/api/token/', {
        username,
        password
      })
      
      const token = tokenResponse.data.token
      
      localStorage.setItem('token', token)
      axios.defaults.headers.common['Authorization'] = `Token ${token}`
      
      // Fetch user data after login
      const userResponse = await axios.get('/api/users/user-data/')
      setUser(userResponse.data)
      
      return true
    } catch (err) {
      console.error('Login error:', err)
      
      // Manejar diferentes tipos de errores
      if (err.response) {
        const status = err.response.status
        const responseData = err.response.data
        
        if (status === 400) {
          // Error de validación - credenciales incorrectas
          if (responseData.non_field_errors) {
            setError(responseData.non_field_errors[0])
          } else if (responseData.username) {
            setError(`Usuario: ${responseData.username[0]}`)
          } else if (responseData.password) {
            setError(`Contraseña: ${responseData.password[0]}`)
          } else {
            setError('Credenciales inválidas. Por favor verifica tu usuario y contraseña.')
          }
        } else if (status === 404) {
          // Usuario no encontrado
          setError('El usuario ingresado no está registrado en el sistema.')
        } else if (status === 401) {
          // No autorizado
          setError('Usuario o contraseña incorrectos.')
        } else {
          // Otros errores del servidor
          setError(`Error del servidor: ${responseData.detail || 'Error desconocido'}`)
        }
      } else if (err.request) {
        // Error de red - no se recibió respuesta
        setError('No se pudo conectar con el servidor. Verifica tu conexión a internet.')
      } else {
        // Error en la configuración de la solicitud
        setError('Error al iniciar sesión. Inténtalo de nuevo más tarde.')
      }
      
      return false
    }
  }

  // Register function
  const register = async (userData) => {
    setError(null)
    try {
      await axios.post('/api/users/register/', userData, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      return true
    } catch (err) {
      console.error('Register error:', err)
      if (err.response && err.response.data) {
        if (typeof err.response.data === 'string') {
          setError({ general: err.response.data })
        } else {
          setError(err.response.data)
        }
      } else {
        setError({ general: 'Error al registrarse. Inténtalo de nuevo.' })
      }
      return false
    }
  }

  // Logout function
  const logout = () => {
    localStorage.removeItem('token')
    delete axios.defaults.headers.common['Authorization']
    setUser(null)
  }

  // Check if user is admin
  const checkIsAdmin = async () => {
    try {
      const response = await axios.get('/api/users/check-staff/')
      return response.data.is_staff
    } catch (err) {
      console.error('Error checking admin status:', err)
      return false
    }
  }

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    checkIsAdmin
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
} 