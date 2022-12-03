import React from 'react';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { makeStyles } from '@mui/styles';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const useStyles = makeStyles((theme) => ({
  button: {
    backgroundColor: theme.palette.green.main,
    color: theme.palette.white.main,
    padding: '0.5rem 1.5rem',
    textTransform: 'none',
    fontSize: 17,
    marginLeft: '60%',
    '&:hover': {
      backgroundColor: theme.palette.green.hover,
    },
  },
}));

export default function PaymentMethod() {
  const classes = useStyles();
  const bankTransfer = [
    {
      name: 'Mandiri Transfer',
      number: '1234567890',
    },
    {
      name: 'BCA Transfer',
      number: '1234567890',
    },
    {
      name: 'BNI Transfer',
      number: '1234567890',
    },
    {
      name: 'BRI Transfer',
      number: '1234567890',
    },
    {
      name: 'BSI Transfer',
      number: '1234567890',
    },
  ];

  return (
    <>
      <Navbar />
      <Box marginY={7}>
        <Box sx={{
          borderBottom: 1, borderColor: 'divider', maxWidth: 400, mx: 'auto', display: 'flex', justifyContent: 'center',
        }}
        >
          <Typography variant="h4" fontWeight={700} sx={{ color: '#195A00', my: 2, mx: 'auto' }}>
            Jenis Pembayaran
          </Typography>
        </Box>
        <Box border={1} borderColor="#B6BCA4" maxWidth={700} borderRadius={5} marginX="auto" marginY={5}>
          <Box sx={{
            display: 'flex', alignItems: 'center', paddingX: 15,
          }}
          >
            <Table>
              <TableBody>
                {bankTransfer.map((bank) => (
                  <TableRow>
                    <TableCell>
                      <Typography variant="h6" sx={{ color: '#333333', my: 2 }}>
                        {bank.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="h6" fontWeight={700} sx={{ color: '#195A00', my: 2 }}>
                        {bank.number}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </Box>
        <Button variant="contained" className={classes.button}>
          Kembali ke pesanan
        </Button>
      </Box>
      <Footer />
    </>
  );
}
