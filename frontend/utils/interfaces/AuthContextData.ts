import { FortyTwoUser } from "../../../backend/src/auth";

export interface AuthContextData {
  //user: FortyTwoUser | null;
  user: boolean
  logoutUser: () => void;
  register2FA: () => void;
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
