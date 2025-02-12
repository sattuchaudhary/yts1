import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { Play, Square } from "lucide-react";

export default function StreamControls() {
  const { toast } = useToast();
  const { data: stream } = useQuery({
    queryKey: ["/api/stream/status"],
  });

  const startMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/stream/start");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/stream/status"] });
      toast({
        title: "Success",
        description: "Stream started successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to start stream",
        variant: "destructive",
      });
    },
  });

  const stopMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/stream/stop");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/stream/status"] });
      toast({
        title: "Success",
        description: "Stream stopped successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to stop stream",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="flex gap-4">
      <Button
        size="lg"
        className="flex-1 bg-[#00B300] hover:bg-[#009900]"
        onClick={() => startMutation.mutate()}
        disabled={startMutation.isPending || !stream?.videoPath || stream?.isStreaming}
      >
        <Play className="w-4 h-4 mr-2" />
        Start Stream
      </Button>
      <Button
        size="lg"
        variant="destructive"
        className="flex-1"
        onClick={() => stopMutation.mutate()}
        disabled={stopMutation.isPending || !stream?.isStreaming}
      >
        <Square className="w-4 h-4 mr-2" />
        Stop Stream
      </Button>
    </div>
  );
}