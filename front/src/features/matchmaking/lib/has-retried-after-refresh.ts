import type { RefObject } from 'react';
import type { IUser } from '@/shared';

export function hasRetriedAfterRefreshUtil(
  ref: RefObject<boolean>,
  setIsAuth: (isAuth: boolean) => void,
  setUser: (user: IUser | null) => void
) {
  if (ref.current) {
    localStorage.removeItem('accessToken');
    setIsAuth(false);
    setUser(null);
    if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
      window.location.href = '/login';
    }
    return true;
  }

  return false;
}
