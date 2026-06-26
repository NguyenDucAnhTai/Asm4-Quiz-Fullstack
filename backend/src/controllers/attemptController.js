import Attempt from "../models/Attempt.js";
import Quiz from "../models/Quiz.js";
import { AppError } from "../utils/AppError.js";

export const submitQuiz = async (req, res, next) => {
  try {
    const { quizId, answers } = req.body;

    const quiz = await Quiz.findById(quizId).populate("questions");
    if (!quiz) throw new AppError("Quiz not found", 404);

    if (!Array.isArray(answers)) {
      throw new AppError("Answers must be an array", 400);
    }

    let score = 0;

    const checkedAnswers = quiz.questions.map((question) => {
      const userAnswer = answers.find(
        (a) => String(a.questionId) === String(question._id)
      );

      const selectedOption = userAnswer?.selectedOption;
      const correctOption = question.options.find((option) => option.isCorrect);
      const isCorrect = String(selectedOption) === String(correctOption?._id);

      if (isCorrect) score += 1;

      return {
        question: question._id,
        selectedOption,
        isCorrect,
      };
    });

    const totalQuestions = quiz.questions.length;
    const percentage = totalQuestions ? Math.round((score / totalQuestions) * 100) : 0;

    const attempt = await Attempt.create({
      user: req.user._id,
      quiz: quiz._id,
      answers: checkedAnswers,
      score,
      totalQuestions,
      percentage,
    });

    res.status(201).json({
      attemptId: attempt._id,
      score,
      totalQuestions,
      percentage,
      answers: checkedAnswers,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyAttempts = async (req, res, next) => {
  try {
    const attempts = await Attempt.find({ user: req.user._id })
      .populate("quiz", "title category")
      .sort({ createdAt: -1 });
    res.json(attempts);
  } catch (error) {
    next(error);
  }
};
