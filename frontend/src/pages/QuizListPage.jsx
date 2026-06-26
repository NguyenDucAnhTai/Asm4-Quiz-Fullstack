import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchQuizzes } from "../features/quizzes/quizSlice";

export default function QuizListPage() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.quizzes);

  useEffect(() => {
    dispatch(fetchQuizzes());
  }, [dispatch]);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Available Quizzes</h2>
          <p className="text-secondary mb-0">Choose a quiz and submit your answers.</p>
        </div>
      </div>

      {loading && <div className="alert alert-info">Loading quizzes...</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-3">
        {items.map((quiz) => (
          <div className="col-md-6 col-lg-4" key={quiz._id}>
            <div className="card h-100 border-0 shadow-sm quiz-card">
              <div className="card-body">
                <span className="badge text-bg-warning mb-2">{quiz.category}</span>
                <h5 className="fw-bold">{quiz.title}</h5>
                <p className="text-secondary">{quiz.description}</p>
                <p className="small text-muted mb-3">
                  {quiz.questions?.length || 0} questions
                </p>
                <Link className="btn btn-dark w-100" to={`/quizzes/${quiz._id}`}>
                  Click and do Quiz
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!loading && items.length === 0 && (
        <div className="alert alert-warning">No quizzes found.</div>
      )}
    </div>
  );
}
