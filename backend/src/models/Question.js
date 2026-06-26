import mongoose from "mongoose";

const optionSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, "Option text is required"],
      trim: true,
    },
    isCorrect: {
      type: Boolean,
      default: false,
    },
  },
  { _id: true }
);

const questionSchema = new mongoose.Schema(
  {
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: [true, "Quiz ID is required"],
    },
    text: {
      type: String,
      required: [true, "Question text is required"],
      trim: true,
      minlength: [5, "Question text must be at least 5 characters"],
    },
    options: {
      type: [optionSchema],
      validate: [
        {
          validator: (options) => options.length >= 2,
          message: "Question must have at least 2 options",
        },
        {
          validator: (options) => options.some((option) => option.isCorrect),
          message: "Question must have at least 1 correct option",
        },
      ],
    },
    explanation: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Question", questionSchema);
