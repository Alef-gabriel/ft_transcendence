import { Models } from "appwrite";

export interface AuthContextData {
  user: Models.User<Models.Preferences> | null;
  loginUser: (userInfo: UserInfo) => void;
  logoutUser: () => void;
  registerUser: (userInfo: UserInfo) => void;
}

export interface UserInfo {
  password: string;
  email: string;
}
