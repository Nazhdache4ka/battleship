import { CellState, type Board, type IShip } from '@/shared';

export function resetBoardAndShips(board: Board, ships: IShip[]) {
  const newBoard = board.map(row =>
    row.map(cell => ({
      ...cell,
      state: cell.shipId !== null ? CellState.SHIP : CellState.EMPTY,
    }))
  );

  const newShips = ships.map(ship => ({
    ...ship,
    isSunk: false,
  }));

  return { newBoard, newShips };
}
