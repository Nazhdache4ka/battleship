import { useEffect, useState } from 'react';
import { Box, Typography, TextField, Button, Stack } from '@mui/material';
import { ErrorAlert } from '@/shared';

interface UserSettingsProps {
  name: string;
  email: string;
  isPatchUserNamePending: boolean;
  isPatchUserEmailPending: boolean;
  isPatchUserPasswordPending: boolean;
  onNameSave: (name: string) => void;
  onEmailSave: (email: string) => void;
  onPasswordSave: (password: string) => void;
}

export function UserSettings({
  name,
  email,
  isPatchUserNamePending,
  isPatchUserEmailPending,
  isPatchUserPasswordPending,
  onNameSave,
  onEmailSave,
  onPasswordSave,
}: UserSettingsProps) {
  const [localName, setLocalName] = useState(name);
  const [localEmail, setLocalEmail] = useState(email);
  const [localPassword, setLocalPassword] = useState('');
  const [localConfirmPassword, setLocalConfirmPassword] = useState('');

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLocalName(name);
  }, [name]);

  useEffect(() => {
    setLocalEmail(email);
  }, [email]);

  const handleConfirmPasswordChange = () => {
    if (localPassword.trim() !== localConfirmPassword.trim()) {
      setLocalConfirmPassword('');

      setError('Passwords do not match');
      return;
    }

    setError(null);
    onPasswordSave(localPassword.trim());
    setLocalPassword('');
    setLocalConfirmPassword('');
  };

  const closeError = () => {
    setError(null);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      <Typography
        variant="h6"
        sx={{ mb: 2, textAlign: 'center' }}
      >
        User Settings
      </Typography>

      <Stack
        spacing={2}
        sx={{ width: '100%', maxWidth: 480 }}
      >
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1}
          sx={{ alignItems: { xs: 'stretch', sm: 'center' } }}
        >
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            value={localName}
            onChange={e => setLocalName(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            disabled={localName.trim() === name || isPatchUserNamePending}
            onClick={() => onNameSave(localName.trim())}
            sx={{ flexShrink: 0, width: { xs: '100%', sm: 'auto' }, minWidth: { sm: 88 } }}
          >
            Save
          </Button>
        </Stack>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1}
          sx={{ alignItems: { xs: 'stretch', sm: 'center' } }}
        >
          <TextField
            label="Email"
            variant="outlined"
            type="email"
            fullWidth
            value={localEmail}
            onChange={e => setLocalEmail(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            disabled={localEmail.trim() === email || isPatchUserEmailPending}
            onClick={() => onEmailSave(localEmail.trim())}
            sx={{ flexShrink: 0, width: { xs: '100%', sm: 'auto' }, minWidth: { sm: 88 } }}
          >
            Save
          </Button>
        </Stack>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1}
          sx={{ alignItems: { xs: 'stretch', sm: 'center' } }}
        >
          <Stack
            spacing={1}
            sx={{ flex: 1, width: '100%' }}
          >
            <TextField
              label="Password"
              variant="outlined"
              type="password"
              fullWidth
              value={localPassword}
              onChange={e => setLocalPassword(e.target.value)}
            />

            <TextField
              label="Confirm Password"
              variant="outlined"
              type="password"
              fullWidth
              value={localConfirmPassword}
              onChange={e => setLocalConfirmPassword(e.target.value)}
            />
          </Stack>
          <Button
            variant="contained"
            color="primary"
            disabled={
              localPassword.trim().length === 0 ||
              localConfirmPassword.trim().length === 0 ||
              isPatchUserPasswordPending
            }
            onClick={handleConfirmPasswordChange}
            sx={{ flexShrink: 0, width: { xs: '100%', sm: 'auto' }, minWidth: { sm: 88 } }}
          >
            Save
          </Button>
        </Stack>
      </Stack>
      <ErrorAlert
        open={!!error}
        onClose={closeError}
        message={error ?? ''}
      />
    </Box>
  );
}
