import { request } from '../utils/request'

const BASE_PATH = 'customer_type'

export const CustomerTypeService = {
  /**
   * Get customer type list with search filter
   * @param {Object} filter - Contains txt_search for filtering by name
   */
  getList: async (filter = {}) => {
    const { txt_search } = filter
    const params = new URLSearchParams()

    if (txt_search) {
      params.append('txt_search', txt_search)
    }

    const url = `${BASE_PATH}?${params.toString()}`
    return request(url, 'get')
  },

  /**
   * Get a single customer type by ID
   */
  getOne: async id => {
    return request(`${BASE_PATH}/${id}`, 'get')
  },

  /**
   * Create a new customer type tier
   */
  create: async data => {
    return request(BASE_PATH, 'post', data)
  },

  /**
   * Update an existing customer type record
   */
  update: async (id, data) => {
    return request(`${BASE_PATH}/${id}`, 'put', data)
  },

  /**
   * Delete a customer type record
   */
  delete: async id => {
    return request(`${BASE_PATH}/${id}`, 'delete')
  }
}
