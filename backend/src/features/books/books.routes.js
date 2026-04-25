import express from "express";
import {
  createBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook,
} from "./controller.js";

const bookRoute = express.Router();

bookRoute.post("/", createBook);
bookRoute.get("/", getBooks);
bookRoute.get("/:id", getBookById);
bookRoute.patch("/:id", updateBook);
bookRoute.delete("/:id", deleteBook);

export default bookRoute;