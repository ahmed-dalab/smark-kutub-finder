import mongoose from "mongoose";
import Joi from "joi";

const cabinetSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    library: { type: mongoose.Schema.Types.ObjectId, ref: "Library", required: true },
    numberOfShelves: { type: Number, default: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true, versionKey: false }
);

// Unique compound index: Cabinet name should be unique within a library
cabinetSchema.index({ name: 1, library: 1 }, { unique: true });

export const validateCabinet = (cabinet, isUpdate = false) => {
  const schema = Joi.object({
    name: isUpdate ? Joi.string().min(1) : Joi.string().min(1).required(),
    library: isUpdate ? Joi.string() : Joi.string().required(),
    numberOfShelves: Joi.number().min(0),
    createdBy: Joi.string().allow(null, ""),
  });
  return schema.validate(cabinet);
};

const CabinetModel = mongoose.model("Cabinet", cabinetSchema);
export default CabinetModel;