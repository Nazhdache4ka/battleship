import { Container } from '@mui/material';
import { UserProfilePublic } from '@/features';

export function UserPublicPage() {
  return (
    <Container
      maxWidth="xl"
      sx={{ my: 4 }}
    >
      <UserProfilePublic />
    </Container>
  );
}
