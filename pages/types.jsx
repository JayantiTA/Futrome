import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tab from '@mui/material/Tab';
import Button from '@mui/material/Button';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  button: {
    backgroundColor: theme.palette.green.main,
    color: theme.palette.white.main,
    padding: '0.5rem 1rem',
    textTransform: 'none',
    fontSize: 17,
    marginTop: 30,
    '&:hover': {
      backgroundColor: theme.palette.green.hover,
    },
  },
  tabList: {
    '& .MuiTabs-indicator': {
      backgroundColor: '#195A00',
      color: '#195A00',
    },
    '& .MuiTab-root': {
      color: '#333333',
      textTransform: 'none',
      fontSize: 20,
      padding: 2,
    },
    '& .Mui-selected': {
      color: '#195A00',
    },
  },
}));

export default function Types() {
  const classes = useStyles();
  const router = useRouter();
  const [value, setValue] = useState('single');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleAction = (tabValue) => {
    router.push({ pathname: '/graves', query: { value: tabValue } });
  };

  return (
    <Box sx={{
      width: '100%', marginY: 5,
    }}
    >
      <TabContext value={value}>
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
          <Box sx={{
            display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center', marginX: 'auto',
          }}
          >
            <Image src="/images/image_single.svg" width={500} height={400} />
            <Box maxWidth={350} marginX={10}>
              <Typography>
                Tipe single adalah tipe pemakaman yang paling murah dan paling banyak
                digunakan. Tipe ini berukuran 1,5x2,6 meter2 dan dapat menampung
                maksimal 1 orang. Harga untuk tipe ini sebesar Rp 50.000.000,-.
              </Typography>
              <Button className={classes.button} onClick={() => handleAction(value)}>
                Cek Ketersediaan
              </Button>
            </Box>
          </Box>
        </TabPanel>
        <TabPanel value="semi private">
          <Box sx={{
            display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center', marginX: 'auto',
          }}
          >
            <Box maxWidth={400} marginX={10} textAlign="right">
              <Typography>
                Tipe semi private adalah tipe pemakaman yang cocok untuk keluarga kecil atau
                pasangan. Tipe ini berukuran 2,6x5 meter2 dan dapat menampung
                sebanyak 2-3 orang. Harga untuk tipe ini sebesar Rp 150.000.000,-.
              </Typography>
              <Button className={classes.button} onClick={() => handleAction(value)}>
                Cek Ketersediaan
              </Button>
            </Box>
            <Image src="/images/image_semiprivate.svg" width={500} height={400} />
          </Box>
        </TabPanel>
        <TabPanel value="private">
          <Box sx={{
            display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center', marginX: 'auto',
          }}
          >
            <Image src="/images/image_private.svg" width={500} height={400} />
            <Box maxWidth={350} marginX={10}>
              <Typography>
                Tipe private adalah tipe pemakaman yang cocok untuk keluarga besar
                atau kelompok orang. Tipe ini berukuran 5,2x10 meter2 dan dapat menampung
                maksimal 12 orang. Harga untuk sebesar dari Rp 600.000.000,-.
              </Typography>
              <Button className={classes.button} onClick={() => handleAction(value)}>
                Cek Ketersediaan
              </Button>
            </Box>
          </Box>
        </TabPanel>
      </TabContext>
    </Box>
  );
}
