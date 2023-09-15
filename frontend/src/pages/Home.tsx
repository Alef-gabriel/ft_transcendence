import { useProfile } from "../../utils/ProfileContext.tsx";
import { ProfileContextData } from "../../utils/interfaces/ProfileContextData.ts";
import { useEffect, useState } from "react";
import axios from "axios";
import useThrowAsyncError from "../../utils/hooks/useThrowAsyncError.ts";

//TODO: Trocar o avatar por uma imagem do backend
const Home = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const { profile} = useProfile() as ProfileContextData;
  const throwAsyncError = useThrowAsyncError();

  useEffect(() => {
    // Replace with the actual backend endpoint to fetch the image

    axios
      .get('http://localhost:3000/api/profile/avatar/12', {
        responseType: 'blob',
        withCredentials: true,
      })
      .then((response) => {
        const blob = new Blob([response.data], { type: response.headers['content-type'] });
        const imageUrl = URL.createObjectURL(blob);
        setImageSrc(imageUrl);
      })
      .catch((error) => {
        console.error('Error fetching image:', error);
        throwAsyncError(error);
      });
  }, [throwAsyncError]);

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
