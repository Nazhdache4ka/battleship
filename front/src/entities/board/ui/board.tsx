import { Box } from '@mui/material';
import { Cell } from '@/entities/cell';
import { Ship } from '@/entities/ship';
import {
  BOARD_MAX_WIDTH_PX,
  COLUMN_NUMBER,
  ROW_NUMBER,
  type Board,
  type BoardEnemy,
  type ICell,
  type ICellEnemy,
  type IShip,
} from '@/shared';
import boardTileUrl from '../../../../assets/kenney_pirate-pack/PNG/Default size/Tiles/tile_73.png';
import { getShipWrapperStyle } from '../lib/get-ship-wrapper-style';

interface BoardProps {
  board: Board | BoardEnemy;
  ships: IShip[];
  variant: 'player' | 'enemy' | 'setting';
  onClick?: (cell: ICell) => void;
}

export function Board({ board, ships, variant, onClick }: BoardProps) {
  const isPlayer = variant === 'player' || variant === 'setting';

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        width: '100%',
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          maxWidth: BOARD_MAX_WIDTH_PX,
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: `repeat(${COLUMN_NUMBER}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${ROW_NUMBER}, minmax(0, 1fr))`,
            aspectRatio: COLUMN_NUMBER > 0 ? `${COLUMN_NUMBER} / ${ROW_NUMBER}` : '1',
            width: '100%',
            maxWidth: BOARD_MAX_WIDTH_PX,
            border: '1px solid',
            borderColor: 'divider',
            backgroundImage: `url(${boardTileUrl})`,
            backgroundRepeat: 'repeat',
            backgroundSize: `${100 / COLUMN_NUMBER}% ${100 / ROW_NUMBER}%`,
          }}
        >
          {board.flatMap((row: ICell[] | ICellEnemy[], rowIndex: number) =>
            row.map((cell: ICell | ICellEnemy) => (
              <Cell
                key={`${rowIndex}-${cell.x}-${cell.y}`}
                cell={cell}
                variant={variant}
                onClick={onClick}
              />
            ))
          )}
        </Box>
        {isPlayer
          ? ships.map(ship => {
              const origin = ship.occupiedCells[0];
              if (!origin) return null;
              const style = getShipWrapperStyle(ship);
              return (
                <Box
                  key={ship.id}
                  sx={{
                    ...style,
                    pointerEvents: variant === 'setting' ? 'auto' : 'none',
                  }}
                >
                  <Ship
                    ship={ship}
                    variant={variant}
                  />
                </Box>
              );
            })
          : ships.map(ship => {
              const origin = ship.occupiedCells[0];
              const isSunk = ship.isSunk;
              if (!origin || !isSunk) return null;
              const style = getShipWrapperStyle(ship);
              return (
                <Box
                  key={ship.id}
                  sx={{
                    ...style,
                    pointerEvents: 'none',
                  }}
                >
                  <Ship
                    ship={ship}
                    variant={variant}
                  />
                </Box>
              );
            })}
      </Box>
    </Box>
  );
}
