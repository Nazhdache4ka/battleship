import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import { alpha, Box, Fade, Typography } from '@mui/material';
import { useAiGameStore } from '../store';

export function AiMessageBubble() {
  const aiMessage = useAiGameStore(state => state.aiMessage);

  if (aiMessage.length === 0) {
    return null;
  }

  return (
    <Fade
      in={aiMessage.length > 0}
      timeout={400}
      key={aiMessage}
    >
      <Box
        sx={{
          position: 'absolute',
          bottom: 'calc(100% + 12px)',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 2,
          width: { xs: 240, sm: 280 },
          px: 2,
          py: 1.5,
          borderRadius: 3,
          border: theme => `1px solid ${alpha(theme.palette.secondary.main, 0.45)}`,
          background: theme =>
            `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.22)}, ${alpha(theme.palette.primary.main, 0.16)})`,
          backdropFilter: 'blur(6px)',
          boxShadow: theme => `0 8px 24px ${alpha(theme.palette.common.black, 0.18)}`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
          <SmartToyOutlinedIcon
            fontSize="small"
            color="secondary"
            sx={{ mt: 0.25, flexShrink: 0 }}
          />
          <Typography
            variant="body2"
            sx={{ fontWeight: 500, lineHeight: 1.45 }}
          >
            {aiMessage}
          </Typography>
        </Box>
      </Box>
    </Fade>
  );
}
