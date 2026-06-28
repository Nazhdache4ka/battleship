import { IdleScreen } from './idle-screen';
import { MultiplayerBoard } from './multiplayer-board';
import { useMultiplayerHandlers, useSocketConnectionHandler } from '../hooks';
import { useMultiplayerStore } from '../store';
import { MultiplayerPhase } from '@/shared';
import { useMultiplayerEvents } from '../hooks/use-multiplayer-events';

export function MatchmakingOrchestrator() {
  const multiplayerPhase = useMultiplayerStore(state => state.multiplayerPhase);

  useSocketConnectionHandler();
  useMultiplayerEvents();
  const { joinQueue, leaveQueue } = useMultiplayerHandlers();

  switch (multiplayerPhase) {
    case MultiplayerPhase.IDLE:
    case MultiplayerPhase.SEARCHING:
      return (
        <IdleScreen
          onJoinQueue={joinQueue}
          onLeaveQueue={leaveQueue}
        />
      );
    case MultiplayerPhase.STARTED:
      return <MultiplayerBoard />;
    case MultiplayerPhase.FINISHED:
      return <MultiplayerBoard />;
    default:
      return null;
  }
}
