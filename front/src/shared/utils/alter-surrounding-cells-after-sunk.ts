import { CellState, COLUMN_NUMBER, ROW_NUMBER, type Board, type Coordinates, type IShip } from '../model';
import { getShallowBoard } from './get-shallow-board';

function isPartOfShip(occupied: Coordinates[], x: number, y: number): boolean {
  return occupied.some(c => c.x === x && c.y === y);
}

export function alterSurroundingCellsAfterSunk(board: Board, ships: IShip[], shipId: string): Board {
  const ship = ships.find(s => s.id === shipId);

  if (!ship) {
    return getShallowBoard(board);
  }

  const newBoard = getShallowBoard(board);

  const { occupiedCells } = ship;

  for (const { x, y } of occupiedCells) {
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;

        const nx = x + dx;
        const ny = y + dy;

        if (nx < 0 || ny < 0 || nx >= COLUMN_NUMBER || ny >= ROW_NUMBER) continue;
        if (isPartOfShip(occupiedCells, nx, ny)) continue;

        const cell = newBoard[ny][nx];
        if (cell.state === CellState.EMPTY) {
          newBoard[ny][nx] = { ...cell, state: CellState.MISS };
        }
      }
    }
  }

  return newBoard;
}
