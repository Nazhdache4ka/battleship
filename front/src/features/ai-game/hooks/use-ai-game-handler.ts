import { useCallback } from 'react';
import { alterSurroundingCellsAfterSunk, isShipSunkAfterTurn, CellState, getShallowBoard, type ICell } from '@/shared';
import { useAiGameStore } from '../store';
import { CurrentTurn } from '../lib';
import { sendUsersTurns } from '../lib/send-users-turns';

export function useAiGameHandler() {
  const { aiBoard, aiShips, currentTurn, setCurrentTurn, setAiBoard, setAiShips } = useAiGameStore();

  const handleUserClick = useCallback(
    (cell: ICell) => {
      if (currentTurn !== CurrentTurn.USER) return;

      const { state, x, y, shipId } = cell;

      if (state === CellState.HIT || state === CellState.MISS) return;

      const newBoard = getShallowBoard(aiBoard);

      if (state === CellState.EMPTY) {
        newBoard[y][x] = { ...newBoard[y][x], state: CellState.MISS };

        setAiBoard(newBoard);
        setCurrentTurn(CurrentTurn.AI);

        sendUsersTurns();
        return;
      }

      if (state === CellState.SHIP) {
        newBoard[y][x] = { ...newBoard[y][x], state: CellState.HIT };

        if (isShipSunkAfterTurn(aiShips, newBoard, shipId!)) {
          const newShips = aiShips.map(ship => (ship.id === shipId ? { ...ship, isSunk: true } : ship));
          const newBoardAfterSunk = alterSurroundingCellsAfterSunk(newBoard, newShips, shipId!);

          setAiShips(newShips);
          setAiBoard(newBoardAfterSunk);
        } else {
          setAiBoard(newBoard);
        }
      }
    },
    [currentTurn, aiBoard, aiShips, setAiBoard, setCurrentTurn, setAiShips]
  );

  return handleUserClick;
}
