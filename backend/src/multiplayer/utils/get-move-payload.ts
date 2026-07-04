import { Board } from 'src/types/interfaces';
import { getEnemyBoard } from 'src/utils/game-logic/get-enemy-board';
import { getShipsFromBoard } from 'src/utils/game-logic/get-ships-from-board';
import { getSunkShips } from 'src/utils/game-logic/get-sunk-ships';

export function getMovePayload(board: Board, opponentBoard: Board, winnerUserId: number | null) {
  const ships = getShipsFromBoard(board);

  const enemyBoard = getEnemyBoard(opponentBoard);
  const enemyShips = getSunkShips(getShipsFromBoard(opponentBoard), opponentBoard);

  return {
    board,
    ships,
    enemyBoard,
    enemyShips,
    winnerUserId,
  };
}
