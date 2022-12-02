import React from 'react';
import Image from 'next/image';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function About() {
  return (
    <>
      <Navbar />
      <Box sx={{
        display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center',
      }}
      >
        <Card sx={{ boxShadow: 'none', maxWidth: 600, margin: 4 }}>
          <Typography variant="h3" fontWeight={700} sx={{ color: '#195A00', my: 3 }}>Tentang Kami</Typography>
          <Typography variant="h6" sx={{ my: 2 }}>
            Pemakaman Futrome adalah sebuah kompleks pemakaman Islam yang dikelola oleh PT Aneka
            Usaha Indonesia. Didirikan pada tahun 2022, Futrome menjadi pemakaman yang memadukan
            konsep pemakaman dengan budaya-budaya Indonesia tanpa melupakan syarat pemakaman secara
            agama.
          </Typography>
          <Typography variant="h6" sx={{ my: 2 }}>
            Pemakaman Futrome dikelola secara profesional, sehingga menjadi salah satu taman
            pemakaman yang terbaik di Indonesia. Penataan makam yang dibantu oleh ahlinya dengan
            rapih, serta penyediaan berbagai fasilitas yang memudahkan prosesi pemakaman dan ziarah.
            Selain itu, perawatan lahan makam yang gratis membuat keluarga yang ditinggalkan tidak
            merasa cemas. Akan tetapi, walaupun gratis perawatan rutin yang dilakukan membuat area
            pemakaman ini terlihat bersih, asri, dan indah.
          </Typography>
        </Card>
        <Image src="/images/image_about.svg" width={450} height={450} />
      </Box>
      <Footer />
    </>
  );
}
