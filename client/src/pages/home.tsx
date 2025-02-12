import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StreamKeyForm from "@/components/stream-key-form";
import VideoUpload from "@/components/video-upload";
import StreamControls from "@/components/stream-controls";
import StreamStatus from "@/components/stream-status";
import AnalyticsPanel from "@/components/analytics-panel";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const { data: stream } = useQuery({
    queryKey: ["/api/stream/status"],
  });

  return (
    <div className="min-h-screen bg-[#FAFAFA] p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-[#030303]">
          YouTube Stream Manager
        </h1>

        <div className="grid gap-6">
          {!stream?.streamKey ? (
            <Card>
              <CardHeader>
                <CardTitle>Configure Stream</CardTitle>
              </CardHeader>
              <CardContent>
                <StreamKeyForm />
              </CardContent>
            </Card>
          ) : (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Video Upload</CardTitle>
                </CardHeader>
                <CardContent>
                  <VideoUpload />
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Stream Controls</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <StreamControls />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Stream Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <StreamStatus />
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <AnalyticsPanel />
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
