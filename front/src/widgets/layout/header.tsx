import { useState, type MouseEvent } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Icon,
  Box,
  Button,
  Tooltip,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Checkbox,
  FormLabel,
} from '@mui/material';
import { GiBattleship } from 'react-icons/gi';
import { Link, useBlocker, useNavigate } from '@tanstack/react-router';
import { AuthLogout } from '@/features';
import { useAuthStore } from '@/shared';

export function Header() {
  const isAuth = useAuthStore(state => state.isAuth);
  const user = useAuthStore(state => state.user);

  const navigate = useNavigate();

  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const [isBlocking, setIsBlocking] = useState(false);

  const open = Boolean(anchorElUser);

  const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  useBlocker({
    shouldBlockFn: () => {
      if (!isBlocking) {
        return false;
      }

      const shouldLeave = confirm('Are you sure you want to leave?');
      return !shouldLeave;
    },
    disabled: !isBlocking,
  });

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Icon
            component={GiBattleship}
            sx={{ fontSize: '2.5rem', mr: 1 }}
          />
          <Typography
            variant="h6"
            sx={{
              fontSize: '2rem',
              fontWeight: 'bold',
              fontFamily: 'monospace',
              textDecoration: 'none',
              color: 'inherit',
            }}
            component={Link}
            to="/"
          >
            Battleship
          </Typography>
          <Box sx={{ flexGrow: 1, ml: 2 }}>
            {navItems.map(item => (
              <Button
                key={item}
                onClick={() => {}}
                variant="outlined"
                sx={{ color: 'white', borderColor: 'white', mx: 1 }}
              >
                {item}
              </Button>
            ))}
          </Box>

          <FormLabel sx={{ backgroundColor: 'white', padding: 1, borderRadius: 1 }}>
            <Checkbox
              value={isBlocking}
              onChange={() => setIsBlocking(!isBlocking)}
              title="Is blocking"
            />

            <Typography>Use penis</Typography>
          </FormLabel>

          <Link
            to="/$notSlug/news"
            search={{ page: 1, limit: 10 }}
            params={{ notSlug: 'news' }}
          >
            News
          </Link>
          <Box sx={{ flexGrow: 0 }}>
            {isAuth ? (
              <>
                <Tooltip title="Open profile settings">
                  <IconButton onClick={handleOpenUserMenu}>
                    <Avatar sx={{ bgcolor: 'secondary.main' }}>{user?.name.charAt(0)}</Avatar>
                  </IconButton>
                </Tooltip>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  open={open}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem onClick={handleCloseUserMenu}>Profile</MenuItem>
                  <MenuItem onClick={handleCloseUserMenu}>Settings</MenuItem>
                  <MenuItem
                    onClick={handleCloseUserMenu}
                    divider
                  >
                    Games History
                  </MenuItem>
                  <AuthLogout />
                </Menu>
              </>
            ) : (
              <>
                <Button
                  variant="contained"
                  sx={{ bgcolor: 'secondary.main', mx: 1 }}
                  onClick={() => navigate({ to: '/login' })}
                >
                  Login
                </Button>
                <Button
                  variant="contained"
                  sx={{ bgcolor: 'error.main', mx: 1 }}
                  onClick={() => navigate({ to: '/register' })}
                >
                  Register
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

const navItems = ['Home', 'Leaderboard', 'Rules', 'About'];
