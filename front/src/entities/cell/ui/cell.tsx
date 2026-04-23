import { CellState, DND_SHIP_TYPE, type ICell, type ICellEnemy } from '@/shared';
import { Box } from '@mui/material';
import { useDragOperation, useDroppable } from '@dnd-kit/react';

interface CellProps {
  cell: ICell | ICellEnemy;
}

export function Cell({ cell }: CellProps) {
  const droppableId = `${cell.x}-${cell.y}`;

  const { ref } = useDroppable({
    id: droppableId,
    accept: DND_SHIP_TYPE,
    data: {
      type: 'cell',
      cell,
    },
  });

  const { target } = useDragOperation();
  const isOver = target !== null && String(target?.id) === droppableId;
  const hasShip = 'shipId' in cell && cell.shipId !== null && cell.state === CellState.SHIP;

  return (
    <Box
      ref={ref}
      sx={{
        minWidth: 0,
        minHeight: 0,
        width: '100%',
        height: '100%',
        bgcolor: hasShip ? 'rgba(25, 118, 210, 0.22)' : 'transparent',
        border: '1px solid',
        borderColor: isOver ? '#188d03' : 'divider',
        transform: isOver ? 'scale(1.08)' : 'scale(1)',
        transition: 'transform 0.1s ease-in-out',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        '&:hover': {
          borderColor: isOver ? '#188d03' : 'common.black',
        },
        '&:active': {
          transform: 'scale(1.02)',
          transition: 'transform 0.1s ease-in-out',
        },
      }}
      onClick={() => console.log(`${cell.x}, ${cell.y}`)}
    />
  );
}
