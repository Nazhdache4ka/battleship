import { axiosConfig, type AiTurnResponse, type Board, type Coordinates, type IShip } from '@/shared';

export class OpenAiSessionService {
  static async initializeAiGameSession(userId: number, playerBoard: Board, aiBoard: Board): Promise<number> {
    const response = await axiosConfig.post('/ai-game/start', { userId, playerBoard, aiBoard });
    return response.data;
  }

  static async triggerAiTurns(
    sessionId: number
  ): Promise<{ aiTurnResponse: AiTurnResponse[]; winner: 'user' | 'ai' | null }> {
    const response = await axiosConfig.post(`/ai-game/turn/${sessionId}`);
    return response.data;
  }

  static async applyUserTurn(
    sessionId: number,
    target: Coordinates
  ): Promise<{ newBoard: Board; newShips: IShip[]; result: 'hit' | 'miss' | 'sunk'; winner: 'user' | 'ai' | null }> {
    const response = await axiosConfig.post(`/ai-game/apply-turn/${sessionId}`, { target });
    return response.data;
  }

  static async deleteAiGameSession(sessionId: number): Promise<void> {
    await axiosConfig.delete(`/ai-game/session/${sessionId}`);
  }
}
