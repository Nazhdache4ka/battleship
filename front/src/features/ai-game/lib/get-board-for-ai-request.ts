import { CellState, type Board } from '@/shared';

export function getBoardForAiRequest(board: Board): ('unknown' | 'hit' | 'miss')[][] {
  return board.map(row =>
    row.map(cell => {
      if (cell.state === CellState.HIT) return 'hit';
      if (cell.state === CellState.MISS) return 'miss';
      return 'unknown';
    })
  );
}
