import express from "express";
import dotenv from "dotenv";
dotenv.config(); // Load .env file
const userRouter = express.Router();


userRouter.post('/signup', async (req, res)=>{

})

userRouter.post('/login', async (req, res)=>{
    
})

export default userRouter