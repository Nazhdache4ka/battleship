import { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useAuthLogin } from '../hooks';
import { ErrorAlert } from '../../../shared';

export function AuthLogin() {
  const { login, isPending, errorMessage, openSnackbar, setOpenSnackbar } = useAuthLogin();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box
      sx={{
        height: '100%',
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
      }}
    >
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          px: 2,
          py: 3,
          width: '100%',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            maxWidth: 420,
            gap: 2,
          }}
        >
          <Typography
            variant="h4"
            component="h1"
          >
            Login
          </Typography>
          <TextField
            label="Name"
            value={name}
            onChange={e => setName(e.target.value)}
            fullWidth
            autoComplete="name"
          />
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            fullWidth
            autoComplete="email"
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            fullWidth
            autoComplete="current-password"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => login({ name, email, password })}
            disabled={isPending}
            fullWidth
          >
            Login
          </Button>
        </Box>
      </Box>

      <ErrorAlert
        open={openSnackbar}
        message={errorMessage ?? ''}
        onClose={handleCloseSnackbar}
      />
    </Box>
  );
}
