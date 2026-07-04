import { Board, IQueuePlayer } from 'src/types/interfaces';
import { getEnemyBoard } from 'src/utils/game-logic/get-enemy-board';
import { getShallowBoard } from 'src/utils/game-logic/get-shallow-board';
import { getShipsFromBoard } from 'src/utils/game-logic/get-ships-from-board';
import { OnlineGameSession, User } from 'src/generated/prisma/client';

export function getInitialPayloadForPlayer(
  player: IQueuePlayer,
  enemy: IQueuePlayer,
  session: OnlineGameSession,
  opponent: Pick<User, 'name'>
) {
  const board = getShallowBoard(player.board);
  const ships = getShipsFromBoard(player.board);

  const enemyBoard = getEnemyBoard(enemy.board);
  const enemyShips = getShipsFromBoard(enemyBoard as Board);

  return {
    gameId: session.id,
    status: session.status,
    currentTurnUserId: session.currentTurnUserId,
    board,
    ships,
    enemyBoard,
    enemyShips,
    opponent: opponent.name,
  };
}
