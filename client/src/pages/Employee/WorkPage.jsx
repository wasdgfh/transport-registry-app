import { useEffect, useRef, useState } from 'react';
import {
  Container, Typography, Box, Snackbar, TextField,
  Pagination, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import {
  getEmployeeWorks,
  postEmployeeWork,
  patchEmployeeWork
} from '../../components/Employee/Work/WorkService';
import WorkFormDialog from '../../components/Employee/Work/WorkFormDialog';
import WorkTable from '../../components/Employee/Work/WorkTable';

function WorkPage() {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [editingCell, setEditingCell] = useState(null);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');

  const searchTimeout = useRef(null);

  useEffect(() => {
    clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      loadWorks();
    }, 500); 
    return () => clearTimeout(searchTimeout.current);
  }, [search, page, limit]);

  const loadWorks = async () => {
    setLoading(true);
    try {
      const res = await getEmployeeWorks({ page, limit, search });
      setWorks(res.data.data);
      setTotalPages(res.data.pages || 1);
    } catch (e) {
      console.error(e);
      showSnackbar('Ошибка загрузки данных', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorks();
  }, [page, limit]);

  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSubmit = async (workData) => {
    try {
      await postEmployeeWork(workData);
      showSnackbar('Работа добавлена', 'success');
      setOpenForm(false);
      loadWorks();
    } catch (e) {
      console.error(e);
      showSnackbar('Ошибка при добавлении работы', 'error');
    }
  };

  const handlePatch = async (id, field, value) => {
    try {
      await patchEmployeeWork(id, { [field]: value });
      showSnackbar('Изменения сохранены');
      loadWorks();
    } catch (e) {
      console.error(e);
      showSnackbar('Ошибка обновления', 'error');
    } finally {
      setEditingCell(null);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4">Выполненные работы</Typography>
      </Box>

      <TextField
        fullWidth
        label="Поиск по VIN"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        sx={{ mb: 2 }}
      />

      <WorkTable
        data={works}
        loading={loading}
        editingCell={editingCell}
        setEditingCell={setEditingCell}
        handleKeyDown={(e, id, field, value) => {
          if (e.key === 'Enter') handlePatch(id, field, value);
        }}
        handleBlur={(id, field, value) => handlePatch(id, field, value)}
      />

      <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel id="limit-select-label">Показывать по</InputLabel>
          <Select
            labelId="limit-select-label"
            value={limit}
            label="Показывать по"
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
          >
            {[5, 10, 20, 50].map((option) => (
              <MenuItem key={option} value={option}>{option}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Pagination count={totalPages} page={page} onChange={(_, value) => setPage(value)} />
      </Box>

      <WorkFormDialog
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSubmit={handleSubmit}
        editingData={editData}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </Container>
  );
}

export default WorkPage;
