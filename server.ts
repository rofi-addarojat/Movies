import express from "express";
import { createServer as createViteServer } from "vite";
import db from "./server/db.js";

async function startServer() {
  const app = express();
  const PORT = 3000;

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

      const response = await fetch(url.toString(), {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }
      });
      
      if (!response.ok) {
        throw new Error(`External API responded with status: ${response.status}`);
      }

      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Proxy error:", error);
      res.status(500).json({ success: false, error: "Failed to fetch data from external API" });
    }
  });

  // Ads API
  app.get("/api/ads", (req, res) => {
    try {
      const ads = db.prepare("SELECT * FROM ads WHERE isActive = 1").all();
      res.json({ success: true, data: ads });
    } catch (e) {
      res.status(500).json({ success: false, error: "Failed to fetch ads" });
    }
  });

  app.get("/api/admin/ads", (req, res) => {
    try {
      const ads = db.prepare("SELECT * FROM ads ORDER BY createdAt DESC").all();
      res.json({ success: true, data: ads });
    } catch (e) {
      res.status(500).json({ success: false, error: "Failed to fetch ads" });
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
      res.status(500).json({ success: false, error: "Failed to create ad" });
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
      res.status(500).json({ success: false, error: "Failed to update ad" });
    }
  });

  app.delete("/api/admin/ads/:id", (req, res) => {
    try {
      const stmt = db.prepare("DELETE FROM ads WHERE id = ?");
      stmt.run(req.params.id);
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ success: false, error: "Failed to delete ad" });
    }
  });

  app.post("/api/ads/:id/click", (req, res) => {
    try {
      const stmt = db.prepare("UPDATE ads SET clicks = clicks + 1 WHERE id = ?");
      stmt.run(req.params.id);
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ success: false, error: "Failed to record click" });
    }
  });

  app.post("/api/ads/:id/impression", (req, res) => {
    try {
      const stmt = db.prepare("UPDATE ads SET impressions = impressions + 1 WHERE id = ?");
      stmt.run(req.params.id);
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ success: false, error: "Failed to record impression" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
