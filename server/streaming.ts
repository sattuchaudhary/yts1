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
      // Force stop any existing stream first
      try {
        this.stopStreaming(true);
      } catch (error) {
        console.error("Failed to stop existing stream:", error);
      }
    }

    const absoluteVideoPath = path.join(process.cwd(), videoPath.replace("/uploads/", "uploads/"));
    const rtmpUrl = `rtmp://a.rtmp.youtube.com/live2/${streamKey}`;

    console.log("Starting stream with video:", absoluteVideoPath);
    console.log("Streaming to URL:", rtmpUrl);

    try {
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
    } catch (error) {
      console.error("Failed to start streaming:", error);
      throw new Error("Failed to start streaming");
    }
  }

  stopStreaming(force: boolean = false): void {
    if (!this.currentStream?.isStreaming && !force) {
      throw new Error("No active stream to stop");
    }

    try {
      if (this.currentStream?.process) {
        // Send SIGTERM first for graceful shutdown
        this.currentStream.process.kill('SIGTERM');

        // If force is true, also send SIGKILL after a short delay
        if (force) {
          setTimeout(() => {
            try {
              if (this.currentStream?.process) {
                this.currentStream.process.kill('SIGKILL');
              }
            } catch (error) {
              console.error("Failed to force kill process:", error);
            }
          }, 1000);
        }
      }
    } catch (error) {
      console.error("Error stopping stream:", error);
      throw new Error("Failed to stop stream");
    } finally {
      this.currentStream = null;
    }
  }

  isStreaming(): boolean {
    return this.currentStream?.isStreaming || false;
  }
}

export const streamingService = new StreamingService();