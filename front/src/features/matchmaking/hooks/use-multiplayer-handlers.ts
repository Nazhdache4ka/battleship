import { useCallback, useMemo } from 'react';
import { getMultiplayerSocket } from '../api';
import { MultiplayerPhase, useGameStore } from '@/shared';
import { useMultiplayerStore } from '../store';

export function useMultiplayerHandlers() {
  const { board } = useGameStore();
  const { setMultiplayerPhase } = useMultiplayerStore();

  const socket = useMemo(() => {
    return getMultiplayerSocket();
  }, []);

  const joinQueue = useCallback(() => {
    socket.emit('queue:join', { board });
    setMultiplayerPhase(MultiplayerPhase.SEARCHING);
  }, [socket, board, setMultiplayerPhase]);

  const leaveQueue = useCallback(() => {
    socket.emit('queue:leave');
    setMultiplayerPhase(MultiplayerPhase.IDLE);
  }, [socket, setMultiplayerPhase]);

  return { joinQueue, leaveQueue };
}
