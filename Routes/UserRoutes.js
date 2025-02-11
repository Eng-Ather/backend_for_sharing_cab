import express from "express";
import sendResponse from "../Helpers/SendResponse.js";
import ClientModel from "../Models/Users.js";
import bcrypt from "bcrypt";
import Joi from "joi";
import jwt from "jsonwebtoken";
import verifyToken from "../Middleware/token.js";
import dotenv from "dotenv";
dotenv.config(); // Load .env file

const userRouter = express.Router();

// for sign up
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


// for login API
const loginSchema = Joi.object({
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }).required(),
  password: Joi.string().min(8).required(),
});

userRouter.post('/login', async (req, res) => {
  const { error, value } = loginSchema.validate(req.body);
  if (error) return sendResponse(res, 400, null, true, error.message);

  const user = await ClientModel.findOne({ email: value.email }).lean();
  if (!user) {
    return sendResponse(res, 400, null, true, "User Not Found");
  }

  const isPasswordValid = await bcrypt.compare(value.password, user.password);
  if (!isPasswordValid) {
    return sendResponse(res, 400, null, true, "Incorrect Password");
  }

  // Generating token with only necessary fields
  var token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  return sendResponse(res, 200, { user, token }, false, "User Login Successfully");
});

// Route to get current user
userRouter.get("/currentUser", verifyToken, async (req, res) => {
  try {
    const currentUser = await ClientModel.findById(req.user.id).select("-password -address");
    console.log("Current User from DB:", currentUser);
    sendResponse(res, 200, currentUser, false, "Fetched Data Successfully");
  } catch (error) {
    sendResponse(res, 500, null, true, "xxxxxxxxxxxxxx");
  }
});


userRouter.get("/allUsers", async (req, res) => {
  try {
    const allUsers = await ClientModel.find().select("-password -address");
    
    if (allUsers.length === 0) {
      return sendResponse(res, 404, null, true, "No users found.");
    }

    console.log("All Users from DB:", allUsers);
    sendResponse(res, 200, allUsers, false, "Fetched Data Successfully");
  } catch (error) {
    console.error("Error fetching users:", error);
    sendResponse(res, 500, null, true, "Internal Server Error");
  }
});

  
export default userRouter