import express from 'express';
import Quiz from '../models/Quiz.js';
import Question from '../models/Question.js';
import UserStats from '../models/UserStats.js';
import auth from '../middlewares/auth.js'; // Protects the route to only logged-in users

const router = express.Router();

// Route 1: Save a newly generated AI quiz
router.post('/save', auth, async (req, res) => {
    try {
        const { noteId, title, questions } = req.body;
        const userId = req.user._id; 

        // 1. Create the Quiz metadata document
        const newQuiz = new Quiz({ userId, noteId, title });
        const savedQuiz = await newQuiz.save();

        // 2. Attach the new quizId to all the generated questions and save them
        const questionsWithQuizId = questions.map(q => ({
            ...q,
            quizId: savedQuiz._id
        }));
        await Question.insertMany(questionsWithQuizId);

        // 3. Update the 5th Collection (UserStats)
        await UserStats.findOneAndUpdate(
            { userId },
            { 
                $inc: { totalQuizzesTaken: 1, totalQuestionsAnswered: questions.length },
                $set: { lastActivity: Date.now() }
            },
            { upsert: true, new: true } // Creates the doc if the user doesn't have one yet
        );

        res.status(201).json({ 
            message: "Quiz saved successfully!", 
            quizId: savedQuiz._id 
        });
    } catch (error) {
        console.error("Error saving quiz:", error);
        res.status(500).json({ message: "Internal server error while saving quiz." });
    }
});

// Route 2: Get all quizzes for the logged-in user
router.get('/my-quizzes', auth, async (req, res) => {
    try {
        // Utilizing the Compound Index you created earlier for lightning-fast speeds
        const quizzes = await Quiz.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json(quizzes);
    } catch (error) {
        res.status(500).json({ message: "Error fetching quizzes." });
    }
});

export default router;