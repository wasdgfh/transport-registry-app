import { useState } from 'react';
import { Container, Button, Typography, Snackbar, Alert } from '@mui/material';
import RegistrationWithVehicleDialog from './RegistrationWithVehicleDialog';
import OwnerVehiclesList from './OwnerVehiclesList'; 

function RegistrationVehiclePage() {
  const [open, setOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSuccess = (data) => {
    setOpen(false);
    if (typeof data === 'object' && data !== null) {
      const message = `Заявление успешно отправлено. Обратитесь в регистрационный отдел ${data.unitCode}.`;
      setSuccessMessage(message);
    } 
    setSuccessOpen(true);
  };

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" gutterBottom>Ваши транспортные средства</Typography>

      {!open && (
        <Button variant="contained" onClick={() => setOpen(true)}>
          Подать заявление на регистрацию ТС
        </Button>
      )}

      <RegistrationWithVehicleDialog
        open={open}
        onClose={() => setOpen(false)}
        onSuccess={handleSuccess}
      />

      <OwnerVehiclesList onSuccess={handleSuccess}/>

      <Snackbar
        open={successOpen}
        autoHideDuration={6000}
        onClose={() => setSuccessOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSuccessOpen(false)}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default RegistrationVehiclePage;
