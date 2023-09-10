import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Profile } from "../../../backend/src/profile/interfaces/profile.interface.ts";
import { AuthContextData } from "../../utils/interfaces/AuthContextData.ts";
import { useAuth } from "../../utils/AuthContext.tsx";

const Profile = () => {
  const { user} = useAuth() as AuthContextData;

  const [profile, setProfile] = useState<Profile | undefined>(undefined);

  //TODO: Criar um Context para o Profile, no futuro diversos componentes usarão esses dados
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
      <p>Nickname: {profile?.nickname}</p>

      <br></br>

      <p>
        <button className="btn">Change Avatar</button>
      </p>

      <br></br>
      <p>
        <button className="btn">Change Nickname</button>
      </p>

      <br></br>

      <p>
        <button className="btn">
          { user?.otpEnabled ? "Enable Two Factor Authentication" : "Disable Two Factor Authentication"}
        </button>
      </p>

      <br></br>

      <p>
        <button className="btn">Delete Account</button>
      </p>
    </div>
  );
};

export default Profile;
