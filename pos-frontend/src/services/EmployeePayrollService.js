import {
    request
} from '../utils/request'

const BASE_PATH = 'employee/payrolls'

export const EmployeePayrollService = {
    /**
     * Get employee payroll list with filters
     * @param {Object} filter { txt_search, payroll_id }
     */
    getList: async (filter = {}) => {
        const {
            txt_search,
            payroll_id
        } = filter
        const params = new URLSearchParams()

        if (txt_search) params.append('txt_search', txt_search)
        if (payroll_id) params.append('payroll_id', payroll_id)

        const url = `${BASE_PATH}?${params.toString()}`
        return request(url, 'get')
    },

    create: async data => {
        return request(BASE_PATH, 'post', data)
    },

    update: async (id, data) => {
        return request(`${BASE_PATH}/${id}`, 'put', data)
    },

    delete: async id => {
        return request(`${BASE_PATH}/${id}`, 'delete')
    }
}