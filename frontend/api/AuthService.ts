import axios, { AxiosInstance } from "axios";

class AuthService {
  private axiosInstance: AxiosInstance;

  constructor(baseURL: string) {
    this.axiosInstance = axios.create({
      baseURL,
      withCredentials: true,
    });
  }

  public async validateUserSession() {
    return this.axiosInstance.get('/session');
  }

  public async logoutUser() {
    return this.axiosInstance.get('/logout');
  }

  public async validate2FASession() {
    return this.axiosInstance.get('/2fa/session');
  }

  public async enable2FA(code: string) {
    return this.axiosInstance.post('/2fa/turn-on', { code });
  }

  public async disable2FA() {
    return this.axiosInstance.post('/2fa/turn-off', {});
  }

  public async validateOTP(code: string) {
    return this.axiosInstance.post('/2fa/validate', { code });
  }
}

const authService: AuthService = new AuthService('http://localhost:3000/api/auth');

export default authService;