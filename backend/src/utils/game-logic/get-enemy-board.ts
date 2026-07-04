import { Board, CellState } from 'src/types/interfaces';

export function getEnemyBoard(board: Board) {
  return board.map(row =>
    row.map(cell => ({
      x: cell.x,
      y: cell.y,
      state: CellState.SHIP === cell.state ? CellState.EMPTY : cell.state,
    }))
  );
}
