import mongoose from "mongoose";
import CabinetModel, { validateCabinet } from "./model.js";

// Create Cabinet
export const createCabinet = async (req, res) => {
  try {
    const { error } = validateCabinet(req.body);
    if (error) return res.status(400).json({ status: false, message: error.details[0].message });

    const cabinet = new CabinetModel(req.body);
    await cabinet.save();
    res.status(201).json({ status: true, data: cabinet });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ status: false, message: "Cabinet name already exists in this library" });
    }
    res.status(500).json({ status: false, message: error.message });
  }
};

// Get All Cabinets
export const getCabinets = async (req, res) => {
  try {
    const cabinets = await CabinetModel.find();
    res.status(200).json({ status: true, data: cabinets });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Get Cabinet by ID
export const getCabinetById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: false, message: "Invalid cabinet id" });
    }

    const cabinet = await CabinetModel.findById(id);
    
    if (!cabinet) return res.status(404).json({ status: false, message: "Cabinet not found" });
    res.status(200).json({ status: true, data: cabinet });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Update Cabinet
export const updateCabinet = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: false, message: "Invalid cabinet id" });
    }

    const { error } = validateCabinet(req.body, true);
    if (error) return res.status(400).json({ status: false, message: error.details[0].message });

    const updatedCabinet = await CabinetModel.findOneAndUpdate(
      { _id: id },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedCabinet) {
      return res.status(404).json({ status: false, message: "Cabinet not found" });
    }

    res.status(200).json({ status: true, message: "Cabinet updated successfully", data: updatedCabinet });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ status: false, message: "Cabinet name already exists in this library" });
    }
    res.status(500).json({ status: false, message: error.message });
  }
};

// Delete Cabinet
export const deleteCabinet = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: false, message: "Invalid cabinet id" });
    }

    const deletedCabinet = await CabinetModel.findByIdAndDelete(id);
    if (!deletedCabinet) {
      return res.status(404).json({ status: false, message: "Cabinet not found" });
    }

    res.status(200).json({ status: true, message: "Cabinet deleted successfully" });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};