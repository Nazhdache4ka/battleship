import type { ReactNode } from 'react';
import { Paper, alpha, Typography } from '@mui/material';

interface PaperLottieProps {
  children: ReactNode;
  text: string;
}

export function PaperLottie({ children, text }: PaperLottieProps) {
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
    </Paper>
  );
}
