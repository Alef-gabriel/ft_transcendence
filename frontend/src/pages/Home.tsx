import { useProfile } from "../../utils/ProfileContext.tsx";
import { ProfileContextData } from "../../utils/interfaces/ProfileContextData.ts";

const Home = () => {
  const { profile} = useProfile() as ProfileContextData;

  return (

    <div className="container">
      <h1>Player Dashboard</h1>

      <br></br>
      <br></br>

      <p>AvatarId: {profile?.avatarId}</p>
      <br></br>
      <p>Nickname: {profile?.nickname}</p>
      <br></br>
      <p>Wins: {profile?.wins}</p>
      <br></br>
      <p>Draws: {profile?.draws}</p>
      <br></br>
      <p>Loses: {profile?.losses}</p>
      <br></br>
      <p>ranking: Not Implement Yet</p>

    </div>

  );
};

export default Home;
