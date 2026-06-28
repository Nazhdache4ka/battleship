import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function getMultiplayerSocket(): Socket {
  if (!socket) {
    socket = io(`${import.meta.env.VITE_API_URL}/multiplayer`, {
      withCredentials: true,
      autoConnect: false,
      auth: callback => {
        callback({ token: localStorage.getItem('accessToken') });
      },
    });
  }

  return socket;
}
