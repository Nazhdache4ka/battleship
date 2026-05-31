import { Board, IShip } from 'src/types/interfaces';
import { isShipSunkAfterTurn } from './is-ship-sunk-after-turn';

export function getSunkShips(ships: IShip[], board: Board): IShip[] {
  return ships
    .filter(ship => isShipSunkAfterTurn(ships, board, ship.id))
    .map(ship => ({ ...ship, isSunk: true }));
}
