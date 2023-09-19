import axios, { AxiosInstance } from "axios/index";


class ProfileService {
  private axiosInstance: AxiosInstance;

  constructor(baseURL: string) {
    this.axiosInstance = axios.create({
      baseURL,
      withCredentials: true,
    });
  }

  public async getProfile() {
    return this.axiosInstance.get('');
  }

  public async createProfile(nickname: string) {
    return this.axiosInstance.post('/create', { nickname });
  }

  public async uploadAvatarImage(formData: FormData) {
    return this.axiosInstance.post('/avatar', formData);
  }

  public async getAvatarImage(avatarId: number) {
    return this.axiosInstance.post(`$/avatar/${avatarId}`);
  }
}

const profileService: ProfileService = new ProfileService('http://localhost:3000/api/profile');

export default profileService;