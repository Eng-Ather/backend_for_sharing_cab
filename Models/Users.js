import mongoose from "mongoose";
const { Schema } = mongoose;

const clientSchema = new Schema(
  {
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    name: { type: String },
    gender: { type: String, enum: ["male", "female"] },
    phoneNumber : {type : Number },
    address : {type : String},
    profileImage : {type : String},
  },
  { timestamps: true }
);

const ClientModel = mongoose.models.Users || mongoose.model("Users", clientSchema);

export default ClientModel;
