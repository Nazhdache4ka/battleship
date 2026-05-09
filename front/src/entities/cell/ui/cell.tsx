import { CellState, DND_SHIP_TYPE, type ICell, type ICellEnemy } from '@/shared';
import { Box } from '@mui/material';
import { useDragOperation, useDroppable } from '@dnd-kit/react';
import fireImage from '../../../../assets/kenney_pirate-pack/PNG/Default size/Effects/fire2.png';
import missImage from '../../../../assets/kenney_pirate-pack/PNG/Default size/Effects/cross.png';

interface CellProps {
  cell: ICell | ICellEnemy;
  variant: 'player' | 'enemy' | 'setting';
  onClick?: (cell: ICell) => void;
}

export function Cell({ cell, variant, onClick }: CellProps) {
  const droppableId = `${cell.x}-${cell.y}`;

  const { ref } = useDroppable({
    id: droppableId,
    accept: DND_SHIP_TYPE,
    data: {
      type: 'cell',
      cell,
    },
    disabled: variant !== 'setting',
  });

  const { target } = useDragOperation();

  const isOver = target !== null && String(target?.id) === droppableId;
  const hasShip =
    'shipId' in cell &&
    cell.shipId !== null &&
    cell.state === CellState.SHIP &&
    (variant === 'player' || variant === 'setting');

  const isMiss = cell.state === CellState.MISS;
  const isHit = cell.state === CellState.HIT;

  return (
    <Box
      ref={ref}
      sx={{
        minWidth: 0,
        minHeight: 0,
        width: '100%',
        height: '100%',
        bgcolor: isMiss ? 'transparent' : hasShip ? 'rgba(25, 118, 210, 0.22)' : 'transparent',
        backgroundImage: isHit ? `url(${fireImage})` : isMiss ? `url(${missImage})` : 'none',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        border: '1px solid',
        borderColor: isMiss ? 'red' : isOver ? '#188d03' : 'divider',
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
      onClick={() => onClick?.(cell as ICell)}
    />
  );
}
