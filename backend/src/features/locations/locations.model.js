import mongoose from "mongoose";
import Joi from "joi";

const locationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true, versionKey: false }
);

export const validateLocation = (location, isUpdate = false) => {
  const schema = Joi.object({
    name: isUpdate ? Joi.string().min(3) : Joi.string().min(3).required(),
    description: Joi.string().allow(""),
    createdBy: Joi.string().allow(null, ""),
  });
  return schema.validate(location);
};

const LocationModel = mongoose.model("Location", locationSchema);
export default LocationModel;