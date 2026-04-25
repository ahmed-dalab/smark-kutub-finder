import express from "express";
import {
  createBookPlacement,
  getBookPlacements,
  getBookPlacementById,
  updateBookPlacement,
  deleteBookPlacement,
} from "./controller.js";

const bookPlacementRoute = express.Router();

bookPlacementRoute.post("/", createBookPlacement);
bookPlacementRoute.get("/", getBookPlacements);
bookPlacementRoute.get("/:id", getBookPlacementById);
bookPlacementRoute.patch("/:id", updateBookPlacement);
bookPlacementRoute.delete("/:id", deleteBookPlacement);

export default bookPlacementRoute;