import { useEffect } from 'react';
import { useAiGameStore } from '../store';
import { OpenAiSessionService } from '../api';

export function useAiGameEffects() {
  const { sessionId, setSessionId } = useAiGameStore();

  useEffect(() => {
    if (!sessionId) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
      return '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      OpenAiSessionService.deleteAiGameSession(sessionId);
      setSessionId(null);
    };
  }, [sessionId, setSessionId]);
}
