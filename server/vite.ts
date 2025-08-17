import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config";
import { nanoid } from "nanoid";
import { getRouteMetadata, generateMetaTags } from "./metadata-config";


const viteLogger = createLogger();

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    allowedHosts: ["localhost", "127.0.0.1", "delu.la", "www.delu.la", ".delu.la"],
    middlewareMode: true,
    hmr: { server },
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    // Skip API routes - let them be handled by the API middleware
    if (url.startsWith('/api/')) {
      return next();
    }

    try {
      const clientTemplate = path.resolve(
        process.cwd(),
        "client",
        "index.html",
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      
      // Get route-specific metadata
      const routeMetadata = getRouteMetadata(url);
      const metaTags = generateMetaTags(routeMetadata);
      
      // Replace the metadata section more robustly
      // Find the start of the metadata (after charset meta tag)
      const charsetIndex = template.indexOf('<meta charset="UTF-8" />');
      if (charsetIndex !== -1) {
        // Find the end of the head section
        const headEndIndex = template.indexOf('</head>');
        if (headEndIndex !== -1) {
          // Extract the part before metadata and after metadata
          const beforeMetadata = template.substring(0, charsetIndex + '<meta charset="UTF-8" />'.length);
          const afterMetadata = template.substring(headEndIndex);
          
          // Insert the new metadata
          template = beforeMetadata + '\n    ' + metaTags + '\n  ' + afterMetadata;
        }
      }
      
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(process.cwd(), "dist", "public");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", async (req, res) => {
    try {
      const indexPath = path.resolve(distPath, "index.html");
      let template = await fs.promises.readFile(indexPath, "utf-8");
      
      // Get route-specific metadata
      const routeMetadata = getRouteMetadata(req.originalUrl);
      const metaTags = generateMetaTags(routeMetadata);
      
      // Replace the metadata section more robustly
      // Find the start of the metadata (after charset meta tag)
      const charsetIndex = template.indexOf('<meta charset="UTF-8" />');
      if (charsetIndex !== -1) {
        // Find the end of the head section
        const headEndIndex = template.indexOf('</head>');
        if (headEndIndex !== -1) {
          // Extract the part before metadata and after metadata
          const beforeMetadata = template.substring(0, charsetIndex + '<meta charset="UTF-8" />'.length);
          const afterMetadata = template.substring(headEndIndex);
          
          // Insert the new metadata
          template = beforeMetadata + '\n    ' + metaTags + '\n  ' + afterMetadata;
        }
      }
      
      res.status(200).set({ "Content-Type": "text/html" }).end(template);
    } catch (error) {
      // Fallback to sending the file directly if metadata injection fails
      res.sendFile(path.resolve(distPath, "index.html"));
    }
  });
}
