import type { MiddlewaresConfig } from "@medusajs/medusa";
import cors from "cors";

export const config: MiddlewaresConfig = {
  routes: [
    {
      bodyParser: { sizeLimit: 5000000 }, 
      matcher: "/vendor*",
      middlewares: [
        cors({
          origin: "http://localhost:8009", 
          credentials: true,
        }),
      ],
    },
    { 
      bodyParser: { sizeLimit: 5000000 }, 
      
      matcher: "/store*",
      middlewares: [
        cors({
          origin:["http://localhost:8003", "http://localhost:8004"],       
          credentials: true,
        }),
      ],
    }, 
    {
      bodyParser: { sizeLimit: 5000000 }, 
      matcher: "/uploads*",
      middlewares: [
        cors({
          origin:["http://localhost:8003", "http://localhost:8004"],       
          credentials: true,
        }),
      ],
    }, 
    
  ],
};
