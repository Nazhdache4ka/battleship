import { Board } from 'src/types/interfaces';
import { getShipsFromBoard } from './get-ships-from-board';

export function getWinner(board: Board, aiBoard: Board): 'user' | 'ai' | null {
  const userShips = getShipsFromBoard(board);
  const aiShips = getShipsFromBoard(aiBoard);

  if (userShips.every(ship => ship.isSunk)) {
    return 'ai';
  }

  if (aiShips.every(ship => ship.isSunk)) {
    return 'user';
  }

  return null;
}
