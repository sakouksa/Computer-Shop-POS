import {
    request
} from '../utils/request'

const BASE_PATH = 'province'

export const ProvinceService = {
    /**
     * Get province list with filters
     * @param {Object} filter { text_search, status }
     */
    getList: async (filter = {}) => {
        const {
            text_search,
            status
        } = filter
        const params = new URLSearchParams()

        if (text_search) params.append('text_search', text_search)
        if (status !== null && status !== undefined && status !== '') {
            params.append('status', status)
        }

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