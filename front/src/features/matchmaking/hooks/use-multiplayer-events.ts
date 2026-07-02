import { useEffect, useMemo } from 'react';
import { getMultiplayerSocket } from '../api';
import { useMultiplayerGameStore, useMultiplayerSessionStore } from '../store';
import { GameStatus, MultiplayerPhase } from '@/shared';

export function useMultiplayerEvents() {
  const { setGameId, setMultiplayerPhase, setGameStatus, setErrorMessage, setOpponentName, setWinnerUserId } =
    useMultiplayerSessionStore();
  const { setBoard, setShips, setEnemyBoard, setEnemyShips, setCurrentTurnUserId } = useMultiplayerGameStore();

  const socket = useMemo(() => {
    return getMultiplayerSocket();
  }, []);

  useEffect(() => {
    socket.on('game:move:state', data => {
      setBoard(data.board);
      setShips(data.ships);
      setEnemyBoard(data.enemyBoard);
      setEnemyShips(data.enemyShips);
      setCurrentTurnUserId(data.currentTurnUserId);
      setWinnerUserId(data.winnerUserId);
      if (data.winnerUserId) {
        setMultiplayerPhase(MultiplayerPhase.FINISHED);
        setGameStatus(GameStatus.FINISHED);
      }
    });

    return () => {
      socket.off('game:move:state');
    };
  }, [
    socket,
    setBoard,
    setShips,
    setEnemyBoard,
    setEnemyShips,
    setCurrentTurnUserId,
    setWinnerUserId,
    setMultiplayerPhase,
    setGameStatus,
  ]);

  useEffect(() => {
    socket.on('game:state', data => {
      setBoard(data.board);
      setShips(data.ships);
      setEnemyBoard(data.enemyBoard);
      setEnemyShips(data.enemyShips);
      setGameId(data.gameId);
      setMultiplayerPhase(MultiplayerPhase.STARTED);
      setGameStatus(GameStatus.ACTIVE);
      setOpponentName(data.opponent);
      setCurrentTurnUserId(data.currentTurnUserId);
      setWinnerUserId(data.winnerUserId ?? null);
    });

    socket.on('game:start', data => {
      setBoard(data.board);
      setShips(data.ships);
      setEnemyBoard(data.enemyBoard);
      setEnemyShips(data.enemyShips);
      setGameId(data.gameId);
      setMultiplayerPhase(MultiplayerPhase.STARTED);
      setGameStatus(GameStatus.ACTIVE);
      setOpponentName(data.opponent);
      setCurrentTurnUserId(data.currentTurnUserId);
      setWinnerUserId(null);
    });

    socket.on('game:error', data => {
      setErrorMessage(data.message);
      setMultiplayerPhase(MultiplayerPhase.IDLE);
      setGameStatus(GameStatus.WAITING);
    });

    socket.on('game:resume:not-found', data => {
      setErrorMessage(data.message ?? 'No active game found');
      setMultiplayerPhase(MultiplayerPhase.IDLE);
      setGameStatus(GameStatus.WAITING);
    });

    return () => {
      socket.off('game:state');
      socket.off('game:start');
      socket.off('game:error');
      socket.off('game:resume:not-found');
    };
  }, [
    socket,
    setGameId,
    setMultiplayerPhase,
    setGameStatus,
    setErrorMessage,
    setOpponentName,
    setBoard,
    setShips,
    setEnemyBoard,
    setEnemyShips,
    setCurrentTurnUserId,
    setWinnerUserId,
  ]);
}
