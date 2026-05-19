import { request } from '../utils/request'

const BASE_PATH = 'payrolls'

export const PayrollService = {
  /**
   * Get payroll list with filters
   * @param {Object} filter { txt_search, status }
   */
  getList: async (filter = {}) => {
    const { txt_search, status } = filter

    const params = new URLSearchParams({
      page: 1
    })

    if (txt_search) params.append('txt_search', txt_search)
    if (status !== null && status !== '') params.append('status', status)

    const url = `${BASE_PATH}?${params.toString()}`
    return request(url, 'get')
  },

  /**
   * Create new payroll
   */
  create: async data => {
    return request(BASE_PATH, 'post', data)
  },

  /**
   * Update existing payroll
   */
  update: async (id, data) => {
    return request(`${BASE_PATH}/${id}`, 'put', data)
  },

  /**
   * Delete payroll
   */
  delete: async id => {
    return request(`${BASE_PATH}/${id}`, 'delete')
  }
}
