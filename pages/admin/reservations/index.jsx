import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import CloseIcon from '@mui/icons-material/Close';
import Alert from '@mui/material/Alert';
import TablePagination from '@mui/material/TablePagination';
import Snackbar from '@mui/material/Snackbar';
import Link from '@mui/material/Link';
import { makeStyles } from '@mui/styles';

import { useAuthStore } from '../../../store/store';
import Sidebar from '../../../components/Sidebar';

const useStyles = makeStyles((theme) => ({
  box: {
    backgroundColor: '#E5EAE2',
    backgroundSize: 'cover',
    minHeight: '100vh',
    padding: '1rem 0',
  },
  typography: {
    margin: '1rem 0',
    color: theme.palette.green.main,
    fontSize: '1.5rem',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  tableHead: {
    backgroundColor: theme.palette.green.main,
    color: theme.palette.white.main,
  },
  tableBody: {
    backgroundColor: '#FFFFFF',
  },
  modalTitle: {
    textAlign: 'center',
    fontSize: '1.5rem',
  },
  modalText: {
    margin: '0.5rem',
  },
}));

export default function ReservationsTable() {
  const classes = useStyles();
  const columns = [
    { json: 'grave', label: 'Grave' },
    { json: 'buyer_id', label: 'Buyer id' },
    { json: 'buyer_data', label: 'Buyer data' },
    { json: 'status', label: 'Status' },
    { json: 'reserved_at', label: 'Reserved at' },
    { json: 'paid_at', label: 'Paid at' },
    { json: 'rejected_at', label: 'Rejected at' },
    { json: 'confirmed_at', label: 'Confirmed at' },
    { json: 'cancelled_at', label: 'Cancelled at' },
    { json: 'done_at', label: 'Done at' },
    { json: 'created_at', label: 'Created at' },
    { json: 'updated_at', label: 'Updated at' },
  ];
  const router = useRouter();
  const session = useAuthStore((state) => state.session);
  const [limit, setLimit] = useState(router.query?.limit || 25);
  const [skip, setSkip] = useState(router.query?.skip || 0);
  const [rows, setRows] = useState([]);
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isAlertOpened, setIsAlertOpened] = useState(false);

  const getData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/api/reservations?skip=${skip}&limit=${limit}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });
      setRows(response.data.data.reservations);
      setCount(response.data.data.total_records);
      router.query = { ...router.query, skip, limit };
      router.push(router);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
    setIsAlertOpened(true);
    setIsLoading(false);
  };

  useEffect(() => {
    getData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skip, limit]);

  const handleChangeRowsPerPage = (event) => {
    setLimit(parseInt(event.target.value, 10));
    setSkip(0);
  };

  return (
    <Sidebar>
      <Box className={classes.box}>
        <Typography className={classes.typography}>Reservations Page</Typography>
        <Snackbar
          open={isAlertOpened}
          autoHideDuration={6000}
          anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        >
          <Alert
            severity="success"
            sx={{ backgroundColor: '#2F7D31', color: '#FFFFFF' }}
            action={(
              <IconButton
                size="small"
                aria-label="close"
                sx={{ color: '#FFFFFF' }}
                onClick={() => {
                  setIsAlertOpened(false);
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            )}
          >
            Success!
          </Alert>
        </Snackbar>
        <Container>
          <TableContainer component={Paper}>
            <Table stickyHeader sx={{ minWidth: 800 }}>
              <TableHead>
                <TableRow>
                  <TableCell className={classes.tableHead}>Id</TableCell>
                  {columns.map((column) => (
                    <TableCell className={classes.tableHead}>{column.label}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody className={classes.tableBody}>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={columns.length + 1} align="center">
                      <CircularProgress sx={{ color: '' }} />
                    </TableCell>
                  </TableRow>
                )
                  : rows.map((row) => (
                    <TableRow
                      key={row._id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell>
                        <Link href={`/admin/reservations/${row._id}`}>
                          {JSON.stringify(row._id)}
                        </Link>
                      </TableCell>
                      {columns.map((column) => (
                        <TableCell>{JSON.stringify(row[column.json])}</TableCell>
                      ))}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <TablePagination
              count={count}
              page={skip}
              onPageChange={(event, newPage) => setSkip(newPage)}
              rowsPerPage={limit}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        </Container>
      </Box>
    </Sidebar>
  );
}
