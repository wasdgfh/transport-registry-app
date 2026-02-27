import { useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, CircularProgress, TextField
} from '@mui/material';

function EditableTable({
  items,
  loading,
  columns,
  onEdit,
  onDelete,
  onPatch,
  sortField,
  sortOrder,
  onSort
}) {
  const [editingCell, setEditingCell] = useState(null);

  const handleKeyDown = (e, id, field, value) => {
    if (e.key === 'Enter') {
      onPatch(id, field, value);
      setEditingCell(null);
    }
  };

  if (loading) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Paper>
    );
  }

  const renderHeaderCell = (column) => (
    <TableCell
      key={column.field}
      sx={{ 
        cursor: column.sortable ? 'pointer' : 'default', 
        whiteSpace: 'nowrap',
        fontWeight: 'bold'
      }}
      onClick={() => column.sortable && onSort(column.field)}
    >
      {column.label} 
      {column.sortable && sortField === column.field && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
    </TableCell>
  );

  const renderCell = (item, column) => {
    if (column.render) {
      return column.render(item);
    }

    const id = item.id || item.badgeNumber || item.unitCode;
    const isEditing = editingCell?.id === id && editingCell?.field === column.field;
    
    if (isEditing && column.editable) {
      return (
        <TextField
          size="small"
          value={editingCell.value}
          autoFocus
          onChange={(e) => setEditingCell(prev => ({ ...prev, value: e.target.value }))}
          onBlur={() => {
            onPatch(id, column.field, editingCell.value);
            setEditingCell(null);
          }}
          onKeyDown={(e) => handleKeyDown(e, id, column.field, editingCell.value)}
        />
      );
    }

    return (
      <span
        onDoubleClick={() => {
          if (column.editable) {
            setEditingCell({ id, field: column.field, value: item[column.field] });
          }
        }}
        style={{ cursor: column.editable ? 'pointer' : 'default' }}
      >
        {item[column.field] || '—'}
      </span>
    );
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map(renderHeaderCell)}
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => {
            const id = item.id || item.badgeNumber || item.unitCode;
            return (
              <TableRow key={id} hover>
                {columns.map(column => (
                  <TableCell key={column.field}>
                    {renderCell(item, column)}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
          {items.length === 0 && (
            <TableRow>
              <TableCell colSpan={columns.length} align="center">
                Нет данных
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default EditableTable;