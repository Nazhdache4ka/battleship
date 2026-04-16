import { axiosConfig } from '../../../shared';

export class AuthService {
  static async login(name: string, email: string, password: string) {
    const response = await axiosConfig.post('/auth/login', { name, email, password });
    return response.data;
  }

  static async register(name: string, email: string, password: string) {
    const response = await axiosConfig.post('/auth/register', { name, email, password });
    return response.data;
  }

  static async logout() {
    const response = await axiosConfig.post('/auth/logout');
    return response.data;
  }
}
