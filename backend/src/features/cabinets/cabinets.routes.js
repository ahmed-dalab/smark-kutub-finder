import express from "express";
import {
  createCabinet,
  getCabinets,
  getCabinetById,
  updateCabinet,
  deleteCabinet,
} from "./controller.js";

const cabinetRoute = express.Router();

cabinetRoute.post("/", createCabinet);
cabinetRoute.get("/", getCabinets);
cabinetRoute.get("/:id", getCabinetById);
cabinetRoute.patch("/:id", updateCabinet);
cabinetRoute.delete("/:id", deleteCabinet);

export default cabinetRoute;