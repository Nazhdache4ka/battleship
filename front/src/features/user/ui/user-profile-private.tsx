import { Box, CircularProgress, Stack, Typography, Alert, Snackbar } from '@mui/material';
import { UserAvatar, UserRatingHistory, UserSettings } from '@/entities';
import { useAuthStore } from '@/shared';
import { useUserInfo, useUserRatingHistory, useUserSettingsPatch } from '../hooks';

export function UserProfilePrivate() {
  const user = useAuthStore(state => state.user);

  const { data: ratingHistory, isLoading } = useUserRatingHistory(user?.id ?? 0);
  const { data: userInfo, isLoading: isInfoLoading } = useUserInfo(user?.id ?? 0);
  const {
    patchUserName,
    patchUserEmail,
    patchUserPassword,
    isPatchUserNamePending,
    isPatchUserEmailPending,
    isPatchUserPasswordPending,
    snackbarMessage,
    openSnackbar,
    setOpenSnackbar,
  } = useUserSettingsPatch({ userId: user?.id ?? 0 });

  if (!user || !userInfo) {
    return (
      <Typography
        color="text.secondary"
        sx={{ textAlign: 'center' }}
      >
        Sign in to view your profile
      </Typography>
    );
  }

  return (
    <>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={4}
        sx={{
          alignItems: { xs: 'center', md: 'flex-start' },
          width: '100%',
        }}
      >
        <Box sx={{ flexShrink: 0 }}>
          {isInfoLoading ? (
            <CircularProgress size={24} />
          ) : (
            <UserAvatar
              name={userInfo.name}
              rating={userInfo.rating}
              createdAt={userInfo.createdAt}
            />
          )}
        </Box>

        <Stack
          spacing={4}
          sx={{ flex: 1, minWidth: 0, width: '100%' }}
        >
          {isLoading ? <CircularProgress size={24} /> : <UserRatingHistory ratingHistory={ratingHistory ?? []} />}
          <UserSettings
            name={user.name}
            email={user.email}
            isPatchUserNamePending={isPatchUserNamePending}
            isPatchUserEmailPending={isPatchUserEmailPending}
            isPatchUserPasswordPending={isPatchUserPasswordPending}
            onNameSave={patchUserName}
            onEmailSave={patchUserEmail}
            onPasswordSave={patchUserPassword}
          />
        </Stack>
      </Stack>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => {
          setOpenSnackbar(false);
        }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="error">{snackbarMessage ?? 'Something went wrong'}</Alert>
      </Snackbar>
    </>
  );
}
