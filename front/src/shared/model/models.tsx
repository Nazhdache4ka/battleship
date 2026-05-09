export const ROW_NUMBER = 10;
export const COLUMN_NUMBER = 10;

export const BOARD_MAX_WIDTH_PX = 480;

export const BOARD_CELL_PX = BOARD_MAX_WIDTH_PX / COLUMN_NUMBER;

export const DND_SHIP_TYPE = 'ship' as const;

export const POINTER_DRAG_DISTANCE_PX = 8;

export const DEFAULT_FLEET_SPEC = [
  { id: 'ship-4', size: 4 },
  { id: 'ship-3a', size: 3 },
  { id: 'ship-3b', size: 3 },
  { id: 'ship-2a', size: 2 },
  { id: 'ship-2b', size: 2 },
  { id: 'ship-2c', size: 2 },
  { id: 'ship-1a', size: 1 },
  { id: 'ship-1b', size: 1 },
  { id: 'ship-1c', size: 1 },
  { id: 'ship-1d', size: 1 },
] as const;

export const AI_TURN_RULES = {
  keepTurnOnHit: true,
  keepTurnOnSunk: true,
} as const;
