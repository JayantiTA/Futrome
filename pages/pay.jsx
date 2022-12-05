import React, { useState } from 'react';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import { makeStyles } from '@mui/styles';

import DefaultInput from '../components/input/DefaultInput';
import FileInput from '../components/input/FileInput';
import SelectInput from '../components/input/SelectInput';

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

export default function Pay() {
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(false);
  const [errorFileInput, setErrorFileInput] = useState('');
  const [paymentData, setPaymentData] = useState({});
  const [graveData, setGraveData] = useState({
    type: 'Single',
    location: 'D1',
    size: 3.75,
    capacity: 1,
    price: 10000000,
  });
  let uploadedImage = '';

  const handleUploadImage = (images) => {
    const imageFiles = Array.from(images);
    [...imageFiles].forEach((image) => {
      if (image.size > 5000000) {
        setErrorFileInput('Ukuran file maksimal 5MB');
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        uploadedImage = reader.result;
      };
      reader.readAsDataURL(image);
    });
  };

  const formInputs = [
    {
      component: SelectInput,
      props: {
        label: 'Jenis Pembayaran',
        value: paymentData.bank,
        onChange: (e) => setPaymentData({ ...paymentData, bank: e.target.value }),
        isLoading,
        lists: ['BRI', 'BNI', 'Mandiri', 'BSI', 'BCA'],
      },
    },
    {
      component: DefaultInput,
      props: {
        label: 'Nama',
        type: 'text',
        value: paymentData.bank_account?.name,
        onChange: (e) => setPaymentData({
          ...paymentData,
          bank_account: { ...paymentData.bank_account, name: e.target.value },
        }),
        isLoading,
      },
    },
    {
      component: DefaultInput,
      props: {
        label: 'Nomor Rekening',
        type: 'text',
        value: paymentData.bank_account?.number,
        onChange: (e) => setPaymentData({
          ...paymentData,
          bank_account: { ...paymentData.bank_account, number: e.target.value },
        }),
        isLoading,
      },
    },
    {
      component: FileInput,
      props: {
        label: 'Bukti Pembayaran',
        value: paymentData.attachment,
        onChange: (e) => handleUploadImage(e.target.files),
        isLoading,
        error: errorFileInput,
      },
    },
  ];

  const handleSubmit = (event) => {
    event.preventDefault();
    try {
      setIsLoading(true);
      const body = {
        ...paymentData, attachment: uploadedImage,
      };
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
          Konfirmasi Pembayaran
        </Typography>
      </Box>
      <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" maxWidth={700} marginX="auto" marginTop={3}>
        {formInputs.map((input) => (
          <input.component {...input.props} />
        ))}
        <Box marginY={3}>
          <Typography variant="body1">
            Total Tagihan
          </Typography>
          <Typography variant="h4" sx={{ color: '#195A00' }}>
            {formatter.format(graveData.price)}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex' }}>
          <Button variant="contained" className={classes.button2} href="/payment_method">
            Batalkan Pesanan
          </Button>
          <LoadingButton variant="contained" type="submit" className={classes.button} loading={isLoading} disabled={isLoading}>
            Konfirmasi
          </LoadingButton>
        </Box>
      </Box>
    </Box>
  );
}
