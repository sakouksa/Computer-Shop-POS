import {
    request
} from '../utils/request'

const BASE_PATH = 'expenses'

export const ExpenseService = {
    /**
     * Get expense list with filters
     * @param {Object} filter { txt_search, expense_type_id, expense_status }
     */
    getList: async (filter = {}) => {
        const {
            txt_search,
            expense_type_id,
            expense_status
        } = filter
        const params = new URLSearchParams()

        if (txt_search) params.append('txt_search', txt_search)
        if (expense_type_id) params.append('expense_type_id', expense_type_id)
        if (expense_status) params.append('expense_status', expense_status)

        const url = `${BASE_PATH}?${params.toString()}`
        return request(url, 'get')
    },

    getOne: async id => {
        return request(`${BASE_PATH}/${id}`, 'get')
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