import Quiz from "../models/Quiz.js";
import Question from "../models/Question.js";
import { AppError } from "../utils/AppError.js";

export const getQuestions = async (req, res, next) => {
  try {
    const filter = req.query.quiz ? { quiz: req.query.quiz } : {};
    const questions = await Question.find(filter).populate("quiz", "title");
    res.json(questions);
  } catch (error) {
    next(error);
  }
};

export const createQuestion = async (req, res, next) => {
  try {
    const { quiz, text, options, explanation } = req.body;
    const targetQuiz = await Quiz.findById(quiz);
    if (!targetQuiz) throw new AppError("Quiz not found", 404);

    const question = await Question.create({ quiz, text, options, explanation });

    targetQuiz.questions.push(question._id);
    await targetQuiz.save();

    res.status(201).json(question);
  } catch (error) {
    next(error);
  }
};

export const getQuestionById = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id).populate("quiz", "title");
    if (!question) throw new AppError("Question not found", 404);
    res.json(question);
  } catch (error) {
    next(error);
  }
};

export const updateQuestion = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) throw new AppError("Question not found", 404);

    question.text = req.body.text ?? question.text;
    question.options = req.body.options ?? question.options;
    question.explanation = req.body.explanation ?? question.explanation;

    const updatedQuestion = await question.save();
    res.json(updatedQuestion);
  } catch (error) {
    next(error);
  }
};

export const deleteQuestion = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) throw new AppError("Question not found", 404);

    await Quiz.findByIdAndUpdate(question.quiz, {
      $pull: { questions: question._id },
    });

    await question.deleteOne();

    res.json({ message: "Question deleted" });
  } catch (error) {
    next(error);
  }
};
