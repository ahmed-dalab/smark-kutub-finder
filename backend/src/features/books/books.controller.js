import mongoose from "mongoose";
import BookModel, { validateBook } from "./model.js";

// Create Book
export const createBook = async (req, res) => {
  try {
    const { error } = validateBook(req.body);
    if (error) return res.status(400).json({ status: false, message: error.details[0].message });

    const book = new BookModel(req.body);
    await book.save();
    res.status(201).json({ status: true, data: book });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ status: false, message: "This book (title & author) already exists" });
    }
    res.status(500).json({ status: false, message: error.message });
  }
};

// Get All Books
export const getBooks = async (req, res) => {
  try {
    const books = await BookModel.find();
    res.status(200).json({ status: true, data: books });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Get Book by ID
export const getBookById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: false, message: "Invalid book id" });
    }

    const book = await BookModel.findById(id);
    if (!book) return res.status(404).json({ status: false, message: "Book not found" });
    res.status(200).json({ status: true, data: book });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Update Book
export const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: false, message: "Invalid book id" });
    }

    const { error } = validateBook(req.body, true);
    if (error) return res.status(400).json({ status: false, message: error.details[0].message });

    const updatedBook = await BookModel.findOneAndUpdate(
      { _id: id },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedBook) {
      return res.status(404).json({ status: false, message: "Book not found" });
    }

    res.status(200).json({ status: true, message: "Book updated successfully", data: updatedBook });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ status: false, message: "This book (title & author) already exists" });
    }
    res.status(500).json({ status: false, message: error.message });
  }
};

// Delete Book
export const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: false, message: "Invalid book id" });
    }

    const deletedBook = await BookModel.findByIdAndDelete(id);
    if (!deletedBook) {
      return res.status(404).json({ status: false, message: "Book not found" });
    }

    res.status(200).json({ status: true, message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};