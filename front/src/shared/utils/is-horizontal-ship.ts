import type { IShip } from '@/shared';

export function isHorizontalShip(ship: IShip): boolean {
  const occupiedCells = ship.occupiedCells;

  if (occupiedCells.length === 1) return true;

  const a = occupiedCells[0];
  const b = occupiedCells[1];
  if (a.y === b.y) return true;
  if (a.x === b.x) return false;

  return true;
}
