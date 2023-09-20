import { createContext, FC, ReactNode, useContext, useEffect, useState } from "react";
import { ProfileContextData } from "./interfaces/ProfileContextData";
import useThrowAsyncError from "../utils/hooks/useThrowAsyncError";
import { ProfileDTO } from "../../backend/src/profile/models/profile.dto";
import AuthContext from "./AuthContext";
import { useLocation } from "react-router-dom";
import { AuthContextData } from "./interfaces/AuthContextData.ts";
import profileService from "../api/ProfileService.ts";
import { AxiosResponse, isAxiosError } from "axios";

const ProfileContext = createContext({});

ProfileContext.displayName = "ProfileContext";

interface ProfileProvideProps {
  children: ReactNode;
}

//TODO: Bug Avatar não aparece na primeira vez que o usuário faz login
export const ProfileProvider: FC<ProfileProvideProps> = ({ children }) => {
  const { user } = useContext(AuthContext) as AuthContextData;
  const [loading, setLoading] = useState<boolean>(true);
  const [avatarImageUrl, setAvatarImageUrl] = useState<string | undefined>(undefined);
  const [profile, setProfile] = useState<ProfileDTO | null>(null);
  const throwAsyncError = useThrowAsyncError();
  const location = useLocation();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    updateProfileContext();
  }, []);

  useEffect(() => {
    getAvatarImage(profile?.avatarId);
  }, [profile]);

  const updateProfileContext = async (): Promise<void> => {
    if (location.pathname === '/validate-otp') {
      console.log(`### Profile context update skipped for validate-otp page`);
      setLoading(false);
      return;
    }

    try {
      const response: AxiosResponse<ProfileDTO> = await profileService.getProfile();

      console.log(`### Profile context updated: ${JSON.stringify(response.data)}`);
      setProfile(response.data);
      setLoading(false);
    } catch (error) {
      console.log(`### Profile context update failed: ${error}`);
      if (isAxiosError(error) && error.response?.status !== 404) {
        throwAsyncError(error);
      } else {
        setLoading(false);
      }
    }
  };

  const createProfile = async (nickname: string): Promise<void> => {
    try {
      const response: AxiosResponse<ProfileDTO> = await profileService.createProfile(nickname);

      console.log(`### Profile created: ${JSON.stringify(response.data)}`);
      setProfile(response.data);
    } catch (error) {
      console.log(`### Profile creation failed: ${error}`);
      throwAsyncError(error);
    }
  };

  const uploadAvatarImage = async (formData: FormData): Promise<void> => {
    try {
      const response: AxiosResponse<ProfileDTO> = await profileService.uploadAvatarImage(formData);

      console.log(`### Avatar uploaded: ${JSON.stringify(response.data)}`);
      await updateProfileContext();
    } catch (error) {
      console.log(`### Avatar upload failed: ${error}`);
      throwAsyncError(error);
    }
  };

  const getAvatarImage = async (avatarId :number | undefined): Promise<void> => {
    if (!avatarId) {
      console.log(`### AvatarId is undefined, skipping avatar image fetch`);
      return;
    }

    try {
      const response: AxiosResponse<Blob> = await profileService.getAvatarImage(avatarId);

      const blob: Blob = new Blob([response.data], { type: response.headers['content-type'] });
      setAvatarImageUrl(URL.createObjectURL(blob));
    } catch(error) {
      console.error('Error fetching image:', error);
      throwAsyncError(error);
    }
  }

  const contextData: ProfileContextData = { profile, avatarImageUrl, updateProfileContext, createProfile, uploadAvatarImage };

  return (
    <ProfileContext.Provider value={contextData}>
      {loading ? <p>Loading...</p> : children}
    </ProfileContext.Provider>
  );
};

export const useProfile = (): unknown => useContext(ProfileContext);

export default AuthContext;