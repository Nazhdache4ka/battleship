import { Board } from 'src/types/interfaces';
import { getShipsFromBoard } from 'src/utils/game-logic/get-ships-from-board';

export function getMatchmakingWinner(board: Board, userId: number): number | null {
  const userShips = getShipsFromBoard(board);

  if (userShips.every(ship => ship.isSunk)) {
    return userId;
  }

  return null;
}
