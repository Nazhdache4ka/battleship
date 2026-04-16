import { Alert, Snackbar } from '@mui/material';

interface ErrorAlertProps {
  open: boolean;
  message: string;
  onClose: () => void;
}

export function ErrorAlert({ open, message, onClose }: ErrorAlertProps) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={onClose}
    >
      <Alert
        severity="error"
        variant="filled"
        sx={{ width: '100%' }}
        onClose={onClose}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
