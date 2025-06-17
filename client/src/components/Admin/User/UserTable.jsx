import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

function UserTable({ users = [] }) {
  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>Email</TableCell>
          <TableCell>Роль</TableCell>
          <TableCell>Идентификатор</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.role}</TableCell>
            <TableCell>{user.passportData || user.taxNumber || user.badgeNumber || '—'}</TableCell>
          </TableRow>
        ))}
        {users.length === 0 && (
          <TableRow>
            <TableCell colSpan={3} align="center">
              Нет данных
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

export default UserTable;
