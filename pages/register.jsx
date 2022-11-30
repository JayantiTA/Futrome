/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';

import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { makeStyles } from '@mui/styles';

import DefaultInput from '../components/input/DefaultInput';

const useStyles = makeStyles((theme) => ({
  gridContainer: {
    minHeight: '100vh',
    padding: '0',
  },
  gridItem: {
    backgroundColor: theme.palette.green.main,
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  title: {
    marginTop: '12rem',
    marginLeft: '7vw',
    fontWeight: 700,
    letterSpacing: '0.05em',
    color: theme.palette.white.main,
  },
  logo: {
    marginTop: '2rem',
    marginLeft: '0.5rem',
    fontWeight: 700,
    color: theme.palette.white.main,
  },
  button: {
    backgroundColor: theme.palette.green.main,
    minHeight: 50,
    marginTop: 10,
    marginBottom: 10,
    '&:hover': {
      backgroundColor: theme.palette.green.hover,
    },
  },
}));

export default function Login() {
  const classes = useStyles();
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isAlertOpened, setIsAlertOpened] = useState(false);
  const [errors, setErrors] = useState({});
  const router = useRouter();

  const formInputs = [
    {
      component: DefaultInput,
      props: {
        label: 'Email',
        type: 'email',
        value: user.email,
        onChange: (e) => setUser({ ...user, email: e.target.value }),
        error: errors?.errors?.email,
        isLoading,
        autofocus: true,
      },
    },
    {
      component: DefaultInput,
      props: {
        label: 'Username',
        type: 'text',
        value: user.username,
        onChange: (e) => setUser({ ...user, username: e.target.value }),
        error: errors?.errors?.username,
        isLoading,
      },
    },
    {
      component: DefaultInput,
      props: {
        label: 'Full Name',
        type: 'text',
        value: user.full_name,
        onChange: (e) => setUser({ ...user, full_name: e.target.value }),
        error: errors?.errors?.full_name,
        isLoading,
      },
    },
    {
      component: DefaultInput,
      props: {
        label: 'Phone Number',
        type: 'text',
        value: user.phone_number,
        onChange: (e) => setUser({ ...user, phone_number: e.target.value }),
        error: errors?.errors?.phone_number,
        isLoading,
      },
    },
    {
      component: DefaultInput,
      props: {
        label: 'Password',
        type: 'password',
        value: user.password,
        onChange: (e) => setUser({ ...user, password: e.target.value }),
        error: errors?.errors?.password,
        isLoading,
      },
    },
    {
      component: DefaultInput,
      props: {
        label: 'Confirm Password',
        type: 'password',
        value: user.confirm_password,
        onChange: (e) => setUser({ ...user, confirm_password: e.target.value }),
        error: errors?.errors?.confirm_password,
        isLoading,
      },
    },
  ];

  const signUp = (event) => {
    event.preventDefault();
    (async () => {
      try {
        setIsLoading(true);
        // eslint-disable-next-line no-console
        console.error(user);
        await axios.post('/api/users/register', user);
        router.push({ pathname: '/login', query: { registered: true } });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        setErrors(error.response.data);
        setIsAlertOpened(true);
      }
      setIsLoading(false);
    })();
  };

  const closeAlert = () => {
    setIsAlertOpened(false);
  };

  return (
    <Grid container className={classes.gridContainer}>
      <Grid item xs={false} sm={4} md={7} className={classes.gridItem}>
        <Box sx={{ margin: 2, display: 'flex' }}>
          <Image src="/logo_white.svg" width={100} height={100} />
          <Typography variant="h5" className={classes.logo}>Futrome</Typography>
        </Box>
        <Typography variant="h2" className={classes.title}>Welcome!</Typography>
        <Typography variant="h5" className={classes.title}>Your future home is here.</Typography>
      </Grid>
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 4,
            mx: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'left',
          }}
        >
          <Typography component="h1" variant="h4">
            Sign Up
          </Typography>
          <Snackbar
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isAlertOpened}
            autoHideDuration={6000}
            onClose={closeAlert}

          >
            <Alert
              severity="error"
              action={(
                <IconButton
                  aria-label="close"
                  color="inherit"
                  sx={{ p: 0.5 }}
                  onClick={closeAlert}
                >
                  <CloseIcon />
                </IconButton>
              )}
            >
              {errors.message}
            </Alert>
          </Snackbar>
          <Box component="form" noValidate onSubmit={signUp} sx={{ mt: 2 }}>
            {formInputs.map((input) => (
              <input.component {...input.props} />
            ))}
            <LoadingButton
              loading={isLoading}
              type="submit"
              fullWidth
              variant="contained"
              className={classes.button}
              disabled={isLoading}
            >
              Register
            </LoadingButton>
            <Grid container justifyContent="flex-end">
              <Typography className={classes.typography}>
                Already have an account? &nbsp;
                <a style={{ textDecoration: 'underline' }}>
                  <Link href="/login">Sign In</Link>
                </a>
              </Typography>
            </Grid>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}
