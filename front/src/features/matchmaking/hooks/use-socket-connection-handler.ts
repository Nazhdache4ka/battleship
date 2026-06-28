import { useCallback, useEffect, useMemo, useRef } from 'react';
import { getMultiplayerSocket } from '../api';
import { AuthService } from '@/features/auth/api';
import { useAuthStore } from '@/shared';
import { hasRetriedAfterRefreshUtil } from '../lib';

let refreshPromise: Promise<string> | null = null;

async function refreshSocketToken() {
  if (refreshPromise) return refreshPromise;

  refreshPromise = AuthService.refresh()
    .then(({ accessToken }: { accessToken: string }) => {
      localStorage.setItem('accessToken', accessToken);
      return accessToken;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}

export function useSocketConnectionHandler() {
  const hasRetriedAfterRefresh = useRef(false);

  const socket = useMemo(() => {
    return getMultiplayerSocket();
  }, []);

  const connect = useCallback(() => {
    socket.connect();
  }, [socket]);

  const disconnect = useCallback(() => {
    socket.disconnect();
  }, [socket]);

  useEffect(() => {
    const handleConnect = () => {
      hasRetriedAfterRefresh.current = false;
    };

    const handleConnectError = async (error: Error) => {
      if (error.message !== 'Unauthorized') {
        return;
      }

      if (
        hasRetriedAfterRefreshUtil(
          hasRetriedAfterRefresh,
          useAuthStore.getState().setIsAuth,
          useAuthStore.getState().setUser
        )
      ) {
        return;
      }

      hasRetriedAfterRefresh.current = true;

      try {
        await refreshSocketToken();
        socket.connect();
      } catch {
        localStorage.removeItem('accessToken');
        useAuthStore.getState().setIsAuth(false);
        useAuthStore.getState().setUser(null);
        if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
          window.location.href = '/login';
        }
      }
    };

    socket.on('connect', handleConnect);
    socket.on('connect_error', handleConnectError);
    connect();

    return () => {
      socket.off('connect', handleConnect);
      socket.off('connect_error', handleConnectError);
      disconnect();
    };
  }, [socket, connect, disconnect]);
}
