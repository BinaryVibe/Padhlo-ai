import Category from '../models/Category.js';

// 1. Create a new Category (Folder)
export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.user._id; // Extracted from your auth middleware

    if (!name) {
      return res.status(400).json({ message: "Category name is required." });
    }

    const newCategory = new Category({
      userId,
      name,
      description
    });

    const savedCategory = await newCategory.save();
    res.status(201).json({ message: "Category created successfully", category: savedCategory });

  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ message: "Server error while creating category." });
  }
};

// 2. Fetch all Categories for the logged-in User
export const getUserCategories = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch categories and sort by newest first
    const categories = await Category.find({ userId }).sort({ createdAt: -1 });
    
    res.status(200).json(categories);

  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Server error while fetching categories." });
  }
};

// 3. Delete a Category
export const deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const userId = req.user._id;

    // Ensure we only delete if the category belongs to the logged-in user
    const deletedCategory = await Category.findOneAndDelete({ _id: categoryId, userId });

    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found or unauthorized to delete." });
    }

    res.status(200).json({ message: "Category deleted successfully." });

  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: "Server error while deleting category." });
  }
};