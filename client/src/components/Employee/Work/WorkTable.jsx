import {
  Table, TableHead, TableRow, TableCell,
  TableBody, TableContainer, Paper, TextField
} from '@mui/material';
import { useState } from 'react';

function WorkTable({
  data,
  loading,
  editingCell,
  setEditingCell,
  handleBlur
}) {
  const [editValue, setEditValue] = useState('');

  const handleDoubleClick = (id, field, value) => {
    setEditingCell({ id, field });
    setEditValue(field === 'workDate'
      ? new Date(value).toISOString().split('T')[0]
      : value);
  };

  const handleSave = (id, field) => {
    handleBlur(id, field, editValue);
    setEditingCell(null);
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>VIN</TableCell>
            <TableCell>Тип операции</TableCell>
            <TableCell>Дата операции</TableCell>
            <TableCell>Дата выполнения</TableCell>
            <TableCell>Назначение</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={5} align="center">Загрузка...</TableCell>
            </TableRow>
          ) : data.length ? data.map((row, index) => {
            const id = row.operationId;
            const isEditingPurpose = editingCell?.id === id && editingCell?.field === 'purpose';
            const isEditingDate = editingCell?.id === id && editingCell?.field === 'workDate';

            return (
              <TableRow key={index}>
                <TableCell>{row.registrationop.vin}</TableCell>
                <TableCell>{row.registrationop.operationType}</TableCell>
                <TableCell>{new Date(row.registrationop.operationDate).toLocaleDateString('ru-RU')}</TableCell>
                
                <TableCell>
                  {isEditingDate ? (
                    <TextField
                      type="date"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={() => handleSave(id, 'workDate')}
                      onKeyDown={(e) => e.key === 'Enter' && handleSave(id, 'workDate')}
                      autoFocus
                      size="small"
                      variant="standard"
                    />
                  ) : (
                    <span
                      onDoubleClick={() => handleDoubleClick(id, 'workDate', row.workDate)}
                      style={{ cursor: 'pointer' }}
                    >
                      {new Date(row.workDate).toLocaleDateString('ru-RU')}
                    </span>
                  )}
                </TableCell>

                <TableCell>
                  {isEditingPurpose ? (
                    <TextField
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={() => handleSave(id, 'purpose')}
                      onKeyDown={(e) => e.key === 'Enter' && handleSave(id, 'purpose')}
                      autoFocus
                      size="small"
                      variant="standard"
                    />
                  ) : (
                    <span
                      onDoubleClick={() => handleDoubleClick(id, 'purpose', row.purpose)}
                      style={{ cursor: 'pointer' }}
                    >
                      {row.purpose}
                    </span>
                  )}
                </TableCell>
              </TableRow>
            );
          }) : (
            <TableRow>
              <TableCell colSpan={5} align="center">Нет данных</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default WorkTable;
