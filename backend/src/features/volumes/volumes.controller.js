import mongoose from "mongoose";
import VolumeModel, { validateVolume } from "./model.js";

// Create Volume
export const createVolume = async (req, res) => {
  try {
    const { error } = validateVolume(req.body);
    if (error) return res.status(400).json({ status: false, message: error.details[0].message });

    const volume = new VolumeModel(req.body);
    await volume.save();
    res.status(201).json({ status: true, data: volume });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ status: false, message: "Volume number already exists for this book" });
    }
    res.status(500).json({ status: false, message: error.message });
  }
};

// Get All Volumes
export const getVolumes = async (req, res) => {
  try {
    const volumes = await VolumeModel.find();
    res.status(200).json({ status: true, data: volumes });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Get Volume by ID
export const getVolumeById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: false, message: "Invalid volume id" });
    }

    const volume = await VolumeModel.findById(id);
    if (!volume) return res.status(404).json({ status: false, message: "Volume not found" });
    res.status(200).json({ status: true, data: volume });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Update Volume
export const updateVolume = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: false, message: "Invalid volume id" });
    }

    const { error } = validateVolume(req.body, true);
    if (error) return res.status(400).json({ status: false, message: error.details[0].message });

    const updatedVolume = await VolumeModel.findOneAndUpdate(
      { _id: id },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedVolume) {
      return res.status(404).json({ status: false, message: "Volume not found" });
    }

    res.status(200).json({ status: true, message: "Volume updated successfully", data: updatedVolume });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ status: false, message: "Volume number already exists for this book" });
    }
    res.status(500).json({ status: false, message: error.message });
  }
};

// Delete Volume
export const deleteVolume = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: false, message: "Invalid volume id" });
    }

    const deletedVolume = await VolumeModel.findByIdAndDelete(id);
    if (!deletedVolume) {
      return res.status(404).json({ status: false, message: "Volume not found" });
    }

    res.status(200).json({ status: true, message: "Volume deleted successfully" });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};