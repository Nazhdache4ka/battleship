import { axiosConfig, type AiTurnRequest, type AiTurnResponse, type Board } from '@/shared';

export class OpenAiSessionService {
  static async initializeAiGameSession(userId: number, playerBoard: Board, aiBoard: Board): Promise<number> {
    const response = await axiosConfig.post('/ai-game/start', { userId, playerBoard, aiBoard });
    return response.data;
  }

  static async sendUserTurn(sessionId: number, request: AiTurnRequest): Promise<AiTurnResponse> {
    const response = await axiosConfig.post(`/ai-game/turn/${sessionId}`, request);
    return response.data;
  }

  static async deleteAiGameSession(sessionId: number): Promise<void> {
    await axiosConfig.delete(`/ai-game/session/${sessionId}`);
  }
}
