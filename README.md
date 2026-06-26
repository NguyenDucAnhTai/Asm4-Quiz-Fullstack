# ASM4 - Full-stack Quiz Application

This project is a complete MERN-style quiz application for Assignment 4.

## Main features

### Backend
- Express server
- MongoDB + Mongoose models
- JWT authentication
- Role-based authorization
- Admin CRUD quizzes and questions
- Normal user can login, fetch quizzes, do quiz, submit answers and view result
- Validation and global error handling

### Frontend
- React + Vite
- Redux Toolkit state management
- React Router protected routes
- Bootstrap 5 styling
- User flow: login -> quiz list -> do quiz -> finish quiz
- Admin flow: login -> admin dashboard -> create/delete quiz -> create/update/delete question

## Demo accounts after seed

```txt
Admin: admin@gmail.com / admin123
User: user@gmail.com / user123
```

## Local setup

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Update `.env`:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/asm4_quiz_app?retryWrites=true&w=majority
JWT_SECRET=your_long_secret
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

Run seed:

```bash
npm run seed
```

Start backend:

```bash
npm run dev
```

Backend URL:

```txt
http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Frontend URL:

```txt
http://localhost:5173
```

## API endpoints

### Auth

| Method | Endpoint | Role | Description |
|---|---|---|---|
| POST | `/api/auth/signup` | Public | Register account |
| POST | `/api/auth/login` | Public | Login |
| GET | `/api/auth/me` | User/Admin | Get current user |

### Quizzes

| Method | Endpoint | Role | Description |
|---|---|---|---|
| GET | `/api/quizzes` | User/Admin | Get all quizzes |
| GET | `/api/quizzes/:id` | User/Admin | Get quiz by id |
| POST | `/api/quizzes` | Admin | Create quiz |
| PUT | `/api/quizzes/:id` | Admin | Update quiz |
| DELETE | `/api/quizzes/:id` | Admin | Delete quiz |

### Questions

| Method | Endpoint | Role | Description |
|---|---|---|---|
| GET | `/api/questions` | Admin | Get questions |
| POST | `/api/questions` | Admin | Create question |
| GET | `/api/questions/:id` | Admin | Get question by id |
| PUT | `/api/questions/:id` | Admin | Update question |
| DELETE | `/api/questions/:id` | Admin | Delete question |

### Attempts

| Method | Endpoint | Role | Description |
|---|---|---|---|
| POST | `/api/attempts` | User/Admin | Submit quiz |
| GET | `/api/attempts/mine` | User/Admin | View my quiz attempts |

## Deploy backend on Render

1. Push project to GitHub.
2. Create a Web Service on Render.
3. Root Directory: `backend`
4. Build Command: `npm install`
5. Start Command: `npm start`
6. Add environment variables:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `CLIENT_URL=https://your-frontend-domain.vercel.app`
   - `NODE_ENV=production`
7. Deploy.
8. After deploy, run seed locally against Atlas or use Render Shell if available:
   ```bash
   npm run seed
   ```

## Deploy frontend on Vercel

1. Import the GitHub repo in Vercel.
2. Root Directory: `frontend`
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Add environment variable:
   - `VITE_API_URL=https://your-backend-domain.onrender.com/api`
6. Deploy.
7. Update backend `CLIENT_URL` on Render with the Vercel URL.

## Suggested screenshots for submission

1. User login successfully.
2. User quiz list after login.
3. User clicks and does quiz.
4. User finishes quiz and sees score.
5. Admin login successfully.
6. Admin dashboard.
7. Admin creates quiz/question.
8. MongoDB Atlas collections: users, quizzes, questions, attempts.
9. Backend deployed API URL.
10. Frontend deployed Vercel URL.
