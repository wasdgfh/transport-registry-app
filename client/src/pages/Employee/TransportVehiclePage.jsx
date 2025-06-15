import {
  Container, Typography, TextField, Pagination, Snackbar,
  FormControl, InputLabel, Select, MenuItem, Box, Button
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { useEffect, useState } from 'react';

import {
  getVehicles,
  patchVehicle,
  putVehicle,
  createVehicle 
} from '../../components/Employee/Vehicle/TransportVehicleService';

import TransportVehicleTable from '../../components/Employee/Vehicle/TransportVehicleTable';
import TransportVehicleFormDialog from '../../components/Employee/Vehicle/TransportVehicleFormDialog';

function TransportVehiclePage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [sortField, setSortField] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('DESC');
  const [search, setSearch] = useState('');

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [editingCell, setEditingCell] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  useEffect(() => {
    fetchData();
  }, [page, limit, sortField, sortOrder, search]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = { page, limit, sortBy: sortField, sortOrder };
      if (search.trim()) {
        params.search = search.trim();
      }
      const res = await getVehicles(params);
      setData(res.data.data);
      setTotalPages(res.data.pagination.totalPages);
    } catch (e) {
      console.error(e);
      showSnackbar('Ошибка загрузки', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSort = (field) => {
    if (field === sortField) {
      setSortOrder(prev => (prev === 'ASC' ? 'DESC' : 'ASC'));
    } else {
      setSortField(field);
      setSortOrder('ASC');
    }
  };

  return (
    <Container maxWidth={false}>
      <Typography variant="h4" mb={3}>Транспортные средства</Typography>

      <Box display="flex" gap={2} alignItems="center" mb={2}>
        <TextField
            label="Поиск"
            value={search}
            onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
            }}
            sx={{ flexGrow: 1 }}
        />
        <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => {
            setEditData(null);
            setEditDialogOpen(true);
            }}
            sx={{ whiteSpace: 'nowrap', minWidth: '150px' }}
        >
            ДОБАВИТЬ ТС
        </Button>
      </Box>

      <TransportVehicleTable
        data={data}
        loading={loading}
        sortField={sortField}
        sortOrder={sortOrder}
        onSort={handleSort}
        onEditClick={(v) => {
          setEditData(v);
          setEditDialogOpen(true);
        }}
        editingCell={editingCell}
        setEditingCell={setEditingCell}
        patchVehicle={patchVehicle}
        fetchData={fetchData}
        showSnackbar={showSnackbar}
      />

      <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel id="limit-label">Показывать по</InputLabel>
          <Select
            labelId="limit-label"
            value={limit}
            label="Показывать по"
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
          >
            {[5, 10, 20, 50].map(n => (
              <MenuItem key={n} value={n}>{n}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Pagination count={totalPages} page={page} onChange={(_, v) => setPage(v)} />
      </Box>

      <TransportVehicleFormDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        editingData={editData}
        onSubmit={async (vin, formData) => {
          try {
            if (editData) {
              await putVehicle(vin, formData); 
            } else {
              await createVehicle({ vin, ...formData }); 
            }
            showSnackbar('Сохранено', 'success');
            fetchData();
          } catch (e) {
            console.error(e);
            showSnackbar('Ошибка при сохранении', 'error');
          } finally {
            setEditDialogOpen(false);
          }
        }}
      />

      <Snackbar
        open={snackbar.open}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        autoHideDuration={4000}
        message={snackbar.message}
      />
    </Container>
  );
}

export default TransportVehiclePage;
