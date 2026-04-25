import mongoose from "mongoose";
import Joi from "joi";

const bookPlacementSchema = new mongoose.Schema(
  {
    book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
    volume: { type: mongoose.Schema.Types.ObjectId, ref: "Volume", required: true },
    location: { type: mongoose.Schema.Types.ObjectId, ref: "Location", required: true },
    library: { type: mongoose.Schema.Types.ObjectId, ref: "Library", required: true },
    cabinet: { type: mongoose.Schema.Types.ObjectId, ref: "Cabinet", required: true },
    shelf: { type: mongoose.Schema.Types.ObjectId, ref: "Shelf", required: true },
    notes: { type: String },
  },
  { timestamps: true, versionKey: false }
);

// One placement per volume
bookPlacementSchema.index({ book: 1, volume: 1 }, { unique: true });

export const validateBookPlacement = (placement, isUpdate = false) => {
  const schema = Joi.object({
    book: isUpdate ? Joi.string() : Joi.string().required(),
    volume: isUpdate ? Joi.string() : Joi.string().required(),
    location: isUpdate ? Joi.string() : Joi.string().required(),
    library: isUpdate ? Joi.string() : Joi.string().required(),
    cabinet: isUpdate ? Joi.string() : Joi.string().required(),
    shelf: isUpdate ? Joi.string() : Joi.string().required(),
    notes: Joi.string().allow(""),
  });
  return schema.validate(placement);
};

const BookPlacementModel = mongoose.model("BookPlacement", bookPlacementSchema);
export default BookPlacementModel;