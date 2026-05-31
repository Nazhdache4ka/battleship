import { Board, BoardEnemy, CellState } from 'src/types/interfaces';

export function convertAiBoardOnInitialization(aiBoard: Board): BoardEnemy {
  return aiBoard.map(row =>
    row.map(cell => ({
      x: cell.x,
      y: cell.y,
      state: CellState.EMPTY,
    }))
  );
}

export function convertAiBoardOnTurn(aiBoard: Board): BoardEnemy {
  return aiBoard.map(row =>
    row.map(cell => ({
      x: cell.x,
      y: cell.y,
      state: CellState.SHIP === cell.state ? CellState.EMPTY : cell.state,
    }))
  );
}
