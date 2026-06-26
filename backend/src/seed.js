import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import User from "./models/User.js";
import Quiz from "./models/Quiz.js";
import Question from "./models/Question.js";
import Attempt from "./models/Attempt.js";

const seed = async () => {
  await connectDB();

  await Attempt.deleteMany();
  await Question.deleteMany();
  await Quiz.deleteMany();
  await User.deleteMany();

  const admin = await User.create({
    name: "Admin Demo",
    email: "admin@gmail.com",
    password: "admin123",
    role: "admin",
  });

  await User.create({
    name: "User Demo",
    email: "user@gmail.com",
    password: "user123",
    role: "user",
  });

  const quiz1 = await Quiz.create({
    title: "JavaScript Basic Quiz",
    description: "Practice basic JavaScript concepts.",
    category: "Programming",
    createdBy: admin._id,
  });

  const quiz2 = await Quiz.create({
    title: "React Redux Quiz",
    description: "Check your understanding of React and Redux.",
    category: "Frontend",
    createdBy: admin._id,
  });

  const questions = await Question.insertMany([
    {
      quiz: quiz1._id,
      text: "Which keyword declares a block-scoped variable in JavaScript?",
      options: [
        { text: "var", isCorrect: false },
        { text: "let", isCorrect: true },
        { text: "define", isCorrect: false },
        { text: "dim", isCorrect: false },
      ],
      explanation: "let and const are block-scoped.",
    },
    {
      quiz: quiz1._id,
      text: "What is the output type of typeof []?",
      options: [
        { text: "array", isCorrect: false },
        { text: "object", isCorrect: true },
        { text: "list", isCorrect: false },
        { text: "undefined", isCorrect: false },
      ],
      explanation: "Arrays are objects in JavaScript.",
    },
    {
      quiz: quiz2._id,
      text: "What is Redux mainly used for?",
      options: [
        { text: "Database management", isCorrect: false },
        { text: "State management", isCorrect: true },
        { text: "CSS compilation", isCorrect: false },
        { text: "Server rendering only", isCorrect: false },
      ],
      explanation: "Redux is commonly used to manage application state.",
    },
    {
      quiz: quiz2._id,
      text: "Which hook is used to read Redux state in React components?",
      options: [
        { text: "useEffect", isCorrect: false },
        { text: "useSelector", isCorrect: true },
        { text: "useParams", isCorrect: false },
        { text: "useState", isCorrect: false },
      ],
      explanation: "useSelector reads data from the Redux store.",
    },
  ]);

  quiz1.questions = questions.slice(0, 2).map((q) => q._id);
  quiz2.questions = questions.slice(2).map((q) => q._id);
  await quiz1.save();
  await quiz2.save();

  console.log("Seed completed");
  console.log("Admin: admin@gmail.com / admin123");
  console.log("User: user@gmail.com / user123");

  await mongoose.connection.close();
};

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
