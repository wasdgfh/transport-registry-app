import {
  Table, TableHead, TableRow, TableCell, TableBody,
  TableContainer, Paper, TextField, IconButton
} from '@mui/material';
import { Edit } from '@mui/icons-material';
import { useState } from 'react';

function RegDocTable({
  data,
  loading,
  sortField,
  sortOrder,
  onSort,
  onEditClick,
  editingCell,
  setEditingCell,
  handleKeyDown,
  handleBlur
}) {
  const [editValue, setEditValue] = useState('');

  const columns = [
    { label: 'Гос. рег. номер', field: 'registrationNumber' },
    { label: 'Адрес', field: 'address' },
    { label: 'ПТС', field: 'pts' },
    { label: 'СТС', field: 'sts' },
    { label: 'Дата рег.', field: 'registrationDate' },
    { label: 'Владелец', field: 'documentOwner' }
  ];

  const handleDoubleClick = (id, field, value) => {
    const isDate = field === 'registrationDate';
    const cleanedValue = isDate
      ? value
        ? new Date(value).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0]
      : value;

    setEditingCell({ id, field });
    setEditValue(cleanedValue);
  };

  const handleSave = (id, field) => {
    handleBlur(id, field, editValue);
    setEditingCell(null);
  };

  const formatDate = (value) => {
    if (!value) return '-';
    const date = new Date(value);
    return isNaN(date) ? value : date.toLocaleDateString('ru-RU');
  };

  const renderHeaderCell = (label, fieldKey) => (
    <TableCell
      key={`header-${fieldKey}`}
      sx={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
      onClick={() => onSort(fieldKey)}
    >
      {label} {sortField === fieldKey ? (sortOrder === 'ASC' ? '↑' : '↓') : ''}
    </TableCell>
  );

  const renderCell = (item, col) => {
    const id = item.registrationNumber;
    const isEditing = editingCell?.id === id && editingCell?.field === col.field;

    if (col.field === 'registrationDate') {
      return isEditing ? (
        <TextField
          type="date"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={() => handleSave(id, col.field)}
          onKeyDown={(e) => e.key === 'Enter' && handleSave(id, col.field)}
          autoFocus
          size="small"
          variant="standard"
        />
      ) : (
        <span
          onDoubleClick={() => handleDoubleClick(id, col.field, item[col.field])}
          style={{ cursor: 'pointer' }}
        >
          {formatDate(item[col.field])}
        </span>
      );
    }

    return isEditing ? (
      <TextField
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={() => handleSave(id, col.field)}
        onKeyDown={(e) => e.key === 'Enter' && handleSave(id, col.field)}
        autoFocus
        size="small"
        variant="standard"
      />
    ) : (
      <span
        onDoubleClick={() =>
          !['registrationNumber', 'address', 'documentOwner'].includes(col.field) &&
          handleDoubleClick(id, col.field, item[col.field])
        }
        style={{ cursor: ['pts', 'sts'].includes(col.field) ? 'pointer' : 'default' }}
      >
        {item[col.field] || '-'}
      </span>
    );
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map(col => renderHeaderCell(col.label, col.field))}
            <TableCell align="right">Действия</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={columns.length + 1} align="center">Загрузка...</TableCell>
            </TableRow>
          ) : data.length > 0 ? (
            data.map((item, index) => {
              const id = item.registrationNumber;
              const rowKey = id || index;
              return (
                <TableRow key={`row-${rowKey}`}>
                  {columns.map(col => (
                    <TableCell key={`cell-${rowKey}-${col.field}`}>
                      {renderCell(item, col)}
                    </TableCell>
                  ))}
                  <TableCell align="right">
                    <IconButton onClick={() => onEditClick(item)}>
                      <Edit />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })
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

export default RegDocTable;
