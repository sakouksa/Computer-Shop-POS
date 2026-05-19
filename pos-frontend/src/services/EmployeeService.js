import {
    request
} from '../utils/request';

export const EmployeeService = {
    getList: async (filters) => {
        let queryParam = '?';
        if (filters.txt_search) queryParam += `txt_search=${filters.txt_search}&`;
        if (filters.status) queryParam += `status=${filters.status}&`;

        // API returns { list: [], total: 0, positions: [], payment_methods: [] }
        return await request(`employees${queryParam}`, 'get', {});
    },

    save: async (id, data) => {
        let url = 'employees';
        let method = 'post';

        if (id) {
            url += `/${id}`;
            // Laravel requires _method: PUT for multipart/form-data updates
            data.append('_method', 'PUT');
        }

        return await request(url, method, data);
    },

    delete: async (id) => {
        return await request(`employees/${id}`, 'delete', {});
    },

    export: async () => {
        return await request('employees-export', 'get', {}, {
            responseType: 'blob'
        });
    }
};