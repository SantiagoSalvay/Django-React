import axios from 'axios'

// Get all users
export const getAllUsers = async () => {
  try {
    const response = await axios.get('/api/users/')
    return response.data
  } catch (error) {
    console.error('Error fetching users:', error)
    throw error
  }
}

// Create a new admin user
export const createAdminUser = async (userData) => {
  try {
    const response = await axios.post('/api/users/admin/', userData)
    return response.data
  } catch (error) {
    console.error('Error creating admin user:', error)
    throw error
  }
}

// Update user
export const updateUser = async (userId, userData) => {
  try {
    const response = await axios.put(`/api/users/${userId}/`, userData)
    return response.data
  } catch (error) {
    console.error(`Error updating user ${userId}:`, error)
    throw error
  }
}

// Delete user
export const deleteUser = async (userId) => {
  try {
    await axios.delete(`/api/users/${userId}/`)
    return true
  } catch (error) {
    console.error(`Error deleting user ${userId}:`, error)
    throw error
  }
}

// Get current user profile
export const getCurrentUser = async () => {
  try {
    const response = await axios.get('/api/users/me/')
    return response.data
  } catch (error) {
    console.error('Error fetching current user:', error)
    throw error
  }
}
