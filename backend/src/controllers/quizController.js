import Quiz from "../models/Quiz.js";
import Question from "../models/Question.js";
import { AppError } from "../utils/AppError.js";

export const getQuizzes = async (req, res, next) => {
  try {
    const quizzes = await Quiz.find()
      .populate("createdBy", "name email")
      .populate("questions", "text options")
      .sort({ createdAt: -1 });

    if (req.user.role === "admin") {
      return res.json(quizzes);
    }

    // Hide correct answers from normal users
    const sanitized = quizzes.map((quiz) => {
      const obj = quiz.toObject();
      obj.questions = obj.questions.map((q) => ({
        ...q,
        options: q.options.map((o) => ({
          _id: o._id,
          text: o.text,
        })),
      }));
      return obj;
    });

    res.json(sanitized);
  } catch (error) {
    next(error);
  }
};

export const getQuizById = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate("questions");
    if (!quiz) throw new AppError("Quiz not found", 404);

    const obj = quiz.toObject();

    if (req.user.role !== "admin") {
      obj.questions = obj.questions.map((q) => ({
        ...q,
        options: q.options.map((o) => ({
          _id: o._id,
          text: o.text,
        })),
      }));
    }

    res.json(obj);
  } catch (error) {
    next(error);
  }
};

export const createQuiz = async (req, res, next) => {
  try {
    const { title, description, category, isPublished } = req.body;

    const quiz = await Quiz.create({
      title,
      description,
      category,
      isPublished,
      createdBy: req.user._id,
    });

    res.status(201).json(quiz);
  } catch (error) {
    next(error);
  }
};

export const updateQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) throw new AppError("Quiz not found", 404);

    quiz.title = req.body.title ?? quiz.title;
    quiz.description = req.body.description ?? quiz.description;
    quiz.category = req.body.category ?? quiz.category;
    quiz.isPublished = req.body.isPublished ?? quiz.isPublished;

    const updatedQuiz = await quiz.save();
    res.json(updatedQuiz);
  } catch (error) {
    next(error);
  }
};

export const deleteQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) throw new AppError("Quiz not found", 404);

    await Question.deleteMany({ quiz: quiz._id });
    await quiz.deleteOne();

    res.json({ message: "Quiz and related questions deleted" });
  } catch (error) {
    next(error);
  }
};
