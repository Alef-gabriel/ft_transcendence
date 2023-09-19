import { FormEvent, MutableRefObject, useRef, useState } from "react";
import { AuthContextData } from "../../context/interfaces/AuthContextData.ts";
import { useAuth } from "../../context/AuthContext.tsx";
import axios from "axios";
import { NavigateFunction, useNavigate } from "react-router-dom";
import useThrowAsyncError from "../../utils/hooks/useThrowAsyncError.ts";

const Register2FA = () => {
  const registerForm: MutableRefObject<HTMLFormElement | null> = useRef<HTMLFormElement | null>(null);
  const {user, enable2FA} = useAuth() as AuthContextData;
  const navigate: NavigateFunction = useNavigate();
  const [qrCode, setQRCode] = useState('');
  const [wrongOtp, setWrongOtp] = useState<boolean>(false);
  const throwAsyncError = useThrowAsyncError();

  const handleRegisterQRCode = () => {
    axios
      .get('http://localhost:3000/api/auth/2fa/qr-code', { withCredentials: true })
      .then((response) => {
        setQRCode(response.data);
      })
      .catch((error) => {
        console.error('Error fetching QR code:', error);
      });
  };


  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (!registerForm.current) {
      return;
    }

    try {
      console.log(`### Registering 2FA with code ${registerForm.current.code?.value}`);
      const isOtpValid: boolean = await enable2FA(registerForm.current.code?.value);

      if (!isOtpValid) {
        setWrongOtp(true);
        return;
      }

      navigate('/');
    } catch (error) {
      throwAsyncError(error);
    }
  }

  return (
    user?.otpEnabled
      ?
        <div className="container">
          <h1>Two Factor Authentication is already enabled</h1>
          <br></br>
          <p>If you want to register again, please disable it first</p>
        </div>
      :
        <div className="container">
          <div className="two-factor-register-container">
            <button className="btn" onClick={handleRegisterQRCode}>Generate QR Code</button>

            <div>
              {qrCode && <img src={qrCode} alt="QR Code" />}
            </div>

            <form ref={registerForm} onSubmit={handleSubmit}>

              <div className="form-field-wrapper">
                <input type="code" name="code" placeholder="Enter the code" />
              </div>

              <div className="form-field-wrapper">
                <input type="submit" value="Register" className="btn" />
              </div>

            </form>
          </div>

          {wrongOtp && <p className="warning-text">Invalid code, try again.</p>}

        </div>
  )
}

export default Register2FA;
