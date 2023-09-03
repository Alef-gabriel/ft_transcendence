import { Link, NavigateFunction, useNavigate } from "react-router-dom";
import { FormEvent, MutableRefObject, useEffect, useRef } from "react";
import { AuthContextData, UserInfo } from "../../utils/interfaces/AuthContextData.ts";
import { useAuth } from "../../utils/AuthContext.tsx";

const Login = () => {
  const navigate: NavigateFunction = useNavigate();
  const { user, loginUser } = useAuth() as AuthContextData;

  const loginForm: MutableRefObject<HTMLFormElement | null> = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    if (!loginForm.current) {
      return;
    }

    const email: string = loginForm.current?.email.value;
    const password: string = loginForm.current?.password.value;

    const userInfo: UserInfo = {
      email,
      password
    }

    loginUser(userInfo);
  }

  return (
    <div className="container">
        <div className="login-register-container">
          <form ref={loginForm} onSubmit={handleSubmit}>

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
                  name="password"
                  placeholder="Enter password..."
                  />
            </div>

            <div className="form-field-wrapper">
                <input 
                  type="submit" 
                  value="Login"
                  className="btn"
                  />
            </div>

          </form>

          <p>Don't have an account? <Link to="/register">Register</Link></p>

        </div>
    </div>
  )
}

export default Login
