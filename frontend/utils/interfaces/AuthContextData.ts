import { FortyTwoUser } from "../../../backend/src/auth";

export interface AuthContextData {
  user: FortyTwoUser | null;
  logoutUser: () => void;
  enable2FA: (code: string) => void;
  disable2FA: () => void;
}


export interface UserRegisterInfo {
  name: string;
  email: string;
  password1: string;
  password2: string;
}
