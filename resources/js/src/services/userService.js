import { API_CONFIG } from '../constants/api';
import { apiClient } from '../lib/axios'
import {User} from "../models/User";

class UserService {
    async getListUsers({name, username, email, state}) {
        try {
            const { data } = await apiClient.get(API_CONFIG.ENDPOINT.USER.LIST, {
                params: {
                    name,
                    username,
                    email,
                    state
                }
            })
            console.log("Obteniendo lista de usuarios", {data})
            return data.map(User.fromApi)
        } catch (err) {
            console.error("Error UserService.getListUsers:", err);
            throw new Error(
                "No se pudieron obtener los clientes. Por favor intenta más tarde."
            );
        }
    }
}

export const userService = new UserService();
