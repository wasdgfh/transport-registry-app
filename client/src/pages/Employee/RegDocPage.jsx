import { useEffect, useState } from 'react';
import {
  Container, Typography, Button, Box, Snackbar, TextField, Pagination,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton
} from '@mui/material';
import { Add, Edit } from '@mui/icons-material';
import RegDocFormDialog from '../../components/Employee/RegDoc/RegDocFormDialog';
import { getRegDocs, postRegDoc, putRegDoc, patchRegDoc } from '../../components/Employee/RegDoc/RegDocService';

function RegDocPage() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [editingCell, setEditingCell] = useState(null);

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortField, setSortField] = useState('registrationDate');
  const [sortOrder, setSortOrder] = useState('DESC');

  const loadDocs = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10, sortBy: sortField, sortOrder };
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
  }, [page, search, sortField, sortOrder]);

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

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ cursor: 'pointer' }} onClick={() => handleSort('registrationNumber')}>
                Рег. номер {sortField === 'registrationNumber' ? (sortOrder === 'ASC' ? '↑' : '↓') : ''}
              </TableCell>
              <TableCell sx={{ cursor: 'pointer' }} onClick={() => handleSort('address')}>
                Адрес {sortField === 'address' ? (sortOrder === 'ASC' ? '↑' : '↓') : ''}
              </TableCell>
              <TableCell sx={{ cursor: 'pointer' }} onClick={() => handleSort('pts')}>
                ПТС {sortField === 'pts' ? (sortOrder === 'ASC' ? '↑' : '↓') : ''}
              </TableCell>
              <TableCell sx={{ cursor: 'pointer' }} onClick={() => handleSort('sts')}>
                СТС {sortField === 'sts' ? (sortOrder === 'ASC' ? '↑' : '↓') : ''}
              </TableCell>
              <TableCell sx={{ cursor: 'pointer' }} onClick={() => handleSort('registrationDate')}>
                Дата рег. {sortField === 'registrationDate' ? (sortOrder === 'ASC' ? '↑' : '↓') : ''}
              </TableCell>
              <TableCell sx={{ cursor: 'pointer' }} onClick={() => handleSort('documentOwner')}>
                Владелец {sortField === 'documentOwner' ? (sortOrder === 'ASC' ? '↑' : '↓') : ''}
              </TableCell>
              <TableCell align="right">Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {docs.map(doc => (
              <TableRow key={doc.registrationNumber}>
                {['registrationNumber', 'address', 'pts', 'sts', 'registrationDate', 'documentOwner'].map(field => (
                  <TableCell
                    key={field}
                    onDoubleClick={() => field !== 'registrationNumber' && setEditingCell({ id: doc.registrationNumber, field, value: doc[field] })}
                  >
                    {editingCell?.id === doc.registrationNumber && editingCell?.field === field ? (
                      <TextField
                        size="small"
                        autoFocus
                        value={editingCell.value}
                        onChange={(e) => setEditingCell({ ...editingCell, value: e.target.value })}
                        onBlur={() => handlePatch(doc.registrationNumber, field, editingCell.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handlePatch(doc.registrationNumber, field, editingCell.value);
                        }}
                      />
                    ) : (
                      field === 'registrationDate'
                        ? new Date(doc[field]).toISOString().split('T')[0].split('-').reverse().join('.')
                        : doc[field]
                    )}
                  </TableCell>
                ))}
                <TableCell align="right">
                  <IconButton onClick={() => handleEdit(doc)}><Edit /></IconButton>
                </TableCell>
              </TableRow>
            ))}
            {docs.length === 0 && !loading && (
              <TableRow>
                <TableCell colSpan={7} align="center">Нет данных</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box display="flex" justifyContent="center" mt={2}>
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