//TODO: Criar um contexto de 'Profile'
// se o profile existir, redirecionar para a home
// se não existir, redirecionar exibir esse componente
import { NavigateFunction, useNavigate } from "react-router-dom";
import { ChangeEvent, FormEvent, MutableRefObject, useEffect, useRef, useState } from "react";
import useThrowAsyncError from "../../utils/hooks/useThrowAsyncError.ts";
import { useProfile } from "../../context/ProfileContext.tsx";
import { ProfileContextData } from "../../context/interfaces/ProfileContextData.ts";

//TODO: Trocar o avatar por uma imagem
//Fazer o componente dinâmica
//Criar um estado para saber se o usuário já tem um profile (enviou o nickname)
//  Se não enviou, renderizar o formulário do nickname
//  Se já enviou, renderizar o formulário do avatar

const Welcome = () => {
  const welcomeForm: MutableRefObject<HTMLFormElement | null> = useRef<HTMLFormElement | null>(null);
  const { profile, createProfile, uploadAvatarImage } = useProfile() as ProfileContextData;
  const navigate: NavigateFunction = useNavigate();
  const throwAsyncError = useThrowAsyncError();
  const [invalidProfile, setInvalidProfile] = useState<boolean>(false);
  const [nicknameSaved, setNicknameSaved] = useState<boolean>(false);
  const [avatarSaved, setAvatarSaved] = useState<boolean>(false);
  const [selectedAvatar, setSelectedAvatar] = useState<File | undefined>(undefined);


  //verificar porque nao ta funcionando
  useEffect(() => {
    if (profile && avatarSaved) {
      navigate("/");
      return;
    }
  }, [avatarSaved, navigate, profile]);

  const handleNicknameSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (!welcomeForm.current) {
      return;
    }

    const nickname: string | undefined = welcomeForm.current.nickname?.value;

    try {
      console.log(`### Creating profile with nickname: ${nickname}`);
      if (!nickname || nickname?.length < 4) {
        setInvalidProfile(true);
        return;
      }

      await createProfile(nickname);

      setNicknameSaved(true);
    } catch (error) {
      throwAsyncError(error);
    }
  }
  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedAvatar(event.target.files?.[0]);
  };

  const handleAvatarSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    const formData: FormData = new FormData();

    if (!selectedAvatar) { //Todo: Trocar por um avatar default
      alert('Please select an image to upload.');
      return;
    }

    formData.append('avatar', selectedAvatar);

    try {
      await uploadAvatarImage(formData);
      setAvatarSaved(true);
    } catch (error) {
      throwAsyncError(error);
    }
  }

  return !nicknameSaved && !profile ? (
        <>
          <div className="container">
            <h1 className="welcome-title">Welcome to Pong!</h1>
          </div>

            <div className="welcome-form-wrapper">
              <form ref={welcomeForm} onSubmit={handleNicknameSubmit}>

                <div className="form-field-wrapper">
                  <label>Enter your nickname</label>
                  <input type="text" name="nickname" placeholder="nickname" required/>
                </div>

                <div className="form-field-btn-wrapper">
                  <input type="submit" value="Create Profile" className="btn-small" />
                </div>

              </form>
            </div>

            {invalidProfile && <p className="warning-text">Username must have at least 4 characters, try again</p>}
        </>
       ) : (
        <>
          <div className="container">
            <div className="avatar-register-container">

              <div className="avatar-image-wrapper">
                { selectedAvatar
                  ? <img src= {URL.createObjectURL(selectedAvatar)} alt="Avatar Image" className="avatar-image" />
                  : <img src= "/default-avatar.jpeg" alt="Default Avatar Image" className="avatar-image" />
                }
              </div>
            </div>
          </div>

          <div className="welcome-form-wrapper">

              <div className="form-field-wrapper">
                <label>Upload an avatar and/or continue</label>
              </div>

              <div  className="form-field-wrapper">
                <form onSubmit={handleAvatarSubmit}>
                  <input type="file" accept="image/*" className="" onChange={handleImageUpload} />
                  <button type="submit" className="btn-small">Continue</button>
                </form>
              </div>
          </div>
        </>
       );
};

export default Welcome;