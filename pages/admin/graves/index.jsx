import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import clsx from 'clsx';
import axios from 'axios';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import SouthIcon from '@mui/icons-material/South';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { makeStyles } from '@mui/styles';

import Sidebar from '../../../components/Sidebar';

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'IDR',
});

const useStyles = makeStyles((theme) => ({
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
    margin: 1,
    padding: '0.5rem',
    textTransform: 'none',
    fontSize: 15,
    marginTop: 10,
    '&:hover': {
      backgroundColor: theme.palette.green.hover,
    },
  },
  singleButton: {
    padding: '2rem 1rem',
  },
  privateButton: {
    padding: '5rem 11.7rem',
  },
  semiPrivateButton: {
    padding: '2rem 5.5rem',
  },
  selectedButton: {
    backgroundColor: theme.palette.green.hover,
  },
  disabledButton: {
    backgroundColor: theme.palette.green.light,
  },
  tabList: {
    '& .MuiTabs-indicator': {
      backgroundColor: theme.palette.green.main,
      color: theme.palette.green.main,
    },
    '& .MuiTab-root': {
      color: '#333333',
      textTransform: 'none',
      fontSize: 20,
      padding: 2,
    },
    '& .Mui-selected': {
      color: theme.palette.green.main,
    },
  },
}));

function GravesPosition(props) {
  const { graves } = props;

  const filterGrave = (type, block) => {
    // eslint-disable-next-line max-len
    const filteredGraves = graves.filter((grave) => grave.type === type && grave.location.includes(block));
    filteredGraves.sort((a, b) => a.location.slice(1) - b.location.slice(1));
    return filteredGraves;
  };

  return (
    <>
      <Box display="flex" flexDirextion="row">
        <Chip label="available" sx={{ backgroundColor: '#195A00', margin: 2, color: '#FFFFFF' }} />
        <Chip label="selected" sx={{ backgroundColor: '#707957', margin: 2, color: '#FFFFFF' }} />
        <Chip label="unavailable" sx={{ backgroundColor: '#B6BCA4', margin: 2 }} />
      </Box>
      <Box display="flex" flexDirection="row" width={1350} marginX="auto" border={1} borderColor="#B6BCA4" borderRadius={2} marginBottom={5}>
        <Box display="flex" flexDirection="column" width={1100}>
          <Box marginY={1}>
            {filterGrave('single', 'G').map((grave) => (
              <grave.component {...grave.props}>{grave.location}</grave.component>
            ))}
          </Box>
          <Box marginY={1}>
            {filterGrave('single', 'F').map((grave) => (
              <grave.component {...grave.props}>{grave.location}</grave.component>
            ))}
          </Box>
          <Box marginY={1}>
            {filterGrave('single', 'E').map((grave) => (
              <grave.component {...grave.props}>{grave.location}</grave.component>
            ))}
          </Box>
          <Box marginY={1}>
            {filterGrave('single', 'D').map((grave) => (
              <grave.component {...grave.props}>{grave.location}</grave.component>
            ))}
          </Box>
          <Box backgroundColor="#B6BCA4" width={100} margin={2} borderRadius={2} padding={1}>
            <Typography>
              <SouthIcon fontSize="large" />
              {' '}
              Kiblat
            </Typography>
          </Box>
        </Box>
        <Box>
          <Box marginY={1}>
            {filterGrave('semi private', 'C').map((grave) => (
              <grave.component {...grave.props}>{grave.location}</grave.component>
            ))}
          </Box>
          <Box marginY={2}>
            {filterGrave('semi private', 'B').map((grave) => (
              <grave.component {...grave.props}>{grave.location}</grave.component>
            ))}
          </Box>
          <Box marginY={3}>
            {graves.filter((grave) => grave.type === 'private').map((grave) => (
              <grave.component {...grave.props}>{grave.location}</grave.component>
            ))}
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default function GravesData() {
  const classes = useStyles();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [currentGrave, setCurrentGrave] = useState({});
  const [gravesData, setGravesData] = useState([]);
  const [isAlertOpened, setIsAlertOpened] = useState(false);

  const getData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/api/graves');
      setGravesData(response.data.data.graves);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
    setIsAlertOpened(true);
    setIsLoading(false);
  };

  useEffect(() => {
    getData();
    setCurrentGrave({});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const graves = gravesData.map((grave) => ({
    component: Button,
    location: grave.location,
    type: grave.type,
    props: {
      onClick: () => {
        if (currentGrave.location === grave.location) {
          setCurrentGrave({});
        } else {
          setCurrentGrave({ ...grave });
        }
      },
      className: clsx(classes.button, {
        [classes.singleButton]: grave.type === 'single',
        [classes.privateButton]: grave.type === 'private',
        [classes.semiPrivateButton]: grave.type === 'semi private',
        [classes.disabledButton]: grave.status === 'reserved',
        [classes.selectedButton]: currentGrave.location === grave.location,
      }),
    },
  }));

  return (
    <Sidebar>
      <Box display="flex" flexDirection="column" alignItems="center" backgroundColor="#E5EAE2" minHeight="100vh">
        <Typography className={classes.typography}>Graves Page</Typography>
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
        {isLoading ? (
          <CircularProgress sx={{ color: '#195A00', marginX: 'auto' }} />
        ) : (
          <GravesPosition graves={graves} />
        )}
        {currentGrave.price && (
        <Box width={500} marginX="auto" border={1} borderColor="#B6BCA4" borderRadius={2} padding={2} marginY={2}>
          <Typography variant="h5">Harga:</Typography>
          <Typography variant="h4" fontWeight={700}>{formatter.format(currentGrave.price)}</Typography>
          <Typography variant="h5">Lokasi:</Typography>
          <Typography variant="h4" fontWeight={600}>{currentGrave.location}</Typography>
          <Typography variant="body1">{currentGrave.description}</Typography>
          <Typography variant="h5">{`Status: ${currentGrave.status}`}</Typography>
        </Box>
        )}
      </Box>
    </Sidebar>
  );
}
