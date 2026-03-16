import axios from 'axios'

const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

export const fetchFeed = async (lastId = null, limit = 10) => {
  try {
    const params = { limit }
    if (lastId) {
      params.lastId = lastId
    }
    const response = await apiClient.get('/feed', { params })
    return response.data.data || []
  } catch (error) {
    console.error('Error fetching feed:', error)
    throw error
  }
}

export default {
  fetchFeed
}
