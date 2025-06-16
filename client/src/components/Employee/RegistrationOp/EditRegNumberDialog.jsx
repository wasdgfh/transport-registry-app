import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Autocomplete, TextField, CircularProgress, Box
} from '@mui/material';
import { useState, useEffect, useMemo } from 'react';
import debounce from 'lodash.debounce';
import { getAvailableRegNumbers } from './RegistrationOpService';

function EditRegNumberDialog({ open, onClose, onSubmit, operationId, currentRegNumber }) {
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState('');
  const [loading, setLoading] = useState(false);
  const [operationDate, setOperationDate] = useState('');

  const fetchOptions = useMemo(() =>
    debounce(async (query) => {
      setLoading(true);
      try {
        const res = await getAvailableRegNumbers(query);
        const list = res.includes(currentRegNumber) || !currentRegNumber
          ? res
          : [currentRegNumber, ...res];
        setOptions(list);
      } finally {
        setLoading(false);
      }
    }, 300), [currentRegNumber]);

  useEffect(() => {
    if (open) {
      setInputValue(currentRegNumber || '');
      setSelected(currentRegNumber || '');
      setOperationDate(new Date().toISOString().split('T')[0]);
      fetchOptions(currentRegNumber || '');
    }
  }, [open, currentRegNumber, fetchOptions]);

  const handleSave = () => {
    if (selected && operationDate) {
      onSubmit(operationId, selected, operationDate);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Изменить гос. номер и дату операции</DialogTitle>
      <DialogContent>
        <Box mt={2} display="flex" flexDirection="column" gap={3}>
            <Autocomplete
                freeSolo
                options={options}
                inputValue={inputValue}
                onInputChange={(_, val) => {
                setInputValue(val);
                fetchOptions(val);
                }}
                onChange={(_, val) => setSelected(val)}
                value={selected}
                renderInput={(params) => (
                <TextField
                    {...params}
                    label="Новый номер"
                    placeholder="Введите или выберите"
                />
                )}
                loading={loading}
                slots={{
                endAdornment: () => (
                    <>
                    {loading && <CircularProgress color="inherit" size={20} />}
                    </>
                )
                }}
            />
            <TextField
                label="Дата операции"
                type="date"
                value={operationDate}
                onChange={(e) => setOperationDate(e.target.value)}
                slotProps={{
                    inputLabel: { shrink: true }
                }}
            />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button onClick={handleSave} variant="contained" disabled={!selected || !operationDate}>
          Сохранить
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditRegNumberDialog;
