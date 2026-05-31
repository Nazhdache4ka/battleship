import { useCallback } from 'react';
import { CellState, type ICell } from '@/shared';
import { useAiGameStore } from '../store';
import { CurrentTurn, triggerAiTurns, sendUserTurn } from '../lib';

export function useAiGameHandler() {
  const { currentTurn } = useAiGameStore();

  const handleUserClick = useCallback(
    async (cell: ICell) => {
      if (currentTurn !== CurrentTurn.USER) return;

      const { state, x, y } = cell;

      if (state === CellState.HIT || state === CellState.MISS) return;

      if (state === CellState.EMPTY) {
        const result = await sendUserTurn({ x, y });

        if (result !== 'miss') return;

        await triggerAiTurns();
        return;
      }

      if (state === CellState.SHIP) {
        await sendUserTurn({ x, y });
        return;
      }
    },
    [currentTurn]
  );

  return handleUserClick;
}
