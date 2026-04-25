import mongoose from "mongoose";
import LibraryModel, { validateLibrary } from "./model.js";

// Create Library
export const createLibrary = async (req, res) => {
  try {
    const { error } = validateLibrary(req.body);
    if (error) return res.status(400).json({ status: false, message: error.details[0].message });

    const library = new LibraryModel(req.body);
    await library.save();
    res.status(201).json({ status: true, data: library });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ status: false, message: "Library name already exists in this location" });
    }
    res.status(500).json({ status: false, message: error.message });
  }
};

// Get All Libraries
export const getLibraries = async (req, res) => {
  try {
    const libraries = await LibraryModel.find();
    
    res.status(200).json({ status: true, data: libraries });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Get Library by ID
export const getLibraryById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: false, message: "Invalid library id" });
    }

    const library = await LibraryModel.findById(id);

    if (!library) return res.status(404).json({ status: false, message: "Library not found" });
    res.status(200).json({ status: true, data: library });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Update Library
export const updateLibrary = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: false, message: "Invalid library id" });
    }

    const { error } = validateLibrary(req.body, true);
    if (error) return res.status(400).json({ status: false, message: error.details[0].message });

    const updatedLibrary = await LibraryModel.findOneAndUpdate(
      { _id: id },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedLibrary) {
      return res.status(404).json({ status: false, message: "Library not found" });
    }

    res.status(200).json({ status: true, message: "Library updated successfully", data: updatedLibrary });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ status: false, message: "Library name already exists in this location" });
    }
    res.status(500).json({ status: false, message: error.message });
  }
};

// Delete Library
export const deleteLibrary = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: false, message: "Invalid library id" });
    }

    const deletedLibrary = await LibraryModel.findByIdAndDelete(id);
    if (!deletedLibrary) {
      return res.status(404).json({ status: false, message: "Library not found" });
    }

    res.status(200).json({ status: true, message: "Library deleted successfully" });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};