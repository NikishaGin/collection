import React, { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  DataGrid,
} from '@mui/x-data-grid';
import {
  Paper,
  TextField,
  Button,
  Box,
  Typography,
  Chip,
  Alert,
} from '@mui/material';
import {
  Search as SearchIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import { updateRow, setSearchTerm } from '../store/slices/dataSlice';
import { exportToXLSX } from '../utils/exportUtils';
import { validateRow } from '../utils/validationUtils';
import DateCell from './cells/DateCell';
import SelectCell from './cells/SelectCell';
import TextCell from './cells/TextCell';

const DebtCollectionTable = () => {
  const dispatch = useDispatch();
  const { filteredRows, searchTerm, validationErrors } = useSelector(state => state.data);

  const handleCellEdit = useCallback((id, field, value) => {
    dispatch(updateRow({ id, field, value }));
    validateRow(id, filteredRows.find(row => row.id === id), dispatch);
  }, [dispatch, filteredRows]);

  const handleSearchChange = (event) => {
    dispatch(setSearchTerm(event.target.value));
  };

  const handleExport = () => {
    exportToXLSX(filteredRows, 'заявления_о_взыскании_задолженности.xlsx');
  };

  const columns = [
    // Столбцы только для чтения (1-12)
    {
      field: 'taxOfficeCode',
      headerName: 'Код НО (заявление)',
      width: 150,
      editable: false,
      renderCell: (params) => (
        <Chip label={params.value} size="small" variant="outlined" />
      ),
    },
    {
      field: 'currentTaxOfficeCode',
      headerName: 'Текущий Код НО',
      width: 140,
      editable: false,
      renderCell: (params) => (
        <Chip label={params.value} size="small" variant="outlined" />
      ),
    },
    {
      field: 'inn',
      headerName: 'ИНН',
      width: 140,
      editable: false,
      renderCell: (params) => (
        <Typography variant="body2" fontFamily="monospace">
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'registrationCode',
      headerName: 'Код постановки',
      width: 120,
      editable: false,
      renderCell: (params) => (
        <Chip 
          label={params.value ? '1' : '0'} 
          color={params.value ? 'success' : 'default'}
          size="small"
        />
      ),
    },
    {
      field: 'fullName',
      headerName: 'ФИО',
      width: 200,
      editable: false,
    },
    {
      field: 'documentNumber',
      headerName: 'Номер документа',
      width: 150,
      editable: false,
    },
    {
      field: 'documentDate',
      headerName: 'Дата документа',
      width: 130,
      editable: false,
      renderCell: (params) => (
        <Typography variant="body2">
          {new Date(params.value).toLocaleDateString('ru-RU')}
        </Typography>
      ),
    },
    {
      field: 'documentType',
      headerName: 'Вид документа',
      width: 180,
      editable: false,
    },
    {
      field: 'documentAmount',
      headerName: 'Сумма по документу',
      width: 150,
      editable: false,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight="medium">
          {params.value?.toLocaleString('ru-RU')} ₽
        </Typography>
      ),
    },
    {
      field: 'debtBalance',
      headerName: 'Остаток задолженности',
      width: 170,
      editable: false,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight="medium" color="error.main">
          {params.value?.toLocaleString('ru-RU')} ₽
        </Typography>
      ),
    },
    {
      field: 'courtName',
      headerName: 'Наименование суда',
      width: 200,
      editable: false,
    },
    {
      field: 'courtAddress',
      headerName: 'Адрес суда',
      width: 200,
      editable: false,
    },
    
    // Редактируемые столбцы (13-22)
    {
      field: 'courtSentDate',
      headerName: 'Дата отправки в суд',
      width: 160,
      editable: true,
      renderCell: (params) => (
        <DateCell
          value={params.value}
          onChange={(value) => handleCellEdit(params.id, 'courtSentDate', value)}
          error={validationErrors[params.id]?.courtSentDate}
        />
      ),
    },
    {
      field: 'noCourtRequired',
      headerName: 'Не требуется направления',
      width: 180,
      editable: true,
      renderCell: (params) => (
        <SelectCell
          value={params.value}
          options={[
            { value: 'долг погашен', label: 'Долг погашен' },
            { value: 'смерть НП', label: 'Смерть НП' },
            { value: 'выбытие НП за пределы РФ', label: 'Выбытие НП за пределы РФ' },
            { value: 'требуется техкорректировка', label: 'Требуется техкорректировка' },
          ]}
          onChange={(value) => handleCellEdit(params.id, 'noCourtRequired', value)}
          error={validationErrors[params.id]?.noCourtRequired}
        />
      ),
    },
    {
      field: 'applicationStatus',
      headerName: 'Статус приема заявления',
      width: 180,
      editable: true,
      renderCell: (params) => (
        <SelectCell
          value={params.value}
          options={[
            { value: 'получен', label: 'Получен' },
            { value: 'не получен', label: 'Не получен' },
          ]}
          onChange={(value) => handleCellEdit(params.id, 'applicationStatus', value)}
          error={validationErrors[params.id]?.applicationStatus}
        />
      ),
    },
    {
      field: 'receivedDate',
      headerName: 'Дата получения',
      width: 140,
      editable: true,
      renderCell: (params) => (
        <DateCell
          value={params.value}
          onChange={(value) => handleCellEdit(params.id, 'receivedDate', value)}
          error={validationErrors[params.id]?.receivedDate}
        />
      ),
    },
    {
      field: 'courtActType',
      headerName: 'Вид судебного акта',
      width: 180,
      editable: true,
      renderCell: (params) => (
        <SelectCell
          value={params.value}
          options={[
            { value: 'судебный приказ', label: 'Судебный приказ' },
            { value: 'исполнительный лист', label: 'Исполнительный лист' },
            { value: 'определение суда об отмене судебного приказа', label: 'Определение об отмене приказа' },
            { value: 'определение суда о возвращении заявления на вынесение судебного приказа', label: 'Определение о возвращении заявления' },
            { value: 'определение суда об отказе в принятии заявления на вынесение судебного приказа', label: 'Определение об отказе в принятии' },
            { value: 'определение суда о повороте исполнительного производства', label: 'Определение о повороте производства' },
          ]}
          onChange={(value) => handleCellEdit(params.id, 'courtActType', value)}
          error={validationErrors[params.id]?.courtActType}
        />
      ),
    },
    {
      field: 'courtActNumber',
      headerName: 'Номер судебного акта',
      width: 160,
      editable: true,
      renderCell: (params) => (
        <TextCell
          value={params.value}
          onChange={(value) => handleCellEdit(params.id, 'courtActNumber', value)}
          error={validationErrors[params.id]?.courtActNumber}
        />
      ),
    },
    {
      field: 'courtActDate',
      headerName: 'Дата судебного акта',
      width: 150,
      editable: true,
      renderCell: (params) => (
        <DateCell
          value={params.value}
          onChange={(value) => handleCellEdit(params.id, 'courtActDate', value)}
          error={validationErrors[params.id]?.courtActDate}
        />
      ),
    },
    {
      field: 'courtActEffectiveDate',
      headerName: 'Дата вступления в силу',
      width: 170,
      editable: true,
      renderCell: (params) => (
        <DateCell
          value={params.value}
          onChange={(value) => handleCellEdit(params.id, 'courtActEffectiveDate', value)}
          error={validationErrors[params.id]?.courtActEffectiveDate}
        />
      ),
    },
    {
      field: 'courtActSentDate',
      headerName: 'Дата направления акта',
      width: 160,
      editable: true,
      renderCell: (params) => (
        <DateCell
          value={params.value}
          onChange={(value) => handleCellEdit(params.id, 'courtActSentDate', value)}
          error={validationErrors[params.id]?.courtActSentDate}
        />
      ),
    },
    {
      field: 'caseReference',
      headerName: 'Ссылка на дело',
      width: 150,
      editable: true,
      renderCell: (params) => (
        <TextCell
          value={params.value}
          onChange={(value) => handleCellEdit(params.id, 'caseReference', value)}
          error={validationErrors[params.id]?.caseReference}
          placeholder="URL ссылки"
        />
      ),
    },
  ];

  return (
    <Paper elevation={2} sx={{ p: 3, minHeight: '80vh' }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
          Заявления о взыскании задолженности
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <TextField
            placeholder="Поиск по ИНН..."
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: <SearchIcon sx={{ color: 'action.active', mr: 1 }} />,
            }}
            sx={{ minWidth: 250 }}
          />
          
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={handleExport}
            sx={{
              background: 'linear-gradient(45deg, #4caf50 30%, #66bb6a 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #43a047 30%, #4caf50 90%)',
              }
            }}
          >
            Скачать статистику
          </Button>
        </Box>
      </Box>

      {Object.keys(validationErrors).length > 0 && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Некоторые обязательные поля не заполнены. Проверьте выделенные ячейки.
        </Alert>
      )}

      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={filteredRows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[10, 25, 50]}
          disableRowSelectionOnClick
          sx={{
            '& .MuiDataGrid-cell': {
              borderColor: '#e0e0e0',
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#f5f5f5',
              fontWeight: 600,
            },
            '& .MuiDataGrid-row:hover': {
              backgroundColor: '#f8f9fa',
            },
            '& .error-cell': {
              backgroundColor: '#ffebee',
              border: '1px solid #f44336',
            },
          }}
        />
      </Box>
    </Paper>
  );
};

export default DebtCollectionTable;