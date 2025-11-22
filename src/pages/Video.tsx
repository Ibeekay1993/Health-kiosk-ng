import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mic, MicOff, Video as VideoIcon, VideoOff, PhoneOff, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Video = () => {
  const navigate = useNavigate();
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-6xl">
        {/* Main Video Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-8rem)]">
          {/* Doctor's Video */}
          <div className="lg:col-span-2">
            <Card className="h-full bg-muted flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mb-4 mx-auto">
                    <span className="text-3xl font-bold">Dr</span>
                  </div>
                  <p className="text-lg font-medium">Dr. Adebayo Okafor</p>
                  <p className="text-sm text-muted-foreground">General Practitioner</p>
                </div>
              </div>

              {/* Patient's Video (Picture-in-Picture) */}
              <div className="absolute bottom-4 right-4 w-48 h-36 bg-background rounded-lg border-2 border-primary flex items-center justify-center">
                {isVideoOn ? (
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center mx-auto">
                      <span className="text-lg font-bold">You</span>
                    </div>
                  </div>
                ) : (
                  <VideoOff className="h-8 w-8 text-muted-foreground" />
                )}
              </div>
            </Card>
          </div>

          {/* Chat Panel */}
          <Card className="p-4">
            <h3 className="font-semibold mb-4">Consultation Notes</h3>
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">10:30 AM</p>
                <p>Doctor joined the call</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">10:31 AM</p>
                <p>Discussing symptoms: headache, fever</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Controls */}
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2">
          <Card className="p-4">
            <div className="flex items-center gap-4">
              <Button
                size="icon"
                variant={isMuted ? "destructive" : "secondary"}
                className="rounded-full h-14 w-14"
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
              </Button>
              
              <Button
                size="icon"
                variant={!isVideoOn ? "destructive" : "secondary"}
                className="rounded-full h-14 w-14"
                onClick={() => setIsVideoOn(!isVideoOn)}
              >
                {isVideoOn ? <VideoIcon className="h-6 w-6" /> : <VideoOff className="h-6 w-6" />}
              </Button>

              <Button
                size="icon"
                variant="destructive"
                className="rounded-full h-16 w-16"
                onClick={() => navigate("/chat")}
              >
                <PhoneOff className="h-6 w-6" />
              </Button>

              <Button
                size="icon"
                variant="secondary"
                className="rounded-full h-14 w-14"
                onClick={() => navigate("/chat")}
              >
                <MessageSquare className="h-6 w-6" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Video;
