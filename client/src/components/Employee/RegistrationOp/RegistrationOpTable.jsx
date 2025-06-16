import {
  Table, TableHead, TableRow, TableCell, TableBody,
  Paper, TableContainer, TextField, IconButton
} from '@mui/material';
import { Edit } from '@mui/icons-material';
import { useState } from 'react';

function RegistrationOpTable({
  data, loading, sortField, sortOrder, onSort,
  editingCell, setEditingCell, patchOp, fetchData,
  showSnackbar, handleOpenDialog
}) {
  const [editValue, setEditValue] = useState('');

  const columns = [
    { field: 'vin', label: 'VIN' },
    { field: 'registrationNumber', label: 'Гос. рег. номер' },
    { field: 'unitCode', label: 'Код подразделения' },
    { field: 'operationType', label: 'Тип операции' },
    { field: 'operationBase', label: 'Основание' },
    { field: 'operationDate', label: 'Дата операции' }
  ];

  const handleDoubleClick = (id, field, value) => {
    setEditingCell({ id, field });
    setEditValue(field === 'operationDate' ? value?.slice(0, 10) : value);
  };

  const handleSave = async (id, field) => {
    try {
      await patchOp(id, { [field]: editValue });
      showSnackbar('Сохранено', 'success');
      fetchData();
    } catch {
      showSnackbar('Ошибка при сохранении', 'error');
    } finally {
      setEditingCell(null);
    }
  };

  const formatDate = (value) => {
    if (!value) return '-';
    const date = new Date(value);
    return isNaN(date) ? value : date.toLocaleDateString('ru-RU');
  };

  const renderCell = (row, col) => {
    const isEditing = editingCell?.id === row.operationId && editingCell.field === col.field;

    if (col.field === 'operationDate') {
      return isEditing ? (
        <TextField
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={() => handleSave(row.operationId, col.field)}
          onKeyDown={(e) => e.key === 'Enter' && handleSave(row.operationId, col.field)}
          autoFocus
          type="date"
          size="small"
          variant="standard"
        />
      ) : (
        <span
          onDoubleClick={() => handleDoubleClick(row.operationId, col.field, row[col.field])}
          style={{ cursor: 'pointer' }}
        >
          {formatDate(row[col.field])}
        </span>
      );
    }

    if (col.field === 'registrationNumber') {
      const isEditing = editingCell?.id === row.operationId && editingCell.field === col.field;

      return isEditing ? (
        <TextField
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={() => handleSave(row.operationId, col.field)}
          onKeyDown={(e) => e.key === 'Enter' && handleSave(row.operationId, col.field)}
          autoFocus
          size="small"
          variant="standard"
        />
      ) : (
        <span
          onDoubleClick={() => handleDoubleClick(row.operationId, col.field, row[col.field])}
          style={{ cursor: 'pointer' }}
        >
          {row[col.field] || '-'}
        </span>
      );
    }

    return row[col.field] || '-';
  };

  return (
    <TableContainer component={Paper}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {columns.map(col => (
              <TableCell
                key={col.field}
                onClick={() => onSort(col.field)}
                sx={{ cursor: 'pointer' }}
              >
                {col.label} {sortField === col.field ? (sortOrder === 'ASC' ? '↑' : '↓') : ''}
              </TableCell>
            ))}
            <TableCell align="right">Действия</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={columns.length + 1} align="center">Загрузка...</TableCell>
            </TableRow>
          ) : data.length > 0 ? (
            data.map((row) => (
              <TableRow key={row.operationId}>
                {columns.map(col => (
                  <TableCell key={col.field}>{renderCell(row, col)}</TableCell>
                ))}
                <TableCell align="right">
                  <IconButton onClick={() => handleOpenDialog(row.operationId)}>
                    <Edit />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length + 1} align="center">Нет данных</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default RegistrationOpTable;
