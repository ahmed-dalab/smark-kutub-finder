import express from "express";
import {
  createLibrary,
  getLibraries,
  getLibraryById,
  updateLibrary,
  deleteLibrary,
} from "./controller.js";

const libraryRoute = express.Router();

libraryRoute.post("/", createLibrary);
libraryRoute.get("/", getLibraries);
libraryRoute.get("/:id", getLibraryById);
libraryRoute.patch("/:id", updateLibrary);
libraryRoute.delete("/:id", deleteLibrary);

export default libraryRoute;