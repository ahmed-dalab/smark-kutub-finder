import mongoose from "mongoose";
import ShelfModel, { validateShelf } from "./model.js";

// Create Shelf
export const createShelf = async (req, res) => {
  try {
    const { error } = validateShelf(req.body);
    if (error) return res.status(400).json({ status: false, message: error.details[0].message });

    const shelf = new ShelfModel(req.body);
    await shelf.save();
    res.status(201).json({ status: true, data: shelf });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ status: false, message: "Shelf number already exists in this cabinet" });
    }
    res.status(500).json({ status: false, message: error.message });
  }
};

// Get All Shelves
export const getShelves = async (req, res) => {
  try {
    const shelves = await ShelfModel.find()

    res.status(200).json({ status: true, data: shelves });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Get Shelf by ID
export const getShelfById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: false, message: "Invalid shelf id" });
    }

    const shelf = await ShelfModel.findById(id)
    
    if (!shelf) return res.status(404).json({ status: false, message: "Shelf not found" });
    res.status(200).json({ status: true, data: shelf });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Update Shelf
export const updateShelf = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: false, message: "Invalid shelf id" });
    }

    const { error } = validateShelf(req.body, true);
    if (error) return res.status(400).json({ status: false, message: error.details[0].message });

    const updatedShelf = await ShelfModel.findOneAndUpdate(
      { _id: id },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedShelf) {
      return res.status(404).json({ status: false, message: "Shelf not found" });
    }

    res.status(200).json({ status: true, message: "Shelf updated successfully", data: updatedShelf });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ status: false, message: "Shelf number already exists in this cabinet" });
    }
    res.status(500).json({ status: false, message: error.message });
  }
};

// Delete Shelf
export const deleteShelf = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: false, message: "Invalid shelf id" });
    }

    const deletedShelf = await ShelfModel.findByIdAndDelete(id);
    if (!deletedShelf) {
      return res.status(404).json({ status: false, message: "Shelf not found" });
    }

    res.status(200).json({ status: true, message: "Shelf deleted successfully" });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};