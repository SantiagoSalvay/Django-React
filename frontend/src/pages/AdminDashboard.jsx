import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { 
  FiPlus, 
  FiEdit, 
  FiTrash2, 
  FiPackage, 
  FiFolder, 
  FiRefreshCw, 
  FiTag, 
  FiGift, 
  FiUsers, 
  FiDollarSign, 
  FiCheckCircle, 
  FiUserCheck,
  FiDatabase,
  FiHome
} from 'react-icons/fi'
import '../styles/AdminDashboard.css'
import { 
  getAllProducts, 
  getProductsByCategory, 
  getAllCategories, 
  createProduct,
  updateProduct,
  deleteProduct,
  createCategory,
  updateCategory,
  deleteCategory
} from '../api/productApi'
import { createAdminUser, getAdminUsers } from '../api/userApi'
import { toast } from 'react-toastify'

const AdminDashboard = () => {
  // Data states
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [adminUsers, setAdminUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isSuperAdmin, setIsSuperAdmin] = useState(false)
  
  // Modal states
  const [showProductModal, setShowProductModal] = useState(false)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [showDiscountModal, setShowDiscountModal] = useState(false)
  const [showComboModal, setShowComboModal] = useState(false)
  const [showProductListModal, setShowProductListModal] = useState(false)
  const [showAdminUserModal, setShowAdminUserModal] = useState(false)
  const [showSalesStatsModal, setShowSalesStatsModal] = useState(false)
  const [showDiscountedProducts, setShowDiscountedProducts] = useState(false)
  const [discountedProducts, setDiscountedProducts] = useState([])
  const [editingDiscount, setEditingDiscount] = useState(null)
  
  // Sales statistics data
  const [salesStats, setSalesStats] = useState({
    monthlySales: [
      { month: 'Enero', sales: 0 },
      { month: 'Febrero', sales: 0 },
      { month: 'Marzo', sales: 0 },
      { month: 'Abril', sales: 0 },
      { month: 'Mayo', sales: 0 },
      { month: 'Junio', sales: 0 },
      { month: 'Julio', sales: 0 },
      { month: 'Agosto', sales: 0 },
      { month: 'Septiembre', sales: 0 },
      { month: 'Octubre', sales: 0 },
      { month: 'Noviembre', sales: 0 },
      { month: 'Diciembre', sales: 0 }
    ],
    totalSales: 0,
    totalOrders: 0,
    averageOrderValue: 0
  })
  
  // Orders approval states
  const [showOrdersModal, setShowOrdersModal] = useState(false)
  const [orderStatusFilter, setOrderStatusFilter] = useState('all')
  const [orders, setOrders] = useState([])
  
  // Posibles estados de pedido
  const orderStatuses = [
    'Pago recibido',
    'Pedido en preparacion',
    'Pedido enviado',
    'Pedido en camino',
    'Pedido entregado'
  ]
  
  // Admin user form state
  const [adminUserForm, setAdminUserForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'admin' // Default role
  })
  
  // Error message for admin user form
  const [adminUserError, setAdminUserError] = useState(null)
  
  // Discount states
  const [selectedProducts, setSelectedProducts] = useState([])
  const [discountPercentage, setDiscountPercentage] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  
  // Combo states
  const [comboProducts, setComboProducts] = useState([])
  const [comboPrice, setComboPrice] = useState('')
  const [comboName, setComboName] = useState('')
  const [comboDescription, setComboDescription] = useState('')
  
  // Form states
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    image: null,
    // Dynamic fields for specific categories
    specs: {}
  })
  const [categoryForm, setCategoryForm] = useState({
    name: ''
  })
  
  // Función para generar slug a partir del nombre
  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[áäàâã]/g, 'a')
      .replace(/[éëèê]/g, 'e')
      .replace(/[íïìî]/g, 'i')
      .replace(/[óöòôõ]/g, 'o')
      .replace(/[úüùû]/g, 'u')
      .replace(/ñ/g, 'n')
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
  }
  
  // Edit states
  const [editingProduct, setEditingProduct] = useState(null)
  const [editingCategory, setEditingCategory] = useState(null)

  // Funciones de gestión de productos
  const productFunctions = [
    {
      title: 'Crear Producto',
      icon: <FiPlus className="text-2xl" />,
      description: 'Añadir nuevo producto al catálogo',
      action: () => setShowProductModal(true)
    },
    {
      title: 'Crear Descuento',
      icon: <FiTag className="text-2xl" />,
      description: 'Crear descuentos para productos',
      action: () => {
        if (showDiscountModal) {
          // Si el modal ya está abierto, lo cerramos y mostramos los productos con descuento
          setShowDiscountModal(false);
          getDiscountedProducts();
          setShowDiscountedProducts(true);
        } else {
          // Si el modal no está abierto, lo abrimos normalmente
          setSelectedProducts([])
          setDiscountPercentage(0)
          setSearchTerm('')
          setShowDiscountModal(true)
        }
      }
    },
    {
      title: 'Crear Combo',
      icon: <FiGift className="text-2xl" />,
      description: 'Crear combos de productos',
      action: () => {
        setComboProducts([])
        setComboPrice('')
        setComboName('')
        setComboDescription('')
        setSearchTerm('')
        setShowComboModal(true)
      }
    },
    {
      title: 'Ver Productos',
      icon: <FiPackage className="text-2xl" />,
      description: 'Ver todos los productos',
      action: () => {
        setSearchTerm('')
        setShowProductListModal(true)
      }
    }
  ]

  // Funciones de gestión de usuarios y administración
  // Algunas funciones solo están disponibles para superadmin
  const allAdminFunctions = [
    {
      title: 'Crear Usuarios Admin',
      icon: <FiUserCheck className="text-2xl" />,
      description: 'Crear nuevos administradores',
      action: () => {
        setAdminUserForm({
          name: '',
          email: '',
          password: '',
          role: 'admin'
        })
        setShowAdminUserModal(true)
      },
      requiresSuperAdmin: true // Solo superadmin puede crear usuarios admin
    },
    {
      title: 'Ver Ventas',
      icon: <FiDollarSign className="text-2xl" />,
      description: 'Ver estadísticas de ventas',
      action: () => setShowSalesStatsModal(true),
      requiresSuperAdmin: false // Todos los admin pueden ver ventas
    },
    {
      title: 'Aprobar Compras',
      icon: <FiCheckCircle className="text-2xl" />,
      description: 'Aprobar pedidos pendientes',
      action: () => {
        setOrderStatusFilter('all')
        setShowOrdersModal(true)
      },
      requiresSuperAdmin: false // Todos los admin pueden aprobar compras
    },
    {
      title: 'Crear Categoría',
      icon: <FiFolder className="text-2xl" />,
      description: 'Crear categorías de productos',
      action: () => setShowCategoryModal(true),
      requiresSuperAdmin: true // Solo superadmin puede crear categorías
    }
  ]
  
  // Filtrar las funciones según el rol del usuario
  const adminFunctions = allAdminFunctions.filter(func => 
    !func.requiresSuperAdmin || isSuperAdmin
  )
  
  // Fetch data
  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Obtener datos del usuario actual para verificar si es superadmin
      const userDataResponse = await axios.get('/api/users/user-data/')
      const userData = userDataResponse.data
      setIsSuperAdmin(userData.is_superuser)
      
      const [productsData, categoriesData, adminUsersData] = await Promise.all([
        getAllProducts(),
        getAllCategories(),
        getAdminUsers()
      ])
      
      setProducts(productsData)
      setCategories(categoriesData)
      setAdminUsers(adminUsersData)
      setError(null)
    } catch (err) {
      setError('Error al cargar los datos')
      console.error('Error fetching data:', err)
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    fetchData()
  }, [])
  
  // Handle admin user form changes
  const handleAdminUserChange = (e) => {
    const { name, value } = e.target
    setAdminUserForm({
      ...adminUserForm,
      [name]: value
    })
  }
  
  // Handle admin user form submission
  const handleAdminUserSubmit = async (e) => {
    e.preventDefault()
    setAdminUserError(null)
    
    try {
      setLoading(true)
      await createAdminUser(adminUserForm)
      
      // Reset form
      setAdminUserForm({
        name: '',
        email: '',
        password: '',
        role: 'admin'
      })
      
      // Refresh admin users list
      const adminUsersData = await getAdminUsers()
      setAdminUsers(adminUsersData)
      
      setError(null)
    } catch (err) {
      console.error('Error creating admin user:', err)
      if (err.response && err.response.data && err.response.data.error) {
        setAdminUserError(err.response.data.error)
      } else {
        setAdminUserError('Error al crear el usuario administrador')
      }
    } finally {
      setLoading(false)
    }
  }
  
  // Close admin user modal
  const handleCloseAdminUserModal = () => {
    setAdminUserForm({
      name: '',
      email: '',
      password: '',
      role: 'admin'
    })
    setAdminUserError(null)
    setShowAdminUserModal(false)
  }
  
  // Handle product form
  const handleProductChange = (e) => {
    const { name, value, type, files } = e.target
    
    if (name.startsWith('specs.')) {
      // Handle specs fields
      const specName = name.split('.')[1]
      setProductForm({
        ...productForm,
        specs: {
          ...productForm.specs,
          [specName]: value
        }
      })
    } else if (type === 'file') {
      setProductForm({
        ...productForm,
        [name]: files[0]
      })
    } else if (name === 'category') {
      // Si cambia la categoría, limpiamos las especificaciones anteriores
      console.log('Cambiando categoría a:', value)
      setProductForm({
        ...productForm,
        [name]: value,
        specs: {} // Limpiar especificaciones al cambiar de categoría
      })
    } else if (name === 'price') {
      // Manejar campo de precio con formato especial
      let numericValue = value.replace(/[^0-9.]/g, '')
      
      // Permitir solo un punto decimal
      const parts = numericValue.split('.')
      if (parts.length > 2) {
        numericValue = parts[0] + '.' + parts.slice(1).join('')
      }
      
      // Limitar a dos decimales
      if (parts.length > 1 && parts[1].length > 2) {
        numericValue = parts[0] + '.' + parts[1].slice(0, 2)
      }
      
      setProductForm({
        ...productForm,
        [name]: numericValue
      })
    } else {
      setProductForm({
        ...productForm,
        [name]: value
      })
    }
  }
  
  // Get dynamic fields based on category
  const getCategoryFields = (categoryId) => {
    // Find the category
    console.log('Buscando categoría con ID:', categoryId)
    console.log('Categorías disponibles:', categories)
    
    // Convertir categoryId a string si es necesario
    const catId = String(categoryId)
    
    // Buscar la categoría por id
    const category = categories.find(cat => String(cat.id) === catId)
    
    console.log('Categoría encontrada:', category)
    
    if (!category) return []
    
    // Return fields based on category name
    const categoryName = category.name.toLowerCase()
    console.log('Nombre de categoría en minúsculas:', categoryName)
    
    switch(categoryName) {
      case 'celulares':
      case 'smartphones':
      case 'teléfonos':
        return [
          { name: 'modelo', label: 'Modelo', type: 'text' },
          { name: 'procesador', label: 'Procesador', type: 'text' },
          { name: 'ram', label: 'Memoria RAM', type: 'text' },
          { name: 'almacenamiento', label: 'Almacenamiento', type: 'text' },
          { name: 'pantalla', label: 'Tamaño de Pantalla', type: 'text' },
          { name: 'camara', label: 'Cámara', type: 'text' },
          { name: 'bateria', label: 'Batería', type: 'text' }
        ]
      case 'laptops':
      case 'notebooks':
      case 'portátiles':
        return [
          { name: 'modelo', label: 'Modelo', type: 'text' },
          { name: 'procesador', label: 'Procesador', type: 'text' },
          { name: 'ram', label: 'Memoria RAM', type: 'text' },
          { name: 'almacenamiento', label: 'Almacenamiento', type: 'text' },
          { name: 'pantalla', label: 'Tamaño de Pantalla', type: 'text' },
          { name: 'tarjeta_grafica', label: 'Tarjeta Gráfica', type: 'text' },
          { name: 'sistema_operativo', label: 'Sistema Operativo', type: 'text' }
        ]
      case 'televisores':
      case 'tvs':
      case 'televisiones':
      case 'tv':
        return [
          { name: 'tamaño', label: 'Tamaño en pulgadas', type: 'text' },
          { name: 'resolucion', label: 'Resolución', type: 'text' },
          { name: 'smart', label: '¿Es Smart TV?', type: 'checkbox' },
          { name: 'sistema_operativo', label: 'Sistema Operativo', type: 'text' },
          { name: 'conexiones', label: 'Conexiones', type: 'text' }
        ]
      case 'tablets':
      case 'tablet':
        return [
          { name: 'modelo', label: 'Modelo', type: 'text' },
          { name: 'procesador', label: 'Procesador', type: 'text' },
          { name: 'ram', label: 'Memoria RAM', type: 'text' },
          { name: 'almacenamiento', label: 'Almacenamiento', type: 'text' },
          { name: 'pantalla', label: 'Tamaño de Pantalla', type: 'text' },
          { name: 'bateria', label: 'Batería', type: 'text' }
        ]
      case 'electrodomésticos':
      case 'electrodomesticos':
        return [
          { name: 'modelo', label: 'Modelo', type: 'text' },
          { name: 'potencia', label: 'Potencia', type: 'text' },
          { name: 'dimensiones', label: 'Dimensiones', type: 'text' },
          { name: 'color', label: 'Color', type: 'text' },
          { name: 'funciones', label: 'Funciones Especiales', type: 'text' }
        ]
      case 'audio':
      case 'sonido':
        return [
          { name: 'modelo', label: 'Modelo', type: 'text' },
          { name: 'potencia', label: 'Potencia', type: 'text' },
          { name: 'canales', label: 'Canales', type: 'text' },
          { name: 'conectividad', label: 'Conectividad', type: 'text' },
          { name: 'bateria', label: 'Batería (si aplica)', type: 'text' }
        ]
      default:
        // Campos básicos para cualquier categoría
        console.log('Usando campos por defecto para la categoría:', categoryName)
        return [
          { name: 'modelo', label: 'Modelo', type: 'text' },
          { name: 'marca', label: 'Marca', type: 'text' },
          { name: 'color', label: 'Color', type: 'text' },
          { name: 'dimensiones', label: 'Dimensiones', type: 'text' },
          { name: 'peso', label: 'Peso', type: 'text' }
        ]
    }
  }
  
  const handleProductSubmit = async (e) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      
      const formData = new FormData()
      
      // Add basic product data
      Object.keys(productForm).forEach(key => {
        if (key !== 'specs' && productForm[key] !== null) {
          formData.append(key, productForm[key])
        }
      })
      
      // Add specs as JSON string
      formData.append('specs', JSON.stringify(productForm.specs))
      
      if (editingProduct) {
        await updateProduct(editingProduct.id, formData)
        setEditingProduct(null)
      } else {
        await createProduct(formData)
      }
      
      // Reset form and close modal
      setProductForm({
        name: '',
        description: '',
        price: '',
        stock: '',
        category: '',
        image: null,
        specs: {}
      })
      setShowProductModal(false)
      
      await fetchData()
    } catch (err) {
      setError('Error al guardar el producto')
      console.error('Error submitting product:', err)
    } finally {
      setLoading(false)
    }
  }
  
  // Reset form when closing modal
  const handleCloseProductModal = () => {
    setProductForm({
      name: '',
      description: '',
      price: '',
      stock: '',
      category: '',
      image: null,
      specs: {}
    })
    setEditingProduct(null)
    setShowProductModal(false)
  }
  
  const handleEditProduct = (product) => {
    setEditingProduct(product)
    
    // Parse specs if they exist
    let specs = {}
    if (product.specs && typeof product.specs === 'string') {
      try {
        specs = JSON.parse(product.specs)
      } catch (err) {
        console.error('Error parsing product specs:', err)
      }
    } else if (product.specs && typeof product.specs === 'object') {
      specs = product.specs
    }
    
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category,
      image: null,
      specs
    })
    
    // Si estamos en el modal de lista de productos, cerrarlo primero
    setShowProductListModal(false)
    
    // Abrir el modal de edición de producto
    setShowProductModal(true)
  }
  
  const handleDeleteProduct = async (productId) => {
    try {
      setLoading(true)
      await deleteProduct(productId)
      await fetchData()
    } catch (err) {
      setError('Error al eliminar el producto')
      console.error('Error deleting product:', err)
    } finally {
      setLoading(false)
    }
  }
  
  // Handle category form
  const handleCategoryChange = (e) => {
    const { name, value } = e.target
    setCategoryForm({
      ...categoryForm,
      [name]: value
    })
  }
  
  const handleCategorySubmit = async (e) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      
      // Generar el slug a partir del nombre
      const categoryData = {
        ...categoryForm,
        slug: generateSlug(categoryForm.name)
      }
      
      if (editingCategory) {
        await updateCategory(editingCategory.slug, categoryData)
        setEditingCategory(null)
      } else {
        await createCategory(categoryData)
      }
      
      setCategoryForm({
        name: ''
      })
      
      setShowCategoryModal(false)
      await fetchData()
    } catch (err) {
      setError('Error al guardar la categoría')
      console.error('Error submitting category:', err)
    } finally {
      setLoading(false)
    }
  }
  
  // Reset form when closing modal
  const handleCloseCategoryModal = () => {
    setCategoryForm({
      name: ''
    })
    setEditingCategory(null)
    setShowCategoryModal(false)
  }
  
  const handleEditCategory = (category) => {
    setEditingCategory(category)
    setCategoryForm({
      name: category.name
    })
    setShowCategoryModal(true)
  }
  
  const handleDeleteCategory = async (categorySlug) => {
    try {
      setLoading(true)
      await deleteCategory(categorySlug)
      await fetchData()
    } catch (err) {
      setError('Error al eliminar la categoría')
      console.error('Error deleting category:', err)
    } finally {
      setLoading(false)
    }
  }
  
  // Funciones para el modal de descuentos
  const handleDiscountSelection = (percentage) => {
    setDiscountPercentage(percentage)
  }
  
  const handleProductSelection = (productId) => {
    // Verificar si el producto ya está seleccionado
    if (selectedProducts.includes(productId)) {
      // Si ya está seleccionado, lo quitamos
      setSelectedProducts(selectedProducts.filter(id => id !== productId))
    } else {
      // Si no está seleccionado, lo agregamos
      setSelectedProducts([...selectedProducts, productId])
    }
  }
  
  const handleApplyDiscount = async () => {
    if (selectedProducts.length === 0 || discountPercentage === 0) {
      toast.error('Selecciona productos y un porcentaje de descuento')
      return
    }
    
    try {
      setLoading(true)
      
      const updatedProducts = []
      
      for (const productId of selectedProducts) {
        const product = products.find(p => p.id === productId)
        
        if (!product) continue
        
        // Guardar precio original si no existe
        const originalPrice = product.original_price || parseFloat(product.price)
        
        // Calcular precio con descuento
        const discountAmount = originalPrice * (discountPercentage / 100)
        const discountedPrice = originalPrice - discountAmount
        
        console.log(`Aplicando descuento del ${discountPercentage}% al producto ${product.name} (ID: ${productId})`);
        console.log(`Precio original: $${originalPrice.toFixed(2)}, Precio con descuento: $${discountedPrice.toFixed(2)}`);
        
        // Crear objeto de producto actualizado
        const updatedProduct = {
          ...product,
          original_price: originalPrice,
          price: discountedPrice.toFixed(2),
          has_discount: true,
          discount_percentage: discountPercentage
        }
        
        // Actualizar producto en la API
        await updateProduct(productId, updatedProduct)
        
        updatedProducts.push(updatedProduct)
      }
      
      // Actualizar el estado local
      setProducts(products.map(product => {
        const updatedProduct = updatedProducts.find(p => p.id === product.id)
        return updatedProduct || product
      }))
      
      toast.success('Descuentos aplicados correctamente')
      
      // Cerrar modal y limpiar estados
      setShowDiscountModal(false)
      setSelectedProducts([])
      setDiscountPercentage(0)
      setSearchTerm('')
      
      // Si estábamos editando un descuento, actualizamos la lista
      if (editingDiscount) {
        setEditingDiscount(null);
        getDiscountedProducts();
        setShowDiscountedProducts(true);
      }
    } catch (err) {
      toast.error('Error al aplicar descuentos')
      console.error('Error applying discounts:', err)
    } finally {
      setLoading(false)
    }
  }
  
  const handleCloseDiscountModal = () => {
    setShowDiscountModal(false)
    setSelectedProducts([])
    setDiscountPercentage(0)
    setSearchTerm('')
  }
  
  // Funciones para el modal de combos
  const handleComboProductSelection = (productId) => {
    // Verificar si el producto ya está seleccionado
    if (comboProducts.includes(productId)) {
      // Si ya está seleccionado, lo quitamos
      setComboProducts(comboProducts.filter(id => id !== productId))
    } else {
      // Si no está seleccionado, lo agregamos
      setComboProducts([...comboProducts, productId])
    }
  }
  
  const handleCreateCombo = async () => {
    if (comboProducts.length === 0 || !comboPrice || !comboName) {
      setError('Debes seleccionar al menos un producto, asignar un nombre y un precio al combo')
      return
    }
    
    try {
      setLoading(true)
      
      // Crear un nuevo producto tipo combo
      const formData = new FormData()
      formData.append('name', comboName)
      formData.append('description', comboDescription || `Combo de ${comboProducts.length} productos`)
      formData.append('price', comboPrice)
      formData.append('stock', 1) // Stock inicial para el combo
      formData.append('is_combo', true)
      
      // Agregar los IDs de los productos incluidos en el combo
      formData.append('combo_products', JSON.stringify(comboProducts))
      
      // Calcular el precio original (suma de los precios individuales)
      const originalPrice = comboProducts.reduce((total, productId) => {
        const product = products.find(p => p.id === productId)
        return total + (product ? parseFloat(product.price) : 0)
      }, 0)
      
      formData.append('original_price', originalPrice.toFixed(2))
      
      // Crear el combo como un nuevo producto
      await createProduct(formData)
      
      // Cerrar modal y refrescar datos
      setShowComboModal(false)
      setComboProducts([])
      setComboPrice('')
      setComboName('')
      setComboDescription('')
      setSearchTerm('')
      await fetchData()
      
    } catch (err) {
      setError('Error al crear el combo')
      console.error('Error creating combo:', err)
    } finally {
      setLoading(false)
    }
  }
  
  const handleCloseComboModal = () => {
    setShowComboModal(false)
    setComboProducts([])
    setComboPrice('')
    setComboName('')
    setComboDescription('')
    setSearchTerm('')
  }
  
  // Funciones para el modal de lista de productos
  const handleCloseProductListModal = () => {
    setShowProductListModal(false)
    setSearchTerm('')
  }
  
  // Funciones para el modal de usuarios administradores
  // Estas funciones se han movido a la parte superior del componente
  
  // Función para cerrar el modal de estadísticas de ventas
  const handleCloseSalesStatsModal = () => {
    setShowSalesStatsModal(false)
  }
  
  // Funciones para el modal de aprobación de pedidos
  const handleCloseOrdersModal = () => {
    setShowOrdersModal(false)
  }
  
  const handleOrderStatusChange = (orderId, newStatus) => {
    // Actualizar el estado del pedido en el array de pedidos
    const updatedOrders = orders.map(order => {
      if (order.id === orderId) {
        return { ...order, status: newStatus }
      }
      return order
    })
    
    setOrders(updatedOrders)
  }
  
  const handleStatusFilterChange = (e) => {
    setOrderStatusFilter(e.target.value)
  }
  
  // Filtrar pedidos según el filtro seleccionado
  const filteredOrders = () => {
    if (orderStatusFilter === 'all') {
      return orders
    }
    
    return orders.filter(order => order.status === orderStatusFilter)
  }
  
  const filteredProducts = () => {
    if (!searchTerm.trim()) return products
    
    return products.filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.id.toString().includes(searchTerm)
    )
  }
  
  // Calcular el precio total de los productos seleccionados para el combo
  const calculateTotalPrice = () => {
    return comboProducts.reduce((total, productId) => {
      const product = products.find(p => p.id === productId)
      return total + (product ? parseFloat(product.price) : 0)
    }, 0).toFixed(2)
  }
  
  // Formatear precio con separadores de miles
  const formatPrice = (value) => {
    // Eliminar caracteres no numéricos excepto punto decimal
    let numericValue = value.toString().replace(/[^0-9.]/g, '')
    
    // Separar parte entera y decimal
    const parts = numericValue.split('.')
    const integerPart = parts[0]
    const decimalPart = parts.length > 1 ? '.' + parts[1].slice(0, 2) : ''
    
    // Formatear parte entera con separadores de miles
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    
    return formattedInteger + decimalPart
  }
  
  // Manejar cambio en campos de precio con formato
  const handlePriceChange = (e, setter) => {
    const value = e.target.value
    
    // Eliminar caracteres no numéricos excepto punto decimal
    let numericValue = value.replace(/[^0-9.]/g, '')
    
    // Permitir solo un punto decimal
    const parts = numericValue.split('.')
    if (parts.length > 2) {
      numericValue = parts[0] + '.' + parts.slice(1).join('')
    }
    
    // Limitar a dos decimales
    if (parts.length > 1 && parts[1].length > 2) {
      numericValue = parts[0] + '.' + parts[1].slice(0, 2)
    }
    
    // Actualizar el valor sin formato para el estado interno
    setter(numericValue)
  }

  // Agregar una función para obtener productos con descuento
  const getDiscountedProducts = () => {
    // En un caso real, deberías tener un campo en la base de datos para saber si un producto tiene descuento
    // Aquí implementamos una versión simplificada asumiendo que cualquier producto cuyo precio no coincida con su precio original tiene un descuento
    const productsWithDiscount = products.filter(product => {
      // Esta es una implementación simulada
      // En un proyecto real, necesitarías un campo en tu base de datos para esto
      return product.has_discount === true || product.discount_percentage > 0;
    });
    
    setDiscountedProducts(productsWithDiscount);
  };

  // Agregar una función para modificar un descuento existente
  const handleEditDiscount = (product) => {
    setEditingDiscount(product);
    setSelectedProducts([product.id]);
    setDiscountPercentage(product.discount_percentage || 0);
    setSearchTerm('');
    setShowDiscountedProducts(false);
    setShowDiscountModal(true);
  };

  // Agregar una función para eliminar un descuento
  const handleRemoveDiscount = async (productId) => {
    try {
      setLoading(true);
      
      // Obtener el producto original
      const product = products.find(p => p.id === productId);
      if (!product) {
        throw new Error('Producto no encontrado');
      }
      
      // Restaurar el precio original
      const updatedProduct = {
        ...product,
        price: product.original_price || product.price,
        has_discount: false,
        discount_percentage: 0
      };
      
      // Actualizar el producto en la API
      await updateProduct(productId, updatedProduct);
      
      // Actualizar el estado local
      setProducts(products.map(p => p.id === productId ? updatedProduct : p));
      
      // Actualizar la lista de productos con descuento
      getDiscountedProducts();
      
      toast.success('Descuento eliminado correctamente');
    } catch (err) {
      console.error('Error al eliminar descuento:', err);
      toast.error('Error al eliminar descuento');
    } finally {
      setLoading(false);
    }
  };

  // Loading state render
  if (loading && products.length === 0 && categories.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 p-8">
        {error && (
          <div className="admin-error">
            {error}
            <button 
              onClick={fetchData} 
              className="admin-error-refresh"
            >
              <FiRefreshCw />
            </button>
          </div>
        )}
      </div>
    );
  }

  // Main dashboard render
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 p-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-4">
          <h1 className="text-3xl font-orbitron font-bold text-white">
            Panel de Control
          </h1>
          <Link 
            to="/" 
            className="flex items-center space-x-2 px-4 py-2 bg-neon-blue/20 hover:bg-neon-blue/40 text-white rounded-lg transition-colors duration-300"
          >
            <FiHome />
            <span>Volver al Inicio</span>
          </Link>
        </div>
        <div className={`px-4 py-2 rounded-full text-sm font-medium ${isSuperAdmin ? 'bg-purple-500/20 text-purple-300' : 'bg-blue-500/20 text-blue-300'}`}>
          Rol: {isSuperAdmin ? 'Super Administrador' : 'Administrador'}
        </div>
      </div>
      
      {/* Mensaje de acceso limitado para usuarios admin */}
      {!isSuperAdmin && (
        <div className="bg-yellow-500/20 border border-yellow-500/50 text-white p-4 rounded-lg mb-8">
          <h3 className="font-bold mb-1">Acceso Limitado</h3>
          <p>Tienes acceso limitado al panel de administración. Algunas funciones solo están disponibles para usuarios con rol de Super Administrador.</p>
        </div>
      )}

      {error && (
        <div className="admin-error">
          {error}
          <button 
            onClick={fetchData} 
            className="admin-error-refresh"
          >
            <FiRefreshCw />
          </button>
        </div>
      )}

      {/* Categoría: Gestión de Productos */}
      <div className="admin-section">
        <h2 className="admin-category-title">Gestión de Productos</h2>
        <div className="admin-grid">
          {productFunctions.map((func, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="admin-card"
              onClick={func.action}
            >
              <div className="flex flex-col items-center text-center p-4">
                <div className="admin-icon mb-4">{func.icon}</div>
                <h3 className="admin-card-title mb-2">{func.title}</h3>
                <p className="admin-card-description">{func.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Categoría: Gestión de Usuarios y Administración */}
      <div className="admin-section">
        <h2 className="admin-category-title">Gestión de Usuarios y Administración</h2>
        <div className="admin-grid">
          {adminFunctions.map((func, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="admin-card"
              onClick={func.action}
            >
              <div className="flex flex-col items-center text-center p-4">
                <div className="admin-icon mb-4">{func.icon}</div>
                <h3 className="admin-card-title mb-2">{func.title}</h3>
                <p className="admin-card-description">{func.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <motion.div 
            className="glassmorphism w-full max-w-3xl max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center p-6 border-b border-white/10">
              <h2 className="text-xl font-orbitron font-bold text-white">
                {editingProduct ? 'Editar Producto' : 'Crear Nuevo Producto'}
              </h2>
              <button 
                onClick={handleCloseProductModal}
                className="text-white/70 hover:text-white text-xl"
              >
                &times;
              </button>
            </div>
            
            <form onSubmit={handleProductSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-white/70 mb-2">Nombre</label>
                  <input 
                    type="text" 
                    name="name"
                    value={productForm.name}
                    onChange={handleProductChange}
                    className="w-full bg-black/30 text-white border border-white/10 rounded p-2"
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-white/70 mb-2">Descripción</label>
                  <textarea 
                    name="description"
                    value={productForm.description}
                    onChange={handleProductChange}
                    className="w-full bg-black/30 text-white border border-white/10 rounded p-2"
                    rows="4"
                    required
                  ></textarea>
                </div>
                
                <div>
                  <label className="block text-white/70 mb-2">Precio</label>
                  <input 
                    type="text" 
                    name="price"
                    value={productForm.price ? formatPrice(productForm.price) : ''}
                    onChange={handleProductChange}
                    className="w-full bg-black/30 text-white border border-white/10 rounded p-2"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-white/70 mb-2">Stock</label>
                  <input 
                    type="number" 
                    name="stock"
                    value={productForm.stock}
                    onChange={handleProductChange}
                    className="w-full bg-black/30 text-white border border-white/10 rounded p-2"
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-white/70 mb-2">Categoría</label>
                  <select 
                    name="category"
                    value={productForm.category}
                    onChange={handleProductChange}
                    className="w-full bg-black/30 text-white border border-white/10 rounded p-2"
                    required
                  >
                    <option value="">Seleccionar categoría</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-white/50 text-sm mt-2">
                    Al seleccionar una categoría, aparecerán campos específicos para ese tipo de producto
                  </p>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-white/70 mb-2">Imagen</label>
                  <input 
                    type="file" 
                    name="image"
                    onChange={handleProductChange}
                    className="w-full bg-black/30 text-white border border-white/10 rounded p-2"
                    accept="image/*"
                  />
                </div>
                
                {/* Dynamic fields based on category */}
                {productForm.category && (
                  <div className="md:col-span-2 border-t border-white/10 pt-4 mt-2">
                    <h3 className="text-lg font-semibold text-white mb-4">Especificaciones Técnicas</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {getCategoryFields(productForm.category).length > 0 ? (
                        getCategoryFields(productForm.category).map((field) => (
                          <div key={field.name}>
                            <label className="block text-white/70 mb-2">{field.label}</label>
                            {field.type === 'checkbox' ? (
                              <input 
                                type="checkbox" 
                                name={`specs.${field.name}`}
                                checked={productForm.specs[field.name] || false}
                                onChange={(e) => handleProductChange({
                                  target: {
                                    name: `specs.${field.name}`,
                                    value: e.target.checked
                                  }
                                })}
                                className="mr-2"
                              />
                            ) : (
                              <input 
                                type={field.type} 
                                name={`specs.${field.name}`}
                                value={productForm.specs[field.name] || ''}
                                onChange={handleProductChange}
                                className="w-full bg-black/30 text-white border border-white/10 rounded p-2"
                                placeholder={`Ingrese ${field.label.toLowerCase()}`}
                              />
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="md:col-span-2 text-center text-white/70">
                          <p>Cargando especificaciones para esta categoría...</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end space-x-4 mt-8">
                <button 
                  type="button" 
                  onClick={handleCloseProductModal}
                  className="btn-secondary"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="btn-primary"
                >
                  {editingProduct ? 'Actualizar Producto' : 'Crear Producto'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
      
      {/* Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <motion.div 
            className="glassmorphism w-full max-w-md"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center p-6 border-b border-white/10">
              <h2 className="text-xl font-orbitron font-bold text-white">
                {editingCategory ? 'Editar Categoría' : 'Crear Nueva Categoría'}
              </h2>
              <button 
                onClick={handleCloseCategoryModal}
                className="text-white/70 hover:text-white text-xl"
              >
                &times;
              </button>
            </div>
            
            <form onSubmit={handleCategorySubmit} className="p-6">
              <div className="mb-6">
                <label className="block text-white/70 mb-2">Nombre</label>
                <input 
                  type="text" 
                  name="name"
                  value={categoryForm.name}
                  onChange={handleCategoryChange}
                  className="w-full bg-black/30 text-white border border-white/10 rounded p-2"
                  required
                />
                <p className="text-white/50 text-sm mt-2">
                  El slug se generará automáticamente a partir del nombre
                </p>
              </div>
              
              <div className="flex justify-end space-x-4">
                <button 
                  type="button" 
                  onClick={handleCloseCategoryModal}
                  className="btn-secondary"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="btn-primary"
                >
                  {editingCategory ? 'Actualizar Categoría' : 'Crear Categoría'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
      
      {/* Discount Modal */}
      {showDiscountModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <motion.div 
            className="glassmorphism w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center p-6 border-b border-white/10">
              <h2 className="text-xl font-orbitron font-bold text-white">
                Crear Descuentos
              </h2>
              <button 
                onClick={handleCloseDiscountModal}
                className="text-white/70 hover:text-white text-xl"
              >
                &times;
              </button>
            </div>
            
            <div className="p-6">
              {/* Discount Percentage Buttons */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-4">Selecciona el Porcentaje de Descuento</h3>
                <div className="flex flex-wrap gap-4">
                  <button 
                    type="button"
                    className={`px-6 py-3 rounded-lg font-bold transition-colors ${discountPercentage === 15 ? 'bg-green-600 text-white' : 'bg-black/30 text-white/70 hover:bg-black/50 hover:text-white'}`}
                    onClick={() => handleDiscountSelection(15)}
                  >
                    15% Descuento
                  </button>
                  <button 
                    type="button"
                    className={`px-6 py-3 rounded-lg font-bold transition-colors ${discountPercentage === 25 ? 'bg-green-600 text-white' : 'bg-black/30 text-white/70 hover:bg-black/50 hover:text-white'}`}
                    onClick={() => handleDiscountSelection(25)}
                  >
                    25% Descuento
                  </button>
                  <button 
                    type="button"
                    className={`px-6 py-3 rounded-lg font-bold transition-colors ${discountPercentage === 50 ? 'bg-green-600 text-white' : 'bg-black/30 text-white/70 hover:bg-black/50 hover:text-white'}`}
                    onClick={() => handleDiscountSelection(50)}
                  >
                    50% Descuento
                  </button>
                  <button 
                    type="button"
                    className={`px-6 py-3 rounded-lg font-bold transition-colors ${discountPercentage === 75 ? 'bg-green-600 text-white' : 'bg-black/30 text-white/70 hover:bg-black/50 hover:text-white'}`}
                    onClick={() => handleDiscountSelection(75)}
                  >
                    75% Descuento
                  </button>
                </div>
              </div>
              
              {/* Product Search */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-4">Selecciona los Productos</h3>
                <div className="mb-4">
                  <input 
                    type="text"
                    placeholder="Buscar por nombre o ID de producto..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-black/30 text-white border border-white/10 rounded p-3"
                  />
                </div>
                
                {/* Selected Products Count */}
                <div className="mb-4 text-white">
                  <p>{selectedProducts.length} productos seleccionados</p>
                </div>
                
                {/* Products List */}
                <div className="overflow-y-auto max-h-80 border border-white/10 rounded">
                  <table className="min-w-full divide-y divide-white/10">
                    <thead className="bg-black/30">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Seleccionar</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Nombre</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Precio Original</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Precio con Descuento</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {filteredProducts().length > 0 ? (
                        filteredProducts().map(product => {
                          const isSelected = selectedProducts.includes(product.id)
                          const originalPrice = parseFloat(product.price)
                          const discountAmount = originalPrice * (discountPercentage / 100)
                          const discountedPrice = originalPrice - discountAmount
                          
                          return (
                            <tr 
                              key={product.id} 
                              className={`hover:bg-white/5 transition-colors cursor-pointer ${isSelected ? 'bg-green-900/20' : ''}`}
                              onClick={() => handleProductSelection(product.id)}
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                <input 
                                  type="checkbox" 
                                  checked={isSelected}
                                  onChange={() => {}} // Controlado por el onClick del tr
                                  className="h-5 w-5"
                                />
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-white">{product.id}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-white">{product.name}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-white">${originalPrice.toFixed(2)}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-white">
                                {discountPercentage > 0 ? (
                                  <span className="text-green-400">${discountedPrice.toFixed(2)}</span>
                                ) : '-'}
                              </td>
                            </tr>
                          )
                        })
                      ) : (
                        <tr>
                          <td colSpan="5" className="px-6 py-12 text-center text-white/70">
                            No se encontraron productos
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 mt-6">
                <button 
                  type="button" 
                  onClick={handleCloseDiscountModal}
                  className="btn-secondary"
                >
                  Cancelar
                </button>
                <button 
                  type="button" 
                  onClick={handleApplyDiscount}
                  className="btn-primary"
                  disabled={selectedProducts.length === 0 || discountPercentage === 0}
                >
                  Aplicar Descuento
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Combo Modal */}
      {showComboModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <motion.div 
            className="glassmorphism w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center p-6 border-b border-white/10">
              <h2 className="text-xl font-orbitron font-bold text-white">
                Crear Combo de Productos
              </h2>
              <button 
                onClick={handleCloseComboModal}
                className="text-white/70 hover:text-white text-xl"
              >
                &times;
              </button>
            </div>
            
            <div className="p-6">
              {/* Combo Information */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-4">Información del Combo</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-white/70 mb-2">Nombre del Combo</label>
                    <input 
                      type="text"
                      placeholder="Ej: Combo Gamer, Pack Familiar, etc."
                      value={comboName}
                      onChange={(e) => setComboName(e.target.value)}
                      className="w-full bg-black/30 text-white border border-white/10 rounded p-3"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white/70 mb-2">Precio del Combo</label>
                    <input 
                      type="text"
                      placeholder="Precio con descuento"
                      value={comboPrice ? formatPrice(comboPrice) : ''}
                      onChange={(e) => handlePriceChange(e, setComboPrice)}
                      className="w-full bg-black/30 text-white border border-white/10 rounded p-3"
                      required
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-white/70 mb-2">Descripción (opcional)</label>
                  <textarea
                    placeholder="Descripción del combo"
                    value={comboDescription}
                    onChange={(e) => setComboDescription(e.target.value)}
                    className="w-full bg-black/30 text-white border border-white/10 rounded p-3"
                    rows="3"
                  ></textarea>
                </div>
              </div>
              
              {/* Product Search */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-4">Selecciona los Productos para el Combo</h3>
                <div className="mb-4">
                  <input 
                    type="text"
                    placeholder="Buscar por nombre o ID de producto..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-black/30 text-white border border-white/10 rounded p-3"
                  />
                </div>
                
                {/* Selected Products Info */}
                <div className="mb-4 flex justify-between items-center">
                  <p className="text-white">{comboProducts.length} productos seleccionados</p>
                  {comboProducts.length > 0 && (
                    <div className="text-white">
                      <p>Precio total: <span className="font-bold">${formatPrice(calculateTotalPrice())}</span></p>
                      {comboPrice && (
                        <p>
                          Descuento: <span className="text-green-400 font-bold">
                            {((1 - (parseFloat(comboPrice) / parseFloat(calculateTotalPrice()))) * 100).toFixed(0)}%
                          </span>
                        </p>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Products List */}
                <div className="overflow-y-auto max-h-80 border border-white/10 rounded">
                  <table className="min-w-full divide-y divide-white/10">
                    <thead className="bg-black/30">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Seleccionar</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Nombre</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Categoría</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Precio</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {filteredProducts().length > 0 ? (
                        filteredProducts().map(product => {
                          const isSelected = comboProducts.includes(product.id)
                          const price = parseFloat(product.price)
                          
                          return (
                            <tr 
                              key={product.id} 
                              className={`hover:bg-white/5 transition-colors cursor-pointer ${isSelected ? 'bg-green-900/20' : ''}`}
                              onClick={() => handleComboProductSelection(product.id)}
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                <input 
                                  type="checkbox" 
                                  checked={isSelected}
                                  onChange={() => {}} // Controlado por el onClick del tr
                                  className="h-5 w-5"
                                />
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-white">{product.id}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-white">{product.name}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-white/70">
                                {categories.find(c => c.id === product.category)?.name || 'Sin categoría'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-white">${formatPrice(price)}</td>
                            </tr>
                          )
                        })
                      ) : (
                        <tr>
                          <td colSpan="5" className="px-6 py-12 text-center text-white/70">
                            No se encontraron productos
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 mt-6">
                <button 
                  type="button" 
                  onClick={handleCloseComboModal}
                  className="btn-secondary"
                >
                  Cancelar
                </button>
                <button 
                  type="button" 
                  onClick={handleCreateCombo}
                  className="btn-primary"
                  disabled={comboProducts.length === 0 || !comboPrice || !comboName}
                >
                  Crear Combo
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Product List Modal */}
      {showProductListModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <motion.div 
            className="glassmorphism w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center p-6 border-b border-white/10">
              <h2 className="text-xl font-orbitron font-bold text-white">
                Lista de Productos
              </h2>
              <button 
                onClick={handleCloseProductListModal}
                className="text-white/70 hover:text-white text-xl"
              >
                &times;
              </button>
            </div>
            
            <div className="p-6">
              {/* Product Search */}
              <div className="mb-6">
                <div className="mb-4">
                  <input 
                    type="text"
                    placeholder="Buscar por nombre o ID de producto..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-black/30 text-white border border-white/10 rounded p-3"
                  />
                </div>
                
                {/* Products Count */}
                <div className="mb-4 text-white">
                  <p>{filteredProducts().length} productos encontrados</p>
                </div>
                
                {/* Products List */}
                <div className="overflow-y-auto max-h-[60vh] border border-white/10 rounded">
                  <table className="min-w-full divide-y divide-white/10">
                    <thead className="bg-black/30 sticky top-0">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Nombre</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Categoría</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Precio</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Stock</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {filteredProducts().length > 0 ? (
                        filteredProducts().map(product => {
                          const price = parseFloat(product.price)
                          
                          return (
                            <tr 
                              key={product.id} 
                              className="hover:bg-white/5 transition-colors"
                            >
                              <td className="px-6 py-4 whitespace-nowrap text-white">{product.id}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-white">{product.name}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-white/70">
                                {categories.find(c => c.id === product.category)?.name || 'Sin categoría'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-white">${formatPrice(price)}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-white">{product.stock}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex space-x-3">
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleEditProduct(product)
                                    }}
                                    className="text-blue-400 hover:text-blue-300 transition-colors"
                                    title="Editar producto"
                                  >
                                    <FiEdit className="text-lg" />
                                  </button>
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      if (window.confirm(`¿Estás seguro de eliminar el producto "${product.name}"?`)) {
                                        handleDeleteProduct(product.id)
                                      }
                                    }}
                                    className="text-red-400 hover:text-red-300 transition-colors"
                                    title="Eliminar producto"
                                  >
                                    <FiTrash2 className="text-lg" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )
                        })
                      ) : (
                        <tr>
                          <td colSpan="6" className="px-6 py-12 text-center text-white/70">
                            No se encontraron productos
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 mt-6">
                <button 
                  type="button" 
                  onClick={handleCloseProductListModal}
                  className="btn-secondary"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Admin User Modal */}
      {showAdminUserModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-hidden">
          <motion.div 
            className="glassmorphism w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center p-6 border-b border-white/10">
              <h2 className="text-xl font-orbitron font-bold text-white">
                Gestión de Usuarios Administradores
              </h2>
              <button 
                onClick={handleCloseAdminUserModal}
                className="text-white/70 hover:text-white text-xl"
              >
                &times;
              </button>
            </div>
            
            <div className="p-6">
              {adminUserError && (
                <div className="bg-red-500/20 border border-red-500 text-white p-4 rounded-lg mb-6">
                  <p className="font-bold">Error:</p>
                  <p>{adminUserError}</p>
                </div>
              )}
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Columna izquierda: Formulario */}
                <div>
                  <div className="bg-black/20 p-6 rounded-lg border border-white/10 mb-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Crear Nuevo Usuario Administrador</h3>
                    
                    <form onSubmit={handleAdminUserSubmit}>
                      <div className="mb-4">
                        <label className="block text-white/70 mb-2">Nombre</label>
                        <input 
                          type="text" 
                          name="name"
                          value={adminUserForm.name}
                          onChange={handleAdminUserChange}
                          className="w-full bg-black/30 text-white border border-white/10 rounded p-3"
                          required
                        />
                      </div>
                      
                      <div className="mb-4">
                        <label className="block text-white/70 mb-2">Email</label>
                        <input 
                          type="email" 
                          name="email"
                          value={adminUserForm.email}
                          onChange={handleAdminUserChange}
                          className="w-full bg-black/30 text-white border border-white/10 rounded p-3"
                          required
                        />
                      </div>
                      
                      <div className="mb-4">
                        <label className="block text-white/70 mb-2">Contraseña</label>
                        <input 
                          type="password" 
                          name="password"
                          value={adminUserForm.password}
                          onChange={handleAdminUserChange}
                          className="w-full bg-black/30 text-white border border-white/10 rounded p-3"
                          required
                        />
                      </div>
                      
                      <div className="mb-6">
                        <label className="block text-white/70 mb-2">Rol</label>
                        <div className="flex space-x-4">
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              name="role"
                              value="admin"
                              checked={adminUserForm.role === 'admin'}
                              onChange={handleAdminUserChange}
                              className="mr-2"
                            />
                            <span className="text-white">Admin</span>
                            <span className="text-white/50 text-sm ml-2">(Solo gestión de productos)</span>
                          </label>
                          
                          {/* Opción de superadmin solo visible para usuarios superadmin */}
                          {isSuperAdmin && (
                            <label className="inline-flex items-center">
                              <input
                                type="radio"
                                name="role"
                                value="superadmin"
                                checked={adminUserForm.role === 'superadmin'}
                                onChange={handleAdminUserChange}
                                className="mr-2"
                              />
                              <span className="text-white">Super Admin</span>
                              <span className="text-white/50 text-sm ml-2">(Acceso total)</span>
                            </label>
                          )}
                        </div>
                        
                        {/* Mensaje informativo sobre roles */}
                        <div className="mt-2 text-xs text-white/60">
                          <p>Los usuarios con rol Admin solo tienen acceso a funciones básicas de gestión.</p>
                          {isSuperAdmin && <p>Los usuarios con rol Super Admin tienen acceso completo a todas las funcionalidades.</p>}
                        </div>
                      </div>
                      
                      <div className="flex justify-end space-x-4">
                        <button 
                          type="button" 
                          onClick={handleCloseAdminUserModal}
                          className="btn-secondary"
                        >
                          Cancelar
                        </button>
                        <button 
                          type="submit" 
                          className="btn-primary"
                          disabled={loading}
                        >
                          {loading ? 'Creando...' : 'Crear Usuario'}
                        </button>
                      </div>
                    </form>
                  </div>
                  
                  <div className="bg-black/20 p-6 rounded-lg border border-white/10">
                    <h4 className="text-sm font-semibold text-white mb-2">Información sobre roles:</h4>
                    <ul className="text-sm text-white/70 space-y-1">
                      <li className="flex items-center">
                        <span className="inline-block w-3 h-3 rounded-full bg-purple-500/50 mr-2"></span>
                        <span><strong>Super Admin:</strong> Acceso completo a todas las funcionalidades del sistema.</span>
                      </li>
                      <li className="flex items-center">
                        <span className="inline-block w-3 h-3 rounded-full bg-blue-500/50 mr-2"></span>
                        <span><strong>Admin:</strong> Acceso limitado a funciones básicas de gestión.</span>
                      </li>
                      <li className="flex items-center">
                        <span className="inline-block w-3 h-3 rounded-full bg-yellow-500/50 mr-2"></span>
                        <span><strong>Usuario Principal:</strong> El usuario 'admin' es el único que puede tener rol de Super Admin.</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                {/* Columna derecha: Tabla de usuarios admin */}
                <div>
                  <div className="bg-black/20 p-6 rounded-lg border border-white/10">
                    <h3 className="text-lg font-semibold text-white mb-4">Usuarios Administradores</h3>
                    
                    <div className="overflow-y-auto max-h-[400px] rounded-lg border border-white/10 shadow-inner">
                      <table className="min-w-full divide-y divide-white/10">
                        <thead className="bg-black/50 sticky top-0 z-10">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Nombre</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Rol</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Estado</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Detalles</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10 bg-black/20">
                          {adminUsers.length > 0 ? (
                            adminUsers.map(user => (
                              <tr key={user.id} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-white">{user.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-white font-medium">
                                  {user.username === 'admin' ? (
                                    <div className="flex items-center">
                                      <span className="mr-2">{user.username}</span>
                                      <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-500/30 text-yellow-300">Principal</span>
                                    </div>
                                  ) : (
                                    user.username
                                  )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-white">{user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  {user.is_superuser ? (
                                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-500/20 text-purple-300">Super Admin</span>
                                  ) : (
                                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-500/20 text-blue-300">Admin</span>
                                  )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  {user.profile?.is_email_verified ? (
                                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-500/20 text-green-300">Verificado</span>
                                  ) : (
                                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-500/20 text-red-300">No verificado</span>
                                  )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-white">
                                  <button 
                                    className="text-neon-blue hover:text-neon-purple transition-colors"
                                    onClick={() => alert(`Usuario: ${user.username}\nEmail: ${user.email}\nRol: ${user.is_superuser ? 'Super Admin' : 'Admin'}\nVerificado: ${user.profile?.is_email_verified ? 'Sí' : 'No'}`)}
                                  >
                                    Ver detalles
                                  </button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="6" className="px-6 py-12 text-center text-white/70">
                                No hay usuarios administradores
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Sales Statistics Modal */}
      {showSalesStatsModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <motion.div 
            className="glassmorphism w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center p-6 border-b border-white/10">
              <h2 className="text-xl font-orbitron font-bold text-white">
                Estadísticas de Ventas
              </h2>
              <button 
                onClick={handleCloseSalesStatsModal}
                className="text-white/70 hover:text-white text-xl"
              >
                &times;
              </button>
            </div>
            
            <div className="p-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="glassmorphism p-6 rounded-lg">
                  <h3 className="text-white/70 text-sm uppercase mb-2">Ventas Totales</h3>
                  <p className="text-3xl font-bold text-white">${formatPrice(salesStats.totalSales)}</p>
                </div>
                
                <div className="glassmorphism p-6 rounded-lg">
                  <h3 className="text-white/70 text-sm uppercase mb-2">Pedidos Totales</h3>
                  <p className="text-3xl font-bold text-white">{salesStats.totalOrders}</p>
                </div>
                
                <div className="glassmorphism p-6 rounded-lg">
                  <h3 className="text-white/70 text-sm uppercase mb-2">Valor Promedio</h3>
                  <p className="text-3xl font-bold text-white">${formatPrice(salesStats.averageOrderValue)}</p>
                </div>
              </div>
              
              {/* Monthly Sales Chart */}
              <div className="glassmorphism p-6 rounded-lg mb-8">
                <h3 className="text-lg font-semibold text-white mb-6">Ventas Mensuales</h3>
                
                <div className="h-64 w-full">
                  <div className="relative h-full">
                    {/* Y-axis */}
                    <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between text-white/70 text-xs">
                      <span>$1000</span>
                      <span>$800</span>
                      <span>$600</span>
                      <span>$400</span>
                      <span>$200</span>
                      <span>$0</span>
                    </div>
                    
                    {/* Chart area */}
                    <div className="absolute left-12 right-0 top-0 bottom-0">
                      {/* Horizontal grid lines */}
                      <div className="absolute inset-0 flex flex-col justify-between">
                        {[0, 1, 2, 3, 4, 5].map((i) => (
                          <div key={i} className="border-t border-white/10 w-full h-0"></div>
                        ))}
                      </div>
                      
                      {/* Bars */}
                      <div className="absolute inset-0 flex items-end">
                        <div className="w-full h-full flex justify-between items-end">
                          {salesStats.monthlySales.map((month, index) => (
                            <div key={index} className="flex flex-col items-center">
                              <div 
                                className="w-8 bg-gradient-to-t from-blue-500 to-blue-300 rounded-t"
                                style={{ height: `${(month.sales / 1000) * 100}%` }}
                              ></div>
                              <span className="text-white/70 text-xs mt-2">{month.month.substring(0, 3)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 mt-6">
                <button 
                  type="button" 
                  onClick={handleCloseSalesStatsModal}
                  className="btn-secondary"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Orders Approval Modal */}
      {showOrdersModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <motion.div 
            className="glassmorphism w-full max-w-5xl max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center p-6 border-b border-white/10">
              <h2 className="text-xl font-orbitron font-bold text-white">
                Aprobación de Pedidos
              </h2>
              <button 
                onClick={handleCloseOrdersModal}
                className="text-white/70 hover:text-white text-xl"
              >
                &times;
              </button>
            </div>
            
            <div className="p-6">
              {/* Filter */}
              <div className="mb-6">
                <label className="block text-white/70 mb-2">Filtrar por estado</label>
                <select
                  value={orderStatusFilter}
                  onChange={handleStatusFilterChange}
                  className="w-full md:w-64 bg-black/30 text-white border border-white/10 rounded p-3"
                >
                  <option value="all">Todos los estados</option>
                  {orderStatuses.map((status, index) => (
                    <option key={index} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              
              {/* Orders Table */}
              <div className="overflow-y-auto max-h-[60vh] border border-white/10 rounded">
                <table className="min-w-full divide-y divide-white/10">
                  <thead className="bg-black/30 sticky top-0">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Producto</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Precio</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Fecha</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {filteredOrders().length > 0 ? (
                      filteredOrders().map(order => (
                        <tr key={order.id} className="hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-white">#{order.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-white">{order.product}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-white">${formatPrice(order.price)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-white/70">{order.date}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              value={order.status}
                              onChange={(e) => handleOrderStatusChange(order.id, e.target.value)}
                              className={`w-full bg-black/30 border rounded p-2 ${order.status === 'Pedido entregado' ? 'text-green-400 border-green-400/30' : 'text-white border-white/10'}`}
                            >
                              {orderStatuses.map((status, index) => (
                                <option key={index} value={status}>{status}</option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-6 py-12 text-center text-white/70">
                          No se encontraron pedidos con el filtro seleccionado
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              {/* Summary */}
              <div className="mt-6 text-white">
                <p>{filteredOrders().length} pedidos encontrados</p>
              </div>
              
              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 mt-6">
                <button 
                  type="button" 
                  onClick={handleCloseOrdersModal}
                  className="btn-secondary"
                >
                  Cerrar
                </button>
                <button 
                  type="button" 
                  className="btn-primary"
                  onClick={() => {
                    alert('Cambios guardados correctamente')
                    handleCloseOrdersModal()
                  }}
                >
                  Guardar Cambios
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Discounted Products Table */}
      {showDiscountedProducts && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <motion.div 
            className="glassmorphism w-full max-w-6xl max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center p-6 border-b border-white/10">
              <h2 className="text-xl font-orbitron font-bold text-white">
                Productos con Descuento
              </h2>
              <button 
                onClick={() => setShowDiscountedProducts(false)}
                className="text-white/70 hover:text-white text-xl"
              >
                &times;
              </button>
            </div>
            
            <div className="p-6">
              {discountedProducts.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-white/10">
                    <thead className="bg-black/30">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Nombre</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Precio Original</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Descuento</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Precio Final</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {discountedProducts.map(product => (
                        <tr key={product.id} className="hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-white">{product.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-white">{product.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-white">${product.original_price?.toFixed(2) || "N/A"}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-green-400">{product.discount_percentage || 0}%</td>
                          <td className="px-6 py-4 whitespace-nowrap text-white">${parseFloat(product.price).toFixed(2)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-white">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEditDiscount(product)}
                                className="bg-neon-blue/20 hover:bg-neon-blue/40 text-white px-3 py-1 rounded transition-colors"
                              >
                                Editar
                              </button>
                              <button
                                onClick={() => handleRemoveDiscount(product.id)}
                                className="bg-red-500/20 hover:bg-red-500/40 text-white px-3 py-1 rounded transition-colors"
                              >
                                Eliminar
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 text-white/70">
                  No hay productos con descuento
                </div>
              )}
              
              <div className="flex justify-end space-x-4 mt-6">
                <button 
                  type="button" 
                  onClick={() => {
                    setShowDiscountedProducts(false);
                    setSelectedProducts([]);
                    setDiscountPercentage(0);
                    setSearchTerm('');
                    setShowDiscountModal(true);
                  }}
                  className="btn-primary"
                >
                  Crear Nuevo Descuento
                </button>
                
                <button 
                  type="button" 
                  onClick={() => setShowDiscountedProducts(false)}
                  className="btn-secondary"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard
