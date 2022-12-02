import React from 'react';
import Image from 'next/image';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const useStyles = makeStyles((theme) => ({
  button: {
    backgroundColor: theme.palette.green.main,
    color: theme.palette.white.main,
    padding: '0.5rem 1rem',
    textTransform: 'none',
    fontSize: 17,
    marginTop: 30,
    '&:hover': {
      backgroundColor: theme.palette.green.hover,
    },
  },
}));

export default function Home() {
  const classes = useStyles();

  return (
    <>
      <Navbar />
      <Box sx={{
        display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', my: 10,
      }}
      >
        <Card sx={{ boxShadow: 'none', maxWidth: 600, margin: 5 }}>
          <Typography variant="h6" sx={{ fontFamily: 'Miniver', color: '#195A00' }}>Futrome</Typography>
          <Typography fontWeight={700} variant="h3">
            Persiapkan rumah masa
            depan dari sekarang
          </Typography>
          <Typography variant="h6" sx={{ my: 2 }}>
            Konsep baru sebuah taman pemakaman Islam unik dan terpadu
            kini hadir di Indonesia.
          </Typography>
          <Button className={classes.button} href="/types">
            Pesan Sekarang
          </Button>
        </Card>
        <Image src="/images/image_home.svg" width={450} height={450} />
      </Box>
      <Footer />
    </>
  );
}
