import { useQuery } from "@tanstack/react-query";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Mock data for the chart
const mockData = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  viewers: Math.floor(Math.random() * 100),
}));

export default function AnalyticsPanel() {
  const { data: stream } = useQuery({
    queryKey: ["/api/stream/status"],
  });

  if (!stream?.isStreaming) {
    return (
      <div className="text-center text-gray-500 py-8">
        Start streaming to see analytics
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-medium">Current Viewers</h3>
          <p className="text-2xl font-bold">{stream.viewCount}</p>
        </div>
      </div>

      <div className="h-[300px] mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={mockData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="time"
              stroke="#666"
              fontSize={12}
              tickFormatter={(value) => value}
            />
            <YAxis stroke="#666" fontSize={12} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="viewers"
              stroke="#FF0000"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
