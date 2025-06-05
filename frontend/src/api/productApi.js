import axios from './axiosConfig'

// Get all products
export const getAllProducts = async () => {
  try {
    const response = await axios.get('/api/products/products/')
    return response.data
  } catch (error) {
    console.error('Error fetching products:', error)
    throw error
  }
}

// Get products by category
export const getProductsByCategory = async (categorySlug) => {
  try {
    const response = await axios.get(`/api/products/products/?category=${categorySlug}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching products for category ${categorySlug}:`, error)
    throw error
  }
}

// Get all categories
export const getAllCategories = async () => {
  try {
    const response = await axios.get('/api/products/categories/')
    return response.data
  } catch (error) {
    console.error('Error fetching categories:', error)
    throw error
  }
}

// Get a category by slug
export const getCategoryBySlug = async (slug) => {
  try {
    const response = await axios.get(`/api/products/categories/${slug}/`)
    return response.data
  } catch (error) {
    console.error(`Error fetching category ${slug}:`, error)
    throw error
  }
}

// Get all payment methods
export const getPaymentMethods = async () => {
  try {
    const response = await axios.get('/api/products/payment-methods/')
    return response.data
  } catch (error) {
    console.error('Error fetching payment methods:', error)
    throw error
  }
}

// Admin functions
// Create a product
export const createProduct = async (productData) => {
  try {
    const response = await axios.post('/api/products/products/', productData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  } catch (error) {
    console.error('Error creating product:', error)
    throw error
  }
}

// Update a product
export const updateProduct = async (id, productData) => {
  try {
    // Check if we're updating an image
    const hasImage = productData.image instanceof File
    
    // Create FormData if we have an image
    let data
    let headers = {}
    
    if (hasImage) {
      data = new FormData()
      Object.keys(productData).forEach(key => {
        data.append(key, productData[key])
      })
      headers['Content-Type'] = 'multipart/form-data'
    } else {
      data = productData
      headers['Content-Type'] = 'application/json'
    }
    
    console.log('Enviando datos al servidor:', data)
    
    const response = await axios.put(`/api/products/products/${id}/`, data, { headers })
    console.log('Respuesta del servidor:', response.data)
    return response.data
  } catch (error) {
    console.error('Error completo en updateProduct:', error)
    if (error.response) {
      console.error('Datos de error:', error.response.data)
      console.error('Estado de error:', error.response.status)
    }
    throw error
  }
}

// Delete a product
export const deleteProduct = async (id) => {
  try {
    await axios.delete(`/api/products/products/${id}/`)
    return true
  } catch (error) {
    console.error(`Error deleting product ${id}:`, error)
    throw error
  }
}

// Create a category
export const createCategory = async (categoryData) => {
  try {
    const response = await axios.post('/api/products/categories/', categoryData)
    return response.data
  } catch (error) {
    console.error('Error creating category:', error)
    throw error
  }
}

// Update a category
export const updateCategory = async (slug, categoryData) => {
  try {
    const response = await axios.put(`/api/products/categories/${slug}/`, categoryData)
    return response.data
  } catch (error) {
    console.error(`Error updating category ${slug}:`, error)
    throw error
  }
}

// Delete a category
export const deleteCategory = async (slug) => {
  try {
    await axios.delete(`/api/products/categories/${slug}/`)
    return true
  } catch (error) {
    console.error(`Error deleting category ${slug}:`, error)
    throw error
  }
} 