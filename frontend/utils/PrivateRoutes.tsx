import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext.tsx";
import { AuthContextData } from "./interfaces/AuthContextData.ts";
import { ProfileProvider } from "./ProfileContext.tsx";

const PrivateRoutes = () => {
  const { user }  = useAuth() as AuthContextData;
    const location = useLocation();

  if (!user) {
    return <Navigate to="/login"/>
  }

  return location.pathname.startsWith("/welcome")
    ? <Outlet/>
    : <ProfileProvider><Outlet/></ProfileProvider>;
}

export default PrivateRoutes;