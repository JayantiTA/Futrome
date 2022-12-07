import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import clsx from 'clsx';
import axios from 'axios';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import Chip from '@mui/material/Chip';
import SouthIcon from '@mui/icons-material/South';
import CircularProgress from '@mui/material/CircularProgress';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import Tab from '@mui/material/Tab';
import TabPanel from '@mui/lab/TabPanel';
import { makeStyles } from '@mui/styles';

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'IDR',
});

const useStyles = makeStyles((theme) => ({
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
      <Chip label="available" sx={{ backgroundColor: '#195A00', margin: 2, color: '#FFFFFF' }} />
      <Chip label="selected" sx={{ backgroundColor: '#707957', margin: 2, color: '#FFFFFF' }} />
      <Chip label="unavailable" sx={{ backgroundColor: '#B6BCA4', margin: 2 }} />
      <Box display="flex" flexDirection="row" width={1350} marginX="auto" border={1} borderColor="#B6BCA4" borderRadius={2}>
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

export default function Invoice() {
  const classes = useStyles();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [currentGrave, setCurrentGrave] = useState({});
  const [gravesData, setGravesData] = useState([]);
  const [value, setValue] = useState(router.query?.value || 'single');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleReserve = (id) => {
    setIsLoading(true);
    router.push({ pathname: '/reserve', query: { id } });
  };

  const getData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/api/graves');
      setGravesData(response.data.data.graves);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getData();
    setCurrentGrave({});
    router.replace({ query: { ...router.query, value } });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const graves = gravesData.map((grave) => ({
    component: Button,
    location: grave.location,
    type: grave.type,
    props: {
      disabled: grave.status === 'reserved' || grave.type !== value,
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
        [classes.disabledButton]: grave.status === 'reserved' || grave.type !== value,
        [classes.selectedButton]: currentGrave.location === grave.location,
      }),
    },
  }));

  return (
    <Box marginY={7} display="flex" flexDirection="column" alignItems="center" minHeight="100vh">
      <TabContext value={value}>
        {isLoading ? (
          <CircularProgress sx={{ color: '#195A00', marginX: 'auto' }} />
        ) : (
          <>
            <Box sx={{
              borderBottom: 1, borderColor: 'divider', maxWidth: 350, display: 'flex', justifyContent: 'center', marginX: 'auto',
            }}
            >
              <TabList
                onChange={handleChange}
                aria-label="lab API tabs example"
                className={classes.tabList}
              >
                <Tab label="Single" value="single" />
                <Tab label="Semi Private" value="semi private" />
                <Tab label="Private" value="private" />
              </TabList>
            </Box>
            <TabPanel value="single">
              <GravesPosition graves={graves} />
            </TabPanel>
            <TabPanel value="semi private">
              <GravesPosition graves={graves} />
            </TabPanel>
            <TabPanel value="private">
              <GravesPosition graves={graves} />
            </TabPanel>
          </>
        )}
      </TabContext>
      {currentGrave.price && (
      <Box width={500} marginX="auto" border={1} borderColor="#B6BCA4" borderRadius={2} padding={2}>
        <Typography variant="h5">Harga</Typography>
        <Typography variant="h4" fontWeight={700}>{formatter.format(currentGrave.price)}</Typography>
        <Typography variant="h5">Location</Typography>
        <Typography variant="h4" fontWeight={600}>{currentGrave.location}</Typography>
        <Typography variant="body1">{currentGrave.description}</Typography>
        <LoadingButton
          loading={isLoading}
          disabled={isLoading}
          className={classes.button}
          onClick={() => handleReserve(currentGrave._id)}
        >
          <Typography variant="h6">Pesan</Typography>
        </LoadingButton>
      </Box>
      )}
    </Box>
  );
}
