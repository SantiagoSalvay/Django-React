import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiPlus, FiEdit, FiTrash2, FiPackage, FiFolder, FiRefreshCw } from 'react-icons/fi'
import { 
  getAllProducts, 
  getAllCategories, 
  createProduct,
  updateProduct,
  deleteProduct,
  createCategory,
  updateCategory,
  deleteCategory
} from '../api/productApi'

const AdminDashboard = () => {
  // Data states
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('products')
  
  // Form states
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    image: null
  })
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    slug: ''
  })
  
  // Edit states
  const [editingProduct, setEditingProduct] = useState(null)
  const [editingCategory, setEditingCategory] = useState(null)
  
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
    
    if (type === 'file') {
      setProductForm({
        ...productForm,
        [name]: files[0]
      })
    } else {
      setProductForm({
        ...productForm,
        [name]: value
      })
    }
  }
  
  const handleProductSubmit = async (e) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      
      const formData = new FormData()
      Object.keys(productForm).forEach(key => {
        if (productForm[key] !== null) {
          formData.append(key, productForm[key])
        }
      })
      
      if (editingProduct) {
        await updateProduct(editingProduct.id, formData)
      } else {
        await createProduct(formData)
      }
      
      // Reset form and refresh data
      setProductForm({
        name: '',
        description: '',
        price: '',
        stock: '',
        category: '',
        image: null
      })
      setEditingProduct(null)
      await fetchData()
    } catch (err) {
      setError('Error al guardar el producto')
      console.error('Error saving product:', err)
    } finally {
      setLoading(false)
    }
  }
  
  const handleEditProduct = (product) => {
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category,
      image: null // Can't pre-fill file input
    })
    setEditingProduct(product)
  }
  
  const handleDeleteProduct = async (productId) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
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
      
      if (editingCategory) {
        await updateCategory(editingCategory.slug, categoryForm)
      } else {
        await createCategory(categoryForm)
      }
      
      // Reset form and refresh data
      setCategoryForm({
        name: '',
        slug: ''
      })
      setEditingCategory(null)
      await fetchData()
    } catch (err) {
      setError('Error al guardar la categoría')
      console.error('Error saving category:', err)
    } finally {
      setLoading(false)
    }
  }
  
  const handleEditCategory = (category) => {
    setCategoryForm({
      name: category.name,
      slug: category.slug
    })
    setEditingCategory(category)
  }
  
  const handleDeleteCategory = async (categorySlug) => {
    if (window.confirm('¿Estás seguro de eliminar esta categoría? Esto eliminará todos los productos asociados.')) {
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
  }
  
  if (loading && products.length === 0 && categories.length === 0) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-neon-blue"></div>
      </div>
    )
  }
  
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-orbitron font-bold mb-8 text-white">
          Panel de Control
        </h1>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-white p-4 rounded-lg mb-6">
            {error}
            <button 
              onClick={fetchData} 
              className="ml-4 text-neon-blue hover:text-white transition-colors"
            >
              <FiRefreshCw />
            </button>
          </div>
        )}
        
        {/* Tabs */}
        <div className="flex border-b border-white/10 mb-8">
          <button
            className={`py-3 px-6 font-orbitron flex items-center space-x-2 ${
              activeTab === 'products' 
                ? 'text-neon-blue border-b-2 border-neon-blue' 
                : 'text-white/70 hover:text-white'
            }`}
            onClick={() => setActiveTab('products')}
          >
            <FiPackage />
            <span>Productos</span>
          </button>
          
          <button
            className={`py-3 px-6 font-orbitron flex items-center space-x-2 ${
              activeTab === 'categories' 
                ? 'text-neon-blue border-b-2 border-neon-blue' 
                : 'text-white/70 hover:text-white'
            }`}
            onClick={() => setActiveTab('categories')}
          >
            <FiFolder />
            <span>Categorías</span>
          </button>
        </div>
        
        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            <div className="glassmorphism p-6 mb-8">
              <h2 className="text-xl font-orbitron font-bold mb-4 text-white">
                {editingProduct ? 'Editar Producto' : 'Agregar Nuevo Producto'}
              </h2>
              
              <form onSubmit={handleProductSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white mb-2">Nombre</label>
                    <input
                      type="text"
                      name="name"
                      value={productForm.name}
                      onChange={handleProductChange}
                      className="input-field"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white mb-2">Categoría</label>
                    <select
                      name="category"
                      value={productForm.category}
                      onChange={handleProductChange}
                      className="input-field"
                      required
                    >
                      <option value="">Seleccionar categoría</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-white mb-2">Precio</label>
                    <input
                      type="number"
                      name="price"
                      value={productForm.price}
                      onChange={handleProductChange}
                      className="input-field"
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white mb-2">Stock</label>
                    <input
                      type="number"
                      name="stock"
                      value={productForm.stock}
                      onChange={handleProductChange}
                      className="input-field"
                      min="0"
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-white mb-2">Descripción</label>
                    <textarea
                      name="description"
                      value={productForm.description}
                      onChange={handleProductChange}
                      className="input-field"
                      rows="3"
                      required
                    ></textarea>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-white mb-2">Imagen</label>
                    <input
                      type="file"
                      name="image"
                      onChange={handleProductChange}
                      className="input-field"
                      accept="image/*"
                      {...(editingProduct ? {} : { required: true })}
                    />
                    {editingProduct && (
                      <p className="text-white/60 text-sm mt-1">
                        Deja en blanco para mantener la imagen actual
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <button type="submit" className="btn-primary flex items-center space-x-2">
                    {editingProduct ? (
                      <>
                        <FiEdit />
                        <span>Actualizar Producto</span>
                      </>
                    ) : (
                      <>
                        <FiPlus />
                        <span>Agregar Producto</span>
                      </>
                    )}
                  </button>
                  
                  {editingProduct && (
                    <button 
                      type="button" 
                      className="btn-secondary"
                      onClick={() => {
                        setProductForm({
                          name: '',
                          description: '',
                          price: '',
                          stock: '',
                          category: '',
                          image: null
                        })
                        setEditingProduct(null)
                      }}
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>
            
            <div className="glassmorphism overflow-hidden">
              <h2 className="text-xl font-orbitron font-bold p-6 border-b border-white/10 text-white">
                Lista de Productos
              </h2>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-white/10">
                  <thead className="bg-black/30">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Imagen</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Nombre</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Categoría</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Precio</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Stock</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {products.length > 0 ? (
                      products.map(product => (
                        <tr key={product.id} className="hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <img 
                              src={product.image} 
                              alt={product.name} 
                              className="h-12 w-12 object-cover rounded-md"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-white">{product.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-white/70">{product.category_name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-neon-blue">${parseFloat(product.price).toFixed(2)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-white/70">{product.stock}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => handleEditProduct(product)}
                                className="text-neon-blue hover:text-white transition-colors"
                              >
                                <FiEdit />
                              </button>
                              <button 
                                onClick={() => handleDeleteProduct(product.id)}
                                className="text-red-400 hover:text-red-500 transition-colors"
                              >
                                <FiTrash2 />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="px-6 py-12 text-center text-white/70">
                          No hay productos registrados
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        
        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div>
            <div className="glassmorphism p-6 mb-8">
              <h2 className="text-xl font-orbitron font-bold mb-4 text-white">
                {editingCategory ? 'Editar Categoría' : 'Agregar Nueva Categoría'}
              </h2>
              
              <form onSubmit={handleCategorySubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white mb-2">Nombre</label>
                    <input
                      type="text"
                      name="name"
                      value={categoryForm.name}
                      onChange={handleCategoryChange}
                      className="input-field"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white mb-2">Slug (URL)</label>
                    <input
                      type="text"
                      name="slug"
                      value={categoryForm.slug}
                      onChange={handleCategoryChange}
                      className="input-field"
                      required
                      disabled={editingCategory} // Can't edit slug of existing category
                    />
                    {editingCategory && (
                      <p className="text-white/60 text-sm mt-1">
                        El slug no se puede editar una vez creada la categoría
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <button type="submit" className="btn-primary flex items-center space-x-2">
                    {editingCategory ? (
                      <>
                        <FiEdit />
                        <span>Actualizar Categoría</span>
                      </>
                    ) : (
                      <>
                        <FiPlus />
                        <span>Agregar Categoría</span>
                      </>
                    )}
                  </button>
                  
                  {editingCategory && (
                    <button 
                      type="button" 
                      className="btn-secondary"
                      onClick={() => {
                        setCategoryForm({
                          name: '',
                          slug: ''
                        })
                        setEditingCategory(null)
                      }}
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>
            
            <div className="glassmorphism overflow-hidden">
              <h2 className="text-xl font-orbitron font-bold p-6 border-b border-white/10 text-white">
                Lista de Categorías
              </h2>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-white/10">
                  <thead className="bg-black/30">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Nombre</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Slug</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Productos</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {categories.length > 0 ? (
                      categories.map(category => (
                        <tr key={category.id} className="hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-white">{category.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-white/70">{category.slug}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-white/70">
                            {products.filter(p => p.category === category.id).length}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => handleEditCategory(category)}
                                className="text-neon-blue hover:text-white transition-colors"
                              >
                                <FiEdit />
                              </button>
                              <button 
                                onClick={() => handleDeleteCategory(category.slug)}
                                className="text-red-400 hover:text-red-500 transition-colors"
                              >
                                <FiTrash2 />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="px-6 py-12 text-center text-white/70">
                          No hay categorías registradas
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default AdminDashboard 