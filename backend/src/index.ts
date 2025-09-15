import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { authRoutes } from "./routes/auth";
import { userRoutes } from "./routes/users";
import { menuRoutes } from "./routes/menus";
import { orderRoutes } from "./routes/orders";

const app = new Elysia()
  .use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  }))
  .get("/", () => ({ 
    message: "🍔 ZeenZilla Food App API is running!",
    version: "1.0.0",
    timestamp: new Date().toISOString()
  }))
  .get("/api/health", () => ({ 
    status: "OK", 
    service: "ZeenZilla Food API",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  }))
  .group("/api", (app) =>
    app
      .use(authRoutes)
      .use(userRoutes)
      .use(menuRoutes)
      .use(orderRoutes)
  )
  .onError(({ error, set }) => {
    console.error('API Error:', error)
    
    const errorMessage = error instanceof Error ? error.message : String(error)
    
    if (errorMessage.includes('Unauthorized')) {
      set.status = 401
      return { error: 'Unauthorized access' }
    }
    
    if (errorMessage.includes('Not found')) {
      set.status = 404
      return { error: 'Resource not found' }
    }
    
    set.status = 500
    return { error: 'Internal server error' }
  })
  .listen(process.env.PORT || 4000);

console.log(
  `🚀 ZeenZilla Food API is running at ${app.server?.hostname}:${app.server?.port}`
);