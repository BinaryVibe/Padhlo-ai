import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import Quiz from '../models/Quiz.js';
import Question from '../models/Question.js';
import UserStats from '../models/UserStats.js';

dotenv.config();

const genAi = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const generateQuizFromAI = async (req, res) => {
  try {
    const { topic, content } = req.body;

    if (!topic) {
      return res.status(400).json({ error: "Topic is required to generate a quiz." });
    }

    const prompt = `You are an expert teacher. Generate exactly 5 multiple choice questions based on the following topic and notes.
    Topic: ${topic}
    Notes: ${content || "Use general knowledge about the topic."}

    You MUST return the output ONLY as a valid JSON array of objects. Do not add any markdown formatting like \`\`\`json.
    Each object must have this exact structure:
    [
      {
        "questionText": "Question string here?",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctAnswer": "The exact string of the correct option"
      }
    ]`;

    const response = await genAi.models.generateContent({
      model: "gemini-2.5-flash", 
      contents: prompt,
    });

    let text = response.text;
    
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    const questions = JSON.parse(text);

    res.status(200).json({ questions });
  } catch (error) {
    console.error("Gemini AI Quiz Generation Error:", error);
    res.status(500).json({ error: "Failed to generate quiz. Please try again." });
  }
};

export const saveQuiz = async (req, res) => {
    try {
        const { noteId, title, questions, score, totalQuestions } = req.body;
        const userId = req.user._id; 

        const newQuiz = new Quiz({ userId, noteId: noteId || null, title, score, totalQuestions });
        const savedQuiz = await newQuiz.save();

        const questionsWithQuizId = questions.map(q => ({
            ...q,
            quizId: savedQuiz._id
        }));
        await Question.insertMany(questionsWithQuizId);

        try {
            await UserStats.findOneAndUpdate(
                { userId },
                { 
                    $inc: { 
                        totalQuizzesTaken: 1, 
                        totalQuestionsAnswered: questions.length,
                        totalScore: score 
                    },
                    $set: { lastActivity: Date.now() }
                },
                { upsert: true, new: true } 
            );
        } catch(e) { console.log("UserStats update failed."); }

        res.status(201).json({ message: "Quiz saved successfully!", quizId: savedQuiz._id });
    } catch (error) {
        console.error("Error saving quiz:", error);
        res.status(500).json({ message: "Internal server error while saving quiz." });
    }
};

export const getUserQuizzes = async (req, res) => {
    try {
        const quizzes = await Quiz.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json(quizzes);
    } catch (error) {
        res.status(500).json({ message: "Error fetching quizzes." });
    }
};