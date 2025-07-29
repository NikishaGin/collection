import * as XLSX from 'xlsx';

export const exportToXLSX = (data, filename) => {
  // Подготавливаем данные для экспорта с читаемыми заголовками
  const exportData = data.map(row => ({
    'Код НО (заявление)': row.taxOfficeCode,
    'Текущий Код НО': row.currentTaxOfficeCode,
    'ИНН': row.inn,
    'Код постановки на учет': row.registrationCode,
    'ФИО': row.fullName,
    'Номер документа': row.documentNumber,
    'Дата документа': row.documentDate ? new Date(row.documentDate).toLocaleDateString('ru-RU') : '',
    'Вид документа': row.documentType,
    'Сумма по документу': row.documentAmount,
    'Остаток задолженности': row.debtBalance,
    'Наименование судебного органа': row.courtName,
    'Адрес судебного органа': row.courtAddress,
    'Дата отправки в суд': row.courtSentDate ? new Date(row.courtSentDate).toLocaleDateString('ru-RU') : '',
    'Не требуется направления в суд': row.noCourtRequired || '',
    'Статус приема заявления налогового органа': row.applicationStatus || '',
    'Дата получения': row.receivedDate ? new Date(row.receivedDate).toLocaleDateString('ru-RU') : '',
    'Вид судебного акта': row.courtActType || '',
    'Номер судебного акта': row.courtActNumber || '',
    'Дата судебного акта': row.courtActDate ? new Date(row.courtActDate).toLocaleDateString('ru-RU') : '',
    'Дата вступления в силу судебного акта': row.courtActEffectiveDate ? new Date(row.courtActEffectiveDate).toLocaleDateString('ru-RU') : '',
    'Дата направления судебного акта в налоговый орган': row.courtActSentDate ? new Date(row.courtActSentDate).toLocaleDateString('ru-RU') : '',
    'Ссылка на номер дела': row.caseReference || '',
  }));

  // Создаем рабочую книгу
  const ws = XLSX.utils.json_to_sheet(exportData);
  const wb = XLSX.utils.book_new();
  
  // Настраиваем ширину столбцов
  const colWidths = [
    { wch: 15 }, // Код НО (заявление)
    { wch: 15 }, // Текущий Код НО
    { wch: 15 }, // ИНН
    { wch: 12 }, // Код постановки
    { wch: 25 }, // ФИО
    { wch: 18 }, // Номер документа
    { wch: 12 }, // Дата документа
    { wch: 25 }, // Вид документа
    { wch: 15 }, // Сумма по документу
    { wch: 18 }, // Остаток задолженности
    { wch: 30 }, // Наименование суда
    { wch: 30 }, // Адрес суда
    { wch: 15 }, // Дата отправки в суд
    { wch: 25 }, // Не требуется направления
    { wch: 20 }, // Статус приема заявления
    { wch: 12 }, // Дата получения
    { wch: 25 }, // Вид судебного акта
    { wch: 18 }, // Номер судебного акта
    { wch: 15 }, // Дата судебного акта
    { wch: 18 }, // Дата вступления в силу
    { wch: 20 }, // Дата направления акта
    { wch: 25 }, // Ссылка на дело
  ];
  
  ws['!cols'] = colWidths;
  
  // Добавляем лист в книгу
  XLSX.utils.book_append_sheet(wb, ws, 'Заявления о взыскании');
  
  // Сохраняем файл
  XLSX.writeFile(wb, filename);
};