import { Outlet, Navigate} from 'react-router-dom';
import { useAuth } from "./AuthContext.tsx";
import { AuthContextData } from "./interfaces/AuthContextData.ts";
import { ProfileProvider } from "./ProfileContext.tsx";

const PrivateRoutes = () => {
  const { user }  = useAuth() as AuthContextData;

  return user
    ?
      (
        <ProfileProvider>
          <Outlet/>
        </ProfileProvider>
      )
    : <Navigate to="/login"/>
}

export default PrivateRoutes;