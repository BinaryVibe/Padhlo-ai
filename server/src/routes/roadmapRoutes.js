
import express from 'express';
import { generateRoadmap, getRoadmaps, updateTaskStatus } from '../controllers/roadmapController.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

// AI se naya roadmap generate karne ke liye
router.post('/generate', auth, generateRoadmap);

// User ke saare roadmaps mangwane ke liye
router.get('/', auth, getRoadmaps);

// Task ka checkbox (progress) update karne ke liye
router.put('/update-task', auth, updateTaskStatus);

export default router;