import { IShip } from 'src/types/interfaces';

export function getShallowShips(ships: IShip[]): IShip[] {
  return ships.map(ship => ({ ...ship }));
}
