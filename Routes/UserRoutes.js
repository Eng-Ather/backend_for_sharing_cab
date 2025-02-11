import express from "express";
import dotenv from "dotenv";
import sendResponse from "../Helpers/SendResponse.js";
import ClientModel from "../Models/Users.js";
import bcrypt from "bcrypt";
import Joi from "joi";
dotenv.config(); // Load .env file
const userRouter = express.Router();

const registerSchema = Joi.object({
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
  password: Joi.string().min(8).required(),
  name: Joi.string().min(3).max(30).required(),
  gender: Joi.string().min(3).max(30).required(),
  phoneNumber: Joi.number(),
  address: Joi.string().min(10).max(50).required(),
  profileImage: Joi.string().min(10).max(50).required(),
});

userRouter.post("/signup", async (req, res) => {
  const { error, value } = registerSchema.validate(req.body);
  if (error) return sendResponse(res, 400, null, true, error.message);
  const user = await ClientModel.findOne({ email: value.email });
  if (user) return sendResponse(res, 404, null, true, "User Already Taken");
  const hashedPass = await bcrypt.hash(value.password, 12);
  value.password = hashedPass;
  let newUser = new ClientModel({ ...value });
  newUser = await newUser.save();
  sendResponse(res, 201, newUser, false, "User Registered Successfully");
});

userRouter.post("/login", async (req, res) => {});

export default userRouter;
