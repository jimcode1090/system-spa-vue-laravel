import { API_CONFIG } from '../constants/api';
import { apiClient } from '../lib/axios'
import {User} from "../models/User";

class UserService {
    async getListUsers(filters = {}) {
        const params = {}
        if (filters.name) params.name = filters.name
        if (filters.username) params.username = filters.username
        if (filters.email) params.email = filters.email
        if (filters.state) params.state = filters.state

        const { data } = await apiClient.get(API_CONFIG.ENDPOINT.USER.LIST, {
            params
        })

        // Handle standardized API response format
        // Response structure: { success, message, data, meta }
        if (data.success && data.data) {
            return data.data.map(User.fromApi)
        }

        // Return empty array if no data or not successful
        return []
    }

    async createUser(formData) {
        const {data} = await apiClient.post(API_CONFIG.ENDPOINT.USER.CREATE, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })

        // Handle standardized API response format
        // Response structure: { success, message, data }
        if (data.success && data.data) {
            return data.data
        }

        // If not successful, throw error (will be caught by ViewModel)
        throw new Error(data.message || 'Error al crear usuario')
    }

}

export const userService = new UserService();
