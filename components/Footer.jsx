import React from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function Footer() {
  return (
    <Box sx={{
      display: 'flex',
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#195A00',
      padding: 2,
      marginTop: 15,
    }}
    >
      <Typography variant="h7" sx={{ color: '#FFFFFF' }}>&#169;&nbsp;Futrome 2022</Typography>
    </Box>
  );
}
