import express from "express";
import dotenv from "dotenv";
dotenv.config(); // Load .env file
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

const loginSchema = Joi.object({})

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


userRouter.post('/login', async (req, res)=>{
    try {
        const { email: currentUserEmail, password: currentUserPassword } = req.body;
    
        // Validate input
        if (!currentUserEmail || !currentUserPassword) {
          return res
            .status(400)
            .json({ message: "Both Email and password are required", status: 400 });
        }
    
        // Find the user in the database
        const user = await User.findOne({ email: currentUserEmail }).lean();
        if (!user) {
          return res.status(404).json({ message: "User not found", status: 404 });
        }
    
        // Compare the provided password with the hashed password in the database
        const isPasswordValid = await bcrypt.compare(
          currentUserPassword,
          user.password
        );
    
        if (!isPasswordValid) {
          return res.status(401).json({ message: "Invalid password", status: 401 });
        }
    
        // Generating token
        var token = jwt.sign(user, process.env.JWT_SECRET);
        // console.log(token);
    
        return res.status(200).json({
          message: "User login successfully!",
          status: 200,
          user: { user, token },
        });
      } catch (error) {
        console.error("Error logging in user:", error);
        return res.status(500).json({
          message: "Error logging in user",
          status: 500,
          error: error.message,
        });
      }
})

export default userRouter