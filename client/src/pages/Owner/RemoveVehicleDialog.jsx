import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, CircularProgress, Typography
} from '@mui/material';
import { useState } from 'react';
import api from '../../http';

function RemoveVehicleDialog({ open, onClose, vehicle, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleRemove = async () => {
    setLoading(true);
    try {
      await api.post('/owner/reg-op', {
        vin: vehicle.vin,
        unitCode: vehicle.unitCode,
        operationType: 'Снятие с учета',
        operationBase: 'Заявление на снятие ТС с регистрационного учета',
        operationDate: new Date().toISOString().split('T')[0]
      });

      if (vehicle.operationId) {
        await api.patch(`/employee/reg-op/${vehicle.operationId}`, {
          registrationNumber: null
        });
      }

      onSuccess?.('ТС успешно снято с учета.');
      onClose();
    } catch (e) {
      console.error('Ошибка снятия с учета:', e);
    } finally {
      setLoading(false);
      setConfirmOpen(false);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>Снятие ТС с учета</DialogTitle>
        <DialogContent dividers>
          <Typography>
            Вы действительно хотите снять транспортное средство с учета?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Отмена</Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => setConfirmOpen(true)}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Снять с учета'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Подтверждение</DialogTitle>
        <DialogContent dividers>
          <Typography>
            Вы уверены, что хотите снять ТС с учета? Это действие необратимо.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Нет</Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleRemove}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Да, снять'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default RemoveVehicleDialog;
