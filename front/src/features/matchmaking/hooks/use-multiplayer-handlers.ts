import { useCallback, useMemo } from 'react';
import { getMultiplayerSocket } from '../api';
import { MultiplayerPhase, useGameStore } from '@/shared';
import { useMultiplayerGameStore, useMultiplayerSessionStore } from '../store';

export function useMultiplayerHandlers() {
  const { board } = useGameStore();
  const { setMultiplayerPhase, setGameId, setWinnerUserId } = useMultiplayerSessionStore();
  const { setBoard, setShips, setEnemyBoard, setEnemyShips } = useMultiplayerGameStore();

  const socket = useMemo(() => {
    return getMultiplayerSocket();
  }, []);

  const resetStates = useCallback(() => {
    setMultiplayerPhase(MultiplayerPhase.IDLE);
    setGameId(null);
    setWinnerUserId(null);
    setBoard([]);
    setShips([]);
    setEnemyBoard([]);
    setEnemyShips([]);
  }, [setMultiplayerPhase, setGameId, setWinnerUserId, setBoard, setShips, setEnemyBoard, setEnemyShips]);

  const joinQueue = useCallback(() => {
    socket.emit('queue:join', { board });
    setMultiplayerPhase(MultiplayerPhase.SEARCHING);
  }, [socket, board, setMultiplayerPhase]);

  const leaveQueue = useCallback(() => {
    socket.emit('queue:leave');
    setMultiplayerPhase(MultiplayerPhase.IDLE);
  }, [socket, setMultiplayerPhase]);

  const reconnect = useCallback(() => {
    socket.emit('game:resume');
  }, [socket]);

  const resign = useCallback(() => {
    socket.emit('game:resign');
  }, [socket]);

  return { joinQueue, leaveQueue, reconnect, resign, resetStates };
}
