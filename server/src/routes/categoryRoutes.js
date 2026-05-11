import express from 'express';
import auth from '../middlewares/auth.js'; 
import { createCategory, getUserCategories, deleteCategory, updateCategory } from '../controllers/categoryController.js';
const router = express.Router();

router.post('/', auth, createCategory);
router.get('/', auth, getUserCategories);
router.delete('/:id', auth, deleteCategory);
router.put('/:id', auth, updateCategory);

export default router;