import { useState, useEffect, useCallback } from 'react';
import {
  Container, Typography, Button, Box, Snackbar, TextField, Pagination,
  FormControl, InputLabel, Select, MenuItem, IconButton
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import ConfirmDeleteDialog from '../../Common/ConfirmDeleteDialog';

function BaseCrudPage({
  title,
  entityName,
  service,
  columns,
  FormComponent,
  TableComponent,
  filterFields,
  initialFilter = {},
  getItemId = (item) => item.id || item.badgeNumber || item.unitCode,
  deleteConfirmContent = (item) => `Удалить ${entityName}?`,
  additionalActions,
  transformData = (data) => data,
  transformParams = (params) => {
    const cleaned = {};
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        cleaned[key] = value;
      }
    });
    return cleaned;
  },
  fetchMethodName = 'fetch',
  createMethodName = 'create',
  updateMethodName = 'update',
  patchMethodName = 'patch',
  deleteMethodName = 'delete',
  renderActions = (item, onEdit, onDelete) => (
    <Box display="flex" gap={1}>
      <IconButton size="small" onClick={() => onEdit(item)} color="primary">
        <Edit fontSize="small" />
      </IconButton>
      <IconButton size="small" onClick={() => onDelete(item)} color="error">
        <Delete fontSize="small" />
      </IconButton>
    </Box>
  )
}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  
  const [filters, setFilters] = useState(initialFilter);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [sortField, setSortField] = useState(columns[0]?.field);
  const [sortOrder, setSortOrder] = useState('asc');

  const callServiceMethod = useCallback((methodName, ...args) => {
    if (service && typeof service[methodName] === 'function') {
      return service[methodName](...args);
    }
    throw new Error(`Service method '${methodName}' is not defined`);
  }, [service]);

  useEffect(() => {
    const hasChanges = Object.keys(initialFilter).some(
      key => initialFilter[key] !== filters[key]
    );
    
    if (hasChanges) {
      setFilters(initialFilter);
      setPage(1); 
    }
  }, [initialFilter, filters]); 

  const loadItems = useCallback(async () => {
    setLoading(true);
    try {
      const baseParams = { 
        page, 
        limit,
        ...filters 
      };
      
      if (sortField && columns.some(col => col.field === sortField && col.sortable)) {
        baseParams.sortField = sortField;
        baseParams.sortOrder = sortOrder;
      }
      
      const params = transformParams(baseParams);
      
      const res = await callServiceMethod(fetchMethodName, params);
      
      const data = res.data?.data || res.data || res;
      const pages = res.data?.pages || res.data?.totalPages || 1;
      
      setItems(Array.isArray(data) ? data : []);
      setTotalPages(pages);
    } catch (e) {
      showSnackbar(`Ошибка загрузки ${entityName}`, 'error');
      console.error('Load error:', e);
    } finally {
      setLoading(false);
    }
  }, [page, limit, sortField, sortOrder, filters, columns, callServiceMethod, 
      fetchMethodName, entityName, transformParams]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCreate = () => {
    setEditData(null);
    setOpenForm(true);
  };

  const handleEdit = (item) => {
    setEditData(item);
    setOpenForm(true);
  };

  const handleDelete = async () => {
    try {
      const id = getItemId(deleteTarget);
      await callServiceMethod(deleteMethodName, id);
      showSnackbar('Удалено успешно', 'success');
      loadItems();
    } catch (e) {
      showSnackbar('Ошибка удаления', 'error');
      console.error('Delete error:', e);
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleSubmit = async (formData, id) => {
    try {
      const transformedData = transformData(formData);
      
      if (editData) {
        const itemId = id || getItemId(editData);
        await callServiceMethod(updateMethodName, itemId, transformedData);
        showSnackbar('Обновлено успешно', 'success');
      } else {
        await callServiceMethod(createMethodName, transformedData);
        showSnackbar('Создано успешно', 'success');
      }
      setOpenForm(false);
      loadItems();
    } catch (e) {
      showSnackbar(e.response?.data?.message || 'Ошибка сохранения', 'error');
      console.error('Submit error:', e);
    }
  };

  const handlePatch = async (id, field, value) => {
    try {
      await callServiceMethod(patchMethodName, id, { [field]: value });
      showSnackbar('Поле обновлено', 'success');
      loadItems();
    } catch (e) {
      showSnackbar('Ошибка обновления поля', 'error');
      console.error('Patch error:', e);
    }
  };

  const handleSort = (field) => {
    const column = columns.find(col => col.field === field);
    if (!column?.sortable) return;
    
    setPage(1);
    if (field === sortField) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleFilterChange = (key, value) => {
    setPage(1);
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleFilterClear = () => {
    setPage(1);
    setFilters(initialFilter);
  };

  const columnsWithActions = [
    ...columns,
    {
      field: 'actions',
      label: 'Действия',
      sortable: false,
      editable: false,
      render: (item) => renderActions(item, handleEdit, setDeleteTarget)
    }
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">{title}</Typography>
        <Box display="flex" gap={2}>
          {additionalActions}
          <Button variant="contained" startIcon={<Add />} onClick={handleCreate}>
            Добавить
          </Button>
        </Box>
      </Box>

      {filterFields && (
        <Box display="flex" gap={2} mb={2} alignItems="center">
          {filterFields.map(field => (
            <TextField
              key={field.key}
              label={field.label}
              value={filters[field.key] || ''}
              onChange={(e) => handleFilterChange(field.key, e.target.value)}
              fullWidth
              size="small"
            />
          ))}
          <Button 
            variant="outlined" 
            onClick={handleFilterClear}
            size="small"
            sx={{ minWidth: '100px', whiteSpace: 'nowrap' }}
          >
            Сбросить
          </Button>
        </Box>
      )}

      <TableComponent
        items={items}
        loading={loading}
        columns={columnsWithActions}
        onEdit={handleEdit}
        onDelete={setDeleteTarget}
        onPatch={handlePatch}
        sortField={sortField}
        sortOrder={sortOrder}
        onSort={handleSort}
      />

      <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
        <FormControl sx={{ minWidth: 120 }} size="small">
          <InputLabel>Показывать по</InputLabel>
          <Select
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
        
        <Pagination 
          count={totalPages} 
          page={page} 
          onChange={(_, value) => setPage(value)} 
          color="primary"
        />
      </Box>

      <FormComponent
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSubmit={handleSubmit}
        editingData={editData}
      />

      <ConfirmDeleteDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        content={deleteTarget ? deleteConfirmContent(deleteTarget) : `Удалить ${entityName}?`}
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

export default BaseCrudPage;