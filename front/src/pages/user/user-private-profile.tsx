import { Container } from '@mui/material';
import { UserProfilePrivate } from '@/features';

export function UserPrivateProfile() {
  return (
    <Container
      maxWidth="xl"
      sx={{ my: 4 }}
    >
      <UserProfilePrivate />
    </Container>
  );
}
