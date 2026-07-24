import { useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { LineChart } from '@mui/x-charts';
import { type UserRatingHistory } from '@/shared';

interface UserRatingHistoryProps {
  ratingHistory: UserRatingHistory[];
}

function formatAxisDate(date: string) {
  return Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export function UserRatingHistory({ ratingHistory }: UserRatingHistoryProps) {
  const isEmpty = ratingHistory.length === 0;

  const ratingSeries = useMemo(() => {
    return ratingHistory.map(item => item.rating);
  }, [ratingHistory]);

  const xAxisLabels = useMemo(() => {
    return ratingHistory.map((_, index) => index);
  }, [ratingHistory]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      <Typography
        variant="h6"
        sx={{ mb: 2, textAlign: 'center' }}
      >
        User Rating History
      </Typography>
      {isEmpty ? (
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ textAlign: 'center' }}
        >
          No rating history, play some games to see your rating history
        </Typography>
      ) : (
        <Box sx={{ width: '100%', maxWidth: 1000 }}>
          <LineChart
            height={300}
            series={[{ data: ratingSeries, label: 'Rating', showMark: true, curve: 'linear' }]}
            xAxis={[
              {
                scaleType: 'point',
                data: xAxisLabels,
                label: 'Match',
                valueFormatter: value => {
                  const point = ratingHistory[Number(value)];
                  return point ? formatAxisDate(point.createdAt) : '';
                },
              },
            ]}
            yAxis={[{ label: 'Rating', width: 60 }]}
            margin={{ left: 10, right: 20, top: 20, bottom: 40 }}
            grid={{ horizontal: true }}
          />
        </Box>
      )}
    </Box>
  );
}
