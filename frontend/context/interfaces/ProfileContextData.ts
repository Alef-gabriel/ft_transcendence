import { ProfileDTO } from "../../../backend/src/profile/models/profile.dto";

export interface ProfileContextData {
  profile: ProfileDTO | null;
  avatarImageUrl: string | undefined;
  updateProfileContext: () => void;
  createProfile: (nickname: string) => Promise<void>;
  uploadAvatarImage: (formData: FormData) => Promise<void>;
}