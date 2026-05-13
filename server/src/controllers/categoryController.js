import Category from '../models/Category.js';

export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.user._id;

    if (!name) return res.status(400).json({ message: "Category name is required." });

    const newCategory = new Category({ userId, name, description });
    const savedCategory = await newCategory.save();
    res.status(201).json({ message: "Category created", category: savedCategory });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUserCategories = async (req, res) => {
  try {
    const userId = req.user._id;
    const categories = await Category.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const userId = req.user._id;
    const deletedCategory = await Category.findOneAndDelete({ _id: categoryId, userId });
    if (!deletedCategory) return res.status(404).json({ message: "Not found or unauthorized" });
    res.status(200).json({ message: "Category deleted" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const categoryId = req.params.id;
    const userId = req.user._id;

    const updatedCategory = await Category.findOneAndUpdate(
      { _id: categoryId, userId },
      { name },
      { new: true }
    );

    if (!updatedCategory) return res.status(404).json({ message: "Not found." });
    res.status(200).json({ message: "Category renamed", category: updatedCategory });
  } catch (error) {
    console.error("Error renaming category:", error);
    res.status(500).json({ message: "Server error" });
  }
};