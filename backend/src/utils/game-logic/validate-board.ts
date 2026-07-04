import { COLUMN_NUMBER, DEFAULT_FLEET_SPEC, ROW_NUMBER } from 'src/models/basic-constants';
import { Board, CellState, Coordinates } from 'src/types/interfaces';
import { getShallowBoard } from './get-shallow-board';
import { getShipsFromBoard } from './get-ships-from-board';

const fleetSpecById: Map<string, number> = new Map(DEFAULT_FLEET_SPEC.map(spec => [spec.id, spec.size]));
const placementStates = new Set<CellState>([CellState.EMPTY, CellState.SHIP]);

function isValidPlacementCell(cell: Board[number][number], x: number, y: number): boolean {
  if (cell.x !== x || cell.y !== y) return false;
  if (!placementStates.has(cell.state)) return false;
  if (cell.state === CellState.EMPTY) return cell.shipId === null;
  return true;
}

function isStraightConsecutiveLine(cells: Coordinates[]): boolean {
  if (cells.length === 0) return false;

  const xs = cells.map(cell => cell.x);
  const ys = cells.map(cell => cell.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  const horizontal = minY === maxY;
  const vertical = minX === maxX;

  if (!horizontal && !vertical) return false;
  if (horizontal) {
    return cells.length === maxX - minX + 1 && cells.every(cell => cell.y === minY);
  }
  return cells.length === maxY - minY + 1 && cells.every(cell => cell.x === minX);
}

function hasValidShipSeparation(board: Board): boolean {
  for (let y = 0; y < ROW_NUMBER; y++) {
    for (let x = 0; x < COLUMN_NUMBER; x++) {
      const shipId = board[y][x].shipId;
      if (shipId === null) continue;

      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;

          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= COLUMN_NUMBER || ny >= ROW_NUMBER) continue;

          const neighborShipId = board[ny][nx].shipId;
          if (neighborShipId !== null && neighborShipId !== shipId) {
            return false;
          }
        }
      }
    }
  }

  return true;
}

function hasValidFleet(board: Board): boolean {
  const ships = getShipsFromBoard(board);
  if (ships.length !== DEFAULT_FLEET_SPEC.length) return false;

  const seenShipIds = new Set<string>();

  for (const ship of ships) {
    if (seenShipIds.has(ship.id)) return false;
    if (fleetSpecById.get(ship.id) !== ship.size) return false;
    if (!isStraightConsecutiveLine(ship.occupiedCells)) return false;
    seenShipIds.add(ship.id);
  }

  return true;
}

export function validateBoard(board: Board): Board | null {
  const shallowBoard = getShallowBoard(board);

  if (shallowBoard.length !== ROW_NUMBER) return null;

  for (let y = 0; y < ROW_NUMBER; y++) {
    const row = shallowBoard[y];
    if (row.length !== COLUMN_NUMBER) return null;

    for (let x = 0; x < COLUMN_NUMBER; x++) {
      if (!isValidPlacementCell(row[x], x, y)) return null;
    }
  }

  if (!hasValidFleet(shallowBoard) || !hasValidShipSeparation(shallowBoard)) {
    return null;
  }

  return shallowBoard;
}
