import type { MiddlewaresConfig } from "@medusajs/medusa";
import cors from "cors";

const generatePortArray = (start: number, end: number) => {
  const ports = [];
  for (let i = start; i <= end; i++) {
    ports.push(`http://localhost:${i}`);
  }
  return ports;
};

export const config: MiddlewaresConfig = {
  routes: [
    {
      bodyParser: { sizeLimit: 5000000 }, 
      matcher: "/vendor*",
      middlewares: [
        cors({
          origin: ["http://localhost:7009" , "http://localhost:7000"], 
          credentials: true,
        }),
      ],
    },
    { 
      bodyParser: { sizeLimit: 5000000 }, 
      
      matcher: "/store*",
      middlewares: [
        cors({
          origin:generatePortArray(8000, 80100),       
          credentials: true,
        }),
      ],
    }, 
    {
      bodyParser: { sizeLimit: 5000000 }, 
      matcher: "/uploads*",
      middlewares: [
        cors({
          origin:generatePortArray(8000, 80100),       
          credentials: true,
        }),
      ],
    }, 
    
  ],
};
