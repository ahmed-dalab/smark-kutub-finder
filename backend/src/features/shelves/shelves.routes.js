import express from "express";
import {
  createShelf,
  getShelves,
  getShelfById,
  updateShelf,
  deleteShelf,
} from "./controller.js";

const shelfRoute = express.Router();

shelfRoute.post("/", createShelf);
shelfRoute.get("/", getShelves);
shelfRoute.get("/:id", getShelfById);
shelfRoute.patch("/:id", updateShelf);
shelfRoute.delete("/:id", deleteShelf);

export default shelfRoute;