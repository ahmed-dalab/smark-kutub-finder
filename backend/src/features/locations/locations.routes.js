import express from "express";
import {
  createLocation,
  getLocations,
  getLocationById,
  updateLocation,
  deleteLocation,
} from "./controller.js";

const locationRoute = express.Router();

locationRoute.post("/", createLocation);
locationRoute.get("/", getLocations);
locationRoute.get("/:id", getLocationById);
locationRoute.patch("/:id", updateLocation);
locationRoute.delete("/:id", deleteLocation);

export default locationRoute;