import mongoose from "mongoose";
import LocationModel, { validateLocation } from "./model.js";

// Create Location
export const createLocation = async (req, res) => {
  try {
    const { error } = validateLocation(req.body);
    if (error) return res.status(400).json({ status: false, message: error.details[0].message });

    const location = new LocationModel(req.body);
    await location.save();
    res.status(201).json({ status: true, data: location });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Get All Locations
export const getLocations = async (req, res) => {
  try {
    const locations = await LocationModel.find().populate("createdBy", "name email");
    res.status(200).json({ status: true, data: locations });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Get Location by ID
export const getLocationById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: false, message: "Invalid location id" });
    }

    const location = await LocationModel.findById(id).populate("createdBy", "name email");
    if (!location) return res.status(404).json({ status: false, message: "Location not found" });
    res.status(200).json({ status: true, data: location });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Update Location
export const updateLocation = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: false, message: "Invalid location id" });
    }

    const { error } = validateLocation(req.body, true);
    if (error) return res.status(400).json({ status: false, message: error.details[0].message });

    const updatedLocation = await LocationModel.findOneAndUpdate(
      { _id: id },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedLocation) {
      return res.status(404).json({ status: false, message: "Location not found" });
    }

    res.status(200).json({ status: true, message: "Location updated successfully", data: updatedLocation });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Delete Location
export const deleteLocation = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: false, message: "Invalid location id" });
    }

    const deletedLocation = await LocationModel.findByIdAndDelete(id);
    if (!deletedLocation) {
      return res.status(404).json({ status: false, message: "Location not found" });
    }

    res.status(200).json({ status: true, message: "Location deleted successfully" });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};