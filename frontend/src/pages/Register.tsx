import { Link, NavigateFunction } from "react-router-dom";
import { FormEvent, MutableRefObject, useEffect, useRef } from "react";
import { AuthContextData } from "../../utils/interfaces/AuthContextData.ts";
import { useAuth } from "../../utils/AuthContext.tsx";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const registerForm: MutableRefObject<HTMLFormElement | null> = useRef<HTMLFormElement | null>(null);
  const {user, register2FA} = useAuth() as AuthContextData;
  const navigate: NavigateFunction = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    if (!registerForm.current) {
      return;
    }

    // // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // // @ts-ignore
    // const name: string = registerForm.current?.name.value;
    // const email: string = registerForm.current?.email.value;
    // const password1: string = registerForm.current?.password1.value;
    // const password2: string = registerForm.current?.password2.value;
    //
    // if (password1 !== password2) {
    //   alert('Passwords do not match');
    //   return;
    // }
    //
    // // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // const userRegisterInfo: UserRegisterInfo = {
    //   name,
    //   email,
    //   password1,
    //   password2
    // }

    register2FA();
  }

  return (
    <div className="container">
      <div className="login-register-container">

        <form ref={registerForm} onSubmit={handleSubmit}>

          <div className="form-field-wrapper">
                <label>Name:</label>
                <input 
                  required
                  type="text" 
                  name="name"
                  placeholder="Enter name..."
                  />
            </div>

            <div className="form-field-wrapper">
                <label>Email:</label>
                <input 
                  required
                  type="email" 
                  name="email"
                  placeholder="Enter email..."
                  />
            </div>

            <div className="form-field-wrapper">
                <label>Password:</label>
                <input 
                  type="password"
                  name="password1" 
                  placeholder="Enter password..."
                  />
            </div>

            <div className="form-field-wrapper">
                <label>Confirm Password:</label>
                <input 
                  type="password"
                  name="password2" 
                  placeholder="Confirm password..."
                  />
            </div>


            <div className="form-field-wrapper">

                <input 
                  type="submit" 
                  value="Register"
                  className="btn"
                  />

            </div>

        </form>

        <p>Already have an account? <Link to="/login">Login</Link></p>

      </div>
  </div>
  )
}

export default Register
