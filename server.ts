import express from "express";
import db from "./server/db.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  // API Proxy Route
  app.get("/api/proxy", async (req, res) => {
    try {
      const url = new URL("https://zeldvorik.ru/apiv3/api.php");
      
      // Forward all query parameters
      for (const [key, value] of Object.entries(req.query)) {
        if (typeof value === "string") {
          url.searchParams.append(key, value);
        }
      }

      let retries = 2; // 1 initial + 1 retry
      let lastError: any;

      while (retries > 0) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout per attempt

          const response = await fetch(url.toString(), {
            headers: {
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
            },
            signal: controller.signal
          });
          
          clearTimeout(timeoutId);
          
          if (!response.ok) {
            throw new Error(`External API responded with status: ${response.status}`);
          }

          const data = await response.json();
          return res.json(data); // Success, exit loop and return
        } catch (error) {
          lastError = error;
          retries--;
          if (retries > 0) {
            // Wait 1 second before retrying
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
      }

      // If we exhaust all retries
      console.error("Proxy error after retries:", lastError);
      res.json({ 
        success: false, 
        error: "The external movie server is currently busy or unavailable. Please try again in a few moments." 
      });
    } catch (error) {
      console.error("Proxy setup error:", error);
      res.json({ success: false, error: "Internal server error setting up proxy" });
    }
  });

  // Ads API
  app.get("/api/ads", (req, res) => {
    try {
      const ads = db.prepare("SELECT * FROM ads WHERE isActive = 1").all();
      res.json({ success: true, data: ads });
    } catch (e) {
      res.json({ success: false, error: "Failed to fetch ads" });
    }
  });

  app.get("/api/admin/ads", (req, res) => {
    try {
      const ads = db.prepare("SELECT * FROM ads ORDER BY createdAt DESC").all();
      res.json({ success: true, data: ads });
    } catch (e) {
      res.json({ success: false, error: "Failed to fetch ads" });
    }
  });

  app.post("/api/admin/ads", (req, res) => {
    try {
      const { title, type, imageUrl, targetUrl, position, isActive, customCode } = req.body;
      const stmt = db.prepare(`
        INSERT INTO ads (title, type, imageUrl, targetUrl, position, isActive, customCode)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      const result = stmt.run(title, type, imageUrl, targetUrl, position, isActive ? 1 : 0, customCode);
      res.json({ success: true, id: result.lastInsertRowid });
    } catch (e) {
      res.json({ success: false, error: "Failed to create ad" });
    }
  });

  app.put("/api/admin/ads/:id", (req, res) => {
    try {
      const { title, type, imageUrl, targetUrl, position, isActive, customCode } = req.body;
      const stmt = db.prepare(`
        UPDATE ads SET title = ?, type = ?, imageUrl = ?, targetUrl = ?, position = ?, isActive = ?, customCode = ?
        WHERE id = ?
      `);
      stmt.run(title, type, imageUrl, targetUrl, position, isActive ? 1 : 0, customCode, req.params.id);
      res.json({ success: true });
    } catch (e) {
      res.json({ success: false, error: "Failed to update ad" });
    }
  });

  app.delete("/api/admin/ads/:id", (req, res) => {
    try {
      const stmt = db.prepare("DELETE FROM ads WHERE id = ?");
      stmt.run(req.params.id);
      res.json({ success: true });
    } catch (e) {
      res.json({ success: false, error: "Failed to delete ad" });
    }
  });

  app.post("/api/ads/:id/click", (req, res) => {
    try {
      const stmt = db.prepare("UPDATE ads SET clicks = clicks + 1 WHERE id = ?");
      stmt.run(req.params.id);
      res.json({ success: true });
    } catch (e) {
      res.json({ success: false, error: "Failed to record click" });
    }
  });

  app.post("/api/ads/:id/impression", (req, res) => {
    try {
      const stmt = db.prepare("UPDATE ads SET impressions = impressions + 1 WHERE id = ?");
      stmt.run(req.params.id);
      res.json({ success: true });
    } catch (e) {
      res.json({ success: false, error: "Failed to record impression" });
    }
  });

  // SEO: Dynamic Sitemap
  app.get("/sitemap.xml", async (req, res) => {
    try {
      const baseUrl = "https://masrofi.web.id";
      const staticPages = [
        "",
        "/category/trending",
        "/category/action",
        "/category/indonesian-movies",
        "/category/indonesian-drama",
        "/category/horror",
        "/category/kdrama",
        "/category/anime"
      ];

      let dynamicUrls: string[] = [];
      
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
        
        // Fetch trending movies to populate dynamic URLs
        const response = await fetch("https://zeldvorik.ru/apiv3/api.php?action=trending&page=1", {
          headers: { "User-Agent": "Mozilla/5.0" },
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && Array.isArray(data.items)) {
            dynamicUrls = data.items.map((item: any) => `/detail/${encodeURIComponent(item.detailPath)}`);
          }
        }
      } catch (e) {
        console.error("Failed to fetch dynamic sitemap data:", e);
      }

      const allUrls = [...staticPages, ...dynamicUrls];
      
      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(url => `  <url>
    <loc>${baseUrl}${url}</loc>
    <changefreq>${url === "" ? "daily" : "weekly"}</changefreq>
    <priority>${url === "" ? "1.0" : url.startsWith("/category") ? "0.8" : "0.6"}</priority>
  </url>`).join('\n')}
</urlset>`;

      res.header("Content-Type", "application/xml");
      res.send(sitemap);
    } catch (error) {
      console.error("Sitemap generation error:", error);
      res.status(500).end();
    }
  });

  // SEO: Robots.txt
  app.get("/robots.txt", (req, res) => {
    res.type("text/plain");
    res.send(`User-agent: *
Allow: /

Sitemap: https://masrofi.web.id/sitemap.xml`);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    // Fallback for SPA routing
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
