import {
    request
} from '../utils/request'

export const profileService = {
    getProfile() {
        return request('user', 'get');
    },
    updateProfile(formData) {
        return request('profile/update', 'post', formData);
    },
    changePassword(data) {
        return request('profile/change-password', 'post', data);
    }
}