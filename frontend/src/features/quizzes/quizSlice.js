import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";

export const fetchQuizzes = createAsyncThunk(
  "quizzes/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/quizzes");
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Cannot fetch quizzes");
    }
  }
);

export const fetchQuizById = createAsyncThunk(
  "quizzes/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/quizzes/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Cannot fetch quiz");
    }
  }
);

export const createQuiz = createAsyncThunk(
  "quizzes/create",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/quizzes", formData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Cannot create quiz");
    }
  }
);

export const updateQuiz = createAsyncThunk(
  "quizzes/update",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/quizzes/${id}`, formData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Cannot update quiz");
    }
  }
);

export const deleteQuiz = createAsyncThunk(
  "quizzes/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/quizzes/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Cannot delete quiz");
    }
  }
);

export const createQuestion = createAsyncThunk(
  "questions/create",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/questions", formData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Cannot create question");
    }
  }
);

export const updateQuestion = createAsyncThunk(
  "questions/update",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/questions/${id}`, formData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Cannot update question");
    }
  }
);

export const deleteQuestion = createAsyncThunk(
  "questions/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/questions/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Cannot delete question");
    }
  }
);

const quizSlice = createSlice({
  name: "quizzes",
  initialState: {
    items: [],
    selectedQuiz: null,
    loading: false,
    error: null,
    adminMessage: null,
  },
  reducers: {
    clearSelectedQuiz: (state) => {
      state.selectedQuiz = null;
    },
    clearQuizMessage: (state) => {
      state.adminMessage = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuizzes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuizzes.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchQuizzes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchQuizById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selectedQuiz = null;
      })
      .addCase(fetchQuizById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedQuiz = action.payload;
      })
      .addCase(fetchQuizById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createQuiz.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
        state.adminMessage = "Quiz created successfully";
      })
      .addCase(updateQuiz.fulfilled, (state, action) => {
        state.items = state.items.map((quiz) =>
          quiz._id === action.payload._id ? action.payload : quiz
        );
        state.adminMessage = "Quiz updated successfully";
      })
      .addCase(deleteQuiz.fulfilled, (state, action) => {
        state.items = state.items.filter((quiz) => quiz._id !== action.payload);
        state.adminMessage = "Quiz deleted successfully";
      })
      .addCase(createQuestion.fulfilled, (state) => {
        state.adminMessage = "Question created successfully";
      })
      .addCase(updateQuestion.fulfilled, (state, action) => {
        state.adminMessage = "Question updated successfully";
        if (state.selectedQuiz?.questions) {
          state.selectedQuiz.questions = state.selectedQuiz.questions.map((question) =>
            question._id === action.payload._id ? action.payload : question
          );
        }
      })
      .addCase(deleteQuestion.fulfilled, (state, action) => {
        state.adminMessage = "Question deleted successfully";
        if (state.selectedQuiz?.questions) {
          state.selectedQuiz.questions = state.selectedQuiz.questions.filter(
            (question) => question._id !== action.payload
          );
        }
      });
  },
});

export const { clearSelectedQuiz, clearQuizMessage } = quizSlice.actions;
export default quizSlice.reducer;
