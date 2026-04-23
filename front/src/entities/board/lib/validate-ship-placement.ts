import { COLUMN_NUMBER, ROW_NUMBER, type Board, type Coordinates } from '@/shared';

function cellKey(x: number, y: number): string {
  return `${x},${y}`;
}

export function canPlaceShipWithSeparation(board: Board, movingShipId: string, cells: Coordinates[]): boolean {
  const pending = new Set(cells.map(({ x, y }) => cellKey(x, y)));
  if (pending.size !== cells.length) return false;

  for (const { x, y } of cells) {
    if (x < 0 || y < 0 || x >= COLUMN_NUMBER || y >= ROW_NUMBER) return false;

    const here = board[y][x].shipId;
    if (here !== null && here !== movingShipId) return false;

    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= COLUMN_NUMBER || ny >= ROW_NUMBER) continue;
        if (pending.has(cellKey(nx, ny))) continue;

        const nid = board[ny][nx].shipId;
        if (nid !== null && nid !== movingShipId) return false;
      }
    }
  }
  return true;
}
