import React, { useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TextField, Box, IconButton } from '@mui/material';
import { CalendarToday, Clear } from '@mui/icons-material';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';

dayjs.locale('ru');

const DateCell = ({ value, onChange, error }) => {
  const [open, setOpen] = useState(false);

  const handleDateChange = (newValue) => {
    onChange(newValue ? newValue.format('YYYY-MM-DD') : null);
  };

  const handleClear = () => {
    onChange(null);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
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
        <DatePicker
          value={value ? dayjs(value) : null}
          onChange={handleDateChange}
          open={open}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="standard"
              size="small"
              fullWidth
              InputProps={{
                ...params.InputProps,
                disableUnderline: true,
                endAdornment: null,
              }}
              sx={{
                '& .MuiInputBase-input': {
                  padding: '4px 8px',
                  fontSize: '0.8125rem',
                  fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, monospace',
                  cursor: 'pointer',
                },
              }}
              onClick={() => setOpen(true)}
              readOnly
            />
          )}
        />
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <IconButton
            size="small"
            onClick={() => setOpen(true)}
            sx={{ 
              p: 0.5,
              '&:hover': { bgcolor: 'action.hover' }
            }}
          >
            <CalendarToday sx={{ fontSize: '1rem', color: 'text.secondary' }} />
          </IconButton>
          {value && (
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
      </Box>
    </LocalizationProvider>
  );
};

export default DateCell;