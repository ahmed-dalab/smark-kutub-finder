import express from "express";
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "./controller.js";

const categoryRoute = express.Router();

categoryRoute.post("/", createCategory);
categoryRoute.get("/", getCategories);
categoryRoute.get("/:id", getCategoryById);
categoryRoute.patch("/:id", updateCategory);
categoryRoute.delete("/:id", deleteCategory);

export default categoryRoute;