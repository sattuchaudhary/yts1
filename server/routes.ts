import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import { insertStreamSchema } from "@shared/schema";

const upload = multer({ dest: "uploads/" });

export function registerRoutes(app: Express): Server {
  app.post("/api/stream/key", async (req, res) => {
    try {
      const { streamKey } = req.body;
      const stream = await storage.createStream({ streamKey, videoPath: "" });
      res.json(stream);
    } catch (error) {
      res.status(400).json({ error: "Invalid stream key" });
    }
  });

  app.post("/api/stream/video", upload.single("video"), async (req, res) => {
    try {
      if (!req.file) throw new Error("No video uploaded");
      const stream = await storage.getCurrentStream();
      if (!stream) throw new Error("No stream configured");

      const updatedStream = await storage.createStream({
        streamKey: stream.streamKey,
        videoPath: req.file.path,
      });
      res.json(updatedStream);
    } catch (error) {
      res.status(400).json({ error: "Failed to upload video" });
    }
  });

  app.post("/api/stream/start", async (req, res) => {
    try {
      const stream = await storage.getCurrentStream();
      if (!stream) throw new Error("No stream configured");

      const updatedStream = await storage.updateStreamStatus(stream.id, true);
      res.json(updatedStream);
    } catch (error) {
      res.status(400).json({ error: "Failed to start stream" });
    }
  });

  app.post("/api/stream/stop", async (req, res) => {
    try {
      const stream = await storage.getCurrentStream();
      if (!stream) throw new Error("No stream configured");

      const updatedStream = await storage.updateStreamStatus(stream.id, false);
      res.json(updatedStream);
    } catch (error) {
      res.status(400).json({ error: "Failed to stop stream" });
    }
  });

  app.get("/api/stream/status", async (req, res) => {
    try {
      const stream = await storage.getCurrentStream();
      res.json(stream || null);
    } catch (error) {
      res.status(400).json({ error: "Failed to get stream status" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
