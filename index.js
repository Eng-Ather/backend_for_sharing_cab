import express from "express";
import mongoose from "./ConnectDB/dbConnection.js";
import cors from 'cors'
import 'dotenv/config'
import userRouter from "./Routes/UserRoutes.js";

const app = express();
// const port = 4000;
const port = process.env.PORT || 4000;  // use process.env.PORT for Vercel


// for mongo db connection
mongoose.connection.on("error", (err) => {
  console.log("Error in connection", err);
});

mongoose.connection.on("open", () => {
  console.log("MongoDB is connected successfully");
});


// main page message
app.get("/", (req, res) => {
    res.send("Welcom TO SHARING CAB");
});

app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // This will allow us to handle JSON bodies

app.use("/user", userRouter)

app.listen(port, () => {
  console.log("server is running on port : ", port);
});

