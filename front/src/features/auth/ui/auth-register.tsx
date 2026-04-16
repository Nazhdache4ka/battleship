import { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useAuthRegister } from '../hooks';
import { ErrorAlert } from '../../../shared';

export function AuthRegister() {
  const { register, isPending, setOpenSnackbar, errorMessage, openSnackbar } = useAuthRegister();

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

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
          display: 'flex',
          flex: 1,
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
            Register
          </Typography>
          <TextField
            label="username"
            value={name}
            onChange={e => setName(e.target.value)}
            fullWidth
          >
            Name
          </TextField>
          <TextField
            value={email}
            onChange={e => setEmail(e.target.value)}
            type="email"
            label="email"
            fullWidth
          >
            Email
          </TextField>
          <TextField
            value={password}
            onChange={e => setPassword(e.target.value)}
            type="password"
            label="password"
            fullWidth
          >
            Password
          </TextField>
          <Button
            variant="contained"
            color="primary"
            onClick={() => register({ name, email, password })}
            disabled={isPending}
            fullWidth
          >
            Register
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
