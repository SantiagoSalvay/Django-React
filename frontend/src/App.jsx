import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import MainLayout from './components/MainLayout'
import HomePage from './pages/HomePage'
import ProductsPage from './pages/ProductsPage'
import CategoryPage from './pages/CategoryPage'
import PaymentMethodsPage from './pages/PaymentMethodsPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import AdminDashboard from './pages/AdminDashboard'
import NotFoundPage from './pages/NotFoundPage'
import CheckEmailPage from './pages/CheckEmailPage'
import EmailVerifiedPage from './pages/EmailVerifiedPage'
import DiscountedProductsPage from './pages/DiscountedProductsPage'
import CombosPage from './pages/CombosPage'
import ProfilePage from './pages/ProfilePage'

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-neon-blue mb-4"></div>
        <p className="text-white text-lg font-orbitron">Verificando autenticación...</p>
      </div>
    )
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }
  
  return children
}

// Admin route component - Permite acceso a usuarios con rol admin o superadmin
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-neon-blue mb-4"></div>
        <p className="text-white text-lg font-orbitron">Verificando permisos de administrador...</p>
      </div>
    )
  }
  
  // Verificar si el usuario tiene permisos de staff (admin o superadmin)
  if (!user?.is_staff) {
    return <Navigate to="/" />
  }
  
  return children
}

// SuperAdmin route component - Permite acceso SOLO a usuarios con rol superadmin
const SuperAdminRoute = ({ children }) => {
  const { user, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-neon-blue mb-4"></div>
        <p className="text-white text-lg font-orbitron">Verificando permisos de superadmin...</p>
      </div>
    )
  }
  
  // Verificar si el usuario tiene permisos de superadmin
  if (!user?.is_superuser) {
    return <Navigate to="/admin/products" />
  }
  
  return children
}

function App() {
  const [isAppReady, setIsAppReady] = useState(false);
  const { loading: authLoading } = useAuth();
  
  // Simular tiempo de carga para asegurar que todos los componentes estén listos
  useEffect(() => {
    // Dar un tiempo mínimo de carga inicial para evitar parpadeos
    const minLoadTime = 1500; // 1.5 segundos mínimo
    const startTime = Date.now();
    
    const checkAndSetReady = () => {
      // Calcular cuánto tiempo ha pasado desde que empezamos a cargar
      const elapsedTime = Date.now() - startTime;
      
      // Si todavía estamos cargando la autenticación, esperamos
      if (authLoading) {
        console.log('Esperando a que se complete la autenticación...');
        // Programar otra verificación en 500ms
        setTimeout(checkAndSetReady, 500);
        return;
      }
      
      // Si no ha pasado el tiempo mínimo, esperamos la diferencia
      if (elapsedTime < minLoadTime) {
        const remainingTime = minLoadTime - elapsedTime;
        console.log(`Esperando ${remainingTime}ms adicionales para completar el tiempo mínimo de carga`);
        setTimeout(() => {
          setIsAppReady(true);
          console.log('Aplicación lista para renderizar después del tiempo mínimo');
        }, remainingTime);
      } else {
        // Si ya pasó el tiempo mínimo y no estamos cargando auth, estamos listos
        setIsAppReady(true);
        console.log('Aplicación lista para renderizar');
      }
    };
    
    // Iniciar el proceso de verificación
    checkAndSetReady();
    
    // No es necesario limpiar este efecto ya que solo se ejecuta una vez
  }, [authLoading]);
  
  // Mostrar un estado de carga mientras la aplicación se inicializa
  if (!isAppReady) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-400 mb-4"></div>
        <p className="text-white text-lg font-orbitron">Cargando Todo Electro...</p>
        <p className="text-white/60 text-sm mt-2">Preparando la mejor experiencia para ti</p>
      </div>
    );
  }
  
  return (
    <div className="app-container">
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <Routes>
        {/* Rutas sin Navbar */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/check-email" element={<CheckEmailPage />} />
        <Route path="/email-verified" element={<EmailVerifiedPage />} />
        
        {/* Rutas con Navbar */}
        <Route path="/" element={
          <MainLayout>
            <HomePage />
          </MainLayout>
        } />
        <Route path="/products" element={
          <ProtectedRoute>
            <MainLayout>
              <ProductsPage />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/category/:slug" element={
          <ProtectedRoute>
            <MainLayout>
              <CategoryPage />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/payment-methods" element={
          <ProtectedRoute>
            <MainLayout>
              <PaymentMethodsPage />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/discounted" element={
          <ProtectedRoute>
            <MainLayout>
              <DiscountedProductsPage />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/combos" element={
          <ProtectedRoute>
            <MainLayout>
              <CombosPage />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <MainLayout>
              <ProfilePage />
            </MainLayout>
          </ProtectedRoute>
        } />
        
        {/* Rutas de administración */}
        <Route path="/admin" element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        } />
        
        {/* Ruta 404 */}
        <Route path="*" element={
          <MainLayout>
            <NotFoundPage />
          </MainLayout>
        } />
      </Routes>
    </div>
  )
}

export default App