import {
    request
} from '../utils/request'

const BASE_PATH = 'expense-types'

export const ExpenseTypeService = {
    /**
     * Get expense type list with search
     * @param {Object} filter { txt_search }
     */
    getList: async (filter = {}) => {
        const {
            txt_search
        } = filter
        const params = new URLSearchParams()

        if (txt_search) params.append('txt_search', txt_search)

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