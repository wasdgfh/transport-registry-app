import {
  Container, Typography, Tabs, Tab, Box,
  TextField, Pagination, Snackbar,
  FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { useEffect, useState } from 'react';

import {
  getLegalEntities,
  getNaturalPersons,
  patchLegalEntity,
  patchNaturalPerson
} from '../../components/Employee/Owner/OwnerService';

import OwnerTable from '../../components/Employee/Owner/OwnerTable';
import OwnerFormDialog from '../../components/Employee/Owner/OwnerFormDialog';

function OwnerPage() {
  const [tab, setTab] = useState(0);
  const type = tab === 0 ? 'natural' : 'legal';

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState('ASC');

  const [editingCell, setEditingCell] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  const sortField = type === 'natural' ? 'passportData' : 'taxNumber';

  useEffect(() => {
    setPage(1); 
  }, [type]);

  useEffect(() => {
    fetchData();
  }, [page, sortOrder, search, type, limit]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit,
        sortBy: sortField,
        sortOrder,
        search
      };
      const res = type === 'natural'
        ? await getNaturalPersons(params)
        : await getLegalEntities(params);

      setData(res.data.data);
      setTotalPages(Math.ceil(res.data.total / limit));
    } catch (e) {
      console.error('Ошибка загрузки:', e);
      showSnackbar('Ошибка загрузки данных', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field) => {
    if (field === sortField) {
      setSortOrder(prev => prev === 'ASC' ? 'DESC' : 'ASC');
    }
  };

  const handleKeyDown = async (e, id, field, value) => {
    if (e.key === 'Enter') {
      try {
        const payload = { [field]: value };
        if (type === 'natural') {
          await patchNaturalPerson(id, payload);
        } else {
          await patchLegalEntity(id, payload);
        }
        showSnackbar('Сохранено', 'success');
        fetchData();
      } catch (error) {
        console.error('Ошибка при сохранении:', error);
        showSnackbar('Ошибка при сохранении', 'error');
      } finally {
        setEditingCell(null);
      }
    }
  };

  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" mb={3}>Владельцы</Typography>

      <Tabs value={tab} onChange={(_, newTab) => setTab(newTab)} sx={{ mb: 2 }}>
        <Tab label="Физические лица" />
        <Tab label="Юридические лица" />
      </Tabs>

      <TextField
        label="Поиск"
        fullWidth
        value={search}
        onChange={(e) => {
          setPage(1);
          setSearch(e.target.value);
        }}
        sx={{ mb: 2 }}
      />

      <OwnerTable
        data={data}
        loading={loading}
        type={type}
        sortField={sortField}
        sortOrder={sortOrder}
        onSort={handleSort}
        onEditClick={(item) => {
            setEditData(item);
            setEditDialogOpen(true);
        }}
        onDoubleClickEdit={(id, field, value) =>
            setEditingCell({ id, field, value })
        }
        editingCell={editingCell}
        setEditingCell={setEditingCell}
        handleKeyDown={handleKeyDown}
        patchNaturalPerson={patchNaturalPerson}
        patchLegalEntity={patchLegalEntity}
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
        
        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, value) => setPage(value)}
        />
      </Box>

      <OwnerFormDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        editingData={editData}
        type={type}
        onSubmit={async (id, payload) => {
          try {
            if (type === 'natural') {
              await patchNaturalPerson(id, payload);
            } else {
              await patchLegalEntity(id, payload);
            }
            showSnackbar('Сохранено', 'success');
            fetchData();
          } catch (err) {
            console.error(err);
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

export default OwnerPage;
