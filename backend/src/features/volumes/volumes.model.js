import mongoose from "mongoose";
import Joi from "joi";

const volumeSchema = new mongoose.Schema(
  {
    book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
    volumeNumber: { type: Number, required: true },
    title: { type: String },
  },
  { timestamps: true, versionKey: false }
);

// Unique compound index: Volume number should be unique within a book
volumeSchema.index({ book: 1, volumeNumber: 1 }, { unique: true });

export const validateVolume = (volume, isUpdate = false) => {
  const schema = Joi.object({
    book: isUpdate ? Joi.string() : Joi.string().required(),
    volumeNumber: isUpdate ? Joi.number() : Joi.number().required(),
    title: Joi.string().allow(""),
  });
  return schema.validate(volume);
};

const VolumeModel = mongoose.model("Volume", volumeSchema);
export default VolumeModel;