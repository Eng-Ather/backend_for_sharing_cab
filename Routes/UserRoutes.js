import express from "express";
import dotenv from "dotenv";
dotenv.config(); // Load .env file
const userRouter = express.Router();


userRouter.post('/signup', async (req, res)=>{

})



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