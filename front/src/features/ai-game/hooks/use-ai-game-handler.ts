import { useCallback, useRef } from 'react';
import { CellState, type ICell } from '@/shared';
import { useAiGameStore } from '../store';
import { CurrentTurn, triggerAiTurns, sendUserTurn } from '../lib';

export function useAiGameHandler() {
  const { currentTurn } = useAiGameStore();

  const isProcessing = useRef(false);

  const handleUserClick = useCallback(
    async (cell: ICell) => {
      if (currentTurn !== CurrentTurn.USER || isProcessing.current) return;

      const { state, x, y } = cell;

      if (state === CellState.HIT || state === CellState.MISS) return;
      if (state !== CellState.EMPTY && state !== CellState.SHIP) return;

      isProcessing.current = true;
      try {
        const result = await sendUserTurn({ x, y });

        if (result === 'miss') {
          await triggerAiTurns();
        }
      } finally {
        isProcessing.current = false;
      }
    },
    [currentTurn]
  );

  return handleUserClick;
}
