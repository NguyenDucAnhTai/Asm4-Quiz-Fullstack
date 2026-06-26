import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchQuizById } from "../features/quizzes/quizSlice";
import { clearResult, submitQuiz } from "../features/attempts/attemptSlice";

export default function TakeQuizPage() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { selectedQuiz, loading, error } = useSelector((state) => state.quizzes);
  const { result, loading: submitting, error: submitError } = useSelector(
    (state) => state.attempts
  );

  const [selectedAnswers, setSelectedAnswers] = useState({});

  useEffect(() => {
    dispatch(clearResult());
    dispatch(fetchQuizById(id));
  }, [dispatch, id]);

  const handleSelect = (questionId, optionId) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const answers = Object.entries(selectedAnswers).map(
      ([questionId, selectedOption]) => ({
        questionId,
        selectedOption,
      })
    );

    dispatch(submitQuiz({ quizId: id, answers }));
  };

  if (loading) return <div className="alert alert-info">Loading quiz...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!selectedQuiz) return null;

  if (result) {
    return (
      <div className="result-card card border-0 shadow-sm mx-auto">
        <div className="card-body text-center p-5">
          <span className="badge text-bg-success mb-3">Finish quiz</span>
          <h2 className="fw-bold">Your Score</h2>
          <div className="score-circle mx-auto my-4">
            {result.percentage}%
          </div>
          <p className="lead">
            Correct answers: <b>{result.score}</b> / {result.totalQuestions}
          </p>
          <Link className="btn btn-dark" to="/quizzes">
            Back to quizzes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <span className="badge text-bg-warning">{selectedQuiz.category}</span>
        <h2 className="fw-bold mt-2">{selectedQuiz.title}</h2>
        <p className="text-secondary">{selectedQuiz.description}</p>
      </div>

      {submitError && <div className="alert alert-danger">{submitError}</div>}

      <form onSubmit={handleSubmit}>
        {selectedQuiz.questions.map((question, index) => (
          <div className="card border-0 shadow-sm mb-3" key={question._id}>
            <div className="card-body">
              <h5 className="fw-bold">
                {index + 1}. {question.text}
              </h5>

              <div className="mt-3">
                {question.options.map((option) => (
                  <label
                    className="answer-option d-block border rounded-3 p-3 mb-2"
                    key={option._id}
                  >
                    <input
                      className="form-check-input me-2"
                      type="radio"
                      name={question._id}
                      value={option._id}
                      checked={selectedAnswers[question._id] === option._id}
                      onChange={() => handleSelect(question._id, option._id)}
                      required
                    />
                    {option.text}
                  </label>
                ))}
              </div>
            </div>
          </div>
        ))}

        <button
          className="btn btn-success btn-lg w-100"
          disabled={
            submitting ||
            Object.keys(selectedAnswers).length !== selectedQuiz.questions.length
          }
        >
          {submitting ? "Submitting..." : "Submit Answers"}
        </button>
      </form>
    </div>
  );
}
