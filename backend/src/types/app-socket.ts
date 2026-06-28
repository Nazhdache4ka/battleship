import type { DefaultEventsMap, Socket } from 'socket.io';

export type AppSocketData = {
  user?: {
    id: number;
    email: string;
  };
};

export type AppSocket = Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, AppSocketData>;
