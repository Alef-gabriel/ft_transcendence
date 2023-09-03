import { Outlet, Navigate} from 'react-router-dom';
import { useAuth } from "./AuthContext.tsx";
import { AuthContextData } from "./interfaces/AuthContextData.ts";

const PrivateRoutes = () => {
  const { user }  = useAuth() as AuthContextData;

  return user ? <Outlet/> : <Navigate to="/login"/>
}

export default PrivateRoutes;