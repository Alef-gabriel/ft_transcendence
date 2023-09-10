import { useAuth } from "../../utils/AuthContext.tsx";
import { AuthContextData } from "../../utils/interfaces/AuthContextData.ts";

const Profile = () => {
  const { user} = useAuth() as AuthContextData;

  return (
    <div className="container">
        <h1>User Profile</h1>
        <p>ID: {user?.id}</p>
        <p>{user?.email}</p>
        <p>{user?.username}</p>
    </div>
  )
}

export default Profile
