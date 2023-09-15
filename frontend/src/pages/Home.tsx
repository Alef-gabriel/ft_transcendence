import { useProfile } from "../../utils/ProfileContext.tsx";
import { ProfileContextData } from "../../utils/interfaces/ProfileContextData.ts";

const Home = () => {
  const { profile, avatarImageUrl} = useProfile() as ProfileContextData;

  return (

    <div className="container">
      <h1>Player Dashboard</h1>

      <br></br>
      <div>
        {avatarImageUrl && <img src={avatarImageUrl} alt="User avatar" />}
        <p>Nickname: {profile?.nickname}</p>
      </div>
      <br></br>
      <p>Wins: {profile?.wins}</p>
      <p>Draws: {profile?.draws}</p>
      <p>Loses: {profile?.losses}</p>
      <p>Ranking: Not Implement Yet</p>
    </div>

  );
};

export default Home;
