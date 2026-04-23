import { CellState, COLUMN_NUMBER, ROW_NUMBER, type Board, type Coordinates } from '@/shared';

export function parseCellDroppableId(id: string | number): Coordinates | null {
  const match = /^(\d+)-(\d+)$/.exec(String(id));
  if (!match) return null;
  const x = Number(match[1]);
  const y = Number(match[2]);
  if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
  return { x, y };
}

export function buildShipCells(origin: Coordinates, size: number, horizontal: boolean): Coordinates[] {
  if (horizontal) {
    return Array.from({ length: size }, (_, i) => ({ x: origin.x + i, y: origin.y }));
  }
  return Array.from({ length: size }, (_, i) => ({ x: origin.x, y: origin.y + i }));
}

export function buildHorizontalShipCells(origin: Coordinates, size: number): Coordinates[] {
  return buildShipCells(origin, size, true);
}

export function buildVerticalShipCells(origin: Coordinates, size: number): Coordinates[] {
  return buildShipCells(origin, size, false);
}

export function inferHorizontalFromOccupiedCells(occupied: Coordinates[]): boolean | null {
  if (occupied.length < 2) return null;
  const a = occupied[0]!;
  const b = occupied[1]!;
  if (a.y === b.y) return true;
  if (a.x === b.x) return false;
  return null;
}

export function canPlaceShipHorizontally(origin: Coordinates, size: number): boolean {
  if (origin.x < 0 || origin.y < 0) return false;
  if (origin.y >= ROW_NUMBER) return false;
  return origin.x + size <= COLUMN_NUMBER;
}

export function canPlaceShipVertically(origin: Coordinates, size: number): boolean {
  if (origin.x < 0 || origin.y < 0) return false;
  if (origin.x >= COLUMN_NUMBER) return false;
  return origin.y + size <= ROW_NUMBER;
}

export function placeShipOnBoard(board: Board, shipId: string, cells: Coordinates[]): Board {
  const cleared = board.map(row =>
    row.map(cell => (cell.shipId === shipId ? { ...cell, shipId: null, state: CellState.EMPTY } : { ...cell }))
  );

  const next = cleared.map(row => row.map(cell => ({ ...cell })));
  for (const { x, y } of cells) {
    const row = next[y];
    if (!row || x < 0 || x >= COLUMN_NUMBER) continue;
    row[x] = { ...row[x], shipId, state: CellState.SHIP };
  }
  return next;
}
