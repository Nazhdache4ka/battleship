import { CellState, COLUMN_NUMBER, ROW_NUMBER, type Board, type ICell } from '@/shared';

export function createEmptyBoard(): Board {
  return Array.from({ length: ROW_NUMBER }, (_, y) =>
    Array.from(
      { length: COLUMN_NUMBER },
      (_, x) =>
        ({
          x,
          y,
          shipId: null,
          state: CellState.EMPTY,
        }) satisfies ICell
    )
  );
}
