export const CurrentTurn = {
  USER: 'user',
  AI: 'ai',
} as const;

export type CurrentTurn = (typeof CurrentTurn)[keyof typeof CurrentTurn];
