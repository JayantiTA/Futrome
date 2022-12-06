import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import clsx from 'clsx';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import { makeStyles } from '@mui/styles';

import { useAuthStore } from '../store/store';

const useStyles = makeStyles((theme) => ({
  button: {
    backgroundColor: theme.palette.white.main,
    color: theme.palette.green.main,
    padding: '0.5rem 1rem',
    textTransform: 'none',
    fontWeight: 600,
    '&:hover': {
      backgroundColor: theme.palette.green.light,
    },
  },
  currentPage: {
    textDecoration: 'underline',
    fontWeight: 700,
  },
}));

function Navbar() {
  const classes = useStyles();
  const router = useRouter();
  const user = useAuthStore((state) => state.session?.user);
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const pages = ['Home', 'About', 'Services', 'Types', 'Contact'];

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const showProfile = () => {
    handleCloseUserMenu();
    router.push('/profile');
  };

  const logOut = () => {
    handleCloseUserMenu();
    useAuthStore.setState({ session: undefined });
    router.push('/');
  };

  const toSnakeCase = (str) => str
  && str
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    .map((x) => x.toLowerCase())
    .join('_');

  return (
    <AppBar position="static" sx={{ backgroundColor: '#195A00' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }}>
            <Image src="/logo_white.svg" width={50} height={50} />
          </Box>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontWeight: 700,
              letterSpacing: '.05rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Futrome
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Link href={`/${toSnakeCase(page)}`}>
                    {page}
                  </Link>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }}>
            <Image src="/logo_white.svg" width={50} height={50} />
          </Box>
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontWeight: 700,
              letterSpacing: '.05rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Futrome
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Typography
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ mx: 2, color: 'white' }}
                className={clsx({ [classes.currentPage]: router.pathname === `/${toSnakeCase(page)}` })}
              >
                <Link href={`/${toSnakeCase(page)}`}>
                  {page}
                </Link>
              </Typography>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            {user?.id ? (
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenUserMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
            ) : (
              <Button href="/login" className={classes.button}>
                Sign In
              </Button>
            )}
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem onClick={showProfile}>Profile</MenuItem>
              <MenuItem onClick={logOut}>Logout</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Navbar;
