import {
  Table, TableHead, TableRow, TableCell, TableBody,
  Paper, TableContainer, TextField, IconButton
} from '@mui/material';
import { Edit } from '@mui/icons-material';

function OwnerTable({
  data,
  loading,
  type,
  sortField,
  sortOrder,
  onSort,
  onEditClick,
  editingCell,
  setEditingCell,
  patchNaturalPerson,
  patchLegalEntity,
  fetchData,
  showSnackbar
}) {
  const fields = type === 'natural'
    ? ['passportData', 'lastName', 'firstName', 'patronymic', 'address']
    : ['taxNumber', 'companyName', 'address'];

  const columns = type === 'natural'
    ? [
        { label: 'Паспортные данные', field: 'passportData' },
        { label: 'Фамилия', field: 'lastName' },
        { label: 'Имя', field: 'firstName' },
        { label: 'Отчество', field: 'patronymic' },
        { label: 'Адрес', field: 'address' }
      ]
    : [
        { label: 'ИНН', field: 'taxNumber' },
        { label: 'Название компании', field: 'companyName' },
        { label: 'Адрес', field: 'address' }
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

  const saveEdit = async (id, field, value) => {
    try {
      const payload = { [field]: value };
      if (type === 'natural') {
        await patchNaturalPerson(id, payload);
      } else {
        await patchLegalEntity(id, payload);
      }
      showSnackbar('Сохранено', 'success');
      fetchData();
    } catch (e) {
      console.error(e);
      showSnackbar('Ошибка при сохранении', 'error');
    } finally {
      setEditingCell(null);
    }
  };

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
            <TableRow key="loading-row">
              <TableCell colSpan={columns.length + 1} align="center">Загрузка...</TableCell>
            </TableRow>
          ) : data.length > 0 ? (
            data.map((item, index) => {
              const id = type === 'natural' ? item.passportData : item.taxNumber;
              const rowKey = id || `${type}-${index}`;

              return (
                <TableRow key={`row-${rowKey}`}>
                  {fields.map(field => (
                    <TableCell
                      key={`cell-${rowKey}-${field}`}
                      onDoubleClick={() => {
                        if (
                          (type === 'natural' && field === 'passportData') ||
                          (type === 'legal' && field === 'taxNumber')
                        ) return;
                        setEditingCell({ id, field, value: item[field] });
                      }}
                    >
                      {editingCell?.id === id && editingCell?.field === field ? (
                        <TextField
                          size="small"
                          autoFocus
                          value={editingCell.value}
                          onChange={(e) =>
                            setEditingCell({ ...editingCell, value: e.target.value })
                          }
                          onBlur={() => saveEdit(id, field, editingCell.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              saveEdit(id, field, editingCell.value);
                            }
                          }}
                        />
                      ) : (
                        item[field]
                      )}
                    </TableCell>
                  ))}
                  <TableCell align="right" key={`actions-${rowKey}`}>
                    <IconButton onClick={() => onEditClick(item)}>
                      <Edit />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow key="no-data-row">
              <TableCell colSpan={columns.length + 1} align="center">Нет данных</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default OwnerTable;
