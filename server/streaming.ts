import { spawn } from "child_process";
import path from "path";

interface StreamProcess {
  process: any;
  isStreaming: boolean;
}

class StreamingService {
  private currentStream: StreamProcess | null = null;

  startStreaming(videoPath: string, streamKey: string): void {
    if (this.currentStream?.isStreaming) {
      throw new Error("Stream already running");
    }

    const absoluteVideoPath = path.join(process.cwd(), videoPath.replace("/uploads/", "uploads/"));
    const rtmpUrl = `rtmp://a.rtmp.youtube.com/live2/${streamKey}`;

    // FFmpeg command for continuous loop streaming to YouTube
    const ffmpeg = spawn("ffmpeg", [
      "-re",                // Read input at native frame rate
      "-stream_loop", "-1", // Loop the input infinitely
      "-i", absoluteVideoPath,  // Input file
      "-c:v", "libx264",   // Video codec
      "-preset", "veryfast",
      "-b:v", "3000k",     // Video bitrate
      "-c:a", "aac",       // Audio codec
      "-b:a", "160k",      // Audio bitrate
      "-f", "flv",         // Output format
      rtmpUrl              // YouTube RTMP URL
    ]);

    ffmpeg.stderr.on("data", (data: Buffer) => {
      console.log(`FFmpeg: ${data.toString()}`);
    });

    ffmpeg.on("close", (code: number) => {
      console.log(`FFmpeg process exited with code ${code}`);
      this.currentStream = null;
    });

    this.currentStream = {
      process: ffmpeg,
      isStreaming: true
    };
  }

  stopStreaming(): void {
    if (!this.currentStream?.isStreaming) {
      throw new Error("No active stream to stop");
    }

    this.currentStream.process.kill();
    this.currentStream = null;
  }

  isStreaming(): boolean {
    return this.currentStream?.isStreaming || false;
  }
}

export const streamingService = new StreamingService();
