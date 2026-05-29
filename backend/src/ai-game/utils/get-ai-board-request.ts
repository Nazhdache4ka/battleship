import { AI_TURN_RULES } from 'src/models/models';
import { AiTurnRequest, CellState, type Board } from 'src/types/interfaces';
import { getShipsFromBoard } from 'src/utils/game-logic/get-ships-from-board';

function getAiShotHistoryFromBoard(board: Board): AiTurnRequest['board']['aiShotHistory'] {
  const ships = getShipsFromBoard(board);
  const sunkShipIds = new Set(ships.filter(ship => ship.isSunk).map(ship => ship.id));
  const history: AiTurnRequest['board']['aiShotHistory'] = [];

  for (const row of board) {
    for (const cell of row) {
      if (cell.state === CellState.MISS) {
        history.push({ x: cell.x, y: cell.y, result: 'miss' });
        continue;
      }

      if (cell.state === CellState.HIT) {
        const result = cell.shipId && sunkShipIds.has(cell.shipId) ? 'sunk' : 'hit';
        history.push({ x: cell.x, y: cell.y, result });
      }
    }
  }

  return history;
}

export function getBoardForAiRequest(board: Board): AiTurnRequest {
  const request = {
    board: {
      playerBoardForAi: board.map(row =>
        row.map(cell => {
          if (cell.state === CellState.HIT) return 'hit';
          if (cell.state === CellState.MISS) return 'miss';
          return 'unknown';
        })
      ),
      aiShotHistory: getAiShotHistoryFromBoard(board),
    },
    rules: AI_TURN_RULES,
  };

  return request;
}
