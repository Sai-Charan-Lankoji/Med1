import { MiddlewaresConfig } from "@medusajs/medusa";
import cors from "cors"; // Import CORS middleware
 
// Configure CORS settings
const vendorCorsOptions = {
  origin: "http://localhost:8009", // Your frontend origin
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allowed methods
  credentials: true, // Allow credentials (if needed)
  optionsSuccessStatus: 200, // For older browsers
};

const storeCorsOptions = {
  origin: ["http://localhost:8003","http://localhost:8004"] , // Your frontend origin
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allowed methods
  credentials: true, // Allow credentials (if needed)
  optionsSuccessStatus: 200, // For older browsers
}; 

const uploadsCorsOptions = {
  origin: "http://localhost:8003", // Your frontend origin
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allowed methods
  credentials: true, // Allow credentials (if needed)
  optionsSuccessStatus: 200, // For older browsers
};


export const config: MiddlewaresConfig = {
  routes: [
    {
      matcher: "/vendor*",
      middlewares: [cors(vendorCorsOptions)], // Allow CORS for all methods
    },
    {
      matcher: "/store*",
      middlewares: [cors(storeCorsOptions)], // Allow CORS for all methods
    }, 
    {
      matcher: "/uploads*",
      middlewares: [cors(uploadsCorsOptions)], // Allow CORS for all methods
    },
  ],
};
