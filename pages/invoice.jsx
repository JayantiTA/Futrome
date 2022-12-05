import React, { useState } from 'react';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'IDR',
});

export default function Invoice() {
  const [reservationData, setReservationData] = useState({
    grave: {
      type: 'Single',
      location: 'D1',
      size: 3.75,
      capacity: 1,
      price: 10000000,
    },
    status: 'Paid',
  });
  const detailGrave = {
    'Tipe:': reservationData.grave.type,
    'Lokasi:': reservationData.grave.location,
    'Ukuran:': reservationData.grave.size,
    'Kapasitas:': reservationData.grave.capacity,
    'Harga:': formatter.format(reservationData.grave.price),
  };

  return (
    <Box marginY={7}>
      <Box sx={{
        borderBottom: 1, borderColor: 'divider', maxWidth: 400, mx: 'auto', display: 'flex', justifyContent: 'center',
      }}
      >
        <Typography variant="h4" fontWeight={700} sx={{ color: '#195A00', my: 1, mx: 'auto' }}>
          Invoice
        </Typography>
      </Box>
      <Box display="flex" flexDirection="column" maxWidth={700} marginX="auto" marginTop={3}>
        <Box border={1} borderColor="#B6BCA4" borderRadius={2} marginY={3}>
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
                <TableRow key="status">
                  <TableCell>
                    <Typography variant="body1" sx={{ color: '#195A00' }}>
                      Status
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" fontWeight={600} sx={{ color: '#195A00' }}>
                      {reservationData.status}
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>
          <Box marginY={3} marginLeft="50%">
            <Typography variant="body1">
              Total Bayar
            </Typography>
            <Typography variant="h4" sx={{ color: '#195A00' }}>
              {formatter.format(reservationData.grave.price)}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
