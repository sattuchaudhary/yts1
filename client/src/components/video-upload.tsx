import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Upload } from "lucide-react";

export default function VideoUpload() {
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();
  const { data: stream } = useQuery({
    queryKey: ["/api/stream/status"],
  });

  const mutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("video", file);

      const res = await fetch("/api/stream/video", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Upload failed");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/stream/status"] });
      toast({
        title: "Success",
        description: "Video uploaded successfully",
      });
      setProgress(0);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to upload video",
        variant: "destructive",
      });
      setProgress(0);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Simulate upload progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 500);

    mutation.mutate(file);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center w-full">
        <label
          htmlFor="video-upload"
          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-8 h-8 mb-2 text-gray-500" />
            <p className="text-sm text-gray-500">
              Click to upload or drag and drop
            </p>
          </div>
          <input
            id="video-upload"
            type="file"
            accept="video/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={mutation.isPending}
          />
        </label>
      </div>
      {(mutation.isPending || progress > 0) && (
        <Progress value={progress} className="w-full" />
      )}

      {/* Show video preview if uploaded */}
      {stream?.videoPath && (
        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">Uploaded Video Preview:</h3>
          <video 
            src={stream.videoPath}
            controls
            className="w-full rounded-lg border"
            style={{ maxHeight: "240px" }}
          >
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </div>
  );
}