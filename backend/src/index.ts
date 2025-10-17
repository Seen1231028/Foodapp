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
import shopRoutes from "./routes/shops";
import { logsRoute } from "./routes/logs";
import fs from "fs";
import path from "path";

const preferredPort = parseInt(process.env.PORT || '4000', 10);
const maxAttempts = 5; // try a few fallback ports

async function startServer(attempt = 0, basePort = preferredPort): Promise<void> {
  const tryPort = basePort + attempt;
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
        .use(shopRoutes)
        .use(logsRoute)
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
    });

  try {
    const serverInfo = app.listen(tryPort);
    // Bun's server object (from .listen) exposes .hostname/.port on returned object, but typing may differ; fallback print tryPort.
    // @ts-ignore
    const host = serverInfo?.hostname || 'localhost';
    // @ts-ignore
    const port = serverInfo?.port || tryPort;
    console.log(`🚀 ZeenZilla Food API is running at ${host}:${port}`);
    if (tryPort !== preferredPort) {
      console.log(`⚠️ Preferred port ${preferredPort} was busy. Using fallback port ${tryPort}.`);
    }
    return;
  } catch (e: any) {
    if (e?.code === 'EADDRINUSE' && attempt < maxAttempts - 1) {
      console.warn(`Port ${tryPort} in use. Trying ${tryPort + 1}...`);
      return startServer(attempt + 1, basePort);
    }
    console.error('Failed to start server:', e);
    process.exit(1);
  }
}

// Kick off startup
startServer();