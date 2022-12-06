import React from 'react';

import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => ({
  helperText: {
    color: '#FF5757',
    textAlign: 'left',
    fontSize: 12,
  },
}));

export default function FileInput(props) {
  const classes = useStyles();
  const {
    label, value, onChange, isLoading, error,
  } = props;

  return (
    <Box sx={{
      border: 1,
      borderColor: '#CDCDCD',
      borderRadius: 1,
      padding: 2,
      marginTop: 1,
      '&:hover': { borderColor: '#000000' },
    }}
    >
      <InputLabel>{label}</InputLabel>
      <FormControl variant="filled" required>
        <input
          accept="image/png, image/jpeg, image/jpg"
          id="raised-button-file"
          disabled={isLoading}
          onChange={onChange}
          value={value}
          type="file"
        />
      </FormControl>
      <Typography className={classes.helperText}>{error}</Typography>
    </Box>
  );
}
