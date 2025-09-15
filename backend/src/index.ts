import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";

const app = new Elysia()
  .use(cors({
    origin: ['http://localhost:3000'],
    credentials: true,
  }))
  .get("/", () => ({ 
    message: "Food App API is running!" 
  }))
  .get("/api/health", () => ({ 
    status: "OK", 
    timestamp: new Date().toISOString() 
  }))
  .group("/api", (app) =>
    app
      .get("/menus", () => [
        {
          id: 1,
          name: "ผัดไทย",
          description: "ผัดไทยแสนอร่อย",
          price: 60,
          available: true
        },
        {
          id: 2,
          name: "ส้มตำ",
          description: "ส้มตำไทยแท้",
          price: 50,
          available: true
        }
      ])
      .post("/auth/login", ({ body }) => ({
        message: "Login endpoint",
        data: body
      }))
      .post("/auth/register", ({ body }) => ({
        message: "Register endpoint", 
        data: body
      }))
  )
  .listen(4000);

console.log(
  `🚀 Food App API is running at ${app.server?.hostname}:${app.server?.port}`
);
