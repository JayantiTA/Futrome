import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import LoadingButton from '@mui/lab/LoadingButton';
import { makeStyles } from '@mui/styles';

import DefaultInput from '../components/input/DefaultInput';
import FileInput from '../components/input/FileInput';
import SelectInput from '../components/input/SelectInput';

import { useAuthStore } from '../store/store';

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

function ModalConfirmation(props) {
  const {
    open, handleClose, handleConfirm, isLoading,
  } = props;

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        backgroundColor="#B6BCA4"
        maxWidth={450}
        borderRadius={2}
        padding={2}
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <Typography variant="h6">Anda yakin ingin membatalkan pesanan?</Typography>
        <LoadingButton
          sx={{
            backgroundColor: '#195A00', color: '#FFFFFF', textTransform: 'none', margin: 1, float: 'right',
          }}
          onClick={handleConfirm}
          loading={isLoading}
          disabled={isLoading}
        >
          Batalkan Pesanan
        </LoadingButton>
        <Button
          sx={{
            backgroundColor: '#D9D9D9', color: '#4A4A4A', textTransform: 'none', margin: 1, float: 'right',
          }}
          onClick={handleClose}
        >
          Kembali

        </Button>
      </Box>
    </Modal>
  );
}

export default function Pay() {
  const classes = useStyles();
  const router = useRouter();
  const session = useAuthStore((state) => state.session);
  const [isLoading, setIsLoading] = useState(false);
  const [showModalCofirmation, setShowModalCofirmation] = useState(false);
  const [errorFileInput, setErrorFileInput] = useState('');
  const [paymentData, setPaymentData] = useState({});
  const [reservationData, setReservationData] = useState({});
  let uploadedImage = '';

  const getData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/api/reservations/${router.query?.id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });
      setReservationData(response.data.data.reservation);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  function handleUploadImage(images) {
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
  }

  const handleShowConfirmation = () => {
    setShowModalCofirmation(!showModalCofirmation);
  };

  const handleCancel = async () => {
    try {
      setIsLoading(true);
      await axios.post('/api/reservations/cancel', {
        _id: router.query?.id,
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });
      router.push('/profile');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
    setIsLoading(false);
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
        _id: reservationData._id,
        data: {
          ...paymentData, attachment: uploadedImage,
        },
      };
      axios.post('/api/reservations/pay', body, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });
      router.push('/profile');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
    setIsLoading(false);
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
            {formatter.format(reservationData.grave?.price)}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex' }}>
          <Button variant="contained" className={classes.button2} onClick={() => handleShowConfirmation()}>
            Batalkan Pesanan
          </Button>
          <LoadingButton variant="contained" type="submit" className={classes.button} loading={isLoading} disabled={isLoading}>
            Konfirmasi
          </LoadingButton>
        </Box>
      </Box>
      <ModalConfirmation
        open={showModalCofirmation}
        handleClose={handleShowConfirmation}
        handleConfirm={handleCancel}
        isLoading={isLoading}
      />
    </Box>
  );
}
