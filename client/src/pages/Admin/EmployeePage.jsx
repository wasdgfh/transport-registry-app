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