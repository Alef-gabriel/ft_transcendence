import { useProfile } from "../../utils/ProfileContext.tsx";
import { ProfileContextData } from "../../utils/interfaces/ProfileContextData.ts";
import { useEffect, useState } from "react";

const Home = () => {
  const [imageSrc, setImageSrc] = useState<string | undefined>(undefined);
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
      <h1>Player Dashboard</h1>

      <br></br>
      <div>
        {imageSrc && <img src={imageSrc} alt="Image" />}
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
