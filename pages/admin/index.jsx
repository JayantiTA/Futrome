import React from 'react';
import Image from 'next/image';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';

import Sidebar from '../../components/Sidebar';

export default function DashboardAdmin() {
  return (
    <Sidebar>
      <Box sx={{
        display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', my: 10,
      }}
      >
        <Card sx={{ boxShadow: 'none', maxWidth: 500, margin: 5 }}>
          <Typography variant="h6" sx={{ fontFamily: 'Miniver', color: '#195A00' }}>Futrome</Typography>
          <Typography fontWeight={700} variant="h3">
            Halo Admin!
          </Typography>
          <Typography variant="h6" sx={{ my: 2 }}>
            Halaman ini digunakan untuk mengelola data-data yang ada di Futrome.
          </Typography>
        </Card>
        <Image src="/images/image_home.svg" width={450} height={450} />
      </Box>
    </Sidebar>
  );
}
