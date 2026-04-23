import { CellState, COLUMN_NUMBER, ROW_NUMBER, type Board, type Coordinates, type IShip } from '../model';
import { createEmptyBoard } from './create-empty-board';

export const DEFAULT_FLEET_SPEC = [
  { id: 'ship-4', size: 4 },
  { id: 'ship-3a', size: 3 },
  { id: 'ship-3b', size: 3 },
  { id: 'ship-2a', size: 2 },
  { id: 'ship-2b', size: 2 },
  { id: 'ship-2c', size: 2 },
  { id: 'ship-1a', size: 1 },
  { id: 'ship-1b', size: 1 },
  { id: 'ship-1c', size: 1 },
  { id: 'ship-1d', size: 1 },
] as const;

function cellKey(x: number, y: number): string {
  return `${x},${y}`;
}

function buildShipCells(origin: Coordinates, size: number, horizontal: boolean): Coordinates[] {
  if (horizontal) {
    return Array.from({ length: size }, (_, i) => ({ x: origin.x + i, y: origin.y }));
  }
  return Array.from({ length: size }, (_, i) => ({ x: origin.x, y: origin.y + i }));
}

function cellsInBounds(cells: Coordinates[]): boolean {
  return cells.every(({ x, y }) => x >= 0 && y >= 0 && x < COLUMN_NUMBER && y < ROW_NUMBER);
}

function canPlaceShip(board: Board, cells: Coordinates[]): boolean {
  const pending = new Set(cells.map(({ x, y }) => cellKey(x, y)));
  if (pending.size !== cells.length) return false;

  for (const { x, y } of cells) {
    const cell = board[y][x];
    if (cell.shipId !== null) return false;

    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= COLUMN_NUMBER || ny >= ROW_NUMBER) continue;
        if (pending.has(cellKey(nx, ny))) continue;
        if (board[ny][nx].shipId !== null) return false;
      }
    }
  }
  return true;
}

function applyShip(board: Board, shipId: string, cells: Coordinates[]): Board {
  const next = board.map(row => row.map(c => ({ ...c })));
  for (const { x, y } of cells) {
    next[y][x] = { ...next[y][x], shipId, state: CellState.SHIP };
  }
  return next;
}

function randomInt(maxExclusive: number): number {
  return Math.floor(Math.random() * maxExclusive);
}

export function createRandomFleetLayout(maxFullRestarts = 200): { board: Board; ships: IShip[] } {
  for (let restart = 0; restart < maxFullRestarts; restart++) {
    let board = createEmptyBoard();
    const ships: IShip[] = [];
    let failed = false;

    for (const spec of DEFAULT_FLEET_SPEC) {
      let placed = false;
      for (let attempt = 0; attempt < 600; attempt++) {
        const horizontal = Math.random() < 0.5;
        const maxOx = horizontal ? COLUMN_NUMBER - spec.size : COLUMN_NUMBER - 1;
        const maxOy = horizontal ? ROW_NUMBER - 1 : ROW_NUMBER - spec.size;
        if (maxOx < 0 || maxOy < 0) break;

        const origin: Coordinates = { x: randomInt(maxOx + 1), y: randomInt(maxOy + 1) };
        const cells = buildShipCells(origin, spec.size, horizontal);
        if (!cellsInBounds(cells) || !canPlaceShip(board, cells)) continue;

        board = applyShip(board, spec.id, cells);
        ships.push({
          id: spec.id,
          size: spec.size,
          occupiedCells: cells,
          isSunk: false,
        });
        placed = true;
        break;
      }

      if (!placed) {
        failed = true;
        break;
      }
    }

    if (!failed) {
      return { board, ships };
    }
  }

  throw new Error('createRandomFleetLayout: не удалось расставить флот, увеличь maxFullRestarts');
}
