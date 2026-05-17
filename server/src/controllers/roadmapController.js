import { GoogleGenAI } from "@google/genai";
import Roadmap from '../models/Roadmap.js';
import dotenv from "dotenv";

dotenv.config();

const genAi = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// 1. Generate Roadmap using AI
export const generateRoadmap = async (req, res) => {
    try {
        const { goal, duration, topics } = req.body;
        const userId = req.user._id;

        if (!goal || !duration) {
            return res.status(400).json({ error: "Goal and duration are required." });
        }

        const prompt = `You are an expert study planner. Create a detailed study roadmap for the following goal.
        Goal: ${goal}
        Duration: ${duration} days
        Specific Topics to cover: ${topics || "General comprehensive coverage"}

        You MUST return ONLY a valid JSON array. Do NOT include markdown formatting like \`\`\`json.
        The JSON structure must exactly match this format:
        [
            {
                "dayNumber": 1,
                "theme": "String (Main topic of the day)",
                "tasks": [
                    { "title": "String (Task heading)", "description": "String (Short detail of what to do)" }
                ]
            }
        ]
        Make sure to generate exactly ${duration} days. Generate 2 to 3 practical tasks per day.`;

        const response = await genAi.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        let text = response.text;
        // Clean up markdown just in case Gemini adds it
        text = text.replace(/```json/g, "").replace(/```/g, "").trim();

        const daysPlan = JSON.parse(text);

        // Save to Database
        const newRoadmap = new Roadmap({
            userId,
            goal,
            duration,
            topics,
            days: daysPlan,
            progress: 0
        });

        const savedRoadmap = await newRoadmap.save();
        res.status(201).json(savedRoadmap);

    } catch (error) {
        console.error("Roadmap Generation Error:", error);
        res.status(500).json({ error: "Failed to generate roadmap. Please try again." });
    }
};

// 2. Get User's Roadmaps
export const getRoadmaps = async (req, res) => {
    try {
        const roadmaps = await Roadmap.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json(roadmaps);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch roadmaps." });
    }
};

// 3. Update Task Status & Recalculate Progress
export const updateTaskStatus = async (req, res) => {
    try {
        const { roadmapId, dayId, taskId, isCompleted } = req.body;

        const roadmap = await Roadmap.findById(roadmapId);
        if (!roadmap) return res.status(404).json({ error: "Roadmap not found" });

        // Find the specific day and task
        const day = roadmap.days.id(dayId);
        const task = day.tasks.id(taskId);
        task.isCompleted = isCompleted;

        // Recalculate overall progress
        let totalTasks = 0;
        let completedTasks = 0;

        roadmap.days.forEach(d => {
            d.tasks.forEach(t => {
                totalTasks++;
                if (t.isCompleted) completedTasks++;
            });
        });

        roadmap.progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

        await roadmap.save();
        res.status(200).json(roadmap);

    } catch (error) {
        console.error("Task Update Error:", error);
        res.status(500).json({ error: "Failed to update task." });
    }
};