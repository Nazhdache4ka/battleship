export type AiMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export type Coordinates = {
  x: number;
  y: number;
};

export type Board = {
  playerBoardForAi: ('unknown' | 'hit' | 'miss')[][];
  aiShotHistory: { x: number; y: number; result: 'hit' | 'miss' | 'sunk' }[];
};

export type AiTurnRequest = {
  board: Board;
  rules: {
    keepTurnOnHit: true;
    keepTurnOnSunk: true;
  };
};

export type AiTurnResponse = {
  target: Coordinates;
  message: string;
};
