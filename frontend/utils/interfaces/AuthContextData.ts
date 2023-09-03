import { Models } from "appwrite";

export interface AuthContextData {
  user: Models.User<Models.Preferences> | null;
  loginUser: (userInfo: UserInfo) => void;
  logoutUser: () => void;
  registerUser: (userInfo: UserRegisterInfo) => void;
}

export interface UserInfo {
  email: string;
  password: string;
}

export interface UserRegisterInfo {
  name: string;
  email: string;
  password1: string;
  password2: string;
}
