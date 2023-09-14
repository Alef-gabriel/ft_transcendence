//TODO: Criar um contexto de 'Profile'
// se o profile existir, redirecionar para a home
// se não existir, redirecionar exibir esse componente
import { NavigateFunction, useNavigate } from "react-router-dom";
import { FormEvent, MutableRefObject, useEffect, useRef, useState } from "react";
import useThrowAsyncError from "../../utils/hooks/useThrowAsyncError.ts";
import { useProfile } from "../../utils/ProfileContext.tsx";
import { ProfileContextData } from "../../utils/interfaces/ProfileContextData.ts";

//TODO: Trocar o avatar por uma imagem
//Fazer o componente dinâmica
//Criar um estado para saber se o usuário já tem um profile (enviou o nickname)
//  Se não enviou, renderizar o formulário do nickname
//  Se já enviou, renderizar o formulário do avatar

const Welcome = () => {
  const welcomeForm: MutableRefObject<HTMLFormElement | null> = useRef<HTMLFormElement | null>(null);
  const [invalidProfile, setInvalidProfile] = useState<boolean>(false);
  const throwAsyncError = useThrowAsyncError();
  const { profile } = useProfile() as ProfileContextData;
  const navigate: NavigateFunction = useNavigate();

  //const profileCreated = false; //Após enviar o avatar
  //const nicknameSaved = false; //após salvar o nickname e criar o profile

  //verificar porque nao ta funcionando
  useEffect(() => {
    if (profile) {
      console.log(`### Profile already exists, redirecting to home`);
      navigate("/");
      return;
    }
    console.log(`### Profile doesn't exist, rendering welcome page`);
  }, [navigate, profile]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (!welcomeForm.current) {
      return;
    }

    const nickname: string | undefined = welcomeForm.current.nickname?.value;
    const avatar: string | undefined = welcomeForm.current.avatar?.value;

    try {
      console.log(`### Creating profile with nickname: ${nickname} and avatar: ${avatar}`);
      //validações
      if (!nickname || nickname?.length < 4) {
        setInvalidProfile(true);
        return;
      }

      //Criar contexto de profile chamar API para salver no DB

      navigate('/');
    } catch (error) {
      throwAsyncError(error);
    }
  }

  return (
    <>
      <div className="container">
        <h1 className="welcome-title">Welcome to Pong!</h1>
      </div>

        <div className="welcome-form-wrapper">
          <form ref={welcomeForm} onSubmit={handleSubmit}>

            <div className="form-field-wrapper">
              <label>Enter your nickname</label>
              <input type="text" name="nickname" placeholder="nickname" required/>
            </div>

            <div className="form-field-wrapper">
              <label>Enter your avatar</label>
              <input type="text" name="avatar" placeholder="avatar" />
            </div>

            <div className="form-field-btn-wrapper">
              <input type="submit" value="Create Profile" className="btn-small" />
            </div>

          </form>
        </div>

        {invalidProfile && <p className="warning-text">Username must have at least 4 characters, try again</p>}
    </>
  );
};

export default Welcome;