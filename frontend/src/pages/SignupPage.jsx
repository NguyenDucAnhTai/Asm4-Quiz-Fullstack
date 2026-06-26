import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signup } from "../features/auth/authSlice";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
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
    dispatch(signup(formData));
  };

  return (
    <div className="auth-card mx-auto card border-0 shadow-sm">
      <div className="card-body p-4">
        <h2 className="fw-bold mb-1">Signup</h2>
        <p className="text-secondary">Create a user or admin account for demo.</p>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              className="form-control"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

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
              minLength="6"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Role</label>
            <select
              className="form-select"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button className="btn btn-dark w-100" disabled={loading}>
            {loading ? "Creating..." : "Signup"}
          </button>
        </form>

        <p className="mt-3 mb-0 small text-center">
          Already have account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
