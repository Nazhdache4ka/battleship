import { IdleScreen } from './idle-screen';
import { MultiplayerBoard } from './multiplayer-board';
import { useMultiplayerHandlers, useSocketConnectionHandler } from '../hooks';
import { useMultiplayerSessionStore } from '../store';
import { MultiplayerPhase } from '@/shared';
import { useMultiplayerEvents } from '../hooks';

export function MatchmakingOrchestrator() {
  const multiplayerPhase = useMultiplayerSessionStore(state => state.multiplayerPhase);

  useSocketConnectionHandler();
  useMultiplayerEvents();
  const { joinQueue, leaveQueue, reconnect, resign, resetStates } = useMultiplayerHandlers();

  switch (multiplayerPhase) {
    case MultiplayerPhase.IDLE:
    case MultiplayerPhase.SEARCHING:
      return (
        <IdleScreen
          onJoinQueue={joinQueue}
          onLeaveQueue={leaveQueue}
          onReconnect={reconnect}
        />
      );
    case MultiplayerPhase.STARTED:
      return (
        <MultiplayerBoard
          onResign={resign}
          onBackToLobby={resetStates}
        />
      );
    case MultiplayerPhase.FINISHED:
      return (
        <MultiplayerBoard
          onResign={resign}
          onBackToLobby={resetStates}
        />
      );
    default:
      return null;
  }
}
