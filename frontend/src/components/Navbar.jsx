import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";

export default function Navbar() {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          ASM4 Quiz
        </Link>

        <div className="d-flex align-items-center gap-3">
          {userInfo && (
            <>
              <NavLink className="nav-link text-white" to="/quizzes">
                Quizzes
              </NavLink>

              {userInfo.role === "admin" && (
                <NavLink className="nav-link text-warning" to="/admin">
                  Admin
                </NavLink>
              )}

              <span className="badge text-bg-light">
                {userInfo.name} · {userInfo.role}
              </span>

              <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}

          {!userInfo && (
            <>
              <NavLink className="btn btn-outline-light btn-sm" to="/login">
                Login
              </NavLink>
              <NavLink className="btn btn-warning btn-sm" to="/signup">
                Signup
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
