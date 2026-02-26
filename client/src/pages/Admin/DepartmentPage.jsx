// client/src/pages/Admin/DepartmentPage.jsx
import BaseCrudPage from '../../components/Admin/Base/BaseCrudPage';
import EditableTable from '../../components/Admin/Base/EditableTable';
import DepartmentFormDialog from '../../components/Admin/RegistrationDepart/DepartmentFormDialog';
import * as departmentService from '../../components/Admin/RegistrationDepart/DepartmentService';

const DEPARTMENT_COLUMNS = [
  { field: 'unitCode', label: 'Код подразделения', sortable: false, editable: false }, // sortable: false
  { field: 'departmentName', label: 'Название отдела', sortable: false, editable: true },
  { field: 'address', label: 'Адрес', sortable: false, editable: true }
];

function DepartmentPage() {
  return (
    <BaseCrudPage
      title="Регистрационные отделы"
      entityName="отдел"
      service={departmentService}
      columns={DEPARTMENT_COLUMNS}
      FormComponent={DepartmentFormDialog}
      TableComponent={EditableTable}
      filterFields={[
        { key: 'search', label: 'Поиск по названию или адресу', fullWidth: true }
      ]}
      fetchMethodName="fetchDepartments"
      createMethodName="createDepartment"
      updateMethodName="updateDepartment"
      patchMethodName="patchDepartment"
      deleteMethodName="deleteDepartment"
      getItemId={(item) => item.unitCode}
      deleteConfirmContent={(item) => `Удалить отдел "${item.departmentName}"?`}
      // Убираем sortField и sortOrder из параметров
      transformParams={(params) => {
        const cleaned = {};
        if (params.search?.trim()) cleaned.search = params.search.trim();
        if (params.page) cleaned.page = params.page;
        if (params.limit) cleaned.limit = params.limit;
        // Не добавляем sortField и sortOrder
        return cleaned;
      }}
    />
  );
}

export default DepartmentPage;