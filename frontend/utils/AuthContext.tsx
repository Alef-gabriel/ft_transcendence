import { useContext, useState, useEffect, createContext, ReactNode, FC } from "react";
import { AuthContextData, UserInfo, UserRegisterInfo } from "./interfaces/AuthContextData.ts";
import { account} from "../appwriteConfig.ts";
import { Models } from "appwrite";
import { ID } from "appwrite";

const AuthContext = createContext({});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children } ) => {

  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser ] = useState<Models.User<Models.Preferences> | null>(null);

  useEffect(() => {
    //const user = sessionStorage.getItem('user');
    checkUserStatus();
  }, []);

  const loginUser = async (userInfo: UserInfo) => {
      setLoading(true);
      try {
        await account.createEmailSession(userInfo.email, userInfo.password);
        const accountDetails: Models.User<Models.Preferences> = await account.get();

        setUser(accountDetails);
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
  }

  const logoutUser = () => {
    account.deleteSession('current');
    setUser(null);
  }

  const registerUser = async (userRegisterInfo: UserRegisterInfo) => {
    setLoading(true);

    try {
      await account.create(
        ID.unique(),
        userRegisterInfo.email,
        userRegisterInfo.password1,
        userRegisterInfo.name);

      await account.createEmailSession(userRegisterInfo.email, userRegisterInfo.password1);
      const accountDetails: Models.User<Models.Preferences> = await account.get();

      setUser(accountDetails);
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  }

  const checkUserStatus = async () => {
    try {
      const accountDetails: Models.User<Models.Preferences> = await account.get();
      setUser(accountDetails);
    } catch (error) {
      console.log(error);
    }

    setLoading(false)
  }

  const contextData: AuthContextData = { user, loginUser, logoutUser, registerUser }

  return (
    <AuthContext.Provider value={contextData}>
      { loading ? <p>Loading...</p> : children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): unknown => useContext(AuthContext);

export default AuthContext;