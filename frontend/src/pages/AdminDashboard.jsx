import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
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
  FiDatabase
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
import { createAdminUser } from '../api/userApi'

const AdminDashboard = () => {
  // Data states
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Modal states
  const [showProductModal, setShowProductModal] = useState(false)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [showDiscountModal, setShowDiscountModal] = useState(false)
  const [showComboModal, setShowComboModal] = useState(false)
  const [showProductListModal, setShowProductListModal] = useState(false)
  const [showAdminUserModal, setShowAdminUserModal] = useState(false)
  const [showSalesStatsModal, setShowSalesStatsModal] = useState(false)
  
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
        setSelectedProducts([])
        setDiscountPercentage(0)
        setSearchTerm('')
        setShowDiscountModal(true)
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
  const adminFunctions = [
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
      }
    },
    {
      title: 'Ver Ventas',
      icon: <FiDollarSign className="text-2xl" />,
      description: 'Ver estadísticas de ventas',
      action: () => setShowSalesStatsModal(true)
    },
    {
      title: 'Aprobar Compras',
      icon: <FiCheckCircle className="text-2xl" />,
      description: 'Aprobar pedidos pendientes',
      action: () => {
        setOrderStatusFilter('all')
        setShowOrdersModal(true)
      }
    },
    {
      title: 'Crear Categoría',
      icon: <FiFolder className="text-2xl" />,
      description: 'Crear categorías de productos',
      action: () => setShowCategoryModal(true)
    }
  ]
  
  // Fetch data
  const fetchData = async () => {
    try {
      setLoading(true)
      const [productsData, categoriesData] = await Promise.all([
        getAllProducts(),
        getAllCategories()
      ])
      
      setProducts(productsData)
      setCategories(categoriesData)
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
      setError('Selecciona al menos un producto y un porcentaje de descuento')
      return
    }
    
    try {
      setLoading(true)
      
      // Aplicar descuento a cada producto seleccionado
      for (const productId of selectedProducts) {
        const product = products.find(p => p.id === productId)
        if (product) {
          const originalPrice = parseFloat(product.price)
          const discountAmount = originalPrice * (discountPercentage / 100)
          const discountedPrice = originalPrice - discountAmount
          
          console.log(`Aplicando descuento del ${discountPercentage}% al producto ${product.name} (ID: ${productId})`);
          console.log(`Precio original: $${originalPrice.toFixed(2)}, Precio con descuento: $${discountedPrice.toFixed(2)}`);
          
          try {
            // Crear un objeto simple con solo los campos necesarios
            const simpleData = {
              name: product.name,
              description: product.description || '',
              price: discountedPrice.toFixed(2),
              stock: product.stock || 0,
              category: product.category || ''
            };
            
            console.log('Enviando datos al servidor:', simpleData);
            
            // Realizar una solicitud directa con axios
            await axios.patch(`/api/products/products/${productId}/`, simpleData, {
              headers: {
                'Content-Type': 'application/json',
              },
            });
            
            console.log(`Descuento aplicado con éxito al producto ${productId}`);
          } catch (error) {
            console.error(`Error al aplicar descuento al producto ${productId}:`, error);
            console.error('Detalles del error:', error.response ? error.response.data : 'No hay detalles disponibles');
          }
        }
      }
      
      // Cerrar modal y refrescar datos
      setShowDiscountModal(false)
      setSelectedProducts([])
      setDiscountPercentage(0)
      setSearchTerm('')
      await fetchData()
      
    } catch (err) {
      setError('Error al aplicar descuentos')
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
  const handleAdminUserChange = (e) => {
    const { name, value } = e.target
    setAdminUserForm({
      ...adminUserForm,
      [name]: value
    })
  }
  
  const handleAdminUserSubmit = async (e) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      
      // Preparar los datos del usuario para enviar a la API
      const userData = {
        name: adminUserForm.name,
        email: adminUserForm.email,
        password: adminUserForm.password,
        role: adminUserForm.role
      }
      
      console.log('Creando usuario administrador:', userData)
      
      // Llamar a la API para crear el usuario
      const response = await createAdminUser(userData)
      
      console.log('Usuario creado exitosamente:', response)
      
      // Mostrar mensaje de éxito
      alert(`Usuario ${adminUserForm.name} creado exitosamente con rol ${adminUserForm.role}`)
      
      // Cerrar modal y limpiar formulario
      setShowAdminUserModal(false)
      setAdminUserForm({
        name: '',
        email: '',
        password: '',
        role: 'admin'
      })
      
    } catch (err) {
      setError('Error al crear usuario administrador')
      console.error('Error creating admin user:', err)
    } finally {
      setLoading(false)
    }
  }
  
  const handleCloseAdminUserModal = () => {
    setShowAdminUserModal(false)
    setAdminUserForm({
      name: '',
      email: '',
      password: '',
      role: 'admin'
    })
  }
  
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
      <h1 className="text-3xl font-orbitron font-bold mb-8 text-white">
        Panel de Control
      </h1>

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
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <motion.div 
            className="glassmorphism w-full max-w-md"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center p-6 border-b border-white/10">
              <h2 className="text-xl font-orbitron font-bold text-white">
                Crear Usuario Administrador
              </h2>
              <button 
                onClick={handleCloseAdminUserModal}
                className="text-white/70 hover:text-white text-xl"
              >
                &times;
              </button>
            </div>
            
            <form onSubmit={handleAdminUserSubmit} className="p-6">
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
    </div>
  );
}

export default AdminDashboard
