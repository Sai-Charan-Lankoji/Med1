import { MiddlewaresConfig } from "@medusajs/medusa";
import cors from "cors"; // Import CORS middleware

const generatePortArray = (start: number, end: number) => {
  const ports = [];
  for (let i = start; i <= end; i++) {
    ports.push(`http://localhost:${i}`);
  }
  return ports;
};

// Configure CORS settings for different routes
const vendorCorsOptions = {
  origin: ["http://localhost:7009", "http://localhost:7000,http://localhost:3000"], // Your frontend origins
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allowed methods
  credentials: true, // Allow credentials (if needed)
  optionsSuccessStatus: 200, // For older browsers
};

const planCorsOptions = {
  origin: ["http://localhost:7009,http://localhost:3000"], // Your frontend origin
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allowed methods
  credentials: true, // Allow credentials (if needed)
  optionsSuccessStatus: 200, // For older browsers
};

const storeCorsOptions = {
  origin: generatePortArray(8000, 80100), // Your frontend origins
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allowed methods
  credentials: true, // Allow credentials (if needed)
  optionsSuccessStatus: 200, // For older browsers
};

const uploadsCorsOptions = {
  origin: generatePortArray(8000, 80100), // Your frontend origins
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
      matcher: "/plan*",
      middlewares: [cors(planCorsOptions)], // Allow CORS for plan-related endpoints
    },
    {
      matcher: "/store*",
      middlewares: [cors(storeCorsOptions)], // Allow CORS for store-related endpoints
    },
    {
      matcher: "/uploads*",
      middlewares: [cors(uploadsCorsOptions)], // Allow CORS for uploads
    },
  ],
};
