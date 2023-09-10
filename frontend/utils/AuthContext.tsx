import { createContext, FC, ReactNode, useContext, useEffect, useState } from "react";
import { AuthContextData } from "./interfaces/AuthContextData.ts";
import axios from "axios";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { FortyTwoUserDto } from "../../backend/src/auth/models/forty-two-user.dto.ts";

const AuthContext = createContext({});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {

  const navigate: NavigateFunction = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<FortyTwoUserDto | null>(null);

  useEffect(() => {
    validateUserSession();
  }, [navigate]);

  const validateUserSession = async () => {
    try {
      const statusResponse = await axios.get("http://localhost:3000/api/auth/session",
        { withCredentials: true });

      console.log("### User session validated");
      setUser(statusResponse.data);
    } catch (error) {
      console.log(error);
      setUser(null)
      navigate('/login');
    }

    setLoading(false);
  };

  const logoutUser = async () => {
    try {
      await axios.get("http://localhost:3000/api/auth/logout",
        { withCredentials: true });
      setUser(null);
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  const enable2FA = async (code: string) => {
    try {
      await axios.post("http://localhost:3000/api/auth/2fa/turn-on", { code }, { withCredentials: true });
    } catch (error) {
      console.log(error);
    }
  };

  const disable2FA = async () => {
    try {
      await axios.post("http://localhost:3000/api/auth/2fa/turn-off");
    } catch (error) {
      console.log(error);
    }
  };

  const contextData: AuthContextData = { user, logoutUser, enable2FA, disable2FA };

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? <p>Loading...</p> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): unknown => useContext(AuthContext);

export default AuthContext;