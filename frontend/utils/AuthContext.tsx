import { useContext, useState, useEffect, createContext } from 'react';
import { AuthContextData, UserInfo } from "./interfaces/AuthContextData.ts";
import { account} from "../appwriteConfig.ts";
import { Models } from "appwrite";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {

  const [loading, setLoading] = useState(true);
  const [user, setUser ] = useState<Models.User<Models.Preferences> | null>(null);

  useEffect(() => {
    //const user = sessionStorage.getItem('user');
    checkUserStatus();
  }, []);

  const loginUser = async (userInfo: UserInfo) => {
      setLoading(true);
      try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        await account.createEmailSession(userInfo.email, userInfo.password);
        const accountDetails: Models.User<Models.Preferences> = await account.get();

        console.log('accountDetails:', accountDetails);
        setUser(accountDetails);
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
  }

  const logoutUser = () => {
    account.deleteSession('current').then(r => console.log(r));
    setUser(null);
  }

  const registerUser = (userInfo: UserInfo) => {

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