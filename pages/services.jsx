import React from 'react';
import Image from 'next/image';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const useStyles = makeStyles((theme) => ({
  button: {
    backgroundColor: theme.palette.green.main,
    color: theme.palette.white.main,
    padding: '0.5rem 1.5rem',
    textTransform: 'none',
    fontSize: 23,
    marginTop: 30,
    '&:hover': {
      backgroundColor: theme.palette.green.hover,
    },
  },
}));

export default function Services() {
  const classes = useStyles();

  return (
    <>
      <Navbar />
      <Box sx={{
        display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', my: 7,
      }}
      >
        <Card sx={{ boxShadow: 'none', maxWidth: 450, mx: 10 }}>
          <Typography fontWeight={700} variant="h4" sx={{ color: '#195A00', my: 2 }}>
            Berikan Persembahan Terbaik Anda Pada Orang Terkasih yang Telah Berpulang
          </Typography>
          <Typography variant="h7" sx={{ my: 2 }}>
            Konsep baru sebuah taman pemakaman unik, terawat, mudah, dan terpadu yang
            dilengkapi dengan fasilitas lengkap pemakaman.
          </Typography>
        </Card>
        <Image src="/images/image_services2.svg" width={450} height={450} />
      </Box>
      <Box maxWidth={500} textAlign="center" marginX="auto" marginTop={15}>
        <Typography variant="h4" fontWeight={600} color="#4F4F4F">
          Hanya 4 Langkah untuk Memesan Lahan Pemakaman
        </Typography>
      </Box>
      <Box marginBottom={15} marginLeft={12}>
        <Grid container spacing={2} marginY={5}>
          <Grid item xs={12} md={3}>
            <Card sx={{ boxShadow: 'none', maxWidth: 250 }}>
              <Typography variant="h1" fontWeight={700} sx={{ color: '#D1D6D0' }}>01</Typography>
              <Typography variant="h4" color="#195A00" sx={{ my: 2 }}>
                Pilih tipe lahan pemakaman
              </Typography>
              <Typography variant="h7">
                Tersedia 3 tipe yang tersedia, yaitu Single, Semi-Private, dan Private
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ boxShadow: 'none', maxWidth: 250 }}>
              <Typography variant="h1" fontWeight={700} sx={{ color: '#D1D6D0' }}>02</Typography>
              <Typography variant="h4" color="#195A00" sx={{ my: 2 }}>
                Pilih letak lahan pemakaman
              </Typography>
              <Typography variant="h7">
                Memilih letak lahan pemakaman pada peta yang tesedia
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ boxShadow: 'none', maxWidth: 250 }}>
              <Typography variant="h1" fontWeight={700} sx={{ color: '#D1D6D0' }}>03</Typography>
              <Typography variant="h4" color="#195A00" sx={{ my: 2 }}>
                Pengisian data identitas
              </Typography>
              <Typography variant="h7">
                Pengisian data identitas dan perjanjian jual-beli
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ boxShadow: 'none', maxWidth: 250 }}>
              <Typography variant="h1" fontWeight={700} sx={{ color: '#D1D6D0' }}>04</Typography>
              <Typography variant="h4" color="#195A00" sx={{ my: 2 }}>
                Pilih metode pembayaran
              </Typography>
              <Typography variant="h7">
                Pembayaran dapat dilakukan dengan metode transfer dengan pilihan bank yang tersedia
              </Typography>
            </Card>
          </Grid>
        </Grid>
        <Button variant="contained" className={classes.button} href="/types">
          Pesan Sekarang
        </Button>
      </Box>
      <Footer />
    </>
  );
}
