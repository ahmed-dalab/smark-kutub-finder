import mongoose from "mongoose";
import Joi from "joi";

const librarySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: { type: mongoose.Schema.Types.ObjectId, ref: "Location", required: true },
    description: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true, versionKey: false }
);

// Unique compound index: Library name should be unique within a location
librarySchema.index({ name: 1, location: 1 }, { unique: true });

export const validateLibrary = (library, isUpdate = false) => {
  const schema = Joi.object({
    name: isUpdate ? Joi.string().min(3) : Joi.string().min(3).required(),
    location: isUpdate ? Joi.string() : Joi.string().required(),
    description: Joi.string().allow(""),
    createdBy: Joi.string().allow(null, ""),
  });
  return schema.validate(library);
};

const LibraryModel = mongoose.model("Library", librarySchema);
export default LibraryModel;