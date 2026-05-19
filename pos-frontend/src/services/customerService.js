import {
    request
} from '../utils/request'

const BASE_PATH = 'customer'

export const customerService = {
    getList(filter = {}) {
        const params = new URLSearchParams()

        params.append('page', 1)

        if (filter.txt_search) {
            params.append('txt_search', filter.txt_search)
        }

        if (filter.status !== undefined && filter.status !== null) {
            params.append('status', filter.status)
        }

        return request(`${BASE_PATH}?${params.toString()}`, 'get')
    },

    create(data) {
        return request(BASE_PATH, 'post', data)
    },

    update(id, data) {
        return request(`${BASE_PATH}/${id}`, 'put', data)
    },

    delete(id) {
        return request(`${BASE_PATH}/${id}`, 'delete')
    }
}