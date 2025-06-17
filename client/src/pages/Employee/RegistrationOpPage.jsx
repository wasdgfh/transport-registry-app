import {
  Container, Typography, Button, Box, Snackbar, TextField,
  Pagination, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { useEffect, useState } from 'react';

import {
  getRegistrationOps,
  patchRegistrationOp,
  createRegistrationOp
} from '../../components/Employee/RegistrationOp/RegistrationOpService';

import EditRegNumberDialog from '../../components/Employee/RegistrationOp/EditRegNumberDialog';
import RegistrationOpTable from '../../components/Employee/RegistrationOp/RegistrationOpTable';
import RegistrationOpFormDialog from '../../components/Employee/RegistrationOp/RegistrationOpFormDialog';

import { postEmployeeWork } from '../../components/Employee/Work/WorkService';
import WorkFormDialog from '../../components/Employee/Work/WorkFormDialog';

function RegistrationOpPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [editingCell, setEditingCell] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  const [search, setSearch] = useState('');
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortField, setSortField] = useState('operationDate');
  const [sortOrder, setSortOrder] = useState('DESC');

  const [dialogOpenId, setDialogOpenId] = useState(null);
  const [dialogRegNumber, setDialogRegNumber] = useState('');

  const [openWorkDialog, setOpenWorkDialog] = useState(false);
  const [workOperationId, setWorkOperationId] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit,
        search: search || undefined,
        sortField,
        sortOrder
      };
      const res = await getRegistrationOps(params);
      setData(res.data.data);
      setTotalPages(res.data.pages || 1);
    } catch (e) {
      console.error(e);
      showSnackbar('Ошибка загрузки данных', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, limit, sortField, sortOrder, search]);

  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCreate = () => {
    setEditData(null);
    setOpenForm(true);
  };

  const handleSubmit = async (_, formData) => {
    try {
      await createRegistrationOp(formData);
      showSnackbar('Операция добавлена', 'success');
      setOpenForm(false);
      fetchData();
    } catch (e) {
      console.error(e);
      showSnackbar(e.response?.data?.message || 'Ошибка при сохранении', 'error');
    }
  };

  const handlePatch = async (id, field, value) => {
    try {
      await patchRegistrationOp(id, { [field]: value });
      showSnackbar('Изменения сохранены');
      fetchData();
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

  
  const handleOpenDialog = (id, regNum) => {
    setDialogOpenId(id);
    setDialogRegNumber(regNum);
  };


  const handleCloseDialog = () => {
    setDialogOpenId(null);
  };

  const handleDialogSubmit = async (id, regNumber, operationDate) => {
    try {
        await patchRegistrationOp(id, {
        registrationNumber: regNumber,
        operationDate
        });
        showSnackbar('Данные обновлены', 'success');
        fetchData();
    } catch (e) {
        console.error(e);
        showSnackbar('Ошибка при обновлении', 'error');
    } finally {
        handleCloseDialog();
    }
  };

  const handleCreateWork = (operationId) => {
    setWorkOperationId(operationId);
    setOpenWorkDialog(true);
  };

  const handleSubmitWork = async (operationId, formData) => {
    try {
      await postEmployeeWork({ ...formData, operationId });
      showSnackbar('Работа добавлена', 'success');
      setOpenWorkDialog(false);
    } catch (e) {
      console.error(e);
      showSnackbar('Ошибка добавления', 'error');
    }
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ my: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Регистрационные операции</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleCreate}>
          Добавить операцию
        </Button>
      </Box>

      <TextField
        fullWidth
        label="Поиск по VIN или гос. номеру"
        value={search}
        onChange={(e) => {
          setPage(1);
          setSearch(e.target.value);
        }}
        sx={{ mb: 2 }}
      />

      <RegistrationOpTable
        data={data}
        loading={loading}
        sortField={sortField}
        sortOrder={sortOrder}
        onSort={handleSort}
        editingCell={editingCell}
        setEditingCell={setEditingCell}
        patchOp={(id, payload) => {
          const [field] = Object.keys(payload);
          handlePatch(id, field, payload[field]);
        }}
        fetchData={fetchData}
        showSnackbar={showSnackbar}
        handleOpenDialog={handleOpenDialog}
        handleCreateWork={handleCreateWork}
      />

      <EditRegNumberDialog
        open={!!dialogOpenId}
        onClose={handleCloseDialog}
        operationId={dialogOpenId}
        currentRegNumber={dialogRegNumber}
        onSubmit={handleDialogSubmit}
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

      <RegistrationOpFormDialog
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSubmit={handleSubmit}
        editingData={editData}
      />

      <WorkFormDialog
        open={openWorkDialog}
        onClose={() => setOpenWorkDialog(false)}
        onSubmit={handleSubmitWork}
        operationId={workOperationId}
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

export default RegistrationOpPage;
