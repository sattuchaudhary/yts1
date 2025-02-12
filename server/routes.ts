import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { streamingService } from "./streaming";
import multer from "multer";
import path from "path";
import express from "express";

// Configure multer to store files with their original names
const upload = multer({ 
  dest: "uploads/",
  storage: multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    }
  })
});

export function registerRoutes(app: Express): Server {
  // Serve uploaded files statically
  app.use("/uploads", express.static("uploads"));

  app.post("/api/stream/key", async (req, res) => {
    try {
      const { streamKey } = req.body;
      const stream = await storage.createStream({ streamKey, videoPath: "" });
      res.json(stream);
    } catch (error) {
      console.error("Failed to set stream key:", error);
      res.status(400).json({ error: "Invalid stream key" });
    }
  });

  app.post("/api/stream/video", upload.single("video"), async (req, res) => {
    try {
      if (!req.file) throw new Error("No video uploaded");
      const stream = await storage.getCurrentStream();
      if (!stream) throw new Error("No stream configured");

      const videoPath = `/uploads/${req.file.filename}`;
      const updatedStream = await storage.updateStreamVideo(stream.id, videoPath);
      res.json(updatedStream);
    } catch (error) {
      console.error("Failed to upload video:", error);
      res.status(400).json({ error: "Failed to upload video" });
    }
  });

  app.post("/api/stream/start", async (req, res) => {
    try {
      const stream = await storage.getCurrentStream();
      if (!stream) throw new Error("No stream configured");
      if (!stream.videoPath) throw new Error("No video uploaded");

      streamingService.startStreaming(stream.videoPath, stream.streamKey);
      const updatedStream = await storage.updateStreamStatus(stream.id, true);
      res.json(updatedStream);
    } catch (error) {
      console.error("Failed to start stream:", error);
      res.status(400).json({ error: "Failed to start stream" });
    }
  });

  app.post("/api/stream/stop", async (req, res) => {
    try {
      const stream = await storage.getCurrentStream();
      if (!stream) throw new Error("No stream configured");

      // Force stop the stream if needed
      streamingService.stopStreaming(true);
      const updatedStream = await storage.updateStreamStatus(stream.id, false);
      res.json(updatedStream);
    } catch (error) {
      console.error("Failed to stop stream:", error);
      // Still try to update the database even if stopping fails
      try {
        if (stream) {
          await storage.updateStreamStatus(stream.id, false);
        }
      } catch (dbError) {
        console.error("Failed to update stream status:", dbError);
      }
      res.status(400).json({ error: "Failed to stop stream" });
    }
  });

  app.get("/api/stream/status", async (req, res) => {
    try {
      const stream = await storage.getCurrentStream();
      res.json(stream || null);
    } catch (error) {
      console.error("Failed to get stream status:", error);
      res.status(400).json({ error: "Failed to get stream status" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}