import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.tsx";
import { AuthContextData } from "../../context/interfaces/AuthContextData.ts";
import { ProfileProvider } from "../../context/ProfileContext.tsx";
//import { ProfileProvider } from "./ProfileContext.tsx";

const PrivateRoutes = () => {
  const { user } = useAuth() as AuthContextData;


  return !user ? <Navigate to="/login" />
    : (
      <ProfileProvider>
        <Outlet />
      </ProfileProvider>
    );
};

export default PrivateRoutes;