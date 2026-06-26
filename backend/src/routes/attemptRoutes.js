import express from "express";
import { getMyAttempts, submitQuiz } from "../controllers/attemptController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, submitQuiz);
router.get("/mine", protect, getMyAttempts);

export default router;
