import { useAuthLogout } from '../hooks';
import { ErrorAlert } from '@/shared';
import { MenuItem } from '@mui/material';

export function AuthLogout() {
  const { logout, isPending, errorMessage, openSnackbar, setOpenSnackbar } = useAuthLogout();

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <>
      <MenuItem
        onClick={() => logout()}
        disabled={isPending}
        sx={{ color: 'error.main' }}
      >
        Logout
      </MenuItem>
      <ErrorAlert
        open={openSnackbar}
        message={errorMessage ?? ''}
        onClose={handleCloseSnackbar}
      />
    </>
  );
}
