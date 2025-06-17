import {
  Table, TableHead, TableRow, TableCell, TableBody,
  Paper, TableContainer, TextField, IconButton
} from '@mui/material';
import { Edit } from '@mui/icons-material';

function TransportVehicleTable({
  data, loading, sortField, sortOrder,
  onSort, onEditClick, editingCell, setEditingCell,
  patchVehicle, fetchData, showSnackbar
}) {
  const columns = [
    { field: 'vin', label: 'VIN' },
    { field: 'makeAndModel', label: 'Марка и модель' },
    { field: 'releaseYear', label: 'Год выпуска' },
    { field: 'manufacture', label: 'Производитель' },
    { field: 'typeOfDrive', label: 'Привод' },
    { field: 'power', label: 'Мощность' },
    { field: 'chassisNumber', label: '№ шасси' },
    { field: 'bodyNumber', label: '№ кузова' },
    { field: 'bodyColor', label: 'Цвет кузова' },
    { field: 'transmissionType', label: 'КПП' },
    { field: 'steeringWheel', label: 'Руль' },
    { field: 'engineModel', label: 'Модель двигателя' },
    { field: 'engineVolume', label: 'Объём двигателя' }
  ];

  const saveEdit = async (vin, field, value) => {
    try {
      await patchVehicle(vin, { [field]: value });
      showSnackbar('Сохранено', 'success');
      fetchData();
    } catch (e) {
      console.error(e);
      showSnackbar('Ошибка при сохранении', 'error');
    } finally {
      setEditingCell(null);
    }
  };

  const renderHeader = (col) => (
    <TableCell
      key={col.field}
      onClick={() => onSort(col.field)}
      sx={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
    >
      {col.label} {sortField === col.field ? (sortOrder === 'ASC' ? '↑' : '↓') : ''}
    </TableCell>
  );

  return (
    <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {columns.map(renderHeader)}
            <TableCell
              align="right"
              sx={{
                position: 'sticky',
                right: 0,
                backgroundColor: 'white',
                zIndex: 2,
                whiteSpace: 'nowrap'
              }}
            >
              Действия
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow><TableCell colSpan={columns.length + 1} align="center">Загрузка...</TableCell></TableRow>
          ) : data.length > 0 ? (
            data.map((v) => (
              <TableRow key={v.vin}>
                {columns.map(col => (
                  <TableCell
                    key={col.field}
                    sx={{ whiteSpace: 'nowrap' }}
                  >
                    {v[col.field] || '-'}
                  </TableCell>
                ))}
                <TableCell
                  align="right"
                  sx={{
                    position: 'sticky',
                    right: 0,
                    backgroundColor: 'white',
                    zIndex: 1
                  }}
                >
                  <IconButton onClick={() => onEditClick(v)}><Edit /></IconButton>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow><TableCell colSpan={columns.length + 1} align="center">Нет данных</TableCell></TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default TransportVehicleTable;
