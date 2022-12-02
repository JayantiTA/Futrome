import React from 'react';
import Image from 'next/image';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import PhoneIcon from '@mui/icons-material/Phone';
import PinDropIcon from '@mui/icons-material/PinDrop';
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

export default function Contact() {
  const classes = useStyles();

  return (
    <>
      <Navbar />
      <Box sx={{
        display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', my: 5,
      }}
      >
        <Card sx={{ boxShadow: 'none', maxWidth: 600, margin: 10 }}>
          <Typography variant="h3" fontWeight={700} sx={{ color: '#195A00', mb: 4 }}>Hubungi Kami</Typography>
          <Typography variant="h6" sx={{ my: 2 }}>
            <PhoneIcon />
            &nbsp;081233294689
          </Typography>
          <Typography variant="h6" sx={{ my: 2 }}>
            <PinDropIcon />
            &nbsp;Futrome Hills
          </Typography>
          <Typography variant="h6" sx={{ my: 2 }}>
            Jln. Keputih No. 100, Surabaya
          </Typography>
          <Button className={classes.button} href="https://wa.me/6281233294689">
            Kirim Pesan
          </Button>
        </Card>
        <Image src="/images/image_contact.svg" width={450} height={450} />
      </Box>
      <Footer />
    </>
  );
}
