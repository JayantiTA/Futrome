import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import CircularProgress from '@mui/material/CircularProgress';
import { makeStyles } from '@mui/styles';

import { useAuthStore } from '../store/store';

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'IDR',
});

const useStyles = makeStyles((theme) => ({
  button: {
    backgroundColor: theme.palette.green.main,
    color: theme.palette.white.main,
    padding: '0.5rem 1rem',
    textTransform: 'none',
    fontSize: 15,
    marginTop: 10,
    '&:hover': {
      backgroundColor: theme.palette.green.hover,
    },
  },
}));

export default function Invoice() {
  const classes = useStyles();
  const router = useRouter();
  const session = useAuthStore((state) => state.session);
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [reservations, setReservations] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isAlertOpened, setIsAlertOpened] = useState(true);

  const getData = async () => {
    try {
      setIsLoading(true);
      const userData = await axios.get(`/api/users/${session.user.id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });
      setUser(userData.data.data);
      const response = await axios.get('/api/reservations', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });
      setReservations(response.data.data.reservations);
      setTotalRecords(response.data.data.total_records);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
    setIsLoading(false);
  };

  const handleAction = (id) => {
    router.push({ pathname: '/invoice', query: { id } });
  };

  useEffect(() => {
    getData();
    if (router.query?.success) {
      setIsAlertOpened(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (
    <Box marginY={7}>
      <Box maxWidth={700} marginX="auto" border={1} borderColor="#B6BCA4" borderRadius={2} display="flex" flexDirection="column">
        {isLoading ? (
          <CircularProgress sx={{ color: '#195A00', marginX: 'auto' }} />
        ) : (
          <>
            {router.query?.success && (
            <Snackbar
              open={isAlertOpened}
              autoHideDuration={6000}
              anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
            >
              <Alert
                severity="success"
                sx={{ backgroundColor: '#2F7D31', color: '#FFFFFF' }}
                action={(
                  <IconButton
                    size="small"
                    aria-label="close"
                    sx={{ color: '#FFFFFF' }}
                    onClick={() => {
                      setIsAlertOpened(false);
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
              )}
              >
                Success!
              </Alert>
            </Snackbar>
            )}
            <Box display="flex" flexDirection="column" alignItems="center">
              <AccountCircleIcon sx={{ fontSize: 100, color: '#195A00' }} />
              <Typography variant="h5">{user?.username}</Typography>
              <Typography variant="body1">{`ID: ${user?._id}`}</Typography>
            </Box>
            <Box marginY={7} marginX={5}>
              <Typography variant="h5">Personal Data</Typography>
              <Typography variant="body1" marginY={1}>{`Full Name: ${user?.full_name}`}</Typography>
              <Typography variant="h6" marginTop={5}>Personal Contact</Typography>
              <Typography variant="body1" marginY={1}>{`Email: ${user?.email}`}</Typography>
              <Typography variant="body1" marginY={1}>{`Phone Number: ${user?.phone_number}`}</Typography>
            </Box>
          </>
        )}
      </Box>
      {totalRecords > 0 && !isLoading && session?.user?.role !== 'admin' && (
      <Box maxWidth={700} marginX="auto" marginTop={5} border={1} borderColor="#B6BCA4" borderRadius={2}>
        <Box display="flex" flexDirection="column" alignItems="center" marginTop={4}>
          <Typography variant="h5">Pesanan</Typography>
        </Box>
        {reservations.map((reservation) => (
          <Box marginY={5} maxWidth={600} marginX="auto" backgroundColor="#E5EBE3" paddingY={3} paddingX={5}>
            <Typography variant="body1">{`Lokasi: ${reservation.grave.location}`}</Typography>
            <Typography variant="body1">{`Harga: ${formatter.format(reservation.grave.price)}`}</Typography>
            <Typography variant="body1">{`Status: ${reservation.status}`}</Typography>
            <Button variant="contained" className={classes.button} onClick={() => handleAction(reservation._id)}>Invoice</Button>
          </Box>
        ))}
      </Box>
      )}
    </Box>
  );
}
