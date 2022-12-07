import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Image from 'next/image';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import CircularProgress from '@mui/material/CircularProgress';
import LoadingButton from '@mui/lab/LoadingButton';
import { makeStyles } from '@mui/styles';

import { useAuthStore } from '../../../store/store';
import SelectInput from '../../../components/input/SelectInput';

const useStyles = makeStyles((theme) => ({
  box: {
    backgroundColor: '#E5EAE2',
    backgroundSize: 'cover',
    minHeight: '100vh',
    padding: '1rem 0',
  },
  typography: {
    margin: '1rem 0',
    color: theme.palette.green.main,
    fontSize: '1.5rem',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: theme.palette.green.main,
    color: theme.palette.white.main,
    padding: '0.5rem 0.7rem',
    textTransform: 'none',
    fontSize: 15,
    margin: '10px 0',
    float: 'right',
    '&:hover': {
      backgroundColor: theme.palette.green.hover,
    },
  },
  tableHead: {
    backgroundColor: theme.palette.green.main,
    color: theme.palette.white.main,
  },
  tableBody: {
    backgroundColor: '#FFFFFF',
  },
  modalTitle: {
    textAlign: 'center',
    fontSize: '1.5rem',
  },
  modalText: {
    margin: '0.5rem',
  },
}));

export default function ReservationTable() {
  const classes = useStyles();
  const router = useRouter();
  const [reservationData, setReservationData] = useState({});
  const [reservationId, setReservationId] = useState('');
  const [paymentData, setPaymentData] = useState(undefined);
  const [paymentAttachment, setPaymentAttachment] = useState('');
  const [status, setStatus] = useState(undefined);
  const [tempStatus, setTempStatus] = useState(undefined);
  const [lists, setLists] = useState([]);
  const [errors, setErrors] = useState({});
  const [isAlertOpened, setIsAlertOpened] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const validStatus = ['waiting for payment', 'waiting for confirmation', 'paid'];
  const accessToken = useAuthStore((state) => state.session?.accessToken);

  const inputLists = () => {
    switch (status) {
      case 'waiting for payment':
        setLists(['cancel']);
        break;
      case 'waiting for confirmation':
        setLists(['confirm', 'reject']);
        break;
      case 'paid':
        setLists(['done']);
        break;
      default:
    }
  };

  useEffect(() => {
    inputLists();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const getReservationData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/api/reservations/${router.query.reservationId}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const tempReservation = response.data.data.reservation;
      inputLists(tempReservation.status);
      setStatus(tempReservation.status);
      setTempStatus(tempReservation.status);
      setReservationId(tempReservation._id);
      setReservationData({
        'Lokasi kuburan:': tempReservation.grave.location,
        'Harga kuburan': tempReservation.grave.price,
        'Nama pembeli': tempReservation.buyer_data.name,
        'Nomor KTP pembeli': tempReservation.buyer_data.ktp,
        'Nomor telepon pembeli': tempReservation.buyer_data.phone_number,
      });
      const tempPayment = response.data.data.payment;
      setPaymentData({
        'Nama pemilik rekening': tempPayment?.bank_account?.name,
        'Nomor rekening': tempPayment?.bank_account?.number,
        'Nama bank': tempPayment?.bank,
      });
      setPaymentAttachment(tempPayment?.attachment);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      setErrors(error.response.data);
      setIsAlertOpened(true);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (router.query.reservationId) {
      getReservationData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const handleAction = async (resvStatus) => {
    try {
      setIsLoading(true);
      await axios.post(`/api/reservations/${resvStatus}`, {
        _id: reservationId,
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      router.push('/admin/reservations');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      setErrors(error.response.data);
      setIsAlertOpened(true);
    }
    setIsLoading(false);
  };

  return (
    <Box marginY={7} display="flex" flexDirection="column">
      {isLoading ? (
        <CircularProgress sx={{ color: '#195A00', marginX: 'auto' }} />
      ) : (
        <>
          <Snackbar
            open={isAlertOpened}
            autoHideDuration={6000}
            anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
          >
            <Alert
              severity="error"
              sx={{ backgroundColor: '#D23030', color: '#FFFFFF' }}
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
              {errors?.message}
            </Alert>
          </Snackbar>
          <Box
            display="flex"
            flexDirection="column"
            maxWidth={700}
            marginX="auto"
            border={1}
            borderColor="#B6BCA4"
            borderRadius={2}
            marginY={3}
          >
            <Typography variant="h5" margin={3}>
              Detail Pesanan
            </Typography>
            <Box sx={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', paddingX: 15, marginBottom: 2,
            }}
            >
              <Table>
                <TableBody>
                  {reservationData && Object.keys(reservationData).map((key) => (
                    <TableRow key={key}>
                      <TableCell>
                        <Typography variant="body1" sx={{ color: '#195A00' }}>
                          {key}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1" fontWeight={600} sx={{ color: '#195A00' }}>
                          {reservationData[key]}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {validStatus.includes(status) && (
              <>
                <SelectInput
                  label="Status Pemesanan"
                  value={tempStatus}
                  onChange={(e) => setTempStatus(e.target.value)}
                  lists={lists}
                />
                <LoadingButton
                  loading={isLoading}
                  disabled={isLoading}
                  className={classes.button}
                  onClick={() => handleAction(tempStatus)}
                >
                  Update Status Pesanan
                </LoadingButton>
              </>
              )}
            </Box>
          </Box>
          {paymentAttachment && (
          <Box
            display="flex"
            flexDirection="column"
            maxWidth={700}
            marginX="auto"
            border={1}
            borderColor="#B6BCA4"
            borderRadius={2}
            marginY={3}
          >
            <Typography variant="h5" margin={3}>
              Detail Pembayaran
            </Typography>
            <Box sx={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', paddingX: 15, marginBottom: 2,
            }}
            >
              <Table>
                <TableBody>
                  {paymentData && Object.keys(paymentData).map((key) => (
                    <TableRow key={key}>
                      <TableCell>
                        <Typography variant="body1" sx={{ color: '#195A00' }}>
                          {key}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1" fontWeight={600} sx={{ color: '#195A00' }}>
                          {paymentData[key]}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                  {paymentAttachment && (
                  <TableRow>
                    <TableCell>
                      <Typography variant="body1" sx={{ color: '#195A00' }}>
                        Bukti Pembayaran
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Image
                        src={paymentAttachment}
                        alt="Red dot"
                        width={100}
                        height={100}
                      />
                    </TableCell>
                  </TableRow>
                  )}
                </TableBody>
              </Table>
            </Box>
          </Box>
          )}
        </>
      )}
    </Box>
  );
}
