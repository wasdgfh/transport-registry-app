import Admin from './pages/Admin';
import Auth from './pages/Auth';
import RegisterNaturalOwner from './pages/RegistrationNaturalOwner'
import RegisterLegalOwner from './pages/RegistrationLegalOwner'
import RegisterEmployee from './pages/RegistrationEmployee';
import NotFound from './pages/NotFound';
import { 
  ADMIN_ROUTE, 
  LOGIN_ROUTE, 
  REGISTER_NATURAL_ROUTE,
  REGISTER_LEGAL_ROUTE, 
  REGISTRATION_EMPLOYEE_ROUTE 
} from "./utils/consts";

export const authRoutes = [
  {
    path: ADMIN_ROUTE,
    Component: Admin
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
    path: '*',
    Component: NotFound
  }
];