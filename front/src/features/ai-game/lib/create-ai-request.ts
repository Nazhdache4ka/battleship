import { AI_TURN_RULES, type AiShotHistory, type AiTurnRequest, type Board } from '@/shared';
import { getBoardForAiRequest } from './get-board-for-ai-request';

export function createAiRequest(board: Board, aiShotHistory: AiShotHistory[]): AiTurnRequest {
  return {
    board: {
      playerBoardForAi: getBoardForAiRequest(board),
      aiShotHistory,
    },
    rules: AI_TURN_RULES,
  };
}
