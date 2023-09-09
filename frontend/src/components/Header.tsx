import { Link } from "react-router-dom";
import { useAuth } from "../../utils/AuthContext.tsx";
import { AuthContextData } from "../../utils/interfaces/AuthContextData.ts";

const Header = () => {
  const { user, logoutUser } = useAuth() as AuthContextData;

  return (
    <div className="header">
      <div>
        <Link id="header-logo" to="/">Pong</Link>
      </div>

      <div className="links--wrapper">
        { user ? (
          <>
            <Link to="/" className="header--link">Home</Link>
            <Link to="/profile" className="header--link">Profile</Link>
            <button onClick={logoutUser} className="btn">Logout</button>
          </>
        ): (
          <>
          </>
        )}
      </div>
    </div>
  );
};

export default Header;
