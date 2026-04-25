import mongoose from "mongoose";
import BookPlacementModel, { validateBookPlacement } from "./model.js";

// Create BookPlacement
export const createBookPlacement = async (req, res) => {
  try {
    const { error } = validateBookPlacement(req.body);
    if (error) return res.status(400).json({ status: false, message: error.details[0].message });

    const placement = new BookPlacementModel(req.body);
    await placement.save();
    res.status(201).json({ status: true, data: placement });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ status: false, message: "Placement already exists for this volume" });
    }
    res.status(500).json({ status: false, message: error.message });
  }
};

// Get All BookPlacements
export const getBookPlacements = async (req, res) => {
  try {
    const placements = await BookPlacementModel.find();

    res.status(200).json({ status: true, data: placements });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Get BookPlacement by ID
export const getBookPlacementById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: false, message: "Invalid placement id" });
    }

    const placement = await BookPlacementModel.findById(id);
    
    if (!placement) return res.status(404).json({ status: false, message: "Placement not found" });
    res.status(200).json({ status: true, data: placement });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Update BookPlacement
export const updateBookPlacement = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: false, message: "Invalid placement id" });
    }

    const { error } = validateBookPlacement(req.body, true);
    if (error) return res.status(400).json({ status: false, message: error.details[0].message });

    const updatedPlacement = await BookPlacementModel.findOneAndUpdate(
      { _id: id },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedPlacement) {
      return res.status(404).json({ status: false, message: "Placement not found" });
    }

    res.status(200).json({ status: true, message: "Placement updated successfully", data: updatedPlacement });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ status: false, message: "Placement already exists for this volume" });
    }
    res.status(500).json({ status: false, message: error.message });
  }
};

// Delete BookPlacement
export const deleteBookPlacement = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: false, message: "Invalid placement id" });
    }

    const deletedPlacement = await BookPlacementModel.findByIdAndDelete(id);
    if (!deletedPlacement) {
      return res.status(404).json({ status: false, message: "Placement not found" });
    }

    res.status(200).json({ status: true, message: "Placement deleted successfully" });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};