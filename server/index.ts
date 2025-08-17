// Load environment variables first
import './env.js';

import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { isAlphaSite } from "./config";
import { jobRecoveryService } from "./job-recovery-service";
// import path from "path";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Comment out or remove the SPA catch-all route
// app.use((req, res, next) => {
//   if (req.method === 'GET' && !req.path.startsWith('/api')) {
//     res.sendFile(path.join(__dirname, '../client/dist/index.html'));
//   } else {
//     next();
//   }
// });

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Initialize job recovery service to handle stuck jobs
  try {
    await jobRecoveryService.initializeRecovery();
    log("Job recovery service initialized successfully");
  } catch (error) {
    log(`Failed to initialize job recovery service: ${error}`);
  }

  // Initialize backlog maintenance service after job recovery
  try {
    const { backlogRetainMinimumService } = await import("./service-backlog-retain-minimum");
    await backlogRetainMinimumService.initialize();
    log("Backlog maintenance service initialized successfully");
  } catch (error) {
    log(`Failed to initialize backlog maintenance service: ${error}`);
  }

  // Start periodic backlog maintenance (every 5 minutes)
  try {
    const { backlogRetainMinimumService } = await import("./service-backlog-retain-minimum");
    setInterval(async () => {
      try {
        log("🔄 Running periodic backlog maintenance...");
        await backlogRetainMinimumService.maintainBacklog();
        log("✅ Periodic backlog maintenance completed");
      } catch (error) {
        log(`❌ Periodic backlog maintenance failed: ${error}`);
      }
    }, 5 * 60 * 1000); // 5 minutes
    log("Periodic backlog maintenance scheduled (every 5 minutes)");
  } catch (error) {
    log(`Failed to schedule periodic backlog maintenance: ${error}`);
  }

  // Serve the app on port 5232 (old SGI port)
  // this serves both the API and the client.
  const port = 5232;
  server.listen({
    port,
    host: "0.0.0.0",
    // reusePort: true,
  }, () => {
    log(`serving on port ${port} (${isAlphaSite() ? 'alpha' : 'production'} mode)`);
  });
})();
