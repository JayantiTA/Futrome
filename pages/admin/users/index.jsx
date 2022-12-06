import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import clsx from 'clsx';

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
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import Collapse from '@mui/material/Collapse';
import Alert from '@mui/material/Alert';
import TablePagination from '@mui/material/TablePagination';
import Modal from '@mui/material/Modal';
import Snackbar from '@mui/material/Snackbar';
import LoadingButton from '@mui/lab/LoadingButton';
import { makeStyles } from '@mui/styles';

import { useAuthStore } from '../../../store/store';
import DefaultInput from '../../../components/input/DefaultInput';
import SelectInput from '../../../components/input/SelectInput';
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
  button: {
    backgroundColor: theme.palette.green.main,
    color: theme.palette.white.main,
    padding: '0.5rem 0.7rem',
    textTransform: 'none',
    fontSize: 15,
    margin: '10px 0',
    float: 'right',
    '&:hover': {
      backgroundColor: theme.palette.green.hover,
    },
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

function ModalConfirmation(props) {
  const {
    user, open, handleClose, postChange,
  } = props;
  const [errors, setErrors] = useState({});
  const [isAlertOpened, setIsAlertOpened] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const accessToken = useAuthStore((state) => state.session?.accessToken);

  const handleDeleteUser = async () => {
    try {
      setIsLoading(true);
      await axios.delete('/api/users', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        data: {
          _id: user._id,
        },
      });
      await postChange();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      setErrors(error.response.data);
      setIsAlertOpened(true);
    }
    handleClose();
    setIsLoading(false);
  };

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
        <Typography variant="h6">Anda yakin ingin menghapus akun ini?</Typography>
        <Collapse in={isAlertOpened}>
          <Alert
            severity="error"
            sx={{ width: '100%' }}
            action={(
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={() => {
                  setIsAlertOpened(false);
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            )}
          >
            {errors?.message}
          </Alert>
        </Collapse>
        <LoadingButton
          sx={{
            backgroundColor: '#195A00', color: '#FFFFFF', textTransform: 'none', margin: 1, float: 'right',
          }}
          onClick={() => handleDeleteUser()}
          loading={isLoading}
          disabled={isLoading}
        >
          Hapus Akun
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

function ModalForm(props) {
  const classes = useStyles();
  const {
    user, open, handleClose, postChange,
  } = props;
  const [currentUser, setCurrentUser] = useState({ ...user });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const accessToken = useAuthStore((state) => state.session?.accessToken);
  const axiosConfig = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  };
  const [isAlertOpened, setIsAlertOpened] = useState(false);

  useEffect(() => {
    const { _id, ...userData } = user;
    setCurrentUser(userData);
    setErrors({});
  }, [user]);

  const handleAction = async (action) => {
    try {
      setIsLoading(true);
      switch (action) {
        case 'create':
          await axios.post('/api/users', {
            ...currentUser,
          }, axiosConfig);
          break;
        case 'update':
          await axios.put('/api/users', {
            _id: user._id,
            data: {
              ...currentUser,
            },
          }, axiosConfig);
          break;
        default:
          break;
      }
      setCurrentUser({});
      handleClose();
      await postChange();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      setErrors(error.response.data);
      setIsAlertOpened(true);
    }
    setIsLoading(false);
  };

  const formInputs = [
    {
      component: DefaultInput,
      props: {
        label: 'Email',
        type: 'email',
        value: currentUser?.email,
        onChange: (event) => setCurrentUser({ ...currentUser, email: event.target.value }),
        error: errors?.errors?.email,
        isLoading,
      },
    },
    {
      component: DefaultInput,
      props: {
        label: 'Username',
        type: 'text',
        value: currentUser?.username,
        onChange: (event) => setCurrentUser({ ...currentUser, username: event.target.value }),
        error: errors?.errors?.username,
        isLoading,
      },
    },
    {
      component: DefaultInput,
      props: {
        label: 'Full Name',
        type: 'text',
        value: currentUser?.full_name,
        onChange: (event) => setCurrentUser({ ...currentUser, full_name: event.target.value }),
        error: errors?.errors?.full_name,
        isLoading,
      },
    },
    {
      component: DefaultInput,
      props: {
        label: 'Phone Number',
        type: 'text',
        value: currentUser?.phone_number,
        onChange: (event) => setCurrentUser({ ...currentUser, phone_number: event.target.value }),
        error: errors?.errors?.phone_number,
        isLoading,
      },
    },
    {
      component: SelectInput,
      props: {
        label: 'Role',
        lists: ['admin', 'user'],
        value: currentUser?.role,
        onChange: (event) => setCurrentUser({ ...currentUser, role: event.target.value }),
        error: errors?.errors?.role,
        isLoading,
      },
    },
  ];

  if (!user._id) {
    formInputs.push({
      component: DefaultInput,
      props: {
        label: 'Password',
        type: 'password',
        onChange: (event) => setCurrentUser({ ...currentUser, password: event.target.value }),
        error: errors?.errors?.password,
        isLoading,
      },
    }, {
      component: DefaultInput,
      props: {
        label: 'Confirm Password',
        type: 'password',
        onChange: (event) => setCurrentUser({
          ...currentUser, confirm_password: event.target.value,
        }),
        error: errors?.errors?.confirm_password,
        isLoading,
      },
    });
  }

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
          overflow: 'scroll',
          display: 'block',
          maxHeight: '100%',
        }}
      >
        <Typography className={clsx(classes.modalText, classes.modalTitle)}>
          {!user._id ? 'Create User' : 'Update User'}
        </Typography>
        <Collapse in={isAlertOpened}>
          <Alert
            severity="error"
            sx={{ width: '100%' }}
            action={(
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={() => {
                  setIsAlertOpened(false);
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            )}
          >
            {errors?.message}
          </Alert>
        </Collapse>
        {formInputs.map((input) => (
          <input.component {...input.props} />
        ))}
        {!user._id ? (
          <LoadingButton
            loading={isLoading}
            onClick={() => handleAction('create')}
            sx={{
              backgroundColor: '#195A00', color: '#FFFFFF', textTransform: 'none', margin: 1, float: 'right',
            }}
          >
            Buat Akun
          </LoadingButton>
        )
          : (
            <LoadingButton
              loading={isLoading}
              onClick={() => handleAction('update')}
              sx={{
                backgroundColor: '#195A00', color: '#FFFFFF', textTransform: 'none', margin: 1, float: 'right',
              }}
            >
              Update Akun
            </LoadingButton>
          )}
        <Button
          onClick={handleClose}
          sx={{
            backgroundColor: '#D9D9D9', color: '#4A4A4A', textTransform: 'none', margin: 1, float: 'right',
          }}
        >
          Kembali
        </Button>
      </Box>
    </Modal>
  );
}

export default function UsersTable() {
  const classes = useStyles();
  const columns = [
    { json: '_id', label: 'Id' },
    { json: 'email', label: 'Email' },
    { json: 'username', label: 'Username' },
    { json: 'full_name', label: 'Full name' },
    { json: 'phone_number', label: 'Phone number' },
    { json: 'role', label: 'Role' },
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
  const [showModalCofirmation, setShowModalCofirmation] = useState(false);
  const [showModalForm, setShowModalForm] = useState(false);
  const [tempUser, setTempUser] = useState({});
  const [isAlertOpened, setIsAlertOpened] = useState(false);

  const getData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/api/users?skip=${skip}&limit=${limit}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });
      setRows(response.data.data.users);
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

  const handleShowForm = (user) => {
    setShowModalForm(!showModalForm);
    setTempUser(user || {});
  };

  const handleShowConfirmation = (user) => {
    setShowModalCofirmation(!showModalCofirmation);
    setTempUser(user || {});
  };

  return (
    <Sidebar>
      <Box className={classes.box}>
        <Typography className={classes.typography}>Users Page</Typography>
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
          <Button className={classes.button} onClick={() => handleShowForm()}>
            <AddIcon />
            Create
          </Button>
          <TableContainer component={Paper}>
            <Table stickyHeader sx={{ minWidth: 800 }}>
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell className={classes.tableHead}>{column.label}</TableCell>
                  ))}
                  <TableCell colSpan={2} align="center" className={classes.tableHead}>Actions</TableCell>
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
                      {columns.map((column) => (
                        <TableCell>{row[column.json]}</TableCell>
                      ))}
                      <TableCell>
                        <IconButton aria-label="edit" onClick={() => handleShowForm(row)}>
                          <EditIcon color="warning" />
                        </IconButton>
                      </TableCell>
                      <TableCell>
                        <IconButton aria-label="delete" onClick={() => handleShowConfirmation(row)}>
                          <DeleteIcon color="error" />
                        </IconButton>
                      </TableCell>
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
        <ModalConfirmation
          open={showModalCofirmation}
          handleClose={handleShowConfirmation}
          user={tempUser}
          postChange={getData}
        />
        <ModalForm
          open={showModalForm}
          handleClose={handleShowForm}
          user={tempUser}
          postChange={getData}
        />
      </Box>
    </Sidebar>
  );
}
