import Auth from './pages/Auth/Auth';
import RegisterNaturalOwner from './pages/Auth/RegistrationNaturalOwner'
import RegisterLegalOwner from './pages/Auth/RegistrationLegalOwner'
import RegisterEmployee from './pages/Auth/RegistrationEmployee';
import NotFound from './pages/Error/NotFound';
import DepartmentPage from './pages/Admin/DepartmentPage';
import ProfilePage from './pages/ProfilePage';
import ForbiddenPage from './pages/Error/ForbiddenPage';
import EmployeePage from './pages/Admin/EmployeePage';
import UserPage from './pages/Admin/UserPage';
import OwnerPage from './pages/Employee/OwnerPage';
import { 
  LOGIN_ROUTE, 
  REGISTER_NATURAL_ROUTE,
  REGISTER_LEGAL_ROUTE, 
  REGISTRATION_EMPLOYEE_ROUTE,
  DEPARTMENTS_ROUTE,
  PROFILE_ROUTE,
  EMPLOYEES_ROUTE,
  USERS_ROUTE,
  OWNER_ROUTE
} from "./utils/consts";

export const authRoutes = [
  {
    path: OWNER_ROUTE,
    Component: OwnerPage,
    roles: ['EMPLOYEE']
  },
  {
    path: USERS_ROUTE,
    Component: UserPage,
    roles: ['ADMIN']
  },
  {
    path: DEPARTMENTS_ROUTE,
    Component: DepartmentPage,
    roles: ['ADMIN'] 
  },
  {
    path: EMPLOYEES_ROUTE,
    Component: EmployeePage,
    roles: ['ADMIN']
  },
  {
    path: PROFILE_ROUTE,
    Component: ProfilePage,
    roles: ['ADMIN', 'EMPLOYEE', 'OWNER']
  }
];

export const publicRoutes = [
  {
    path: LOGIN_ROUTE,
    Component: Auth
  },
  {
    path: REGISTER_NATURAL_ROUTE,
    Component: RegisterNaturalOwner
  },
  {
    path: REGISTER_LEGAL_ROUTE,
    Component: RegisterLegalOwner
  },
  {
    path: REGISTRATION_EMPLOYEE_ROUTE,
    Component: RegisterEmployee
  },
  {
    path: '/403',
    Component: ForbiddenPage
  },
  {
    path: '*',
    Component: NotFound
  }
];