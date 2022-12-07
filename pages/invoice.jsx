import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
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
  const [isLoading, setIsLoading] = useState(false);
  const [reservationData, setReservationData] = useState({});
  const [detailGrave, setDetailGrave] = useState({});

  const getGraveData = async (id) => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/api/graves/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });
      setDetailGrave({
        'Tipe:': response.data.data.type,
        'Lokasi:': response.data.data.location,
        'Ukuran:': `${response.data.data.size} m2`,
        'Kapasitas:': response.data.data.capacity,
        'Deskripsi:': response.data.data.description,
        'Harga:': formatter.format(response.data.data.price),
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  const getReservationData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/api/reservations/${router.query?.id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });
      setReservationData(response.data.data.reservation);
      getGraveData(response.data.data.reservation.grave.id);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getReservationData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const handlePayment = (id) => {
    router.push({ pathname: '/pay', query: { id } });
  };

  const actions = () => {
    switch (reservationData.status) {
      case 'waiting for payment':
        return (
          <Button
            className={classes.button}
            onClick={() => handlePayment(reservationData._id)}
          >
            Bayar sekarang
          </Button>
        );
      case 'paid':
        return (
          <>
            <Typography>Silahkan ambil sertifikat di alamat kantor kami</Typography>
            <Typography>atau hubungi kontak yang tertera pada:</Typography>
            <Button className={classes.button} href="/contact">Kontak dan Alamat</Button>
          </>
        );
      case 'done':
        return (
          <>
            <Typography>Jika Anda ingin melakukan upacara pemakaman, </Typography>
            <Typography>silakan hubungi kontak yang tertera pada:</Typography>
            <Button className={classes.button} href="/contact">Kontak Kami</Button>
            <Typography variant="body2">(maksimal 3 jam sebelum pemakaman)</Typography>
          </>
        );
      default:
        break;
    }
  };

  return (
    <Box marginY={7} minHeight="100vh">
      <Box
        borderBottom={1}
        borderColor="divider"
        maxWidth={400}
        marginX="auto"
        display="flex"
        justifyContent="center"
        marginBottom={5}
      >
        <Typography variant="h4" fontWeight={700} sx={{ color: '#195A00', my: 1, mx: 'auto' }}>
          Invoice
        </Typography>
      </Box>
      <Box display="flex" flexDirection="column" maxWidth={700} marginX="auto" border={1} borderColor="#B6BCA4" borderRadius={2} marginY={3}>
        {isLoading ? (
          <CircularProgress sx={{ color: '#195A00', marginX: 'auto' }} />
        ) : (
          <>
            <Typography variant="h5" margin={3}>
              Detail Kuburan
            </Typography>
            <Box sx={{
              display: 'flex', alignItems: 'center', paddingX: 15,
            }}
            >
              <Table>
                <TableBody>
                  {detailGrave && Object.keys(detailGrave).map((key) => (
                    <TableRow key={key}>
                      <TableCell>
                        <Typography variant="body1" sx={{ color: '#195A00' }}>
                          {key}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1" fontWeight={600} sx={{ color: '#195A00' }}>
                          {detailGrave[key]}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow key="status">
                    <TableCell>
                      <Typography variant="body1" sx={{ color: '#195A00' }}>
                        Status
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1" fontWeight={600} sx={{ color: '#195A00' }}>
                        {reservationData.status}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
            <Box marginY={3} marginLeft="50%">
              <Typography variant="body1">
                Total Bayar
              </Typography>
              <Typography variant="h4" sx={{ color: '#195A00' }}>
                {formatter.format(reservationData.grave?.price)}
              </Typography>
            </Box>
            <Box margin={2}>
              {actions()}
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}
