import type { Board } from '../model';
import { axiosConfig } from './axios-config';

export class UserService {
  static async getUserBoardPreset(): Promise<Board> {
    const response = await axiosConfig.get('/users/board-preset');
    return response.data;
  }

  static async saveUserBoardPreset(boardPreset: Board): Promise<boolean> {
    const response = await axiosConfig.post('/users/board-preset', boardPreset);
    return response.data;
  }
}
