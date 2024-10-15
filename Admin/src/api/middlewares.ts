import type { MiddlewaresConfig } from "@medusajs/medusa";
import cors from "cors";

export const config: MiddlewaresConfig = {
  routes: [
    {
      matcher: "/vendor*",
      middlewares: [
        cors({
          origin: "http://localhost:8009", 
          credentials: true,
        }),
      ],
    },
    {
      matcher: "/store*",
      middlewares: [
        cors({
          origin:["http://localhost:8003", "http://localhost:8004"],       
          credentials: true,
        }),
      ],
    }, 
    {
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
