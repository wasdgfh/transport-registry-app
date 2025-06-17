import { useEffect, useState } from 'react';
import {
  Container, Typography, Button, Box, Snackbar, TextField, 
  Pagination, FormControl, InputLabel, Select, MenuItem 
} from '@mui/material';
import { Add, Edit } from '@mui/icons-material';
import RegDocFormDialog from '../../components/Employee/RegDoc/RegDocFormDialog';
import RegDocTable from '../../components/Employee/RegDoc/RegDocTable';
import { getRegDocs, postRegDoc, putRegDoc, patchRegDoc } from '../../components/Employee/RegDoc/RegDocService';

function RegDocPage() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [editingCell, setEditingCell] = useState(null);
  const [limit, setLimit] = useState(10);

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortField, setSortField] = useState('registrationDate');
  const [sortOrder, setSortOrder] = useState('DESC');

  const loadDocs = async () => {
    setLoading(true);
    try {
      const params = { page, limit, sortBy: sortField, sortOrder };
      if (search.trim()) params.search = search.trim();

      const res = await getRegDocs(params);
      setDocs(res.data.data);
      setTotalPages(res.data.pages || 1);
    } catch (e) {
      console.error(e);
      showSnackbar('Ошибка загрузки данных', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocs();
  }, [page, search, sortField, sortOrder, limit]);

  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCreate = () => {
    setEditData(null);
    setOpenForm(true);
  };

  const handleEdit = (doc) => {
    setEditData(doc);
    setOpenForm(true);
  };

  const handleSubmit = async (regNumber, formData) => {
    try {
      const {
        registrationNumber,
        createdAt,
        updatedAt,
        owner,
        ...payload
      } = formData;

      if (editData) {
        await putRegDoc(regNumber, payload);
        showSnackbar('Документ обновлён', 'success');
      } else {
        await postRegDoc({ registrationNumber, ...payload });
        showSnackbar('Документ создан', 'success');
      }

      setOpenForm(false);
      loadDocs();
    } catch (e) {
      console.error(e);
      showSnackbar(e.response?.data?.message || 'Ошибка сохранения', 'error');
    }
  };



  const handlePatch = async (regNumber, field, value) => {
    try {
      await patchRegDoc(regNumber, { [field]: value });
      showSnackbar('Изменения сохранены');
      loadDocs();
    } catch (e) {
      console.error(e);
      showSnackbar('Ошибка обновления', 'error');
    } finally {
      setEditingCell(null);
    }
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
    <Container maxWidth="lg">
      <Box sx={{ my: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Регистрационные документы</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleCreate}>
          Добавить документ
        </Button>
      </Box>

      <TextField
        fullWidth
        label="Поиск"
        value={search}
        onChange={(e) => {
          setPage(1);
          setSearch(e.target.value);
        }}
        sx={{ mb: 2 }}
      />

      <RegDocTable
        data={docs}
        loading={loading}
        sortField={sortField}
        sortOrder={sortOrder}
        onSort={handleSort}
        onEditClick={handleEdit}
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

      <RegDocFormDialog
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

export default RegDocPage;