import { Board, CellState, IShip } from 'src/types/interfaces';

export function isShipSunkAfterTurn(ships: IShip[], board: Board, shipId: string): boolean {
  const ship = ships.find(ship => ship.id === shipId);

  if (!ship) return false;

  for (const cell of ship.occupiedCells) {
    if (board[cell.y][cell.x].state !== CellState.HIT) return false;
  }

  return true;
}
