import { createContext, FC, ReactNode, useContext, useEffect, useState } from "react";
import { ProfileContextData } from "./interfaces/ProfileContextData";
import useThrowAsyncError from "../utils/hooks/useThrowAsyncError";
import { ProfileDTO } from "../../backend/src/profile/models/profile.dto";
import axios, { isAxiosError } from "axios";
import AuthContext from "./AuthContext";
import { useLocation } from "react-router-dom";
import { AuthContextData } from "./interfaces/AuthContextData.ts";

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
      const response = await axios.get("http://localhost:3000/api/profile",
        { withCredentials: true });
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
      const response = await axios.post("http://localhost:3000/api/profile/create",
        { nickname }, { withCredentials: true });

      console.log(`### Profile created: ${JSON.stringify(response.data)}`);
      setProfile(response.data);
    } catch (error) {
      console.log(`### Profile creation failed: ${error}`);
      throwAsyncError(error);
    }
  };

  const uploadAvatarImage = async (formData: FormData): Promise<void> => {
    try {
      const response = await axios.post("http://localhost:3000/api/profile/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        withCredentials: true
      });

      console.log(`### Avatar uploaded: ${JSON.stringify(response.data)}`);
      updateProfileContext();
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
      const response = await axios
        .get(`http://localhost:3000/api/profile/avatar/${avatarId}`, {
          responseType: 'blob',
          withCredentials: true,
        });

      const blob = new Blob([response.data], { type: response.headers['content-type'] });
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