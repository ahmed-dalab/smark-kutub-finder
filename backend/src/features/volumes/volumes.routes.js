import express from "express";
import {
  createVolume,
  getVolumes,
  getVolumeById,
  updateVolume,
  deleteVolume,
} from "./controller.js";

const volumeRoute = express.Router();

volumeRoute.post("/", createVolume);
volumeRoute.get("/", getVolumes);
volumeRoute.get("/:id", getVolumeById);
volumeRoute.patch("/:id", updateVolume);
volumeRoute.delete("/:id", deleteVolume);

export default volumeRoute;