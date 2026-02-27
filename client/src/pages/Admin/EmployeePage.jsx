<<<<<<< HEAD
import { useEffect, useState } from 'react';
import {
  Container, Typography, Button, Box, Snackbar, TextField, Pagination,
  FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { Add } from '@mui/icons-material';

import {
  fetchEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  patchEmployee
} from '../../components/Admin/Employee/EmployeeService';

import EmployeeFormDialog from '../../components/Admin/Employee/EmployeeFormDialog';
import ConfirmDeleteDialog from '../../components/Common/ConfirmDeleteDialog';
import EmployeeTable from '../../components/Admin/Employee/EmployeeTable';

function EmployeePage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openForm, setOpenForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const [sortField, setSortField] = useState('lastName');
  const [sortOrder, setSortOrder] = useState('asc');

  const loadEmployees = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit,
        sortField,
        sortOrder,
      };
      if (filter.trim()) {
        params.search = filter.trim(); 
      }
      const res = await fetchEmployees(params);
      setEmployees(res.data.data);
      setTotalPages(res.data.pages || 1);
    } catch (e) {
      console.error(e);
      showSnackbar('Ошибка загрузки', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, [page, filter, sortField, sortOrder, limit]);

  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCreate = () => {
    setEditData(null);
    setOpenForm(true);
  };

  const handleEdit = (emp) => {
    setEditData(emp);
    setOpenForm(true);
  };

  const handleDelete = async () => {
    try {
      await deleteEmployee(deleteTarget.badgeNumber);
      showSnackbar('Удалён успешно', 'success');
      loadEmployees();
    } catch (e) {
      console.error(e);
      showSnackbar('Ошибка удаления', 'error');
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleSubmit = async (formData, badgeNumber) => {
    try {
      if (editData) {
        await updateEmployee(badgeNumber, formData);
        showSnackbar('Обновлён успешно', 'success');
      } else {
        await createEmployee(formData);
        showSnackbar('Создан успешно', 'success');
      }
      setOpenForm(false);
      loadEmployees();
    } catch (e) {
      console.error(e);
      showSnackbar(e.response?.data?.message || 'Ошибка сохранения', 'error');
    }
  };

  const handlePatch = async (badgeNumber, field, value) => {
    try {
      await patchEmployee(badgeNumber, { [field]: value });
      loadEmployees();
    } catch (e) {
      console.error(e);
      showSnackbar('Ошибка обновления поля', 'error');
    }
  };

  const handleSort = (field) => {
    setPage(1);
    if (field === sortField) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Сотрудники</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleCreate}>
          Добавить сотрудника
        </Button>
      </Box>

      <TextField
        fullWidth
        label="Поиск"
        value={filter}
        onChange={(e) => {
          setPage(1);
          setFilter(e.target.value);
        }}
        sx={{ mb: 2 }}
      />

      <EmployeeTable
        employees={employees}
        loading={loading}
        onEdit={handleEdit}
        onDelete={(emp) => setDeleteTarget(emp)}
        onPatch={handlePatch}
        sortField={sortField}
        sortOrder={sortOrder}
        onSort={handleSort}
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
            {[5, 10, 20, 50].map(n => (
              <MenuItem key={n} value={n}>{n}</MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <Pagination count={totalPages} page={page} onChange={(_, value) => setPage(value)} />
      </Box>

      <EmployeeFormDialog
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSubmit={handleSubmit}
        editingData={editData}
      />

      <ConfirmDeleteDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        content={`Удалить сотрудника ${deleteTarget?.lastName} ${deleteTarget?.firstName}?`}
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

export default EmployeePage;
=======
import BaseCrudPage from '../../components/Admin/Base/BaseCrudPage';
import EditableTable from '../../components/Admin/Base/EditableTable';
import EmployeeFormDialog from '../../components/Admin/Employee/EmployeeFormDialog';
import * as employeeService from '../../components/Admin/Employee/EmployeeService';

const EMPLOYEE_COLUMNS = [
  { field: 'badgeNumber', label: 'Номер значка', sortable: false, editable: false },
  { field: 'unitCode', label: 'Код подразделения', sortable: false, editable: true },
  { field: 'lastName', label: 'Фамилия', sortable: false, editable: true },
  { field: 'firstName', label: 'Имя', sortable: false, editable: true },
  { field: 'patronymic', label: 'Отчество', sortable: false, editable: true },
  { field: 'rank', label: 'Звание', sortable: false, editable: true }
];

function EmployeePage() {
  return (
    <BaseCrudPage
      title="Сотрудники"
      entityName="сотрудника"
      service={employeeService}
      columns={EMPLOYEE_COLUMNS}
      FormComponent={EmployeeFormDialog}
      TableComponent={EditableTable}
      filterFields={[
        { key: 'search', label: 'Поиск по ФИО или номеру', fullWidth: true }
      ]}
      fetchMethodName="fetchEmployees"
      createMethodName="createEmployee"
      updateMethodName="updateEmployee"
      patchMethodName="patchEmployee"
      deleteMethodName="deleteEmployee"
      getItemId={(item) => item.badgeNumber}
      deleteConfirmContent={(item) => `Удалить сотрудника ${item.lastName} ${item.firstName}?`}
      transformParams={(params) => {
        const cleaned = {};
        if (params.search?.trim()) cleaned.search = params.search.trim();
        if (params.page) cleaned.page = params.page;
        if (params.limit) cleaned.limit = params.limit;
        return cleaned;
      }}
    />
  );
}

export default EmployeePage;
>>>>>>> develop
