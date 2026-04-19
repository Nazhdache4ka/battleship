import { Box, Container, Link, Tooltip, Typography } from '@mui/material';
import { Link as RouterLink } from '@tanstack/react-router';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

const footerLinks = [
  { label: 'Rules', to: '/rules' },
  { label: 'About', to: '/about' },
] as const;

export function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        py: 3,
        borderTop: 1,
        borderColor: 'divider',
        bgcolor: 'grey.50',
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
          }}
        >
          <Box sx={{ flexGrow: 1 }}>
            <Typography
              variant="body2"
              color="text.secondary"
            >
              © {new Date().getFullYear()} Battleship
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              mr: 4,
            }}
          >
            {footerLinks.map(({ label, to }) => (
              <Link
                key={to}
                component={RouterLink}
                to={to}
                variant="body2"
                color="text.secondary"
                underline="hover"
              >
                {label}
              </Link>
            ))}
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Tooltip title="GitHub Profile">
              <Link
                href="https://github.com/Nazhdache4ka"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaGithub />
              </Link>
            </Tooltip>
            <Tooltip title="LinkedIn Profile">
              <Link
                href="https://www.linkedin.com/in/ilia-iurkov-a947053a3/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaLinkedin />
              </Link>
            </Tooltip>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
