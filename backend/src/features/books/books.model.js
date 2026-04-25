import mongoose from "mongoose";
import Joi from "joi";

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    type: { type: String, enum: ["Matn", "Mujallad"], required: true },
    totalVolumes: { type: Number, default: 1 },
  },
  { timestamps: true, versionKey: false }
);

// Unique compound index: Book title and author should be unique
bookSchema.index({ title: 1, author: 1 }, { unique: true });

export const validateBook = (book, isUpdate = false) => {
  const schema = Joi.object({
    title: isUpdate ? Joi.string().min(1) : Joi.string().min(1).required(),
    author: isUpdate ? Joi.string().min(1) : Joi.string().min(1).required(),
    category: isUpdate ? Joi.string() : Joi.string().required(),
    type: isUpdate ? Joi.string().valid("Matn", "Mujallad") : Joi.string().valid("Matn", "Mujallad").required(),
    totalVolumes: Joi.number().min(1),
  });
  return schema.validate(book);
};

const BookModel = mongoose.model("Book", bookSchema);
export default BookModel;