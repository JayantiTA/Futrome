import React, { useState } from 'react';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import LoadingButton from '@mui/lab/LoadingButton';
import { makeStyles } from '@mui/styles';

import DefaultInput from '../components/input/DefaultInput';

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'IDR',
});

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
  button2: {
    backgroundColor: '#D9D9D9',
    color: theme.palette.green.main,
    padding: '0.5rem 1.5rem',
    textTransform: 'none',
    fontSize: 17,
    margin: '0 auto',
    '&:hover': {
      backgroundColor: theme.palette.grey.light,
    },
  },
}));

export default function PaymentMethod() {
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(false);
  const [buyerData, setBuyerData] = useState({});
  const [graveData, setGraveData] = useState({
    type: 'Single',
    location: 'D1',
    size: 3.75,
    capacity: 1,
    price: 10000000,
  });
  const detailGrave = {
    'Tipe:': graveData.type,
    'Lokasi:': graveData.location,
    'Ukuran:': graveData.size,
    'Kapasitas:': graveData.capacity,
    'Harga:': formatter.format(graveData.price),
  };

  const formInputs = [
    {
      component: DefaultInput,
      props: {
        label: 'Nama Lengkap',
        type: 'text',
        value: buyerData.name,
        onChange: (e) => setBuyerData({ ...buyerData, name: e.target.value }),
        isLoading,
      },
    },
    {
      component: DefaultInput,
      props: {
        label: 'Nomor KTP',
        type: 'text',
        value: buyerData.ktp,
        onChange: (e) => setBuyerData({ ...buyerData, ktp: e.target.value }),
        isLoading,
      },
    },
    {
      component: DefaultInput,
      props: {
        label: 'Nomor HP',
        type: 'text',
        value: buyerData.phone,
        onChange: (e) => setBuyerData({ ...buyerData, phone: e.target.value }),
        isLoading,
      },
    },
  ];

  const handleSubmit = (event) => {
    event.preventDefault();
    try {
      setIsLoading(true);
    } catch {
      setIsLoading(false);
    }
  };

  return (
    <Box marginY={7}>
      <Box sx={{
        borderBottom: 1, borderColor: 'divider', maxWidth: 400, mx: 'auto', display: 'flex', justifyContent: 'center',
      }}
      >
        <Typography variant="h4" fontWeight={700} sx={{ color: '#195A00', my: 1, mx: 'auto' }}>
          Data Pemesan
        </Typography>
      </Box>
      <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" maxWidth={700} marginX="auto" marginTop={3}>
        {formInputs.map((input) => (
          <input.component {...input.props} />
        ))}
        <Box border={1} borderColor="#B6BCA4" borderRadius={2} marginY={5}>
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
              </TableBody>
            </Table>
          </Box>
          <Box marginY={3} marginLeft="50%">
            <Typography variant="body1">
              Total Tagihan
            </Typography>
            <Typography variant="h4" sx={{ color: '#195A00' }}>
              {formatter.format(graveData.price)}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex' }}>
          <Button variant="contained" className={classes.button2} href="/payment_method">
            Jenis Pembayaran
          </Button>
          <LoadingButton variant="contained" type="submit" className={classes.button} loading={isLoading} disabled={isLoading}>
            Bayar
          </LoadingButton>
        </Box>
      </Box>
    </Box>
  );
}
