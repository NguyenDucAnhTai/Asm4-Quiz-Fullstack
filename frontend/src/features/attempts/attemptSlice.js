import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";

export const submitQuiz = createAsyncThunk(
  "attempts/submit",
  async ({ quizId, answers }, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/attempts", { quizId, answers });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Cannot submit quiz");
    }
  }
);

export const fetchMyAttempts = createAsyncThunk(
  "attempts/fetchMine",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/attempts/mine");
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Cannot fetch attempts");
    }
  }
);

const attemptSlice = createSlice({
  name: "attempts",
  initialState: {
    result: null,
    history: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearResult: (state) => {
      state.result = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitQuiz.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.result = null;
      })
      .addCase(submitQuiz.fulfilled, (state, action) => {
        state.loading = false;
        state.result = action.payload;
      })
      .addCase(submitQuiz.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchMyAttempts.fulfilled, (state, action) => {
        state.history = action.payload;
      });
  },
});

export const { clearResult } = attemptSlice.actions;
export default attemptSlice.reducer;
