import { AI_TURN_RULES } from 'src/models/models';
import { AiShotHistory, AiTurnRequest, CellState, type Board } from 'src/types/interfaces';

export function createAiRequest(board: Board, aiShotsHistory: AiShotHistory[]): AiTurnRequest {
  const request = {
    board: {
      playerBoardForAi: board.map(row =>
        row.map(cell => {
          if (cell.state === CellState.HIT) return 'hit';
          if (cell.state === CellState.MISS) return 'miss';
          return 'unknown';
        })
      ),
    },
    aiShotHistory: aiShotsHistory,
    rules: AI_TURN_RULES,
  };

  return request;
}
