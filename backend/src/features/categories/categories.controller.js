import mongoose from "mongoose";
import CategoryModel, { validateCategory } from "./model.js";

// Create Category
export const createCategory = async (req, res) => {
  try {
    const { error } = validateCategory(req.body);
    if (error) return res.status(400).json({ status: false, message: error.details[0].message });

    const category = new CategoryModel(req.body);
    await category.save();
    res.status(201).json({ status: true, data: category });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Get All Categories
export const getCategories = async (req, res) => {
  try {
    const categories = await CategoryModel.find();
    res.status(200).json({ status: true, data: categories });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Get Category by ID
export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: false, message: "Invalid category id" });
    }

    const category = await CategoryModel.findById(id);
    if (!category) return res.status(404).json({ status: false, message: "Category not found" });
    res.status(200).json({ status: true, data: category });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Update Category
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: false, message: "Invalid category id" });
    }

    const { error } = validateCategory(req.body, true);
    if (error) return res.status(400).json({ status: false, message: error.details[0].message });

    const updatedCategory = await CategoryModel.findOneAndUpdate(
      { _id: id },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ status: false, message: "Category not found" });
    }

    res.status(200).json({ status: true, message: "Category updated successfully", data: updatedCategory });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Delete Category
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: false, message: "Invalid category id" });
    }

    const deletedCategory = await CategoryModel.findByIdAndDelete(id);
    if (!deletedCategory) {
      return res.status(404).json({ status: false, message: "Category not found" });
    }

    res.status(200).json({ status: true, message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};