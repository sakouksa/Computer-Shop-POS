import { request } from '../utils/request'

const BASE_PATH = 'customer'

export const customerService = {
  /**
   * Get list of customers with search and type filters
   * @param {Object} filter - Contains txt_search, customer_type_id, page, limit
   */
  getList (filter = {}) {
    const params = new URLSearchParams()

    params.append('page', filter.page || 1)
    if (filter.limit) {
      params.append('limit', filter.limit)
    }

    if (filter.txt_search) {
      params.append('txt_search', filter.txt_search)
    }

    if (
      filter.customer_type_id !== undefined &&
      filter.customer_type_id !== null &&
      filter.customer_type_id !== ''
    ) {
      params.append('customer_type_id', filter.customer_type_id)
    }

    return request(`${BASE_PATH}?${params.toString()}`, 'get')
  },

  /**
   * Create a new customer
   */
  create (data) {
    return request(BASE_PATH, 'post', data)
  },

  /**
   * Update an existing customer record
   */
  update (id, data) {
    return request(`${BASE_PATH}/${id}`, 'put', data)
  },

  /**
   * Delete a customer record
   */
  delete (id) {
    return request(`${BASE_PATH}/${id}`, 'delete')
  }
}
