import React, { useState } from 'react';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Button from '@mui/material/Button';
import { makeStyles } from '@mui/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

const useStyles = makeStyles((theme) => ({
  button: {
    backgroundColor: theme.palette.green.main,
    color: theme.palette.white.main,
    padding: '0.5rem 1.5rem',
    textTransform: 'none',
    fontSize: 17,
    margin: '0 auto',
    '&:hover': {
      backgroundColor: theme.palette.green.hover,
    },
  },
}));

export default function Invoice() {
  const classes = useStyles();
  const [user, setUser] = useState({
    _id: '748254258619865',
    username: 'JohnD',
    full_name: 'John Doe',
    email: 'LipsumDolor@sitamet.com',
    phone_number: '62 812 3456 7890',
  });

  const [reservations, setReservations] = useState([
    {
      location: 'D5',
      capacity: 1,
      status: 'waiting for payment',
    },
    {
      location: 'D6',
      capacity: 1,
      status: 'waiting for confirmation',
    },
    {
      location: 'D7',
      capacity: 1,
      status: 'paid',
    },
    {
      location: 'D5',
      capacity: 1,
      status: 'cancelled',
    },
  ]);

  return (
    <Box marginY={7}>
      <Box maxWidth={700} marginX="auto" border={1} borderColor="#B6BCA4" borderRadius={2}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <AccountCircleIcon sx={{ fontSize: 100, color: '#195A00' }} />
          <Typography variant="h5">{user.username}</Typography>
          <Typography variant="body1">{`ID: ${user._id}`}</Typography>
        </Box>
        <Box marginY={7} marginX={5}>
          <Typography variant="h6">Personal Data</Typography>
          <Typography variant="body1" marginY={1}>{`Full Name: ${user.full_name}`}</Typography>
          <Typography variant="h6" marginTop={5}>Personal Contact</Typography>
          <Typography variant="body1" marginY={1}>{`Email: ${user.email}`}</Typography>
          <Typography variant="body1" marginY={1}>{`Phone Number: ${user.phone_number}`}</Typography>
        </Box>
      </Box>
      <Box maxWidth={700} marginX="auto" marginTop={5} border={1} borderColor="#B6BCA4" borderRadius={2}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography variant="h5">Pesanan</Typography>
        </Box>
        {reservations.map((reservation) => (
          <Box marginY={7} maxWidth={600} marginX="auto">
            <Typography variant="h6">{`Lokasi: ${reservation.location}`}</Typography>
            <Typography variant="h6">{`Kapasitas: ${reservation.capacity}`}</Typography>
            <Typography variant="h6">{`Status: ${reservation.status}`}</Typography>
            <Button variant="contained" className={classes.button} href="/invoice">Invoice</Button>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
