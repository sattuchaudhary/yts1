import { streams, type Stream, type InsertStream } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  createStream(stream: InsertStream): Promise<Stream>;
  getStream(id: number): Promise<Stream | undefined>;
  updateStreamStatus(id: number, isStreaming: boolean): Promise<Stream>;
  updateViewCount(id: number, viewCount: number): Promise<Stream>;
  getCurrentStream(): Promise<Stream | undefined>;
}

export class DatabaseStorage implements IStorage {
  async createStream(insertStream: InsertStream): Promise<Stream> {
    const [stream] = await db
      .insert(streams)
      .values(insertStream)
      .returning();
    return stream;
  }

  async getStream(id: number): Promise<Stream | undefined> {
    const [stream] = await db
      .select()
      .from(streams)
      .where(eq(streams.id, id));
    return stream;
  }

  async updateStreamStatus(id: number, isStreaming: boolean): Promise<Stream> {
    const [stream] = await db
      .update(streams)
      .set({ 
        isStreaming, 
        startedAt: isStreaming ? new Date() : null 
      })
      .where(eq(streams.id, id))
      .returning();
    return stream;
  }

  async updateViewCount(id: number, viewCount: number): Promise<Stream> {
    const [stream] = await db
      .update(streams)
      .set({ viewCount })
      .where(eq(streams.id, id))
      .returning();
    return stream;
  }

  async getCurrentStream(): Promise<Stream | undefined> {
    const [stream] = await db
      .select()
      .from(streams)
      .orderBy(streams.createdAt)
      .limit(1);
    return stream;
  }
}

export const storage = new DatabaseStorage();