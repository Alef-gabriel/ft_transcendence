import { useProfile } from "../../context/ProfileContext.tsx";
import { ProfileContextData } from "../../context/interfaces/ProfileContextData.ts";
import { useEffect } from "react";

const Home = () => {
  const { profile, avatarImageUrl, updateProfileContext} = useProfile() as ProfileContextData;

  useEffect(() => {
    if (!avatarImageUrl) {
      console.log(`### Avatar Image URL undefined`);
      updateProfileContext();
      return;
    }
  }, []);

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
