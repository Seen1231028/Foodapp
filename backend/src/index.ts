import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { authRoutes } from "./routes/auth";
import { userRoutes } from "./routes/users";
import { menuRoutes } from "./routes/menus";
import { orderRoutes } from "./routes/orders";
import { dashboardRoutes } from "./routes/dashboard";
import { analyticsRoutes } from "./routes/analytics_new";
import financeRoutes from "./routes/finance";
import reportsRoutes from "./routes/reports";
import fs from "fs";
import path from "path";

const app = new Elysia()
  .use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  }))
  // Serve static files from uploads directory
  .get("/uploads/*", ({ params, set }) => {
    try {
      const filePath = path.join(process.cwd(), "uploads", params["*"] || "");
      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const file = fs.readFileSync(filePath);
        const ext = path.extname(filePath).toLowerCase();
        const mimeTypes: Record<string, string> = {
          '.jpg': 'image/jpeg',
          '.jpeg': 'image/jpeg',
          '.png': 'image/png',
          '.gif': 'image/gif',
          '.webp': 'image/webp',
          '.txt': 'text/plain'
        };
        
        set.headers['Content-Type'] = mimeTypes[ext] || 'application/octet-stream';
        return file;
      }
      set.status = 404;
      return "File not found";
    } catch (error) {
      set.status = 500;
      return "Internal server error";
    }
  })
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
      .use(dashboardRoutes)
      .use(analyticsRoutes)
      .use(financeRoutes)
      .use(reportsRoutes)
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