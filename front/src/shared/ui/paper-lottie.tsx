import { useMemo, type ReactNode } from 'react';
import { Paper, alpha, Typography } from '@mui/material';
import { getScaleAnimation } from '../utils';

interface PaperLottieProps {
  children: ReactNode;
  text: string;
  rating?: number;
  updatedRating?: number;
}

export function PaperLottie({ children, text, rating, updatedRating }: PaperLottieProps) {
  const isPositiveChange = useMemo(() => {
    if (typeof updatedRating !== 'number' || typeof rating !== 'number') return false;
    return updatedRating > rating;
  }, [updatedRating, rating]);

  const ratingText = useMemo(() => {
    if (typeof updatedRating === 'number' && typeof rating === 'number') {
      return (
        <Typography
          variant="body2"
          sx={{
            fontWeight: 'bold',
            textAlign: 'center',
            display: 'inline-block',
            backgroundImage: isPositiveChange
              ? 'linear-gradient(90deg,rgb(98, 220, 143),rgb(7, 121, 53))'
              : 'linear-gradient(90deg,rgb(219, 115, 146), #dc2626)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            color: 'transparent',
            ...getScaleAnimation(),
          }}
        >
          {`${rating} -> ${updatedRating}`}
        </Typography>
      );
    }

    if (typeof rating !== 'number') return null;

    return (
      <Typography
        variant="body2"
        sx={{ fontWeight: 'bold', textAlign: 'center' }}
      >
        {rating}
      </Typography>
    );
  }, [rating, updatedRating, isPositiveChange]);

  return (
    <Paper
      elevation={1}
      sx={{
        minWidth: 160,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        py: 1,
        borderRadius: 3,
        border: theme => `1px solid ${alpha(theme.palette.primary.main, 0.28)}`,
        background: theme =>
          `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.14)}, ${alpha(theme.palette.secondary.main, 0.12)})`,
        backdropFilter: 'blur(4px)',
      }}
    >
      {children}
      <Typography
        variant="h6"
        sx={{ fontWeight: 'bold', textAlign: 'center' }}
      >
        {text}
      </Typography>
      {ratingText}
    </Paper>
  );
}
