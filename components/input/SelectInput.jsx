import React from 'react';

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

export default function SelectInput(props) {
  const {
    label, value, lists, onChange, isLoading,
  } = props;
  if (!lists.includes(value)) {
    lists.push(value);
  }

  return (
    <FormControl required fullWidth>
      <InputLabel id="demo-simple-select-required-label">{label}</InputLabel>
      <Select
        labelId="demo-simple-select-required-label"
        id="demo-simple-select-required"
        value={value}
        label={label}
        onChange={onChange}
        disabled={isLoading}
      >
        {lists?.map((list) => (
          <MenuItem value={list}>{list}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
