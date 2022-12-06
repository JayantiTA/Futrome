import React from 'react';

import TextField from '@mui/material/TextField';

export default function DefaultInput(props) {
  const {
    label, type, value, onChange, error, isLoading, autoFocus,
  } = props;

  return (
    <TextField
      focused
      error={error}
      helperText={error}
      margin="normal"
      required
      fullWidth
      label={label}
      type={type}
      value={value}
      autoFocus={autoFocus}
      onChange={onChange}
      disabled={isLoading}
    />
  );
}
