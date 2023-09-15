import { AuthContextData } from "../../utils/interfaces/AuthContextData.ts";
import { useAuth } from "../../utils/AuthContext.tsx";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { useProfile } from "../../utils/ProfileContext.tsx";
import { ProfileContextData } from "../../utils/interfaces/ProfileContextData.ts";


//TODO: Trocar o avatar por uma imagem do backend
const Profile = () => {
  const navigate: NavigateFunction = useNavigate();
  const { user, disable2FA } = useAuth() as AuthContextData;
  const { profile} = useProfile() as ProfileContextData;

  return (
    <div className="container">
      <h1>User Profile</h1>

      <br></br>

      <p>AvatarId: {profile?.avatarId}</p>

      <br></br>

      <p>Nickname: {profile?.nickname}</p>

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
