import {
  Table, TableHead, TableRow, TableCell, TableBody,
  TableContainer, Paper, TextField, IconButton
} from '@mui/material';
import { Edit } from '@mui/icons-material';

function RegDocTable({
  data,
  loading,
  sortField,
  sortOrder,
  onSort,
  onEditClick,
  onDoubleClickEdit,
  editingCell,
  setEditingCell,
  handleKeyDown,
  handleBlur
}) {
  const columns = [
    { label: 'Рег. номер', field: 'registrationNumber' },
    { label: 'Адрес', field: 'address' },
    { label: 'ПТС', field: 'pts' },
    { label: 'СТС', field: 'sts' },
    { label: 'Дата рег.', field: 'registrationDate' },
    { label: 'Владелец', field: 'documentOwner' }
  ];

  const renderHeaderCell = (label, fieldKey) => (
    <TableCell
      key={`header-${fieldKey}`}
      sx={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
      onClick={() => onSort(fieldKey)}
    >
      {label} {sortField === fieldKey ? (sortOrder === 'ASC' ? '↑' : '↓') : ''}
    </TableCell>
  );

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map(col => renderHeaderCell(col.label, col.field))}
            <TableCell align="right" key="actions-header">Действия</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
            {loading ? (
                <TableRow key="loading">
                <TableCell colSpan={columns.length + 1} align="center">Загрузка...</TableCell>
                </TableRow>
            ) : data.length > 0 ? (
                data.map((item, index) => {
                const id = item.registrationNumber;
                const rowKey = id || index;

                return (
                    <TableRow key={`row-${rowKey}`}>
                    {columns.map(col => {
                        return (
                        <TableCell
                            key={`cell-${rowKey}-${col.field}`}
                            onDoubleClick={() => {
                            if (col.field === 'registrationNumber') return;
                            onDoubleClickEdit(id, col.field, item[col.field]);
                            }}
                        >
                            {editingCell?.id === id && editingCell?.field === col.field ? (
                            <TextField
                                size="small"
                                autoFocus
                                value={editingCell.value}
                                onChange={(e) =>
                                setEditingCell({ ...editingCell, value: e.target.value })
                                }
                                onBlur={() =>
                                handleBlur(id, col.field, editingCell.value)
                                }
                                onKeyDown={(e) =>
                                handleKeyDown(e, id, col.field, editingCell.value)
                                }
                            />
                            ) : (
                            col.field === 'registrationDate'
                                ? new Date(item[col.field])
                                    .toISOString()
                                    .split('T')[0]
                                    .split('-')
                                    .reverse()
                                    .join('.')
                                : item[col.field]
                            )}
                        </TableCell>
                        );
                    })}
                    <TableCell align="right" key={`actions-${rowKey}`}>
                        <IconButton onClick={() => onEditClick(item)}>
                        <Edit />
                        </IconButton>
                    </TableCell>
                    </TableRow>
                );
                })
            ) : (
                <TableRow key="no-data">
                <TableCell colSpan={columns.length + 1} align="center">Нет данных</TableCell>
                </TableRow>
            )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default RegDocTable;
