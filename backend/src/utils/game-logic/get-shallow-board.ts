import { Board } from 'src/types/interfaces';

export function getShallowBoard(board: Board): Board {
  return board.map(row => row.map(cell => ({ ...cell })));
}
