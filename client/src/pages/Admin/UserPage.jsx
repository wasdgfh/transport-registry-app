import { useState } from 'react';
import { 
  Select, MenuItem, FormControl, InputLabel,
  IconButton, Box 
} from '@mui/material';
import { Lock, Edit, Delete } from '@mui/icons-material';
import BaseCrudPage from '../../components/Admin/Base/BaseCrudPage';
import EditableTable from '../../components/Admin/Base/EditableTable';
import UserFormDialog from '../../components/Admin/User/UserFormDialog';
import ChangePasswordDialog from '../../components/Admin/User/ChangePasswordDialog';
import * as userService from '../../components/Admin/User/UserService';

const USER_COLUMNS = [
  { field: 'email', label: 'Email', sortable: true, editable: true },
  { field: 'role', label: 'Роль', sortable: true, editable: false },
  { 
    field: 'identifier', 
    label: 'Идентификатор', 
    sortable: false, 
    editable: false,
    render: (user) => user.passportData || user.taxNumber || user.badgeNumber || '—'
  }
];

function UserPage() {
  const [roleFilter, setRoleFilter] = useState('');
  const [selectedUser, setSelectedUser] = useState(null); 
  const [openPassword, setOpenPassword] = useState(false);

  const handleOpenPassword = (user) => {
    setSelectedUser(user);
    setOpenPassword(true);
  };

  const handlePasswordChanged = () => {
    setOpenPassword(false);
    setSelectedUser(null);
  };

  const renderUserActions = (user, onEdit, onDelete) => (
    <Box display="flex" gap={1}>
      <IconButton size="small" onClick={() => onEdit(user)} color="primary">
        <Edit fontSize="small" />
      </IconButton>
      <IconButton size="small" onClick={() => onDelete(user)} color="error">
        <Delete fontSize="small" />
      </IconButton>
      <IconButton size="small" onClick={() => handleOpenPassword(user)} color="primary">
        <Lock fontSize="small" />
      </IconButton>
    </Box>
  );

  const RoleFilter = (
    <FormControl sx={{ minWidth: 200 }} size="small">
      <InputLabel>Фильтр по роли</InputLabel>
      <Select
        value={roleFilter}
        label="Фильтр по роли"
        onChange={(e) => setRoleFilter(e.target.value)}
      >
        <MenuItem value="">Все роли</MenuItem>
        <MenuItem value="ADMIN">Админ</MenuItem>
        <MenuItem value="EMPLOYEE">Сотрудник</MenuItem>
        <MenuItem value="OWNER">Владелец</MenuItem>
      </Select>
    </FormControl>
  );

  return (
    <>
      <BaseCrudPage
        title="Пользователи"
        entityName="пользователя"
        service={userService}
        columns={USER_COLUMNS}
        FormComponent={UserFormDialog}
        TableComponent={EditableTable}
        filterFields={[
          { key: 'search', label: 'Поиск по email или идентификатору', fullWidth: true }
        ]}
        initialFilter={{ role: roleFilter }}
        additionalActions={RoleFilter}
        fetchMethodName="getUsers"
        createMethodName="createUser"
        patchMethodName="patchUser"
        deleteMethodName="deleteUser"
        updateMethodName="patchUser"
        getItemId={(item) => item.id}
        renderActions={renderUserActions} 
        transformData={(data) => {
          const cleaned = { ...data };
          Object.keys(cleaned).forEach(key => {
            if (cleaned[key] === '') delete cleaned[key];
          });
          return cleaned;
        }}
        deleteConfirmContent={(item) => `Удалить пользователя ${item.email}?`}
        transformParams={(params) => {
          const cleaned = {};
          if (params.search) cleaned.search = params.search;
          if (params.page) cleaned.page = params.page;
          if (params.limit) cleaned.limit = params.limit;
          if (params.role && params.role !== '') cleaned.role = params.role;
          return cleaned;
        }}
      />

      <ChangePasswordDialog
        open={openPassword}
        onClose={() => setOpenPassword(false)}
        user={selectedUser}
        onPasswordChanged={handlePasswordChanged}
      />
    </>
  );
}

export default UserPage;
