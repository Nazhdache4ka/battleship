import type { Board } from '../model';

export function getShallowBoard(board: Board): Board {
  return board.map(row => row.map(cell => ({ ...cell })));
}
