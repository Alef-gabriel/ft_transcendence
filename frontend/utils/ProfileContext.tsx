import { createContext, FC, ReactNode, useContext, useEffect, useState } from "react";
import { ProfileContextData } from "./interfaces/ProfileContextData";
import useThrowAsyncError from "./hooks/useThrowAsyncError";
import { ProfileDTO } from "../../backend/src/profile/models/profile.dto";
import axios, { isAxiosError } from "axios";
import AuthContext from "./AuthContext";

const ProfileContext = createContext({});

ProfileContext.displayName = "ProfileContext";

interface ProfileProvideProps {
  children: ReactNode;
}

export const ProfileProvider: FC<ProfileProvideProps> = ({ children }) => {
  const [profile, setProfile] = useState<ProfileDTO | null>(null);
  const throwAsyncError = useThrowAsyncError();

  useEffect(() => {
    console.log(`### Profile context initialized`);
    updateProfileContext();
  }, []);

  const updateProfileContext = async (): Promise<void> => {
    try {
      const response = await axios.get("http://localhost:3000/api/profile",
        { withCredentials: true });
      console.log(`### Profile context updated: ${JSON.stringify(response.data)}`);
      setProfile(response.data);
    } catch (error) {
      console.log(`### Profile context update failed: ${error}`);
      if (isAxiosError(error) && error.response?.status !== 404) {
        throwAsyncError(error);
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

  const uploadImage = async (formData: FormData): Promise<void> => {
    try {
      const response = await axios.post("http://localhost:3000/api/profile/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        withCredentials: true
      });

      console.log(`### Avatar uploaded: ${JSON.stringify(response.data)}`);
      setProfile(response.data);
    } catch (error) {
      console.log(`### Avatar upload failed: ${error}`);
      throwAsyncError(error);
    }
  };

  const contextData: ProfileContextData = { profile, updateProfileContext, createProfile, uploadImage };

  return (
    <ProfileContext.Provider value={contextData}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = (): unknown => useContext(ProfileContext);

export default AuthContext;