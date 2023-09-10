import { createContext, FC, ReactNode, useContext, useEffect, useState } from "react";
import { AuthContextData } from "./interfaces/AuthContextData.ts";
import axios from "axios";

const AuthContext = createContext({});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children } ) => {

  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser ] = useState<boolean | null>(null);

  useEffect(() => {
    //const user = sessionStorage.getItem('user');
    validateUserSession();
  }, []);


  const logoutUser = async () => {
    try {
      await axios.get('http://localhost:3000/api/auth/logout',
        { withCredentials: true });
      setUser(false);
    } catch (error) {
      console.log(error);
    }
  }

  const validateUserSession = async () => {
    //Trocar para obter infomrações do usuário e setar no contexto

    try {
      const statusResponse = await axios.get('http://localhost:3000/api/auth/status',
        { withCredentials: true });

      if (statusResponse.status === 200) {
        console.log("User is logged in");
        setUser(true);
      }

    } catch (error) {
      console.log(error);
    }

    setLoading(false)
  }

  const register2FA = async () => {
    try {
      await axios.post('http://localhost:3000/api/auth/register');
    } catch (error) {
      console.log(error);
    }
  }

  const contextData: AuthContextData = { user, logoutUser, register2FA }

  return (
    <AuthContext.Provider value={contextData}>
      { loading ? <p>Loading...</p> : children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): unknown => useContext(AuthContext);

export default AuthContext;