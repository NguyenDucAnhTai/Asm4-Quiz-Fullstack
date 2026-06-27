import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createQuestion,
  createQuiz,
  deleteQuestion,
  deleteQuiz,
  fetchQuizById,
  fetchQuizzes,
  updateQuestion,
  updateQuiz,
} from "../../features/quizzes/quizSlice";

const emptyOptions = () => [
  { text: "", isCorrect: true },
  { text: "", isCorrect: false },
  { text: "", isCorrect: false },
  { text: "", isCorrect: false },
];

export default function AdminDashboardPage() {
  const dispatch = useDispatch();
  const { items, selectedQuiz, loading, error, adminMessage } = useSelector(
    (state) => state.quizzes
  );

  const emptyQuizForm = {
    title: "",
    description: "",
    category: "General",
    isPublished: true,
  };

  const [editingQuizId, setEditingQuizId] = useState(null);

  const [quizForm, setQuizForm] = useState(emptyQuizForm);

  const [questionForm, setQuestionForm] = useState({
    quiz: "",
    text: "",
    explanation: "",
    options: emptyOptions(),
  });

  const [manageQuizId, setManageQuizId] = useState("");
  const [editingQuestionId, setEditingQuestionId] = useState(null);

  useEffect(() => {
    dispatch(fetchQuizzes());
  }, [dispatch]);

  useEffect(() => {
    if (!questionForm.quiz && items.length > 0) {
      setQuestionForm((prev) => ({ ...prev, quiz: items[0]._id }));
      setManageQuizId(items[0]._id);
    }
  }, [items, questionForm.quiz]);

  useEffect(() => {
    if (manageQuizId) {
      dispatch(fetchQuizById(manageQuizId));
    }
  }, [dispatch, manageQuizId]);

  const normalizeQuestionPayload = (form) => ({
    ...form,
    options: form.options
      .filter((option) => option.text.trim() !== "")
      .map((option) => ({ ...option, text: option.text.trim() })),
  });

  const resetQuestionForm = () => {
    setQuestionForm((prev) => ({
      quiz: prev.quiz,
      text: "",
      explanation: "",
      options: emptyOptions(),
    }));
    setEditingQuestionId(null);
  };

  const handleCreateQuiz = (event) => {
    event.preventDefault();

    if (editingQuizId) {
      dispatch(updateQuiz({ id: editingQuizId, formData: quizForm })).then(() => {
        setQuizForm(emptyQuizForm);
        setEditingQuizId(null);
        dispatch(fetchQuizzes());
      });
      return;
    }

    dispatch(createQuiz(quizForm)).then(() => {
      setQuizForm(emptyQuizForm);
      dispatch(fetchQuizzes());
    });
  };

  const handleCancelEdit = () => {
    setEditingQuizId(null);
    setQuizForm(emptyQuizForm);
  };

  const handleSaveQuestion = (event) => {
    event.preventDefault();
    const payload = normalizeQuestionPayload(questionForm);

    if (editingQuestionId) {
      dispatch(updateQuestion({ id: editingQuestionId, formData: payload })).then(() => {
        resetQuestionForm();
        dispatch(fetchQuizById(manageQuizId || payload.quiz));
        dispatch(fetchQuizzes());
      });
      return;
    }

    dispatch(createQuestion(payload)).then(() => {
      resetQuestionForm();
      dispatch(fetchQuizById(manageQuizId || payload.quiz));
      dispatch(fetchQuizzes());
    });
  };

  const updateOption = (index, field, value) => {
    const nextOptions = questionForm.options.map((option, optionIndex) => {
      if (field === "isCorrect") {
        return { ...option, isCorrect: optionIndex === index };
      }

      return optionIndex === index ? { ...option, [field]: value } : option;
    });

    setQuestionForm({ ...questionForm, options: nextOptions });
  };

  const startEditQuestion = (question) => {
    const paddedOptions = [...question.options.map((o) => ({ text: o.text, isCorrect: o.isCorrect }))];
    while (paddedOptions.length < 4) paddedOptions.push({ text: "", isCorrect: false });

    setQuestionForm({
      quiz: manageQuizId,
      text: question.text,
      explanation: question.explanation || "",
      options: paddedOptions.slice(0, 4),
    });
    setEditingQuestionId(question._id);
  };

  const handleDeleteQuestion = (questionId) => {
    dispatch(deleteQuestion(questionId)).then(() => {
      dispatch(fetchQuizById(manageQuizId));
      dispatch(fetchQuizzes());
    });
  };

  return (
    <div>
      <div className="mb-4">
        <h2 className="fw-bold mb-1">Admin Dashboard</h2>
        <p className="text-secondary mb-0">
          Admin can CRUD quizzes and questions. Normal users can only take quizzes.
        </p>
      </div>

      {adminMessage && <div className="alert alert-success">{adminMessage}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-4">
        <div className="col-lg-5">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h5 className="fw-bold">
                {editingQuizId ? "Edit Quiz" : "Create Quiz"}
              </h5>
              <form onSubmit={handleCreateQuiz}>
                <div className="mb-3">
                  <label className="form-label">Title</label>
                  <input
                    className="form-control"
                    value={quizForm.title}
                    onChange={(e) => setQuizForm({ ...quizForm, title: e.target.value })}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    value={quizForm.description}
                    onChange={(e) =>
                      setQuizForm({ ...quizForm, description: e.target.value })
                    }
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Category</label>
                  <input
                    className="form-control"
                    value={quizForm.category}
                    onChange={(e) =>
                      setQuizForm({ ...quizForm, category: e.target.value })
                    }
                  />
                </div>

                <div className="d-flex gap-2">
                  <button className="btn btn-dark w-100">
                    {editingQuizId ? "Update Quiz" : "Create Quiz"}
                  </button>

                  {editingQuizId && (
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          <div className="card border-0 shadow-sm mt-4">
            <div className="card-body">
              <h5 className="fw-bold">Quiz CRUD</h5>
              {loading && <p>Loading...</p>}
              <div className="list-group">
                {items.map((quiz) => (
                  <div
                    className="list-group-item d-flex justify-content-between align-items-center"
                    key={quiz._id}
                  >
                    <button
                      className="btn btn-link text-start p-0 text-decoration-none"
                      onClick={() => setManageQuizId(quiz._id)}
                    >
                      <b>{quiz.title}</b>
                      <div className="small text-muted">
                        {quiz.questions?.length || 0} questions
                      </div>
                    </button>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => handleEditQuiz(quiz)}
                      >
                        Edit
                      </button>

                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => dispatch(deleteQuiz(quiz._id))}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-7">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h5 className="fw-bold">
                {editingQuestionId ? "Update Question" : "Create Question"}
              </h5>
              <form onSubmit={handleSaveQuestion}>
                <div className="mb-3">
                  <label className="form-label">Quiz</label>
                  <select
                    className="form-select"
                    value={questionForm.quiz}
                    onChange={(e) => {
                      setQuestionForm({ ...questionForm, quiz: e.target.value });
                      setManageQuizId(e.target.value);
                    }}
                    required
                  >
                    {items.map((quiz) => (
                      <option value={quiz._id} key={quiz._id}>
                        {quiz.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Question text</label>
                  <textarea
                    className="form-control"
                    value={questionForm.text}
                    onChange={(e) =>
                      setQuestionForm({ ...questionForm, text: e.target.value })
                    }
                    required
                  />
                </div>

                {questionForm.options.map((option, index) => (
                  <div className="input-group mb-2" key={index}>
                    <span className="input-group-text">
                      <input
                        className="form-check-input mt-0"
                        type="radio"
                        name="correct"
                        checked={option.isCorrect}
                        onChange={() => updateOption(index, "isCorrect", true)}
                      />
                    </span>
                    <input
                      className="form-control"
                      placeholder={`Option ${index + 1}`}
                      value={option.text}
                      onChange={(e) => updateOption(index, "text", e.target.value)}
                      required={index < 2}
                    />
                  </div>
                ))}

                <div className="mb-3">
                  <label className="form-label">Explanation</label>
                  <textarea
                    className="form-control"
                    value={questionForm.explanation}
                    onChange={(e) =>
                      setQuestionForm({
                        ...questionForm,
                        explanation: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="d-flex gap-2">
                  <button className="btn btn-warning flex-grow-1">
                    {editingQuestionId ? "Update Question" : "Create Question"}
                  </button>
                  {editingQuestionId && (
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={resetQuestionForm}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          <div className="card border-0 shadow-sm mt-4">
            <div className="card-body">
              <h5 className="fw-bold">Question CRUD</h5>
              <p className="small text-secondary">
                Select a quiz on the left to view, update, or delete its questions.
              </p>
              <div className="table-responsive">
                <table className="table align-middle">
                  <thead>
                    <tr>
                      <th>Question</th>
                      <th>Correct answer</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedQuiz?.questions?.map((question) => (
                      <tr key={question._id}>
                        <td>{question.text}</td>
                        <td>
                          {question.options.find((option) => option.isCorrect)?.text || "N/A"}
                        </td>
                        <td className="text-end">
                          <button
                            className="btn btn-sm btn-outline-dark me-2"
                            onClick={() => startEditQuestion(question)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDeleteQuestion(question._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {!selectedQuiz?.questions?.length && (
                <div className="alert alert-warning mb-0">No questions in this quiz.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
