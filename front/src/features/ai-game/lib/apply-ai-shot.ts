import {
  alterSurroundingCellsAfterSunk,
  CellState,
  getShallowBoard,
  isShipSunkAfterTurn,
  type Board,
  type Coordinates,
  type IShip,
} from '@/shared';

export function applyAiShot(board: Board, ships: IShip[], shot: Coordinates) {
  const newBoard = getShallowBoard(board);
  let newShips = ships.map(ship => ({ ...ship }));
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
