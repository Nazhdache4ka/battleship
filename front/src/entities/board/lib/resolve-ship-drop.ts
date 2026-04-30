import type { Board, CellDropData, ICell, IShip, Coordinates } from '@/shared';
import { buildShipCells, inferHorizontalFromOccupiedCells, parseCellDroppableId } from './place-ship';
import { canPlaceShipWithSeparation } from './validate-ship-placement';

type DroppableTargetLike = {
  id?: string | number;
  data?: unknown;
} | null;

export function getCellFromDropTarget(board: Board, target: DroppableTargetLike): ICell | null {
  if (!target) return null;

  const payload = target.data as CellDropData | undefined;
  if (payload?.type === 'cell' && 'shipId' in payload.cell) {
    const { x, y } = payload.cell;
    return board[y]?.[x] ?? null;
  }

  const coords = parseCellDroppableId(target.id ?? '');
  if (!coords) return null;
  return board[coords.y]?.[coords.x] ?? null;
}

export function isDropAnchorAllowed(targetCell: ICell, draggedShipId: string): boolean {
  return targetCell.shipId === null || targetCell.shipId === draggedShipId;
}

export function resolveShipCellsAfterDrop(board: Board, targetCell: ICell, ship: IShip): Coordinates[] | null {
  if (!isDropAnchorAllowed(targetCell, ship.id)) return null;

  const anchor = { x: targetCell.x, y: targetCell.y };
  const preferredHorizontal = inferHorizontalFromOccupiedCells(ship.occupiedCells) ?? true;

  const primary = buildShipCells(anchor, ship.size, preferredHorizontal);
  if (canPlaceShipWithSeparation(board, ship.id, primary)) return primary;

  if (ship.size <= 1) return null;

  const flipped = buildShipCells(anchor, ship.size, !preferredHorizontal);
  if (canPlaceShipWithSeparation(board, ship.id, flipped)) return flipped;

  return null;
}

export function updateShipsOccupiedCells(ships: IShip[], shipId: string, cells: Coordinates[]): IShip[] {
  return ships.map(s => (s.id === shipId ? { ...s, occupiedCells: cells } : s));
}
