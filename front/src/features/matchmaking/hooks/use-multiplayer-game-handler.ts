import { CellState, useAuthStore, type ICell } from '@/shared';
import { useCallback } from 'react';
import { useMultiplayerGameStore } from '../store';
import { sendUserTurn } from '../lib';

export function useMultiplayerGameHandler() {
  const currentTurnUserId = useMultiplayerGameStore(s => s.currentTurnUserId);
  const user = useAuthStore(s => s.user);

  const handleUserClick = useCallback(
    (cell: ICell) => {
      if (currentTurnUserId !== user?.id) return;

      const { state, x, y } = cell;

      if (state === CellState.HIT || state === CellState.MISS) return;

      if (state !== CellState.EMPTY && state !== CellState.SHIP) return;

      sendUserTurn(x, y);
    },
    [currentTurnUserId, user]
  );

  return handleUserClick;
}
