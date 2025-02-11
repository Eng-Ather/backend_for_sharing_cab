//connection/dbconnection.js

import mongoose from "mongoose";
import 'dotenv/config'
// const url= `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@smit.9zo1a.mongodb.net/?retryWrites=true&w=majority&appName=smit`;

const url= `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@smit.9zo1a.mongodb.net/sharingcab`;
mongoose.connect (url);

export default mongoose;
