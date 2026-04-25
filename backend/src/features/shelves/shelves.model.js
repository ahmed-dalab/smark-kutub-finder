import mongoose from "mongoose";
import Joi from "joi";

const shelfSchema = new mongoose.Schema(
  {
    cabinet: { type: mongoose.Schema.Types.ObjectId, ref: "Cabinet", required: true },
    shelfNumber: { type: Number, required: true },
    label: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true, versionKey: false }
);

// Unique compound index: Shelf number should be unique within a cabinet
shelfSchema.index({ cabinet: 1, shelfNumber: 1 }, { unique: true });

export const validateShelf = (shelf, isUpdate = false) => {
  const schema = Joi.object({
    cabinet: isUpdate ? Joi.string() : Joi.string().required(),
    shelfNumber: isUpdate ? Joi.number() : Joi.number().required(),
    label: Joi.string().allow(""),
    createdBy: Joi.string().allow(null, ""),
  });
  return schema.validate(shelf);
};

const ShelfModel = mongoose.model("Shelf", shelfSchema);
export default ShelfModel;