import { Board, CellState, Coordinates } from 'src/types/interfaces';
import { MAX_BOARD_INDEX, MIN_BOARD_INDEX } from 'src/models/basic-constants';

export function validateAiTurn(board: Board, target: Coordinates): boolean {
  if (
    !Number.isInteger(target.x) ||
    !Number.isInteger(target.y) ||
    target.x < MIN_BOARD_INDEX ||
    target.x > MAX_BOARD_INDEX ||
    target.y < MIN_BOARD_INDEX ||
    target.y > MAX_BOARD_INDEX
  ) {
    return false;
  }

  const cell = board.at(target.y)?.at(target.x);

  if (!cell) {
    return false;
  }

  return cell.state !== CellState.HIT && cell.state !== CellState.MISS;
}
