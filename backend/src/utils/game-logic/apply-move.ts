import { Board, CellState, Coordinates, IShip } from 'src/types/interfaces';
import { getShallowBoard } from './get-shallow-board';
import { getShallowShips } from './get-shallow-ships';
import { isShipSunkAfterTurn } from './is-ship-sunk-after-turn';
import { alterSurroundingCellsAfterSunk } from './alter-surrounding-cells-after-sunk';

export function applyMove(board: Board, ships: IShip[], shot: Coordinates) {
  const newBoard = getShallowBoard(board);
  let newShips = getShallowShips(ships);

  const targetCell = newBoard[shot.y][shot.x];

  if (targetCell.state === CellState.EMPTY) {
    newBoard[shot.y][shot.x] = { ...targetCell, state: CellState.MISS };
    return { newBoard, newShips, result: 'miss' as const };
  }

  if (targetCell.state === CellState.SHIP) {
    newBoard[shot.y][shot.x] = { ...targetCell, state: CellState.HIT };

    const shipId = targetCell.shipId;
    if (shipId && isShipSunkAfterTurn(newShips, newBoard, shipId)) {
      newShips = newShips.map(ship => (ship.id === shipId ? { ...ship, isSunk: true } : ship));
      const newBoardAfterSunk = alterSurroundingCellsAfterSunk(newBoard, newShips, shipId);
      return { newBoard: newBoardAfterSunk, newShips, result: 'sunk' as const };
    }

    return { newBoard, newShips, result: 'hit' as const };
  }

  return { newBoard, newShips, result: 'miss' as const };
}
