import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config(); // Load .env file

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extracting token from header

  if (!token) {
    // If token is not found
    return res.status(401).json({ message: "Token not found" }); // Return immediately to stop further processing
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
   
    if(decoded) {
      // console.log(decoded);
      
      req.user = decoded; // Attach the decoded user to the request object
      // console.log(req.user);
      
      next(); // If token is valid, move to the next middleware
      
      //when ever using role based authentication for adim only
      // if(decoded.role === "admin") {  next(); } else { return res.status(401).json({ message: "Unauthorized" }); }

   
    }
    else{
      return res.status(401).json({ message: "Invalid token" });
    } 
  }
  catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" }); // If token is invalid/expired
  }
};

export default verifyToken;

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzZiZmY2ZGQ0MjVkZTVkNjU3NDQ0NmIiLCJlbWFpbCI6InNhZ2hlZXJAZ21haWwuY29tIiwicGFzc3dvcmQiOiIkMmIkMTAkSXouQ2xqYVFGV1lDb0VsWE5FT3FWZTFibFlDVnRxN3R1QUVPeDNTekRtcnphaWVSOWJpREMiLCJyb2xlIjoic3R1ZGVudCIsImNyZWF0ZWRBdCI6IjIwMjQtMTItMjVUMTI6NDk6NDkuMDcxWiIsInVwZGF0ZWRBdCI6IjIwMjQtMTItMjVUMTI6NDk6NDkuMDcxWiIsIl9fdiI6MCwiaWF0IjoxNzM1MTQwMzUxfQ.hCHcVfaRDQ5rEemrZtIy6wGqs33nEXI6qfF9NA4DW5E


