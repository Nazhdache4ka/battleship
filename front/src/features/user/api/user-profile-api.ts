import { axiosConfig, type IUser, type UserRatingHistory } from '@/shared';

export class UserProfileApi {
  static async getRatingHistory(userId: number) {
    const response = await axiosConfig.get<UserRatingHistory[]>(`/users/${userId}/rating-history`);
    return response.data;
  }

  static async getUserInfo(userId: number) {
    const response = await axiosConfig.get<Pick<IUser, 'rating' | 'name' | 'createdAt'>>(`/users/${userId}`);
    return response.data;
  }

  static async patchUserName(name: string) {
    const response = await axiosConfig.patch<Pick<IUser, 'name'>>(`/users/me/name`, { name });
    return response.data;
  }

  static async patchUserEmail(email: string) {
    const response = await axiosConfig.patch<Pick<IUser, 'email'>>(`/users/me/email`, { email });
    return response.data;
  }

  static async patchUserPassword(password: string) {
    const response = await axiosConfig.patch<void>(`/users/me/password`, { password });
    return response.data;
  }
}
