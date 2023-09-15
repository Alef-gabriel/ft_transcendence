import { AuthContextData } from "../../utils/interfaces/AuthContextData.ts";
import { useAuth } from "../../utils/AuthContext.tsx";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { useProfile } from "../../utils/ProfileContext.tsx";
import { ProfileContextData } from "../../utils/interfaces/ProfileContextData.ts";
import { useEffect, useState } from "react";


const Profile = () => {
  const [imageSrc, setImageSrc] = useState<string | undefined>(undefined);
  const navigate: NavigateFunction = useNavigate();
  const { user, disable2FA } = useAuth() as AuthContextData;
  const { profile, getAvatarImage} = useProfile() as ProfileContextData;

  const handleAvatar = async () => {
    const imageSrc = await getAvatarImage(profile?.avatarId);
    setImageSrc(imageSrc);
  }

  useEffect(() => {
    handleAvatar();
  }, []);

  return (
    <div className="container">
      <h1>User Profile Settings</h1>

      <br></br>
      <div>
        {imageSrc && <img src={imageSrc} alt="Image" />}
        <p>Nickname: {profile?.nickname}</p>
      </div>

      <br></br>
      <button className="btn">Change Avatar (Not Impl)</button>

      <br></br>
      <button className="btn">Change Nickname (Not Impl)</button>

      <br></br>
      <button className="btn" onClick={ user?.otpEnabled ? disable2FA : () => navigate("/register-2fa")} >
        { user?.otpEnabled ? "Disable Two Factor Authentication" : "Enable Two Factor Authentication"}
      </button>

      <br></br>

      <button className="btn">Delete Account (Not Impl)</button>

    </div>
  );
};

export default Profile;
