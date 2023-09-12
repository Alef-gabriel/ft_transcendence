import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Profile } from "../../../backend/src/profile/interfaces/profile.interface.ts";
import { AuthContextData } from "../../utils/interfaces/AuthContextData.ts";
import { useAuth } from "../../utils/AuthContext.tsx";
import { NavigateFunction, useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate: NavigateFunction = useNavigate();

  const { user, disable2FA } = useAuth() as AuthContextData;

  const [profile, setProfile] = useState<Profile | undefined>(undefined);

  //TODO: Criar um Context para o Profile, no futuro diversos componentes usarão esses dados. Exibir as informações do Profile.
  const fetchData = useCallback(async () => {
      const response = await axios.get("http://localhost:3000/api/profile",
        { withCredentials: true });

      setProfile(response.data);
  }, [])

  useEffect(() => {
    fetchData()
      .catch((error) => console.log(error));
  }, [fetchData]);


  return (
    <div className="container">
      <h1>User Profile</h1>

      <br></br>

      <p>Avatar: {profile?.avatar}</p>

      <br></br>

      <p>Nickname: {profile?.nickname}</p>

      <br></br>

      <button className="btn">Change Avatar</button>

      <br></br>

      <button className="btn">Change Nickname</button>


      <br></br>

      <button className="btn" onClick={ user?.otpEnabled ? disable2FA : () => navigate("/register-2fa")} >
        { user?.otpEnabled ? "Disable Two Factor Authentication" : "Enable Two Factor Authentication"}
      </button>

      <br></br>

      <button className="btn">Delete Account</button>

    </div>
  );
};

export default Profile;
