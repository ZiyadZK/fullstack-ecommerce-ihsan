'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function CustomSelect({
  label = 'Select',           // Default label
  options = [
    {
      value: 1,
      label: 1
    }
  ],                // Array of options for the dropdown
  value = 1,                       // Selected value
  onChange,                    // Callback for change event
  fullWidth = true,
  size = 'small',
  modalParentId = '' ,
  id = 'select-label'           // Optionally set full width
}) {
  const handleChange = (event) => {
    onChange?.(event.target.value);  // Call onChange if provided
  };

  const modalContainer = modalParentId ? document.getElementById(modalParentId) : undefined;

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth={fullWidth} size={size}>
        <InputLabel id={id}>
          {label}
        </InputLabel>
        <Select
          labelId={id}
          id="custom-select"
          value={value}
          label={label}
          onChange={!onChange ? handleChange : onChange}
          size={size}
          MenuProps={{
            container: modalContainer, // Ensures dropdown renders inside the modal
             // Keeps the dropdown within the modal's DOM
            PaperProps: {
              style: {
                zIndex: 1300, // Adjust to ensure it shows above the modal overlay
              },
            },
          }}
        >
          {options.map((option, index) => (
            <MenuItem 
              key={index} 
              value={option.value}
            >
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
