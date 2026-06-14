import { BOARD_CELL_PX, COLUMN_NUMBER, ROW_NUMBER, type IShip } from '@/shared';
import { inferHorizontalFromOccupiedCells } from './place-ship';

export function getShipWrapperStyle(ship: IShip) {
  const origin = ship.occupiedCells[0];
  const horizontal = inferHorizontalFromOccupiedCells(ship.occupiedCells) ?? true;
  return {
    position: 'absolute',
    left: `${(origin.x / COLUMN_NUMBER) * 100}%`,
    top: `${(origin.y / ROW_NUMBER) * 100}%`,
    width: `${((horizontal ? ship.size : 1) / COLUMN_NUMBER) * 100}%`,
    height: `${((horizontal ? 1 : ship.size) / ROW_NUMBER) * 100}%`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
    boxSizing: 'border-box',
    minHeight: BOARD_CELL_PX,
    minWidth: BOARD_CELL_PX,
  };
}
