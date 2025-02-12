import { streams, type Stream, type InsertStream } from "@shared/schema";

export interface IStorage {
  createStream(stream: InsertStream): Promise<Stream>;
  getStream(id: number): Promise<Stream | undefined>;
  updateStreamStatus(id: number, isStreaming: boolean): Promise<Stream>;
  updateViewCount(id: number, viewCount: number): Promise<Stream>;
  getCurrentStream(): Promise<Stream | undefined>;
}

export class MemStorage implements IStorage {
  private streams: Map<number, Stream>;
  private currentId: number;

  constructor() {
    this.streams = new Map();
    this.currentId = 1;
  }

  async createStream(insertStream: InsertStream): Promise<Stream> {
    const id = this.currentId++;
    const stream: Stream = {
      ...insertStream,
      id,
      isStreaming: false,
      viewCount: 0,
      startedAt: null,
    };
    this.streams.set(id, stream);
    return stream;
  }

  async getStream(id: number): Promise<Stream | undefined> {
    return this.streams.get(id);
  }

  async updateStreamStatus(id: number, isStreaming: boolean): Promise<Stream> {
    const stream = this.streams.get(id);
    if (!stream) throw new Error("Stream not found");

    const updatedStream = {
      ...stream,
      isStreaming,
      startedAt: isStreaming ? new Date() : stream.startedAt,
    };
    this.streams.set(id, updatedStream);
    return updatedStream;
  }

  async updateViewCount(id: number, viewCount: number): Promise<Stream> {
    const stream = this.streams.get(id);
    if (!stream) throw new Error("Stream not found");

    const updatedStream = { ...stream, viewCount };
    this.streams.set(id, updatedStream);
    return updatedStream;
  }

  async getCurrentStream(): Promise<Stream | undefined> {
    return Array.from(this.streams.values())[0];
  }
}

export const storage = new MemStorage();
