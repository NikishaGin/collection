import React, { useState } from 'react';
import { 
  Select, 
  MenuItem, 
  FormControl, 
  Box, 
  Chip,
  IconButton 
} from '@mui/material';
import { Clear, ExpandMore } from '@mui/icons-material';

const SelectCell = ({ value, options, onChange, error }) => {
  const [open, setOpen] = useState(false);

  const handleChange = (event) => {
    onChange(event.target.value);
  };

  const handleClear = (event) => {
    event.stopPropagation();
    onChange(null);
  };

  return (
    <Box 
      sx={{ 
        width: '100%',
        ...(error && {
          backgroundColor: '#ffebee',
          borderRadius: 1,
          border: '1px solid #f44336',
        })
      }}
    >
      <FormControl fullWidth size="small">
        <Select
          value={value || ''}
          onChange={handleChange}
          open={open}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          variant="standard"
          disableUnderline
          displayEmpty
          IconComponent={() => (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, pr: 1 }}>
              {value && (
                <IconButton
                  size="small"
                  onClick={handleClear}
                  sx={{ p: 0.5 }}
                >
                  <Clear fontSize="small" />
                </IconButton>
              )}
              <ExpandMore fontSize="small" />
            </Box>
          )}
          renderValue={(selected) => {
            if (!selected) {
              return <span style={{ color: '#999', fontSize: '0.875rem' }}>Выберите...</span>;
            }
            const option = options.find(opt => opt.value === selected);
            return (
              <Chip 
                label={option?.label || selected} 
                size="small" 
                variant="outlined"
                color="primary"
                sx={{ height: 24, fontSize: '0.75rem' }}
              />
            );
          }}
          sx={{
            '& .MuiSelect-select': {
              padding: '4px 8px',
              fontSize: '0.875rem',
            },
          }}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default SelectCell;