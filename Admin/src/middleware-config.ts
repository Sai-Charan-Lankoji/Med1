import { MiddlewaresConfig } from "@medusajs/medusa";
import cors from "cors"; // Import CORS middleware

const generatePortArray = (start: number, end: number) => {
  const ports = [];
  for (let i = start; i <= end; i++) {
    ports.push(`http://localhost:${i}`);
  }
  return ports;
};
 
// Configure CORS settings
const vendorCorsOptions = {
origin: ["http://localhost:7009","http://localhost:7000"], // Your frontend origin
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allowed methods
  credentials: true, // Allow credentials (if needed)
  optionsSuccessStatus: 200, // For older browsers
};

// const testCorsOptions = {
//   origin: ["http://localhost:7000"], // Your frontend origin
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allowed methods
//   credentials: true, // Allow credentials (if needed)
//   optionsSuccessStatus: 200, // For older browsers
// };
const storeCorsOptions = {
  origin: generatePortArray(8000, 80100) , // Your frontend origin
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allowed methods
  credentials: true, // Allow credentials (if needed)
  optionsSuccessStatus: 200, // For older browsers
}; 

const uploadsCorsOptions = {
  origin: generatePortArray(8000, 80100), // Your frontend origin
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
