import { useQuery } from "@tanstack/react-query";
import { BadgeCheck, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function StreamStatus() {
  const { data: stream } = useQuery({
    queryKey: ["/api/stream/status"],
  });

  if (!stream) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <BadgeCheck
          className={
            stream.isStreaming ? "text-[#00B300]" : "text-gray-400"
          }
        />
        <span className="font-medium">
          Status: {stream.isStreaming ? "Live" : "Offline"}
        </span>
      </div>
      {stream.isStreaming && stream.startedAt && (
        <div className="flex items-center gap-2">
          <Clock className="text-gray-500" />
          <span className="text-sm text-gray-600">
            Streaming for{" "}
            {formatDistanceToNow(new Date(stream.startedAt), {
              addSuffix: false,
            })}
          </span>
        </div>
      )}
    </div>
  );
}
