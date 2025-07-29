import React, { useState, useEffect } from 'react';
import { TextField, Box, IconButton } from '@mui/material';
import { Clear, Link } from '@mui/icons-material';

const TextCell = ({ value, onChange, error, placeholder }) => {
  const [localValue, setLocalValue] = useState(value || '');

  useEffect(() => {
    setLocalValue(value || '');
  }, [value]);

  const handleChange = (event) => {
    setLocalValue(event.target.value);
  };

  const handleBlur = () => {
    onChange(localValue);
  };

  const handleClear = () => {
    setLocalValue('');
    onChange('');
  };

  const isUrl = localValue && (localValue.startsWith('http://') || localValue.startsWith('https://'));

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        width: '100%',
        minHeight: 32,
        ...(error && {
          backgroundColor: '#fef2f2',
          borderRadius: 1,
          border: '1px solid #fecaca',
        })
      }}
    >
      <TextField
        value={localValue}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        variant="standard"
        size="small"
        fullWidth
        InputProps={{
          disableUnderline: true,
          startAdornment: isUrl && <Link sx={{ fontSize: '1rem', mr: 0.5, color: 'primary.main' }} />,
        }}
        sx={{
          '& .MuiInputBase-input': {
            padding: '4px 8px',
            fontSize: '0.8125rem',
            ...(isUrl && {
              fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, monospace',
            }),
          },
        }}
      />
      {localValue && (
        <IconButton
          size="small"
          onClick={handleClear}
          sx={{ 
            p: 0.5,
            '&:hover': { bgcolor: 'action.hover' }
          }}
        >
          <Clear sx={{ fontSize: '1rem', color: 'text.secondary' }} />
        </IconButton>
      )}
    </Box>
  );
};

export default TextCell;