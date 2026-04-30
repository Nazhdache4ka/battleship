import { useCallback, useMemo } from 'react';
import { DragDropProvider, type DragEndEvent } from '@dnd-kit/react';
import { PointerSensor, KeyboardSensor, PointerActivationConstraints } from '@dnd-kit/dom';
import {
  Board,
  getCellFromDropTarget,
  placeShipOnBoard,
  resolveShipCellsAfterDrop,
  updateShipsOccupiedCells,
} from '@/entities/board';
import type { ShipDragData } from '@/shared';
import { POINTER_DRAG_DISTANCE_PX, useGameStore } from '@/shared';

export function BoardSetting() {
  const board = useGameStore(s => s.board);
  const ships = useGameStore(s => s.ships);

  const sensors = useMemo(
    () => [
      PointerSensor.configure({
        activationConstraints: [new PointerActivationConstraints.Distance({ value: POINTER_DRAG_DISTANCE_PX })],
      }),
      KeyboardSensor,
    ],
    []
  );

  const onDragEnd = useCallback(({ operation, canceled }: DragEndEvent) => {
    if (canceled) return;

    const target = operation.target;
    const source = operation.source;

    if (!target || !source) return;

    const shipPayload = source.data as ShipDragData | undefined;
    if (shipPayload?.type !== 'ship') return;

    const { board: currentBoard, ships: currentShips, setBoard, setShips } = useGameStore.getState();
    const targetCell = getCellFromDropTarget(currentBoard, target);
    if (!targetCell) return;

    const cells = resolveShipCellsAfterDrop(currentBoard, targetCell, shipPayload.ship);
    if (!cells) return;

    setBoard(placeShipOnBoard(currentBoard, shipPayload.ship.id, cells));
    setShips(updateShipsOccupiedCells(currentShips, shipPayload.ship.id, cells));
  }, []);

  return (
    <DragDropProvider
      sensors={sensors}
      onDragEnd={onDragEnd}
    >
      <Board
        board={board}
        ships={ships}
      />
    </DragDropProvider>
  );
}
