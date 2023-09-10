import { FormEvent, MutableRefObject, useRef } from "react";
import { useAuth } from "../../utils/AuthContext.tsx";
import { AuthContextData } from "../../utils/interfaces/AuthContextData.ts";

const ValidateOTP = () => {
  const registerForm: MutableRefObject<HTMLFormElement | null> = useRef<HTMLFormElement | null>(null);
  const {user, validateOTP} = useAuth() as AuthContextData;

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    if (!registerForm.current) {
      return;
    }

    console.log(`### Registering 2FA with code ${registerForm.current.code?.value}`);
    validateOTP(registerForm.current.code?.value);
  }

  return (
    //!user?.otpEnabled
    !user
      ?
      <div className="container">
        <h1>Two Factor Authentication is disabled</h1>
      </div>
      :
      <div className="container">

        <div className="two-factor-register-title">
          <h1> Validate One Time Password</h1>
        </div>

        <div className="two-factor-register-container">

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

export default ValidateOTP;