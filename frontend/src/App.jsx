import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
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
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-neon-blue"></div>
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
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-neon-blue"></div>
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
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-neon-blue"></div>
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
  return (
    <div className="app-container">
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
        <Route path="/discounted-products" element={
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
            <ProfilePage />
          </ProtectedRoute>
        } />
        <Route path="/admin/*" element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        } />
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