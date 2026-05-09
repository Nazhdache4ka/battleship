import { createRandomFleetLayout, type Board, type IShip } from '@/shared';

export function generateAiBoardAndFleet(): { board: Board; ships: IShip[] } {
  const { board, ships } = createRandomFleetLayout();

  return { board, ships };
}
