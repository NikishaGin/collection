import { setValidationErrors } from '../store/slices/dataSlice';

// Определяем обязательные поля для валидации
const requiredFields = [
  'courtSentDate',
  'applicationStatus',
  'receivedDate',
  'courtActType',
  'courtActNumber',
  'courtActDate',
];

// Условные обязательные поля (зависят от других значений)
const conditionalRequiredFields = {
  courtActEffectiveDate: (row) => row.courtActType === 'судебный приказ' || row.courtActType === 'исполнительный лист',
  courtActSentDate: (row) => row.applicationStatus === 'получен',
};

export const validateRow = (rowId, row, dispatch) => {
  const errors = {};
  
  // Проверяем обязательные поля
  requiredFields.forEach(field => {
    if (!row[field] || row[field] === '') {
      errors[field] = 'Обязательное поле';
    }
  });
  
  // Проверяем условно обязательные поля
  Object.entries(conditionalRequiredFields).forEach(([field, condition]) => {
    if (condition(row) && (!row[field] || row[field] === '')) {
      errors[field] = 'Обязательное поле для данного типа акта';
    }
  });
  
  // Специальная логика валидации
  
  // Если указано "Не требуется направления в суд", то некоторые поля становятся необязательными
  if (row.noCourtRequired) {
    delete errors.courtSentDate;
    delete errors.applicationStatus;
    delete errors.receivedDate;
  }
  
  // Валидация дат (логическая проверка)
  if (row.courtSentDate && row.receivedDate) {
    const sentDate = new Date(row.courtSentDate);
    const receivedDate = new Date(row.receivedDate);
    if (sentDate > receivedDate) {
      errors.receivedDate = 'Дата получения не может быть раньше даты отправки';
    }
  }
  
  if (row.courtActDate && row.courtActEffectiveDate) {
    const actDate = new Date(row.courtActDate);
    const effectiveDate = new Date(row.courtActEffectiveDate);
    if (actDate > effectiveDate) {
      errors.courtActEffectiveDate = 'Дата вступления в силу не может быть раньше даты акта';
    }
  }
  
  // Валидация URL
  if (row.caseReference && !isValidUrl(row.caseReference)) {
    errors.caseReference = 'Некорректный формат URL';
  }
  
  // Обновляем ошибки в store
  dispatch(setValidationErrors(prevErrors => ({
    ...prevErrors,
    [rowId]: Object.keys(errors).length > 0 ? errors : undefined
  })));
  
  return Object.keys(errors).length === 0;
}

const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

export const validateAllRows = (rows, dispatch) => {
  rows.forEach(row => {
    validateRow(row.id, row, dispatch);
  });
};