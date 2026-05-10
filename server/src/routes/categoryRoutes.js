import express from 'express';
import { createCategory, getUserCategories, deleteCategory } from '../controllers/categoryController.js';
import auth from '../middlewares/auth.js'; 

const router = express.Router();

router.post('/', auth, createCategory);
router.get('/', auth, getUserCategories);
router.delete('/:id', auth, deleteCategory);

export default router;