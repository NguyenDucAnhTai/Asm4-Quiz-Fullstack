import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function HomePage() {
  const { userInfo } = useSelector((state) => state.auth);

  return (
    <div className="hero-card p-5 rounded-4 shadow-sm">
      <div className="row align-items-center">
        <div className="col-lg-7">
          <span className="badge text-bg-warning mb-3">Full-stack MERN Assignment</span>
          <h1 className="display-5 fw-bold">Quiz Application with React, Redux, Express and MongoDB</h1>
          <p className="lead text-secondary">
            Login as normal user to take quizzes. Login as admin to create quizzes and questions.
          </p>
          <div className="d-flex gap-2">
            <Link className="btn btn-dark btn-lg" to={userInfo ? "/quizzes" : "/login"}>
              Start Quiz
            </Link>
            <Link className="btn btn-outline-dark btn-lg" to="/signup">
              Create Account
            </Link>
          </div>
        </div>

        <div className="col-lg-5 mt-4 mt-lg-0">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h5 className="fw-bold">Demo accounts</h5>
              <div className="bg-light rounded-3 p-3 small">
                <p className="mb-1"><b>Admin:</b> admin@gmail.com / admin123</p>
                <p className="mb-0"><b>User:</b> user@gmail.com / user123</p>
              </div>
              <p className="text-secondary mt-3 mb-0">
                Run backend seed command before testing these accounts.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
