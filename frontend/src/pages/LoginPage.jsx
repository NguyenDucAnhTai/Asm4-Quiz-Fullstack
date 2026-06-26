import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../features/auth/authSlice";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "user@gmail.com",
    password: "user123",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate(userInfo.role === "admin" ? "/admin" : "/quizzes");
    }
  }, [userInfo, navigate]);

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(login(formData));
  };

  return (
    <div className="auth-card mx-auto card border-0 shadow-sm">
      <div className="card-body p-4">
        <h2 className="fw-bold mb-1">Login</h2>
        <p className="text-secondary">Login successfully before fetching quizzes.</p>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              className="form-control"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              type="email"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              className="form-control"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              type="password"
              required
            />
          </div>

          <button className="btn btn-dark w-100" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-3 mb-0 small text-center">
          No account? <Link to="/signup">Signup</Link>
        </p>
      </div>
    </div>
  );
}
