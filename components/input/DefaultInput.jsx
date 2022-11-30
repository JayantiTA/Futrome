import React from 'react';

import TextField from '@mui/material/TextField';

export default function DefaultInput(props) {
  const {
    label, type, value, onChange, error, isLoading, autofocus,
  } = props;

  return (
    <TextField
      autofocus={autofocus}
      error={error}
      helperText={error}
      margin="normal"
      required
      fullWidth
      label={label}
      type={type}
      value={value}
      onChange={onChange}
      disabled={isLoading}
    />
  );
}
