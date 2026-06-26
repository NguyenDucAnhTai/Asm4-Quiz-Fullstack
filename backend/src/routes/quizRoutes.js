import express from "express";
import {
  createQuiz,
  deleteQuiz,
  getQuizById,
  getQuizzes,
  updateQuiz,
} from "../controllers/quizController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .get(protect, getQuizzes)
  .post(protect, adminOnly, createQuiz);

router
  .route("/:id")
  .get(protect, getQuizById)
  .put(protect, adminOnly, updateQuiz)
  .delete(protect, adminOnly, deleteQuiz);

export default router;
