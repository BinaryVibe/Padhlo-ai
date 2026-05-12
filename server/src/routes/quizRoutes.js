import express from 'express';
import { generateQuizFromAI, saveQuiz, getUserQuizzes } from '../controllers/quizController.js';
import auth from '../middlewares/auth.js'; 

const router = express.Router();

// 1. Generate questions via AI
router.post('/generate', auth, generateQuizFromAI);

// 2. Save quiz to MongoDB
router.post('/save', auth, saveQuiz);

// 3. Get user's quizzes
router.get('/my-quizzes', auth, getUserQuizzes);

export default router;