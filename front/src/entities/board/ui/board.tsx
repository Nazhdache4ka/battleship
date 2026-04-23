import { Box } from '@mui/material';
import { Cell } from '@/entities/cell';
import { Ship } from '@/entities/ship';
import {
  BOARD_CELL_PX,
  BOARD_MAX_WIDTH_PX,
  COLUMN_NUMBER,
  ROW_NUMBER,
  type Board,
  type ICell,
  type IShip,
} from '@/shared';
import { inferHorizontalFromOccupiedCells } from '../lib';
import boardTileUrl from '../../../../assets/kenney_pirate-pack/PNG/Default size/Tiles/tile_73.png';

export function Board({ board, ships }: { board: Board; ships: IShip[] }) {
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
          {board.flatMap((row: ICell[], rowIndex: number) =>
            row.map((cell: ICell) => (
              <Cell
                key={`${rowIndex}-${cell.x}-${cell.y}`}
                cell={cell}
              />
            ))
          )}
        </Box>
        {ships.map(ship => {
          const origin = ship.occupiedCells[0];
          if (!origin) return null;
          const horizontal = inferHorizontalFromOccupiedCells(ship.occupiedCells) ?? true;
          return (
            <Box
              key={ship.id}
              sx={{
                position: 'absolute',
                left: `${(origin.x / COLUMN_NUMBER) * 100}%`,
                top: `${(origin.y / ROW_NUMBER) * 100}%`,
                width: `${((horizontal ? ship.size : 1) / COLUMN_NUMBER) * 100}%`,
                height: `${((horizontal ? 1 : ship.size) / ROW_NUMBER) * 100}%`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'auto',
                boxSizing: 'border-box',
                minHeight: BOARD_CELL_PX,
                minWidth: BOARD_CELL_PX,
              }}
            >
              <Ship ship={ship} />
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
