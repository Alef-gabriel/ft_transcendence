import { ProfileDTO } from "../../../backend/src/profile/models/profile.dto";

export interface ProfileContextData {
  profile: ProfileDTO | null;
  updateProfileContext: () => void;
  createProfile: (nickname: string) => Promise<void>;
  uploadImage: (formData: FormData) => Promise<void>;
}