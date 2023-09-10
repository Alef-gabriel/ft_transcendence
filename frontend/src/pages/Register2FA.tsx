import { FormEvent, MutableRefObject, useRef, useState } from "react";
import { AuthContextData } from "../../utils/interfaces/AuthContextData.ts";
import { useAuth } from "../../utils/AuthContext.tsx";
import axios from "axios";

const Register2FA = () => {
  const registerForm: MutableRefObject<HTMLFormElement | null> = useRef<HTMLFormElement | null>(null);
  const {user, enable2FA} = useAuth() as AuthContextData;

  const [qrCode, setQRCode] = useState('');


  const handleRegisterQRCode = () => {
    // Make a request to the backend to fetch the QR code
    axios
      .get('http://localhost:3000/api/auth/2fa/qr-code', { withCredentials: true })
      .then((response) => {
        setQRCode(response.data);
      })
      .catch((error) => {
        console.error('Error fetching QR code:', error);
      });
  };


  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    if (!registerForm.current) {
      return;
    }

    console.log(`### Registering 2FA with code ${registerForm.current.code?.value}`);
    enable2FA(registerForm.current.code?.value);
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
        </div>
  )
}

export default Register2FA;
