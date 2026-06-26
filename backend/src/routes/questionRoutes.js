import express from "express";
import {
  createQuestion,
  deleteQuestion,
  getQuestionById,
  getQuestions,
  updateQuestion,
} from "../controllers/questionController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect, adminOnly);

router.route("/").get(getQuestions).post(createQuestion);
router.route("/:id").get(getQuestionById).put(updateQuestion).delete(deleteQuestion);

export default router;
