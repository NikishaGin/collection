import { createSlice } from '@reduxjs/toolkit';

// Мок данные для демонстрации
const mockData = [
  {
    id: 1,
    taxOfficeCode: '7701',
    currentTaxOfficeCode: '7701',
    inn: '123456789012',
    registrationCode: 1,
    fullName: 'Иванов Иван Иванович',
    documentNumber: 'ПП-001-2024',
    documentDate: '2024-01-15',
    documentType: 'Постановление о взыскании',
    documentAmount: 150000,
    debtBalance: 150000,
    courtName: 'Тверской районный суд г. Москвы',
    courtAddress: 'ул. Тверская, д. 1, Москва',
    courtSentDate: null,
    noCourtRequired: null,
    applicationStatus: null,
    receivedDate: null,
    courtActType: null,
    courtActNumber: null,
    courtActDate: null,
    courtActEffectiveDate: null,
    courtActSentDate: null,
    caseReference: null,
  },
  {
    id: 2,
    taxOfficeCode: '7702',
    currentTaxOfficeCode: '7702',
    inn: '987654321098',
    registrationCode: 0,
    fullName: 'Петров Петр Петрович',
    documentNumber: 'ПП-002-2024',
    documentDate: '2024-01-20',
    documentType: 'Постановление о взыскании',
    documentAmount: 75000,
    debtBalance: 75000,
    courtName: 'Басманный районный суд г. Москвы',
    courtAddress: 'ул. Басманная, д. 10, Москва',
    courtSentDate: '2024-02-01',
    noCourtRequired: null,
    applicationStatus: 'получен',
    receivedDate: '2024-02-05',
    courtActType: 'судебный приказ',
    courtActNumber: 'СП-123/2024',
    courtActDate: '2024-02-10',
    courtActEffectiveDate: '2024-02-20',
    courtActSentDate: '2024-02-22',
    caseReference: 'https://court.gov.ru/case/123456',
  },
];

const initialState = {
  rows: mockData,
  filteredRows: mockData,
  searchTerm: '',
  loading: false,
  validationErrors: {},
};

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    updateRow: (state, action) => {
      const { id, field, value } = action.payload;
      const rowIndex = state.rows.findIndex(row => row.id === id);
      if (rowIndex !== -1) {
        state.rows[rowIndex][field] = value;
        // Update filtered rows if they match
        const filteredRowIndex = state.filteredRows.findIndex(row => row.id === id);
        if (filteredRowIndex !== -1) {
          state.filteredRows[filteredRowIndex][field] = value;
        }
      }
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
      if (action.payload) {
        state.filteredRows = state.rows.filter(row => 
          row.inn.includes(action.payload)
        );
      } else {
        state.filteredRows = state.rows;
      }
    },
    setValidationErrors: (state, action) => {
      state.validationErrors = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    }
  },
});

export const { updateRow, setSearchTerm, setValidationErrors, setLoading } = dataSlice.actions;
export default dataSlice.reducer;