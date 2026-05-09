import { CellState, DEFAULT_FLEET_SPEC, type Board, type Coordinates, type IShip } from '../model';

const fleetOrder = new Map<string, number>(DEFAULT_FLEET_SPEC.map((spec, index) => [spec.id, index]));

function sortOccupiedCellsForShip(cells: Coordinates[]): Coordinates[] {
  if (cells.length <= 1) return [...cells];

  const uniqueY = new Set(cells.map(c => c.y));
  const uniqueX = new Set(cells.map(c => c.x));

  if (uniqueY.size === 1) {
    return [...cells].sort((a, b) => a.x - b.x);
  }
  if (uniqueX.size === 1) {
    return [...cells].sort((a, b) => a.y - b.y);
  }

  return [...cells].sort((a, b) => a.y - b.y || a.x - b.x);
}

export function getShipsFromBoardPreset(board: Board): IShip[] {
  const byShipId = new Map<string, Coordinates[]>();

  for (const row of board) {
    for (const cell of row) {
      if (cell.shipId === null || cell.state !== CellState.SHIP) continue;
      const list = byShipId.get(cell.shipId) ?? [];
      list.push({ x: cell.x, y: cell.y });
      byShipId.set(cell.shipId, list);
    }
  }

  const ships: IShip[] = [];

  for (const [id, coords] of byShipId) {
    const occupiedCells = sortOccupiedCellsForShip(coords);
    ships.push({
      id,
      size: occupiedCells.length,
      occupiedCells,
      isSunk: false,
    });
  }

  ships.sort((a, b) => {
    const ia = fleetOrder.get(a.id);
    const ib = fleetOrder.get(b.id);
    if (ia !== undefined && ib !== undefined) return ia - ib;
    if (ia !== undefined) return -1;
    if (ib !== undefined) return 1;
    return a.id.localeCompare(b.id);
  });

  return ships;
}
