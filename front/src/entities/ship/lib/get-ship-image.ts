import type { IShip } from '@/shared';
import shipUrlVertical from '../../../../assets/kenney_pirate-pack/PNG/Default size/Ships/ship4.png';
import shipUrlHorizontal from '../../../../assets/kenney_pirate-pack/PNG/Default size/Ships/ship4-h.png';
import shipUrlVerticalSunk from './../../../../assets/kenney_pirate-pack/PNG/Default size/Ships/ship4-sunk.png';
import shipUrlHorizontalSunk from './../../../../assets/kenney_pirate-pack/PNG/Default size/Ships/ship4-sunk-h.png';

export function getShipImage(ship: IShip, isHorizontal: boolean): string {
  if (ship.isSunk) {
    return isHorizontal ? shipUrlHorizontalSunk : shipUrlVerticalSunk;
  }
  return isHorizontal ? shipUrlHorizontal : shipUrlVertical;
}
