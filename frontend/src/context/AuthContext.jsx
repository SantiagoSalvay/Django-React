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
      const response = await axios.post('/api/token/', { username, password })
      const { token } = response.data
      
      localStorage.setItem('token', token)
      axios.defaults.headers.common['Authorization'] = `Token ${token}`
      
      // Fetch user data after login
      const userResponse = await axios.get('/api/users/user-data/')
      setUser(userResponse.data)
      
      return true
    } catch (err) {
      console.error('Login error:', err)
      if (err.response && err.response.data) {
        setError(err.response.data.non_field_errors || 'Credenciales inválidas')
      } else {
        setError('Error al iniciar sesión. Inténtalo de nuevo.')
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