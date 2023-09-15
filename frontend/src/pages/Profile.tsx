import { AuthContextData } from "../../utils/interfaces/AuthContextData.ts";
import { useAuth } from "../../utils/AuthContext.tsx";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { useProfile } from "../../utils/ProfileContext.tsx";
import { ProfileContextData } from "../../utils/interfaces/ProfileContextData.ts";

const Profile = () => {
  const navigate: NavigateFunction = useNavigate();
  const { user, disable2FA } = useAuth() as AuthContextData;
  const { profile, avatarImageUrl} = useProfile() as ProfileContextData;


  return (
    <div className="container">
      <h1>User Profile Settings</h1>

      <br></br>
      <div>
        {avatarImageUrl && <img src={avatarImageUrl} alt="Image" />}
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
