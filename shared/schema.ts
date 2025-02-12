import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const streams = pgTable("streams", {
  id: serial("id").primaryKey(),
  streamKey: text("stream_key").notNull(),
  videoPath: text("video_path").notNull(),
  isStreaming: boolean("is_streaming").notNull().default(false),
  viewCount: integer("view_count").notNull().default(0),
  startedAt: timestamp("started_at"),
});

export const insertStreamSchema = createInsertSchema(streams).pick({
  streamKey: true,
  videoPath: true,
});

export const streamKeySchema = z.object({
  streamKey: z.string().min(10, "Stream key must be at least 10 characters"),
});

export type InsertStream = z.infer<typeof insertStreamSchema>;
export type Stream = typeof streams.$inferSelect;
